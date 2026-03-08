import { Check, X, Zap, Crown, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubscriptionTier } from "@/lib/stripe-config";

interface PricingCardsProps {
  currentTier: SubscriptionTier;
  isLoggedIn: boolean;
  loading: boolean;
  onUpgrade: () => void;
  onContactSales: () => void;
  onSignUp: () => void;
}

const plans = [
  {
    tier: "free" as const,
    name: "Free",
    icon: Zap,
    price: "$0",
    billing: "Forever free",
    description: "Perfect for getting started",
    features: [
      { text: "Track 2 competitors", included: true },
      { text: "Daily price updates", included: true },
      { text: "Email alerts", included: true },
      { text: "Basic analytics", included: true },
      { text: "Dashboard access", included: true },
      { text: "Real-time monitoring", included: false },
      { text: "Slack integration", included: false },
      { text: "Pricing recommendations", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    tier: "pro" as const,
    name: "Pro",
    icon: Crown,
    price: "$20",
    billing: "/month",
    description: "For growing businesses and online stores",
    popular: true,
    features: [
      { text: "Track 10 competitors", included: true },
      { text: "Real-time monitoring", included: true },
      { text: "Slack integration", included: true },
      { text: "Pricing recommendations", included: true },
      { text: "Advanced analytics", included: true },
      { text: "API access", included: true },
      { text: "Email support", included: true },
      { text: "Weekly auto-updates", included: true },
    ],
  },
  {
    tier: "enterprise" as const,
    name: "Enterprise",
    icon: Rocket,
    price: "Custom",
    billing: "pricing",
    description: "For large retailers and enterprise businesses",
    features: [
      { text: "Unlimited competitor tracking", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated support", included: true },
      { text: "White-label options", included: true },
      { text: "SLA guarantee", included: true },
      { text: "Priority feature requests", included: true },
      { text: "Advanced security", included: true },
      { text: "Bulk pricing on API", included: true },
    ],
  },
];

export const PricingCards = ({
  currentTier,
  isLoggedIn,
  loading,
  onUpgrade,
  onContactSales,
  onSignUp,
}: PricingCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {plans.map((plan) => {
        const isCurrentPlan = isLoggedIn && currentTier === plan.tier;
        return (
          <div
            key={plan.tier}
            className={cn(
              "relative bg-card border rounded-2xl p-6 md:p-8 transition-all duration-300 flex flex-col",
              plan.popular
                ? "border-primary ring-1 ring-primary/30 md:scale-105"
                : "border-border hover:border-primary/30"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-6 pt-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <plan.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                {plan.price}
                <span className="text-base text-muted-foreground font-normal ml-1">
                  {plan.billing}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-center text-sm",
                    feature.included ? "text-foreground" : "text-muted-foreground/50 line-through"
                  )}
                >
                  {feature.included ? (
                    <Check className="w-4 h-4 text-success mr-3 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 mr-3 flex-shrink-0" />
                  )}
                  {feature.text}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {isCurrentPlan ? (
                <Button disabled className="w-full py-3 font-semibold rounded-lg bg-secondary text-secondary-foreground">
                  Your Current Plan
                </Button>
              ) : plan.tier === "enterprise" ? (
                <Button
                  onClick={onContactSales}
                  className="w-full py-3 font-semibold rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  Contact Sales
                </Button>
              ) : plan.tier === "pro" ? (
                <Button
                  onClick={isLoggedIn ? onUpgrade : onSignUp}
                  disabled={loading}
                  className={cn(
                    "w-full py-3 font-semibold rounded-lg transition-all duration-300",
                    "bg-cta hover:bg-cta/90 text-cta-foreground shadow-lg shadow-cta/20"
                  )}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {isLoggedIn ? "Upgrade to Pro" : "Start Free Trial"}
                </Button>
              ) : (
                <Button
                  onClick={isLoggedIn ? undefined : onSignUp}
                  disabled={isLoggedIn}
                  className="w-full py-3 font-semibold rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  {isLoggedIn ? "Free Plan" : "Get Started"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
