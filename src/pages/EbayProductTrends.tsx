import { EbayProductTrendsHeroSection } from "@/components/EbayProductTrendsHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const EbayProductTrends = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <EbayProductTrendsHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default EbayProductTrends;
