import { WalmartMarketplaceProductTrendsHeroSection } from "@/components/WalmartMarketplaceProductTrendsHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const WalmartMarketplaceProductTrends = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <WalmartMarketplaceProductTrendsHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default WalmartMarketplaceProductTrends;
