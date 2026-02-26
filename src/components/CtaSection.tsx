import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CtaSection = () => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-36 px-4 relative">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-wide">
          Turn Market Data Into
          <span className="text-primary"> Strategic Advantage</span>
        </h2>
        <div className="mb-10">
          <Button
            size="lg"
            className="bg-cta hover:bg-cta/90 text-cta-foreground px-10 py-5 text-lg font-semibold rounded-lg shadow-lg shadow-cta/20 transition-all duration-300 hover:shadow-xl hover:shadow-cta/30"
            onClick={scrollToDemo}
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Usage-based pricing. No long-term contracts.
        </p>
      </div>
    </section>
  );
};
