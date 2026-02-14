import { EbayAnalyticsHeroSection } from "@/components/EbayAnalyticsHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const EbayAnalyticsTool = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <EbayAnalyticsHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default EbayAnalyticsTool;
