import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

/**
 * Stripe -> GA4 webhook.
 *
 * Forwards subscription lifecycle events to GA4 via the Measurement Protocol.
 * These are analytics-only events (never imported to Google Ads):
 *
 *   invoice.payment_succeeded  (billing_reason = subscription_cycle) -> subscription_renewal
 *   customer.subscription.updated (cancel_at_period_end false -> true) -> cancellation_requested
 *   customer.subscription.deleted -> subscription_canceled
 *
 * The very first payment (billing_reason = subscription_create) is intentionally
 * ignored here — that acquisition conversion is fired client-side as `purchase`
 * on the checkout-success page.
 *
 * Required secrets (Supabase edge function env):
 *   STRIPE_SECRET_KEY        - existing
 *   STRIPE_WEBHOOK_SECRET    - Stripe -> Developers -> Webhooks -> signing secret
 *   GA4_API_SECRET           - GA4 -> Admin -> Data Streams -> Measurement Protocol API secrets
 *   GA4_MEASUREMENT_ID       - optional; defaults to the property in index.html
 */

const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID") ?? "G-EZK488JRW8";

const logStep = (step: string, details?: unknown) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
};

async function sendToGA4(params: {
  clientId: string;
  userId?: string | null;
  name: string;
  eventParams: Record<string, unknown>;
}): Promise<void> {
  const apiSecret = Deno.env.get("GA4_API_SECRET");
  if (!apiSecret) {
    logStep("GA4_API_SECRET missing — skipping GA4 send", { name: params.name });
    return;
  }

  const body: Record<string, unknown> = {
    client_id: params.clientId,
    events: [{ name: params.name, params: params.eventParams }],
  };
  if (params.userId) body.user_id = params.userId;

  const url =
    `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}` +
    `&api_secret=${apiSecret}`;

  const res = await fetch(url, { method: "POST", body: JSON.stringify(body) });
  logStep("Sent to GA4", { name: params.name, status: res.status });
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    logStep("Missing Stripe secrets");
    return new Response("Server not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  // Signature verification needs the raw, unparsed body.
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature ?? "",
      webhookSecret
    );
  } catch (err) {
    logStep("Signature verification failed", { error: String(err) });
    return new Response("Invalid signature", { status: 400 });
  }

  logStep("Event received", { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case "invoice.payment_succeeded": {
        // Invoice shape shifts across Stripe API versions (top-level
        // `subscription` moved under `parent` in basil), so read defensively.
        // deno-lint-ignore no-explicit-any
        const invoice = event.data.object as any;
        // Only recurring cycle payments are renewals. The first payment
        // (subscription_create) is the client-side `purchase`.
        if (invoice.billing_reason !== "subscription_cycle") {
          logStep("Skipping invoice", { reason: invoice.billing_reason });
          break;
        }
        const customerId = String(invoice.customer);
        const rawSub =
          invoice.subscription ??
          invoice.parent?.subscription_details?.subscription ??
          undefined;
        const subscriptionId = rawSub ? String(rawSub) : undefined;
        let userId: string | null = null;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          userId = (sub.metadata?.user_id as string) ?? null;
        }
        await sendToGA4({
          clientId: customerId,
          userId,
          name: "subscription_renewal",
          eventParams: {
            transaction_id: invoice.id,
            subscription_id: subscriptionId,
            value: (invoice.amount_paid ?? 0) / 100,
            currency: (invoice.currency ?? "usd").toUpperCase(),
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        // deno-lint-ignore no-explicit-any
        const prev = event.data.previous_attributes as any;
        // Fire only on the false -> true transition (a cancel was requested).
        const nowScheduled = sub.cancel_at_period_end === true;
        const wasScheduled = prev?.cancel_at_period_end === false;
        if (!(nowScheduled && wasScheduled)) {
          logStep("Subscription update is not a cancel request — skipping");
          break;
        }
        const price = sub.items.data[0]?.price;
        await sendToGA4({
          clientId: String(sub.customer),
          userId: (sub.metadata?.user_id as string) ?? null,
          name: "cancellation_requested",
          eventParams: {
            subscription_id: sub.id,
            value: (price?.unit_amount ?? 0) / 100,
            currency: (price?.currency ?? "usd").toUpperCase(),
            cancel_at: sub.cancel_at,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const price = sub.items.data[0]?.price;
        await sendToGA4({
          clientId: String(sub.customer),
          userId: (sub.metadata?.user_id as string) ?? null,
          name: "subscription_canceled",
          eventParams: {
            subscription_id: sub.id,
            value: (price?.unit_amount ?? 0) / 100,
            currency: (price?.currency ?? "usd").toUpperCase(),
          },
        });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }
  } catch (err) {
    logStep("Handler error", { error: String(err) });
    // Return 200 so Stripe does not retry indefinitely on our-side logic errors;
    // signature/config failures above already returned non-200.
    return new Response(JSON.stringify({ received: true, error: String(err) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
