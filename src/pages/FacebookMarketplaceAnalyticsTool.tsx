import { FacebookMarketplaceAnalyticsHeroSection } from "@/components/FacebookMarketplaceAnalyticsHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const FacebookMarketplaceAnalyticsTool = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <FacebookMarketplaceAnalyticsHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default FacebookMarketplaceAnalyticsTool;
