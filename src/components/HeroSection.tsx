import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";

export const HeroSection = () => {
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

      {/* Auth buttons */}
      <Header />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 bg-navy-surface/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-border">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-foreground">AI-Powered Retail Product Research</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight">
          Spot Your Next
          <br />
          <span className="text-primary">Winning Product</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-14 max-w-3xl mx-auto leading-relaxed">
          Our AI analyzes millions of data points across platforms and regions to predict which retail products will trend next. Stay ahead of the curve and maximize your opportunities.
        </p>
        
        <div className="flex justify-center items-center mb-20">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
            onClick={scrollToDemo}
          >
            See it in Action
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-navy-surface/50 border border-border">
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">98%</div>
            <div className="text-muted-foreground text-sm">Prediction Accuracy</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-navy-surface/50 border border-border">
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50+</div>
            <div className="text-muted-foreground text-sm">Countries Covered</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-navy-surface/50 border border-border">
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">24/7</div>
            <div className="text-muted-foreground text-sm">Real-time Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
};
