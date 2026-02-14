
import { Globe, Target, BarChart3, Zap, Shield, Clock } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Globe,
      title: "Retail Market Intelligence",
      description: "Monitor retail trends across 50+ countries and regions with real-time data analysis from multiple platforms and marketplaces."
    },
    {
      icon: Target,
      title: "Niche-Specific Insights",
      description: "Drill down into specific retail product categories, demographics, and market segments to find opportunities tailored to your business."
    },
    {
      icon: BarChart3,
      title: "Platform Analytics",
      description: "Track emerging trends across social media, e-commerce platforms, search engines, and retail channels simultaneously."
    },
    {
      icon: Zap,
      title: "Early Warning System",
      description: "Get alerts weeks or months before products peak, giving you the competitive advantage to stock up and capitalize first."
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "AI-powered risk analysis helps you avoid fads and focus on sustainable trends with long-term profit potential."
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Continuous monitoring and instant notifications ensure you never miss an emerging opportunity in your market."
    }
  ];

  return (
    <section className="py-28 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Stay Ahead of Your
            <span className="text-primary"> Competitors</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Make data-driven decisions and capture market opportunities before anyone else.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-8 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
