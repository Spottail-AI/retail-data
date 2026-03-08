import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe-config";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { PricingCards } from "@/components/pricing/PricingCards";
import { ComparisonTable } from "@/components/pricing/ComparisonTable";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session, subscriptionTier, isSubscribed, checkSubscriptionStatus } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: "", lastName: "", email: "", message: "" });

  // Handle checkout success redirect
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({ title: "Welcome to Pro!", description: "Your subscription is now active." });
      // Force re-check subscription
      checkSubscriptionStatus();
    }
  }, [searchParams, checkSubscriptionStatus]);

  const handleUpgrade = async () => {
    if (!session) {
      navigate("/auth?mode=signup&redirect=/pricing");
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { priceId: STRIPE_TIERS.pro.price_id },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
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
      if (data?.url) {
        window.open(data.url, "_blank");
      }
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

  return (
    <DashboardShell
      title="Upgrade Plan"
      description="Choose the plan that fits your business needs."
    >
      {/* Current plan banner */}
      {user && (
        <div className="mb-8 p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              You're currently on the{" "}
              <span className="font-semibold text-foreground capitalize">{subscriptionTier}</span>{" "}
              plan.
            </p>
            {subscriptionTier === "free" && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Upgrade to Pro to unlock all features.
              </p>
            )}
          </div>
          {isSubscribed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              disabled={checkoutLoading}
            >
              {checkoutLoading && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
              Manage Subscription
            </Button>
          )}
        </div>
      )}

      <PricingCards
        currentTier={subscriptionTier}
        isLoggedIn={!!user}
        loading={checkoutLoading}
        onUpgrade={handleUpgrade}
        onContactSales={() => setContactOpen(true)}
        onSignUp={() => navigate("/auth?mode=signup&redirect=/pricing")}
      />

      <ComparisonTable />
      <PricingFAQ />

      {/* Bottom CTA */}
      <div className="text-center mt-16 mb-8">
        <h3 className="text-xl font-bold text-foreground mb-2">Ready to get started?</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Start tracking competitors today. No credit card required for the free plan.
        </p>
        {!isSubscribed && (
          <Button
            onClick={user ? handleUpgrade : () => navigate("/auth?mode=signup")}
            disabled={checkoutLoading}
            className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold px-8 py-3"
          >
            {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Upgrade to Pro — $20/month
          </Button>
        )}
      </div>

      {/* Contact Sales Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-foreground">
              Contact Sales
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cf-fn" className="text-foreground text-sm">First Name</Label>
                <Input
                  id="cf-fn"
                  value={contactForm.firstName}
                  onChange={(e) => setContactForm(f => ({ ...f, firstName: e.target.value }))}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cf-ln" className="text-foreground text-sm">Last Name</Label>
                <Input
                  id="cf-ln"
                  value={contactForm.lastName}
                  onChange={(e) => setContactForm(f => ({ ...f, lastName: e.target.value }))}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cf-email" className="text-foreground text-sm">Email</Label>
              <Input
                id="cf-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                className="bg-background border-border"
                required
              />
            </div>
            <div>
              <Label htmlFor="cf-msg" className="text-foreground text-sm">Tell Us More...</Label>
              <Textarea
                id="cf-msg"
                value={contactForm.message}
                onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                className="bg-background border-border min-h-[120px]"
                placeholder="Tell us about your business needs..."
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold rounded-lg">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};

export default Pricing;
