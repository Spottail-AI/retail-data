
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, TrendingUp, CheckCircle, Users, Target, BarChart3, Gauge } from "lucide-react";
import { useState } from "react";

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

  const features = [
    {
      icon: TrendingUp,
      title: "Predict Emerging Trends",
      description: "Unlike basic analytics tools that just show you what sold yesterday, we analyse signals to forecast what's about to trend."
    },
    {
      icon: Gauge,
      title: "Real-Time Product Insights",
      description: "Track sales velocity, keyword rankings, and customer sentiment — all in real time."
    },
    {
      icon: Target,
      title: "Actionable Recommendations",
      description: "Stop guessing. Get clear, data-backed suggestions on which products to promote, restock, or bundle."
    },
    {
      icon: BarChart3,
      title: "Easy to Use Dashboard",
      description: "No learning curve. See your opportunities at a glance with intuitive, visual reports."
    }
  ];

  const users = [
    "Retailers who want to maximize bestsellers.",
    "Private Label Sellers who need product ideas.",
    "Agencies & Consultants who deliver growth for clients.",
    "Brands looking for a competitive edge."
  ];

  const faqs = [
    {
      question: "Is this Amazon Analytics Tool approved by Amazon?",
      answer: "Yes. We comply with Amazon's API and data policies."
    },
    {
      question: "How accurate are the trend predictions?",
      answer: "Our models continuously learn and improve. Users see up to 40% higher sell-through rates."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely — you're in control."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-slate-800">Spottail</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Amazon Analytics Tool:
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Predict What's Trending Before It Happens
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Tired of chasing trends after they peak? Our Amazon Analytics Tool helps retailers spot products that are gaining traction, so you can act fast and stay ahead of the competition.
          </p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-2xl transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-slate-800 mb-2">
                  We'll be live soon. Receive the results directly in your email
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white/80 border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white/80 border-slate-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/80 border-slate-200"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-full"
                >
                  Send me Trends
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 text-center">
            Why Our Amazon Analytics Tool
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent"> Stands Out</span>
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
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Discover Hidden Opportunities</h3>
              <p className="text-slate-600">Our AI analyses millions of data points to detect product trends in your chosen niche before your competitors do.</p>
            </Card>
            
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200/50">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Take Action & Grow</h3>
              <p className="text-slate-600">Use these data to stock smart, run ads efficiently, and grow profitably.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Who Uses Our Amazon Analytics Tool?</h2>
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
          <h2 className="text-4xl font-bold mb-6">Start Predicting Amazon Trends Today</h2>
          <p className="text-xl mb-8">Don't wait for your competitors to outrank you. Discover your next bestseller now.</p>
          <div className="flex justify-center space-x-8 mb-8 text-lg">
            <span>✅ Try it Free</span>
            <span>✅ No Risk</span>
            <span>✅ Get Ahead of Trends</span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-100 px-12 py-4 text-lg font-semibold rounded-full"
              >
                Get Started Free
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </section>
    </div>
  );
};

export default AmazonAnalytics;
