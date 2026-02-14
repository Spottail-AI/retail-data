import { TrendingBeautyProductsUSHeroSection } from "@/components/TrendingBeautyProductsUSHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const TrendingBeautyProductsUS = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <TrendingBeautyProductsUSHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default TrendingBeautyProductsUS;
