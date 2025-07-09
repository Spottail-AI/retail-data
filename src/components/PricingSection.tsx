
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Rocket } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "$49",
      period: "/month",
      description: "Perfect for small retailers testing the waters",
      features: [
        "5 country markets",
        "10 product categories",
        "Weekly trend reports",
        "Email alerts",
        "Basic analytics",
        "Community support"
      ],
      popular: false
    },
    {
      name: "Professional",
      icon: Crown,
      price: "$149",
      period: "/month",
      description: "Ideal for growing businesses and online stores",
      features: [
        "25+ country markets",
        "Unlimited categories",
        "Daily trend reports",
        "Real-time alerts",
        "Advanced analytics",
        "Platform-specific insights",
        "Priority support",
        "Custom filters"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      icon: Rocket,
      price: "Custom",
      period: "pricing",
      description: "For large retailers and enterprise businesses",
      features: [
        "All global markets",
        "Unlimited everything",
        "Hourly updates",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "Training & onboarding"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"> Success Plan</span>
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Start with our free trial, then choose the plan that fits your business needs. 
            All plans include our core AI trend detection technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white/5 backdrop-blur-sm border rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-black mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-black mb-2">
                  {plan.price}
                  <span className="text-lg text-gray-600 font-normal">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-black">
                    <Check className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-black mb-4">
            All plans include a <span className="text-emerald-400 font-semibold">14-day free trial</span>. 
            No credit card required.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money back guarantee</span>
            <span>✓ 24/7 customer support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
