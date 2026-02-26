
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Zap, Crown, Rocket } from "lucide-react";

export const PricingSection = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', { firstName, lastName, email, message });
    setIsDialogOpen(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "$20",
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
      price: "$40",
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
    <section id="pricing-section" className="py-10 md:py-16 px-4 relative">
      <div className="absolute inset-0 bg-navy-surface/50"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 md:mb-8 tracking-wide">
            Choose Your
            <span className="text-primary"> Success Plan</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Start with our free trial, then choose the plan that fits your business needs. 
            All plans include our core AI trend detection technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-card border rounded-2xl p-6 md:p-8 transition-all duration-300 ${
                plan.popular ? 'border-primary ring-1 ring-primary/30' : 'border-[hsl(var(--card-border))] hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6 md:mb-8 pt-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {plan.price}
                  <span className="text-base text-muted-foreground font-normal">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 md:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-muted-foreground text-sm">
                    <Check className="w-4 h-4 text-success mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.name === "Enterprise" ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-3 font-semibold rounded-lg transition-all duration-300 bg-cta hover:bg-cta/90 text-cta-foreground">
                      Contact Sales
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-border mx-4">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-center text-foreground mb-2">
                        Contact Sales
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactFirstName" className="text-foreground font-medium text-sm">First Name</Label>
                          <Input
                            id="contactFirstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-background border-border"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactLastName" className="text-foreground font-medium text-sm">Last Name</Label>
                          <Input
                            id="contactLastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-background border-border"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="contactEmail" className="text-foreground font-medium text-sm">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background border-border"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-foreground font-medium text-sm">Tell Us More...</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="bg-background border-border min-h-[120px]"
                          placeholder="Tell us about your business needs..."
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold rounded-lg"
                      >
                        Contact Sales
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                    plan.popular 
                      ? "bg-cta hover:bg-cta/90 text-cta-foreground shadow-lg shadow-cta/20" 
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                  onClick={scrollToDemo}
                >
                  Start now - Free
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-8 text-sm text-muted-foreground">
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 customer support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
