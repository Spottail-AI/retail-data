import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, TrendingUp, CheckCircle, Zap, Target, BarChart3, Gauge } from "lucide-react";
import { useState } from "react";
import { DemoSection } from "@/components/DemoSection";
import { Header } from "@/components/Header";

const TikTokShopAnalytics = () => {
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
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Trend Prediction Made Simple",
      description: "We don't just show you sales stats — we forecast what's about to go viral."
    },
    {
      icon: Gauge,
      title: "Real-Time Insights",
      description: "Monitor live product performance, keyword buzz, and audience engagement."
    },
    {
      icon: Target,
      title: "Actionable Growth Tips",
      description: "Turn data into revenue with clear recommendations on what to push, restock, or bundle."
    },
    {
      icon: BarChart3,
      title: "Easy, Visual Dashboard",
      description: "No complicated setup. Get all your TikTok Shop analytics at a glance."
    }
  ];

  const users = [
    "Creators & Sellers who want to sell what's trending.",
    "Brands tapping into TikTok's explosive growth.",
    "E-commerce Agencies managing multiple TikTok Shops.",
    "Marketers looking to plan viral campaigns."
  ];

  const faqs = [
    {
      question: "Is this TikTok Shop Analytics Tool safe to use?",
      answer: "Yes! We comply with TikTok's data policies and never compromise your account."
    },
    {
      question: "How accurate are your trend predictions?",
      answer: "Our AI models learn from millions of data points. Users report up to 50% higher sales on trending products."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Of course — you're in full control."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="py-8 px-4 relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png" 
              alt="Spottail" 
              className="h-8"
            />
          </div>
          <Header inline />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            TikTok Shop Analytics Tools:
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Predict Trends Before They Go Viral
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Stop guessing what's going to sell. Our TikTok Shop Analytics Tools help you spot products that are starting to trend, so you can stock, promote, and profit before your competitors even notice.
          </p>
          
          <Button 
            onClick={scrollToDemo}
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 text-center">
            Why Track TikTok Shop Analytics Tools
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent"> With Us</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Tell Us More</h3>
              <p className="text-slate-600">Choose your targeted location, product niche, platform, etc</p>
            </Card>
            
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Uncover Hidden Trends</h3>
              <p className="text-slate-600">Our AI scans millions of signals to predict which products are about to take off.</p>
            </Card>
            
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Act & Win</h3>
              <p className="text-slate-600">Use these insights to run viral campaigns, stock smart, and grow fast.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Who Uses Our TikTok Shop Analytics Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user, index) => (
              <div key={index} className="flex items-center text-white text-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 flex-shrink-0" />
                {user}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Get Ahead of Trends on TikTok Shop</h2>
          <p className="text-xl mb-8">Don't just scroll — sell smarter. Discover the next viral bestseller now.</p>
          <div className="flex justify-center space-x-8 mb-8 text-lg">
            <span>✅ Try it Free</span>
            <span>✅ No Risk</span>
            <span>✅ Stay Ahead</span>
          </div>
          <Button 
            onClick={scrollToDemo}
            size="lg" 
            className="bg-white text-emerald-600 hover:bg-gray-100 px-12 py-4 text-lg font-semibold rounded-full"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TikTokShopAnalytics;
