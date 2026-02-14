import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Target, BarChart3, Gauge, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DemoSection } from "@/components/DemoSection";
import { Header } from "@/components/Header";

const AmazonAnalytics = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { firstName, lastName, email });
    setIsDialogOpen(false);
    setFirstName("");
    setLastName("");
    setEmail("");
  };

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: TrendingUp, title: "Predict Emerging Trends", description: "Unlike basic analytics tools that just show you what sold yesterday, we analyse signals to forecast what's about to trend." },
    { icon: Gauge, title: "Real-Time Product Insights", description: "Track sales velocity, keyword rankings, and customer sentiment — all in real time." },
    { icon: Target, title: "Actionable Recommendations", description: "Stop guessing. Get clear, data-backed suggestions on which products to promote, restock, or bundle." },
    { icon: BarChart3, title: "Easy to Use Dashboard", description: "No learning curve. See your opportunities at a glance with intuitive, visual reports." }
  ];

  const users = [
    "Retailers who want to maximize bestsellers.",
    "Private Label Sellers who need product ideas.",
    "Agencies & Consultants who deliver growth for clients.",
    "Brands looking for a competitive edge."
  ];

  const faqs = [
    { question: "Is this Amazon Analytics Tool approved by Amazon?", answer: "Yes. We comply with Amazon's API and data policies." },
    { question: "How accurate are the trend predictions?", answer: "Our models continuously learn and improve. Users see up to 40% higher sell-through rates." },
    { question: "Can I cancel anytime?", answer: "Absolutely — you're in control." }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-wide">
            Amazon Analytics Tool:
            <br />
            <span className="text-primary">Predict What's Trending Before It Happens</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Tired of chasing trends after they peak? Our Amazon Analytics Tool helps retailers spot products that are gaining traction, so you can act fast and stay ahead of the competition.
          </p>
          <Button onClick={scrollToDemo} size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-12 py-4 text-xl font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300">
            Get Started Free<ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </section>

      <DemoSection />

      <section className="py-36 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center tracking-wide">
            Why Our Amazon Analytics Tool <span className="text-primary">Stands Out</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-card backdrop-blur-sm border border-[hsl(var(--card-border))] rounded-2xl p-8">
                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-36 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-16 tracking-wide">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ n: "1", t: "Tell Us More", d: "Choose your targeted location, product niche, platform, etc" },
              { n: "2", t: "Discover Hidden Opportunities", d: "Our AI analyses millions of data points to detect product trends in your chosen niche before your competitors do." },
              { n: "3", t: "Take Action & Grow", d: "Use these data to stock smart, run ads efficiently, and grow profitably." }
            ].map((step, i) => (
              <Card key={i} className="p-8 bg-card border border-[hsl(var(--card-border))]">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-2xl font-bold">{step.n}</div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{step.t}</h3>
                <p className="text-muted-foreground">{step.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-36 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12 tracking-wide">Who Uses Our Amazon Analytics Tool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user, index) => (
              <div key={index} className="flex items-center text-foreground text-lg">
                <CheckCircle className="w-6 h-6 text-success mr-4 flex-shrink-0" />{user}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-36 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center tracking-wide">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card border border-[hsl(var(--card-border))] rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-36 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6 tracking-wide">Start Predicting Amazon Trends Today</h2>
          <p className="text-xl text-muted-foreground mb-8">Don't wait for your competitors to outrank you. Discover your next bestseller now.</p>
          <div className="flex justify-center space-x-8 mb-8 text-lg text-foreground">
            <span>✅ Try it Free</span><span>✅ No Risk</span><span>✅ Get Ahead of Trends</span>
          </div>
          <Button onClick={scrollToDemo} size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-12 py-4 text-lg font-semibold rounded-lg">
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AmazonAnalytics;
