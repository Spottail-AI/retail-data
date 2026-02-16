
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Results from "./pages/Results";
import AmazonAnalytics from "./pages/AmazonAnalytics";
import TikTokShopAnalytics from "./pages/TikTokShopAnalytics";
import AmazonProductTrends from "./pages/AmazonProductTrends";
import TikTokShopProductTrends from "./pages/TikTokShopProductTrends";
import EcommerceProductTrends from "./pages/EcommerceProductTrends";
import ShopifyDropshippingProductResearch from "./pages/ShopifyDropshippingProductResearch";
import EbayProductResearchTool from "./pages/EbayProductResearchTool";
import EcommerceProductResearchTool from "./pages/EcommerceProductResearchTool";
import FacebookMarketplaceProductResearchTool from "./pages/FacebookMarketplaceProductResearchTool";
import FacebookMarketplaceAnalyticsTool from "./pages/FacebookMarketplaceAnalyticsTool";
import EbayAnalyticsTool from "./pages/EbayAnalyticsTool";
import EcommerceAnalyticsTool from "./pages/EcommerceAnalyticsTool";
import WalmartMarketplaceAnalyticsTool from "./pages/WalmartMarketplaceAnalyticsTool";
import EbayProductTrends from "./pages/EbayProductTrends";
import EtsyProductTrends from "./pages/EtsyProductTrends";
import WalmartMarketplaceProductTrends from "./pages/WalmartMarketplaceProductTrends";
import EtsyProductResearchTool from "./pages/EtsyProductResearchTool";
import TikTokShopProductResearchTool from "./pages/TikTokShopProductResearchTool";
import VintedProductResearchTool from "./pages/VintedProductResearchTool";
import WalmartMarketplaceProductResearchTool from "./pages/WalmartMarketplaceProductResearchTool";
import TrendingBeautyProductsUS from "./pages/TrendingBeautyProductsUS";
import TrendingElectronicProductsUS from "./pages/TrendingElectronicProductsUS";
import TrendingFashionProductsUS from "./pages/TrendingFashionProductsUS";
import TrendingHealthProductsUS from "./pages/TrendingHealthProductsUS";
import TrendingAutomobileProductsUS from "./pages/TrendingAutomobileProductsUS";
import TrendingOfficeProductsUS from "./pages/TrendingOfficeProductsUS";
import TrendingChildrenToysProductsUS from "./pages/TrendingChildrenToysProductsUS";
import TrendingFoodProductsUS from "./pages/TrendingFoodProductsUS";
import TrendingFurnitureHomeProductsUS from "./pages/TrendingFurnitureHomeProductsUS";
import TrendingEcommerceProductsUS from "./pages/TrendingEcommerceProductsUS";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Helium10Alternative from "./pages/Helium10Alternative";
import JungleScoutAlternative from "./pages/JungleScoutAlternative";
import SellTheTrendAlternative from "./pages/SellTheTrendAlternative";
import PexdaAlternative from "./pages/PexdaAlternative";
import ExplodingTopicsAlternative from "./pages/ExplodingTopicsAlternative";
import AlgopixAlternative from "./pages/AlgopixAlternative";
import TrendHunterAlternative from "./pages/TrendHunterAlternative";
import EcomhuntAlternative from "./pages/EcomhuntAlternative";
import DropshipSpyAlternative from "./pages/DropshipSpyAlternative";
import GlimpseAlternative from "./pages/GlimpseAlternative";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/amazon-analytics-tool" element={<AmazonAnalytics />} />
            <Route path="/tiktok-shop-analytics-tool" element={<TikTokShopAnalytics />} />
            <Route path="/amazon-product-trends" element={<AmazonProductTrends />} />
            <Route path="/tiktok-shop-product-trends" element={<TikTokShopProductTrends />} />
            <Route path="/ecommerce-product-trends" element={<EcommerceProductTrends />} />
            <Route path="/product-research-tool-shopify-dropshipping" element={<ShopifyDropshippingProductResearch />} />
            <Route path="/ebay-product-research-tool" element={<EbayProductResearchTool />} />
            <Route path="/ecommerce-product-research-tool" element={<EcommerceProductResearchTool />} />
            <Route path="/facebook-marketplace-product-research-tool" element={<FacebookMarketplaceProductResearchTool />} />
            <Route path="/facebook-marketplace-analytics-tool" element={<FacebookMarketplaceAnalyticsTool />} />
            <Route path="/ebay-analytics-tool" element={<EbayAnalyticsTool />} />
            <Route path="/ecommerce-analytics-tool" element={<EcommerceAnalyticsTool />} />
            <Route path="/walmart-marketplace-analytics-tool" element={<WalmartMarketplaceAnalyticsTool />} />
            <Route path="/ebay-product-trends" element={<EbayProductTrends />} />
            <Route path="/etsy-product-trends" element={<EtsyProductTrends />} />
            <Route path="/walmart-marketplace-product-trends" element={<WalmartMarketplaceProductTrends />} />
            <Route path="/etsy-product-research-tool" element={<EtsyProductResearchTool />} />
            <Route path="/tiktok-shop-product-research-tool" element={<TikTokShopProductResearchTool />} />
            <Route path="/vinted-product-research-tool" element={<VintedProductResearchTool />} />
            <Route path="/walmart-marketplace-product-research-tool" element={<WalmartMarketplaceProductResearchTool />} />
            <Route path="/trending-beauty-products-us" element={<TrendingBeautyProductsUS />} />
            <Route path="/trending-electronic-products-us" element={<TrendingElectronicProductsUS />} />
            <Route path="/trending-fashion-products-us" element={<TrendingFashionProductsUS />} />
            <Route path="/trending-health-products-us" element={<TrendingHealthProductsUS />} />
            <Route path="/trending-automobile-products-us" element={<TrendingAutomobileProductsUS />} />
            <Route path="/trending-office-products-us" element={<TrendingOfficeProductsUS />} />
            <Route path="/trending-children-toys-products-us" element={<TrendingChildrenToysProductsUS />} />
            <Route path="/trending-food-products-us" element={<TrendingFoodProductsUS />} />
            <Route path="/trending-furniture-home-products-us" element={<TrendingFurnitureHomeProductsUS />} />
            <Route path="/trending-ecommerce-products-us" element={<TrendingEcommerceProductsUS />} />
            <Route path="/helium10-alternative" element={<Helium10Alternative />} />
            <Route path="/jungle-scout-alternative" element={<JungleScoutAlternative />} />
            <Route path="/sell-the-trend-alternative" element={<SellTheTrendAlternative />} />
            <Route path="/pexda-alternative" element={<PexdaAlternative />} />
            <Route path="/exploding-topics-alternative" element={<ExplodingTopicsAlternative />} />
            <Route path="/algopix-alternative" element={<AlgopixAlternative />} />
            <Route path="/trendhunter-alternative" element={<TrendHunterAlternative />} />
            <Route path="/ecomhunt-alternative" element={<EcomhuntAlternative />} />
            <Route path="/dropship-spy-alternative" element={<DropshipSpyAlternative />} />
            <Route path="/glimpse-alternative" element={<GlimpseAlternative />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
