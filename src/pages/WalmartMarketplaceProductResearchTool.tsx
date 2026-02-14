import { WalmartMarketplaceProductResearchHeroSection } from "@/components/WalmartMarketplaceProductResearchHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const WalmartMarketplaceProductResearchTool = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <WalmartMarketplaceProductResearchHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default WalmartMarketplaceProductResearchTool;
