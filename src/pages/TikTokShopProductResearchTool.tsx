import { TikTokShopProductResearchHeroSection } from "@/components/TikTokShopProductResearchHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const TikTokShopProductResearchTool = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <TikTokShopProductResearchHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default TikTokShopProductResearchTool;
