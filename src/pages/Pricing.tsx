import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe-config";
import { V2Nav, V2Footer, V2Page } from "@/components/v2/V2Shell";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Check, X, Zap, Crown, Rocket } from "lucide-react";
import type { SubscriptionTier } from "@/lib/stripe-config";

const plans = [
  {
    tier: "free" as const,
    name: "Starter",
    icon: Zap,
    price: "$0",
    billing: "Start exploring the market",
    description: "Perfect for individuals and small teams getting started with smarter retail decisions.",
    features: [
      { text: "Access to product trend detection", included: true },
      { text: "Launch products to retail buyers", included: true },
      { text: "Track up to 2 product prices", included: true },
      { text: "Find up to 2 suppliers & distributors", included: true },
      { text: "Competitive analysis tools", included: false },
      { text: "Priority support & onboarding", included: false },
    ],
  },
  {
    tier: "pro" as const,
    name: "Growth",
    icon: Crown,
    price: "$20",
    billing: "per month",
    description: "For growing retail and e-commerce teams ready to scale decisions and execution.",
    popular: true,
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Track up to 10 product prices", included: true },
      { text: "Find up to 10 suppliers & distributors", included: true },
      { text: "Access to competitive analysis tools", included: true },
    ],
  },
  {
    tier: "enterprise" as const,
    name: "Enterprise",
    icon: Rocket,
    price: "Custom",
    billing: "Full visibility. Full control.",
    description: "For teams operating at scale across multiple products, markets, and suppliers.",
    features: [
      { text: "Unlimited product price tracking", included: true },
      { text: "Unlimited supplier & distributor discovery", included: true },
      { text: "Full competitive analysis suite", included: true },
      { text: "Priority support & onboarding", included: true },
    ],
  },
];

const compareRows = [
  { feature: "Product trend detection", free: true, pro: true, enterprise: true },
  { feature: "Launch products to retail buyers", free: true, pro: true, enterprise: true },
  { feature: "Product price tracking", free: "Up to 2", pro: "Up to 10", enterprise: "Unlimited" },
  { feature: "Supplier & distributor discovery", free: "Up to 2", pro: "Up to 10", enterprise: "Unlimited" },
  { feature: "Competitive analysis tools", free: false, pro: true, enterprise: true },
  { feature: "Priority support & onboarding", free: false, pro: false, enterprise: true },
];

const faqs = [
  { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately, and we'll prorate your billing." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe." },
  { q: "Is there a contract?", a: "No contracts. Monthly plans are flexible. Cancel anytime from your billing settings." },
  { q: "What happens if I downgrade?", a: "Your downgrade takes effect at the end of your current billing period. You won't lose any data." },
  { q: "Do you offer refunds?", a: "We offer a 7-day free trial with no credit card required. After that, we don't offer refunds, but you can cancel anytime." },
  { q: "What happens if I exceed my plan limits?", a: "If you exceed limits (e.g., tracking 3+ competitors on Free plan), features are disabled until you upgrade or remove tracked items." },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (typeof value === "string") {
    return <span className="font-body" style={{ fontSize: 13, color: "var(--v2-ink)", fontWeight: 500 }}>{value}</span>;
  }
  return value ? (
    <Check className="w-4 h-4 mx-auto" style={{ color: "var(--v2-teal)" }} />
  ) : (
    <X className="w-4 h-4 mx-auto" style={{ color: "var(--v2-border)" }} />
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session, subscriptionTier, isSubscribed, checkSubscriptionStatus } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: "", lastName: "", email: "", message: "" });

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({ title: "Welcome to Pro!", description: "Your subscription is now active." });
      checkSubscriptionStatus();
    }
  }, [searchParams, checkSubscriptionStatus]);

  const handleUpgrade = async () => {
    if (!session) {
      navigate("/signup&redirect=/pricing");
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { priceId: STRIPE_TIERS.pro.price_id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to start checkout", variant: "destructive" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to open billing portal", variant: "destructive" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent", description: "Our sales team will get back to you shortly." });
    setContactOpen(false);
    setContactForm({ firstName: "", lastName: "", email: "", message: "" });
  };

  const currentTier: SubscriptionTier = subscriptionTier;
  const isLoggedIn = !!user;

  return (
    <V2Page>
      <V2Nav />

      <main style={{ padding: "120px 24px 96px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 14 }}>
            Pricing
          </p>
          <h1 className="font-display" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--v2-ink)", marginBottom: 16 }}>
            Plans built to <em style={{ fontStyle: "italic", color: "var(--v2-teal)" }}>scale with you</em>.
          </h1>
          <p className="font-body" style={{ fontSize: 16, fontWeight: 300, color: "var(--v2-muted)", maxWidth: 540, margin: "0 auto", letterSpacing: "-0.005em" }}>
            Choose the plan that fits your business. Cancel anytime, no contracts.
          </p>
        </div>

        {/* Current plan banner */}
        {user && (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{
              marginBottom: 36,
              padding: "16px 22px",
              borderRadius: 12,
              background: "var(--v2-surface)",
              border: "1px solid var(--v2-border)",
            }}
          >
            <div>
              <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>
                You're currently on the{" "}
                <span style={{ fontWeight: 600, color: "var(--v2-ink)", textTransform: "capitalize" }}>{subscriptionTier}</span>{" "}
                plan.
              </p>
              {subscriptionTier === "free" && (
                <p className="font-body" style={{ fontSize: 12, color: "var(--v2-muted)", marginTop: 2 }}>
                  Upgrade to Pro to unlock all features.
                </p>
              )}
            </div>
            {isSubscribed && (
              <button
                onClick={handleManageSubscription}
                disabled={checkoutLoading}
                style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: "var(--v2-white)", color: "var(--v2-ink)", border: "1px solid var(--v2-border)", cursor: "pointer" }}
              >
                {checkoutLoading && <Loader2 className="w-3 h-3 animate-spin mr-2 inline" />}
                Manage Subscription
              </button>
            )}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isCurrentPlan = isLoggedIn && currentTier === plan.tier;
            const isPopular = plan.popular;
            return (
              <div
                key={plan.tier}
                className="relative flex flex-col"
                style={{
                  background: isPopular ? "var(--v2-ink)" : "var(--v2-white)",
                  border: `1px solid ${isPopular ? "var(--v2-ink)" : "var(--v2-border)"}`,
                  borderRadius: 12,
                  padding: 32,
                  color: isPopular ? "#fff" : "var(--v2-ink)",
                }}
              >
                {isPopular && (
                  <div
                    className="absolute"
                    style={{
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--v2-teal)",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "5px 14px",
                      borderRadius: 999,
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <div
                    className="inline-flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: isPopular ? "rgba(13,155,138,0.18)" : "var(--v2-teal-light)",
                      marginBottom: 16,
                    }}
                  >
                    <plan.icon className="w-5 h-5" style={{ color: "var(--v2-teal)" }} />
                  </div>
                  <h3 className="font-display" style={{ fontSize: 24, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4 }}>
                    {plan.name}
                  </h3>
                  <p className="font-body" style={{ fontSize: 13, fontWeight: 300, color: isPopular ? "rgba(255,255,255,0.6)" : "var(--v2-muted)", marginBottom: 20 }}>
                    {plan.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span className="font-display" style={{ fontSize: 40, fontWeight: 300, letterSpacing: "-0.03em" }}>{plan.price}</span>
                    <span className="font-body" style={{ fontSize: 14, fontWeight: 300, color: isPopular ? "rgba(255,255,255,0.5)" : "var(--v2-muted)" }}>
                      {plan.billing}
                    </span>
                  </div>
                </div>

                <ul className="list-none flex-1" style={{ marginBottom: 24 }}>
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start"
                      style={{
                        fontSize: 13,
                        fontWeight: 300,
                        gap: 10,
                        marginBottom: 10,
                        color: f.included
                          ? (isPopular ? "rgba(255,255,255,0.85)" : "var(--v2-ink)")
                          : (isPopular ? "rgba(255,255,255,0.3)" : "var(--v2-border)"),
                        textDecoration: f.included ? "none" : "line-through",
                      }}
                    >
                      {f.included ? (
                        <Check className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: "var(--v2-teal)" }} />
                      ) : (
                        <X className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: isPopular ? "rgba(255,255,255,0.2)" : "var(--v2-border)" }} />
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full"
                      style={{ padding: "12px 20px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: isPopular ? "rgba(255,255,255,0.1)" : "var(--v2-surface)", color: isPopular ? "rgba(255,255,255,0.6)" : "var(--v2-muted)", border: "none" }}
                    >
                      Your Current Plan
                    </button>
                  ) : plan.tier === "enterprise" ? (
                    <button
                      onClick={() => setContactOpen(true)}
                      className="w-full"
                      style={{ padding: "12px 20px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-white)", color: "var(--v2-ink)", border: "1px solid var(--v2-border)", cursor: "pointer" }}
                    >
                      Contact Sales
                    </button>
                  ) : plan.tier === "pro" ? (
                    <button
                      onClick={isLoggedIn ? handleUpgrade : () => navigate("/signup&redirect=/pricing")}
                      disabled={checkoutLoading}
                      className="w-full inline-flex items-center justify-center"
                      style={{ padding: "12px 20px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-teal)", color: "#fff", border: "none", cursor: "pointer", gap: 6 }}
                    >
                      {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isLoggedIn ? "Upgrade to Pro" : "Start Free Trial"}
                    </button>
                  ) : (
                    <button
                      onClick={isLoggedIn ? undefined : () => navigate("/signup&redirect=/pricing")}
                      disabled={isLoggedIn}
                      className="w-full"
                      style={{ padding: "12px 20px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-white)", color: "var(--v2-ink)", border: "1px solid var(--v2-border)", cursor: isLoggedIn ? "default" : "pointer" }}
                    >
                      {isLoggedIn ? "Free Plan" : "Get Started"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div style={{ marginTop: 96 }}>
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--v2-ink)", textAlign: "center", marginBottom: 40 }}>
            Compare all plans
          </h2>
          <div className="overflow-x-auto" style={{ border: "1px solid var(--v2-border)", borderRadius: 12, background: "var(--v2-white)" }}>
            <table className="w-full" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--v2-surface)", borderBottom: "1px solid var(--v2-border)" }}>
                  <th className="text-left font-body" style={{ padding: "14px 18px", fontWeight: 600, color: "var(--v2-ink)" }}>Feature</th>
                  <th className="text-center font-body" style={{ padding: "14px 18px", fontWeight: 600, color: "var(--v2-ink)" }}>Free</th>
                  <th className="text-center font-body" style={{ padding: "14px 18px", fontWeight: 600, color: "var(--v2-teal)" }}>Pro</th>
                  <th className="text-center font-body" style={{ padding: "14px 18px", fontWeight: 600, color: "var(--v2-ink)" }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: i === compareRows.length - 1 ? "none" : "1px solid var(--v2-border)" }}>
                    <td className="font-body" style={{ padding: "14px 18px", fontWeight: 500, color: "var(--v2-ink)" }}>{row.feature}</td>
                    <td style={{ padding: "14px 18px", textAlign: "center" }}><Cell value={row.free} /></td>
                    <td style={{ padding: "14px 18px", textAlign: "center" }}><Cell value={row.pro} /></td>
                    <td style={{ padding: "14px 18px", textAlign: "center" }}><Cell value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 96, maxWidth: 720, margin: "96px auto 0" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--v2-ink)", textAlign: "center", marginBottom: 40 }}>
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="px-5"
                style={{ border: "1px solid var(--v2-border)", borderRadius: 12, background: "var(--v2-white)" }}
              >
                <AccordionTrigger className="font-body text-left hover:no-underline" style={{ color: "var(--v2-ink)", fontSize: 14, fontWeight: 500 }}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="font-body" style={{ color: "var(--v2-muted)", fontSize: 13, fontWeight: 300, lineHeight: 1.6 }}>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 96, textAlign: "center" }}>
          <h3 className="font-display" style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--v2-ink)", marginBottom: 10 }}>
            Ready to get started?
          </h3>
          <p className="font-body" style={{ fontSize: 14, color: "var(--v2-muted)", marginBottom: 24 }}>
            Start tracking competitors today. No credit card required for the free plan.
          </p>
          {!isSubscribed && (
            <button
              onClick={user ? handleUpgrade : () => navigate("/signup")}
              disabled={checkoutLoading}
              className="inline-flex items-center justify-center"
              style={{ padding: "14px 28px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer", gap: 8 }}
            >
              {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Upgrade to Pro — $20/month
            </button>
          )}
        </div>

        {/* Contact Sales Dialog */}
        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
          <DialogContent className="sm:max-w-md" style={{ background: "var(--v2-white)", border: "1px solid var(--v2-border)" }}>
            <DialogHeader>
              <DialogTitle className="font-display text-center" style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--v2-ink)" }}>
                Contact Sales
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cf-fn" className="font-body" style={{ color: "var(--v2-ink)", fontSize: 13 }}>First Name</Label>
                  <Input id="cf-fn" value={contactForm.firstName} onChange={(e) => setContactForm(f => ({ ...f, firstName: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="cf-ln" className="font-body" style={{ color: "var(--v2-ink)", fontSize: 13 }}>Last Name</Label>
                  <Input id="cf-ln" value={contactForm.lastName} onChange={(e) => setContactForm(f => ({ ...f, lastName: e.target.value }))} required />
                </div>
              </div>
              <div>
                <Label htmlFor="cf-email" className="font-body" style={{ color: "var(--v2-ink)", fontSize: 13 }}>Email</Label>
                <Input id="cf-email" type="email" value={contactForm.email} onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="cf-msg" className="font-body" style={{ color: "var(--v2-ink)", fontSize: 13 }}>Tell us more...</Label>
                <Textarea
                  id="cf-msg"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                  className="min-h-[120px]"
                  placeholder="Tell us about your business needs..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full"
                style={{ padding: "12px 20px", borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Send Message
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      <V2Footer />
    </V2Page>
  );
};

export default Pricing;
