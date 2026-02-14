import { VintedProductResearchHeroSection } from "@/components/VintedProductResearchHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const VintedProductResearchTool = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <VintedProductResearchHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default VintedProductResearchTool;
