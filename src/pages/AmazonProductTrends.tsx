import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, TrendingUp, CheckCircle, Target, BarChart3, Gauge, Eye } from "lucide-react";
import { useState } from "react";
import { DemoSection } from "@/components/DemoSection";

const AmazonProductTrends = () => {
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
      title: "Predict Emerging Bestsellers",
      description: "We go beyond historical sales. Our AI uncovers signals that reveal products trending up before they become mainstream."
    },
    {
      icon: Gauge,
      title: "Real-Time Trend Data",
      description: "Monitor product demand, keyword popularity, and customer sentiment — updated continuously."
    },
    {
      icon: Target,
      title: "Actionable Insights",
      description: "See exactly what to promote, restock, or bundle — no guesswork needed."
    },
    {
      icon: BarChart3,
      title: "Easy-to-Use Dashboard",
      description: "Visual, intuitive reports make it simple to track Amazon product trends at a glance."
    }
  ];

  const users = [
    "Retailers who want to stay ahead of the curve.",
    "Private Label Sellers searching for their next winning product.",
    "E-commerce Agencies that deliver growth for clients.",
    "Brands that can't afford to miss a trend."
  ];

  const faqs = [
    {
      question: "Where does the trend data come from?",
      answer: "We use real Amazon marketplace data, combined with search trends and customer insights."
    },
    {
      question: "How accurate are the predictions?",
      answer: "Our AI gets smarter every day. Users see up to 40% more sales on trending products."
    },
    {
      question: "Is it safe for my Amazon account?",
      answer: "100% — we comply with Amazon's data guidelines."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely — no contracts, no hassle."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png" 
              alt="Spottail" 
              className="h-8"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Amazon Product Trends:
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Discover What's About to Sell Big
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Don't waste time chasing yesterday's bestsellers. Our tool helps you discover Amazon product trends in real time — so you can stock up, advertise smarter, and outsell your competition.
          </p>
          
          <Button 
            onClick={scrollToDemo}
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
          >
            Start Tracking Trends Free
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
            Why Choose Us to Track
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent"> Amazon Product Trends</span>
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
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Spot Hidden Product Trends</h3>
              <p className="text-slate-600">Our system scans millions of data points to show you what's gaining traction.</p>
            </Card>
            
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Act Fast, Stay Ahead</h3>
              <p className="text-slate-600">Use your trend insights to win the Buy Box, run smart ads, and grow profitably.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Who Uses Our Amazon Product Trends Tool?</h2>
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
          <h2 className="text-4xl font-bold mb-6">Predict Amazon Product Trends Today</h2>
          <p className="text-xl mb-8">Stop guessing and start selling what's next. Grow your Amazon store with data that gives you an edge.</p>
          <div className="flex justify-center space-x-8 mb-8 text-lg">
            <span>✅ Try it Free</span>
            <span>✅ No Risk</span>
            <span>✅ Predict the Next Bestseller</span>
          </div>
          <Button 
            onClick={scrollToDemo}
            size="lg" 
            className="bg-white text-emerald-600 hover:bg-gray-100 px-12 py-4 text-lg font-semibold rounded-full"
          >
            Start Tracking Trends Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AmazonProductTrends;
