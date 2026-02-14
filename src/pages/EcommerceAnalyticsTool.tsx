import { EcommerceAnalyticsHeroSection } from "@/components/EcommerceAnalyticsHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const EcommerceAnalyticsTool = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <EcommerceAnalyticsHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default EcommerceAnalyticsTool;
