import { Check } from "lucide-react";

export const TestimonialsSection = () => {
  const reasons = [
    "Protect margins from raw material volatility",
    "Spot product opportunities early",
    "Reduce supplier search time",
    "Make faster pricing decisions",
    "Stay ahead of competitors"
  ];

  return (
    <section id="testimonials-section" className="py-36 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-wide">
            Why Retail Teams Use
            <span className="text-primary"> Spottail</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-5 bg-card border border-[hsl(var(--card-border))] rounded-xl"
            >
              <div className="w-6 h-6 bg-success/15 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-success" />
              </div>
              <span className="text-foreground font-medium text-sm">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
