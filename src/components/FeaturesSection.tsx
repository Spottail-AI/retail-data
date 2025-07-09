
import { Globe, Target, BarChart3, Zap, Shield, Clock } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Market Intelligence",
      description: "Monitor trends across 50+ countries and regions with real-time data analysis from multiple platforms and marketplaces."
    },
    {
      icon: Target,
      title: "Niche-Specific Insights",
      description: "Drill down into specific product categories, demographics, and market segments to find opportunities tailored to your business."
    },
    {
      icon: BarChart3,
      title: "Platform Analytics",
      description: "Track emerging trends across social media, e-commerce platforms, search engines, and retail channels simultaneously."
    },
    {
      icon: Zap,
      title: "Early Warning System",
      description: "Get alerts 2-4 weeks before products peak, giving you the competitive advantage to stock up and capitalize first."
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
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"> Stay Ahead</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our comprehensive AI platform gives you the tools and insights to make data-driven decisions 
            and capture market opportunities before anyone else.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
