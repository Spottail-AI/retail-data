import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";

export const TrendingOfficeProductsUSHeroSection = () => {
  const scrollToDemo = () => { document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-28">
      <Header />
      <div className="absolute inset-0 overflow-hidden"><div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div><div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/8 rounded-full blur-3xl"></div></div>
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-10"><div className="flex items-center space-x-2 bg-navy-surface/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-border"><TrendingUp className="w-4 h-4 text-success" /><span className="text-sm font-medium text-foreground">AI-Powered Retail Product Research</span></div></div>
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-10 leading-tight tracking-wide">Find Trending Office Products in the United States</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">Jump on the next trend. Find trending office products that people are talking about and stay ahead of the curve!</p>
        <div className="flex justify-center items-center mb-24"><Button size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30" onClick={scrollToDemo}>Start Researching Products Free<ArrowRight className="ml-2 w-5 h-5" /></Button></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-navy-surface/50 border border-[hsl(var(--card-border))]"><div className="text-3xl md:text-4xl font-bold text-foreground mb-2">98%</div><div className="text-muted-foreground text-sm">Prediction Accuracy</div></div>
          <div className="text-center p-6 rounded-xl bg-navy-surface/50 border border-[hsl(var(--card-border))]"><div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50+</div><div className="text-muted-foreground text-sm">Countries Covered</div></div>
          <div className="text-center p-6 rounded-xl bg-navy-surface/50 border border-[hsl(var(--card-border))]"><div className="text-3xl md:text-4xl font-bold text-foreground mb-2">24/7</div><div className="text-muted-foreground text-sm">Real-time Monitoring</div></div>
        </div>
      </div>
    </section>
  );
};
