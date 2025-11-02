import { WalmartMarketplaceProductTrendsHeroSection } from "@/components/WalmartMarketplaceProductTrendsHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const WalmartMarketplaceProductTrends = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
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
