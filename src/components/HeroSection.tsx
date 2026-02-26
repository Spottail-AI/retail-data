import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-8 md:py-28">
      <Header />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-success/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-foreground mb-8 md:mb-10 leading-tight tracking-wide">
          AI Growth Partner
          <br />
          <span className="text-primary">for Retail & E-Commerce</span>
        </h1>
        
        <div className="flex flex-col items-center gap-2.5 md:gap-3 mb-12 md:mb-16 max-w-3xl mx-auto">
          {[
            "Track food and commodity prices.",
            "Find suppliers and distributors of your products in one click.",
            "Analyze competitors to find your unique edge.",
            "Uncover products about to trend."
          ].map((line, i) => (
            <div key={i} className="flex items-start gap-2 text-base md:text-xl text-foreground text-left">
              <Check className="w-5 h-5 text-cta flex-shrink-0 mt-0.5" />
              <span>{line}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-16 md:mb-24">
          <Button 
            size="lg" 
            className="bg-cta hover:bg-cta/90 text-cta-foreground px-8 sm:px-10 py-5 text-base sm:text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30 w-full sm:w-auto"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 sm:px-10 py-5 text-base sm:text-lg font-semibold rounded-lg w-full sm:w-auto"
          >
            Request Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
