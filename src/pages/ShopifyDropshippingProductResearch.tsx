import { ShopifyDropshippingHeroSection } from "@/components/ShopifyDropshippingHeroSection";
import { DemoSection } from "@/components/DemoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

const ShopifyDropshippingProductResearch = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <ShopifyDropshippingHeroSection />
      <DemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default ShopifyDropshippingProductResearch;