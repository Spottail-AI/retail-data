import { TrendingChildrenToysProductsUSHeroSection } from "@/components/TrendingChildrenToysProductsUSHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const TrendingChildrenToysProductsUS = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <TrendingChildrenToysProductsUSHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default TrendingChildrenToysProductsUS;
