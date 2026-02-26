import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("[CHECK-PAYMENT] Missing Stripe configuration");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503,
      });
    }
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      console.error("[CHECK-PAYMENT] Auth verification failed:", userError.message);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }
    
    const user = userData.user;
    if (!user?.email) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }
    logStep("User authenticated", { userId: user.id });

    // Parse request body for checkout_session_id
    let checkoutSessionId: string | undefined;
    try {
      const body = await req.json();
      checkoutSessionId = body.checkout_session_id;
      logStep("Request body parsed", { checkoutSessionId });
    } catch {
      logStep("No body or invalid JSON, will check existing subscription");
    }

    // Initialize Stripe with Edge-compatible settings
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // If checkout_session_id is provided, verify that specific session
    if (checkoutSessionId) {
      logStep("Verifying checkout session", { checkoutSessionId });
      
      const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
        expand: ["subscription"],
      });

      logStep("Checkout session retrieved", {
        paymentStatus: checkoutSession.payment_status,
        subscriptionId: typeof checkoutSession.subscription === 'object' 
          ? checkoutSession.subscription?.id 
          : checkoutSession.subscription,
      });

      const isPaid = checkoutSession.payment_status === "paid";
      const subscription = checkoutSession.subscription;
      
      let isActiveSubscription = false;
      let subscriptionEnd: string | null = null;

      if (subscription && typeof subscription === "object") {
        isActiveSubscription = subscription.status === "active";
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        logStep("Subscription status", { 
          status: subscription.status, 
          isActive: isActiveSubscription,
          endDate: subscriptionEnd 
        });
      }

      const hasPaid = isPaid && isActiveSubscription;

      // If payment is valid, sync to local database
      if (hasPaid && subscription && typeof subscription === "object") {
        const customerId = typeof checkoutSession.customer === 'string' 
          ? checkoutSession.customer 
          : checkoutSession.customer?.id;

        await supabaseClient.from("payments").upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_payment_intent_id: subscription.id,
          amount: subscription.items.data[0]?.price?.unit_amount || 2000,
          currency: subscription.currency || "usd",
          status: "succeeded",
        }, {
          onConflict: "user_id",
        });
        logStep("Synced payment to local database");
      }

      return new Response(JSON.stringify({ 
        hasPaid,
        subscriptionEnd,
        hasActiveSubscription: isActiveSubscription,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Fallback: Check for existing subscriptions by customer email
    logStep("Checking existing subscriptions by email");
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ hasPaid: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSubscription = subscriptions.data.length > 0;
    let subscriptionEnd: string | null = null;

    if (hasActiveSubscription) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        endDate: subscriptionEnd 
      });

      // Sync to local database
      const { data: existingPayments } = await supabaseClient
        .from("payments")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "succeeded")
        .limit(1);

      if (!existingPayments || existingPayments.length === 0) {
        await supabaseClient.from("payments").insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_payment_intent_id: subscription.id,
          amount: subscription.items.data[0]?.price?.unit_amount || 2000,
          currency: subscription.currency,
          status: "succeeded",
        });
        logStep("Synced subscription to local database");
      }
    } else {
      logStep("No active subscription found");
    }

    // Also check local database as fallback
    const { data: localPayments } = await supabaseClient
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "succeeded")
      .limit(1);

    const hasPaid = hasActiveSubscription || (localPayments && localPayments.length > 0);

    logStep("Payment check complete", { 
      hasActiveSubscription, 
      hasLocalPayment: localPayments && localPayments.length > 0,
      hasPaid 
    });

    return new Response(JSON.stringify({ 
      hasPaid,
      subscriptionEnd,
      hasActiveSubscription 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[CHECK-PAYMENT] Unexpected error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
