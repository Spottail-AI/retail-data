import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-28">
      <Header />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-10 leading-tight tracking-wide">
          AI Growth Partner
          <br />
          <span className="text-primary">for Retail & E-Commerce</span>
        </h1>
        
        <div className="flex flex-col items-center gap-3 mb-16 max-w-3xl mx-auto">
          {[
            "Track food and commodity prices.",
            "Find suppliers.",
            "Analyze competitors.",
            "Uncover products about to trend."
          ].map((line, i) => (
            <div key={i} className="flex items-center gap-2 text-lg md:text-xl text-muted-foreground">
              <Check className="w-5 h-5 text-cta flex-shrink-0" />
              <span>{line}</span>
            </div>
          ))}
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            All in one real-time intelligence platform.
          </p>
        </div>
        
        <div className="flex justify-center items-center gap-4 mb-24">
          <Button 
            size="lg" 
            className="bg-cta hover:bg-cta/90 text-cta-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="px-10 py-5 text-lg font-semibold rounded-lg"
          >
            Request Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
