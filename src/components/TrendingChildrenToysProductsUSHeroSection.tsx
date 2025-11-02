import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

export const TrendingChildrenToysProductsUSHeroSection = () => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Company Logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png" 
            alt="Spottail" 
            className="h-8"
          />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">AI-Powered Retail Product Research</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
          Find Trending Children's Toys Products in the United States
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Jump on the next trend. Find trending children's toys products that people are talking about and stay ahead of the curve!
        </p>
        
        <div className="flex justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
            onClick={scrollToDemo}
          >
            Start Researching Products Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">98%</div>
            <div className="text-slate-600">Prediction Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">50+</div>
            <div className="text-slate-600">Countries Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">24/7</div>
            <div className="text-slate-600">Real-time Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
};
