import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, CheckCircle, Target, BarChart3, Gauge } from "lucide-react";
import { useState } from "react";
import { DemoSection } from "@/components/DemoSection";
import { Header } from "@/components/Header";

const TikTokShopProductTrends = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsDialogOpen(false); setFirstName(""); setLastName(""); setEmail(""); };
  const scrollToDemo = () => { document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' }); };

  const features = [
    { icon: TrendingUp, title: "Predict Viral Products Early", description: "Our AI doesn't just show you what's trending now — it spots products gaining momentum, so you can act fast." },
    { icon: Gauge, title: "Real-Time Trend Data", description: "See product demand, search popularity, and engagement metrics as they happen." },
    { icon: Target, title: "Clear, Actionable Insights", description: "Turn raw data into real sales. Know exactly what to promote, restock, or bundle for your TikTok Shop." },
    { icon: BarChart3, title: "Simple, Visual Dashboard", description: "No guesswork — just clear trend graphs and reports anyone can use." }
  ];
  const users = ["Creators & Sellers wanting to catch the next big thing.", "Brands looking to ride the TikTok wave.", "Agencies & Marketers planning viral campaigns.", "Retailers expanding into TikTok Shop."];
  const faqs = [
    { question: "Where does your TikTok Shop trend data come from?", answer: "We analyse live TikTok Shop data, search patterns, and engagement signals." },
    { question: "How accurate is it?", answer: "Our predictive AI learns and improves daily. Users see up to 50% more sales on trending products." },
    { question: "Is it safe for my shop?", answer: "Yes — we comply with TikTok Shop's data guidelines." },
    { question: "Can I cancel anytime?", answer: "Yes — no contracts, no hassle." }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-wide">TikTok Shop Product Trends:<br /><span className="text-primary">Know What's Going Viral Next</span></h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">Don't get left behind. Our tool helps you track TikTok Shop product trends in real time — so you can sell what's about to go viral, not what's already fading.</p>
          <Button onClick={scrollToDemo} size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-12 py-4 text-xl font-semibold rounded-lg shadow-lg shadow-cta/20">Start Tracking Trends Free<ArrowRight className="ml-2 w-6 h-6" /></Button>
        </div>
      </section>
      <DemoSection />
      <section className="py-36 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center tracking-wide">Why Track TikTok Shop Product Trends <span className="text-primary">With Us</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {features.map((f, i) => (<div key={i} className="bg-card border border-[hsl(var(--card-border))] rounded-2xl p-8"><div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6"><f.icon className="w-7 h-7 text-primary" /></div><h3 className="text-xl font-semibold text-foreground mb-4">{f.title}</h3><p className="text-muted-foreground leading-relaxed">{f.description}</p></div>))}
          </div>
        </div>
      </section>
      <section className="py-36 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-16 tracking-wide">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{n:"1",t:"Tell Us More",d:"Choose your targeted location, product niche, platform, etc"},{n:"2",t:"Track Hidden Product Trends",d:"Our system scans millions of data points to reveal which products are heating up."},{n:"3",t:"Act & Win Before It's Too Late",d:"Use trend insights to create viral videos, run winning campaigns, and sell out fast."}].map((s,i)=>(<Card key={i} className="p-8 bg-card border border-[hsl(var(--card-border))]"><div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-2xl font-bold">{s.n}</div><h3 className="text-xl font-semibold text-foreground mb-4">{s.t}</h3><p className="text-muted-foreground">{s.d}</p></Card>))}
          </div>
        </div>
      </section>
      <section className="py-36 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12 tracking-wide">Who Uses Our TikTok Shop Product Trends Tool?</h2>
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
          <h2 className="text-4xl font-bold text-foreground mb-6 tracking-wide">Predict TikTok Shop Product Trends Today</h2>
          <p className="text-xl text-muted-foreground mb-8">Stay one step ahead of what your audience wants next.</p>
          <div className="flex justify-center space-x-8 mb-8 text-lg text-foreground"><span>✅ Try it Free</span><span>✅ No Risk</span><span>✅ Catch the Next Viral Product</span></div>
          <Button onClick={scrollToDemo} size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-12 py-4 text-lg font-semibold rounded-lg">Start Tracking Trends Free</Button>
        </div>
      </section>
    </div>
  );
};

export default TikTokShopProductTrends;
