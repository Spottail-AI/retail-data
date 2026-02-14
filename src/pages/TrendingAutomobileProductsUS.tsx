import { TrendingAutomobileProductsUSHeroSection } from "@/components/TrendingAutomobileProductsUSHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const TrendingAutomobileProductsUS = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <TrendingAutomobileProductsUSHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default TrendingAutomobileProductsUS;
