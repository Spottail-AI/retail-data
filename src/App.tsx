
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AmazonAnalytics from "./pages/AmazonAnalytics";
import TikTokShopAnalytics from "./pages/TikTokShopAnalytics";
import AmazonProductTrends from "./pages/AmazonProductTrends";
import TikTokShopProductTrends from "./pages/TikTokShopProductTrends";
import EcommerceProductTrends from "./pages/EcommerceProductTrends";
import ShopifyDropshippingProductResearch from "./pages/ShopifyDropshippingProductResearch";
import EbayProductResearchTool from "./pages/EbayProductResearchTool";
import EcommerceProductResearchTool from "./pages/EcommerceProductResearchTool";
import FacebookMarketplaceProductResearchTool from "./pages/FacebookMarketplaceProductResearchTool";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/amazon-analytics-tool" element={<AmazonAnalytics />} />
          <Route path="/tiktok-shop-analytics-tool" element={<TikTokShopAnalytics />} />
          <Route path="/amazon-product-trends" element={<AmazonProductTrends />} />
          <Route path="/tiktok-shop-product-trends" element={<TikTokShopProductTrends />} />
          <Route path="/ecommerce-product-trends" element={<EcommerceProductTrends />} />
          <Route path="/product-research-tool-shopify-dropshipping" element={<ShopifyDropshippingProductResearch />} />
          <Route path="/ebay-product-research-tool" element={<EbayProductResearchTool />} />
          <Route path="/ecommerce-product-research-tool" element={<EcommerceProductResearchTool />} />
          <Route path="/facebook-marketplace-product-research-tool" element={<FacebookMarketplaceProductResearchTool />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
