import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, CheckCircle, Target, BarChart3, Gauge } from "lucide-react";
import { useState } from "react";
import { DemoSection } from "@/components/DemoSection";
import { Header } from "@/components/Header";

const TikTokShopAnalytics = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsDialogOpen(false); setFirstName(""); setLastName(""); setEmail(""); };
  const scrollToDemo = () => { document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' }); };

  const features = [
    { icon: TrendingUp, title: "Trend Prediction Made Simple", description: "We don't just show you sales stats — we forecast what's about to go viral." },
    { icon: Gauge, title: "Real-Time Insights", description: "Monitor live product performance, keyword buzz, and audience engagement." },
    { icon: Target, title: "Actionable Growth Tips", description: "Turn data into revenue with clear recommendations on what to push, restock, or bundle." },
    { icon: BarChart3, title: "Easy, Visual Dashboard", description: "No complicated setup. Get all your TikTok Shop analytics at a glance." }
  ];
  const users = ["Creators & Sellers who want to sell what's trending.", "Brands tapping into TikTok's explosive growth.", "E-commerce Agencies managing multiple TikTok Shops.", "Marketers looking to plan viral campaigns."];
  const faqs = [
    { question: "Is this TikTok Shop Analytics Tool safe to use?", answer: "Yes! We comply with TikTok's data policies and never compromise your account." },
    { question: "How accurate are your trend predictions?", answer: "Our AI models learn from millions of data points. Users report up to 50% higher sales on trending products." },
    { question: "Can I cancel anytime?", answer: "Of course — you're in full control." }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-wide">TikTok Shop Analytics Tools:<br /><span className="text-primary">Predict Trends Before They Go Viral</span></h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">Stop guessing what's going to sell. Our TikTok Shop Analytics Tools help you spot products that are starting to trend, so you can stock, promote, and profit before your competitors even notice.</p>
          <Button onClick={scrollToDemo} size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-12 py-4 text-xl font-semibold rounded-lg shadow-lg shadow-cta/20">Get Started Free<ArrowRight className="ml-2 w-6 h-6" /></Button>
        </div>
      </section>
      <DemoSection />
      <section className="py-36 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center tracking-wide">Why Track TikTok Shop Analytics Tools <span className="text-primary">With Us</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {features.map((f, i) => (<div key={i} className="bg-card border border-[hsl(var(--card-border))] rounded-2xl p-8"><div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6"><f.icon className="w-7 h-7 text-primary" /></div><h3 className="text-xl font-semibold text-foreground mb-4">{f.title}</h3><p className="text-muted-foreground leading-relaxed">{f.description}</p></div>))}
          </div>
        </div>
      </section>
      <section className="py-36 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-16 tracking-wide">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{n:"1",t:"Tell Us More",d:"Choose your targeted location, product niche, platform, etc"},{n:"2",t:"Uncover Hidden Trends",d:"Our AI scans millions of signals to predict which products are about to take off."},{n:"3",t:"Act & Win",d:"Use these insights to run viral campaigns, stock smart, and grow fast."}].map((s,i)=>(<Card key={i} className="p-8 bg-card border border-[hsl(var(--card-border))]"><div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-2xl font-bold">{s.n}</div><h3 className="text-xl font-semibold text-foreground mb-4">{s.t}</h3><p className="text-muted-foreground">{s.d}</p></Card>))}
          </div>
        </div>
      </section>
      <section className="py-36 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12 tracking-wide">Who Uses Our TikTok Shop Analytics Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{users.map((u,i)=>(<div key={i} className="flex items-center text-foreground text-lg"><CheckCircle className="w-6 h-6 text-success mr-4 flex-shrink-0" />{u}</div>))}</div>
        </div>
      </section>
      <section className="py-36 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center tracking-wide">Frequently Asked Questions</h2>
          <div className="space-y-8">{faqs.map((f,i)=>(<div key={i} className="bg-card border border-[hsl(var(--card-border))] rounded-2xl p-8"><h3 className="text-xl font-semibold text-foreground mb-4">{f.question}</h3><p className="text-muted-foreground">{f.answer}</p></div>))}</div>
        </div>
      </section>
      <section className="py-36 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6 tracking-wide">Get Ahead of Trends on TikTok Shop</h2>
          <p className="text-xl text-muted-foreground mb-8">Don't just scroll — sell smarter. Discover the next viral bestseller now.</p>
          <div className="flex justify-center space-x-8 mb-8 text-lg text-foreground"><span>✅ Try it Free</span><span>✅ No Risk</span><span>✅ Stay Ahead</span></div>
          <Button onClick={scrollToDemo} size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-12 py-4 text-lg font-semibold rounded-lg">Get Started Free</Button>
        </div>
      </section>
    </div>
  );
};

export default TikTokShopAnalytics;
