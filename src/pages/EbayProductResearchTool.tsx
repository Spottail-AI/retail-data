import { EbayProductResearchHeroSection } from "@/components/EbayProductResearchHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const EbayProductResearchTool = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <EbayProductResearchHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default EbayProductResearchTool;
