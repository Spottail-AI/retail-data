
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
    // Reset form
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
    <section id="pricing-section" className="py-24 px-4 relative">
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

              {plan.name === "Enterprise" ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white">
                      Contact Sales
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-center text-slate-800 mb-2">
                        Contact Sales
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactFirstName" className="text-slate-700 font-medium">First Name</Label>
                          <Input
                            id="contactFirstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-white/80 border-slate-200"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactLastName" className="text-slate-700 font-medium">Last Name</Label>
                          <Input
                            id="contactLastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-white/80 border-slate-200"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="contactEmail" className="text-slate-700 font-medium">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/80 border-slate-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-slate-700 font-medium">Tell Us More...</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="bg-white/80 border-slate-200 min-h-[120px]"
                          placeholder="Tell us about your business needs..."
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-full"
                      >
                        Contact Sales
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  className="w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white"
                  onClick={scrollToDemo}
                >
                  Start now - Free
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 customer support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
