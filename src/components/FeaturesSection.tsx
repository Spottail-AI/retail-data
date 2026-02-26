import { DollarSign, Search, Truck, Target } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: DollarSign,
      title: "Cost & Margin Intelligence",
      description: "Track Consumer Price Index. Monitor commodity prices. Follow raw material fluctuations. Get alerts when input costs threaten margins."
    },
    {
      icon: Search,
      title: "Product Opportunity Detection",
      description: "Identify emerging product demand signals. Discover rising market categories. Spot revenue opportunities before competitors."
    },
    {
      icon: Truck,
      title: "Supplier & Distributor Discovery",
      description: "Search verified distributors. Find suppliers in one click. Reduce sourcing friction."
    },
    {
      icon: Target,
      title: "Competitive Advantage Analysis",
      description: "Track competitor pricing. Detect feature gaps. Find positioning opportunities using AI insights."
    }
  ];

  return (
    <section id="features-section" className="py-20 md:py-36 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 md:mb-8 tracking-wide">
            Built for Retail, E-Commerce,
            <span className="text-primary"> and Enterprise</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Data-driven insights that protect margins and unlock new growth opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card border border-[hsl(var(--card-border))] rounded-xl p-6 md:p-8 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
