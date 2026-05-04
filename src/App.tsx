
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Results = lazy(() => import("./pages/Results"));
const AmazonAnalytics = lazy(() => import("./pages/AmazonAnalytics"));
const TikTokShopAnalytics = lazy(() => import("./pages/TikTokShopAnalytics"));
const AmazonProductTrends = lazy(() => import("./pages/AmazonProductTrends"));
const TikTokShopProductTrends = lazy(() => import("./pages/TikTokShopProductTrends"));
const EcommerceProductTrends = lazy(() => import("./pages/EcommerceProductTrends"));
const ShopifyDropshippingProductResearch = lazy(() => import("./pages/ShopifyDropshippingProductResearch"));
const EbayProductResearchTool = lazy(() => import("./pages/EbayProductResearchTool"));
const EcommerceProductResearchTool = lazy(() => import("./pages/EcommerceProductResearchTool"));
const FacebookMarketplaceProductResearchTool = lazy(() => import("./pages/FacebookMarketplaceProductResearchTool"));
const FacebookMarketplaceAnalyticsTool = lazy(() => import("./pages/FacebookMarketplaceAnalyticsTool"));
const EbayAnalyticsTool = lazy(() => import("./pages/EbayAnalyticsTool"));
const EcommerceAnalyticsTool = lazy(() => import("./pages/EcommerceAnalyticsTool"));
const WalmartMarketplaceAnalyticsTool = lazy(() => import("./pages/WalmartMarketplaceAnalyticsTool"));
const EbayProductTrends = lazy(() => import("./pages/EbayProductTrends"));
const EtsyProductTrends = lazy(() => import("./pages/EtsyProductTrends"));
const WalmartMarketplaceProductTrends = lazy(() => import("./pages/WalmartMarketplaceProductTrends"));
const EtsyProductResearchTool = lazy(() => import("./pages/EtsyProductResearchTool"));
const TikTokShopProductResearchTool = lazy(() => import("./pages/TikTokShopProductResearchTool"));
const VintedProductResearchTool = lazy(() => import("./pages/VintedProductResearchTool"));
const WalmartMarketplaceProductResearchTool = lazy(() => import("./pages/WalmartMarketplaceProductResearchTool"));
const TrendingBeautyProductsUS = lazy(() => import("./pages/TrendingBeautyProductsUS"));
const TrendingElectronicProductsUS = lazy(() => import("./pages/TrendingElectronicProductsUS"));
const TrendingFashionProductsUS = lazy(() => import("./pages/TrendingFashionProductsUS"));
const TrendingHealthProductsUS = lazy(() => import("./pages/TrendingHealthProductsUS"));
const TrendingAutomobileProductsUS = lazy(() => import("./pages/TrendingAutomobileProductsUS"));
const TrendingOfficeProductsUS = lazy(() => import("./pages/TrendingOfficeProductsUS"));
const TrendingChildrenToysProductsUS = lazy(() => import("./pages/TrendingChildrenToysProductsUS"));
const TrendingFoodProductsUS = lazy(() => import("./pages/TrendingFoodProductsUS"));
const TrendingFurnitureHomeProductsUS = lazy(() => import("./pages/TrendingFurnitureHomeProductsUS"));
const TrendingEcommerceProductsUS = lazy(() => import("./pages/TrendingEcommerceProductsUS"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PriceTracking = lazy(() => import("./pages/PriceTracking"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const CompetitorAnalysis = lazy(() => import("./pages/CompetitorAnalysis"));
const CompetitorDetailPage = lazy(() => import("./pages/CompetitorDetailPage"));
const TrendDiscovery = lazy(() => import("./pages/TrendDiscovery"));
const Reports = lazy(() => import("./pages/Reports"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const Pricing = lazy(() => import("./pages/Pricing"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Helium10Alternative = lazy(() => import("./pages/Helium10Alternative"));
const JungleScoutAlternative = lazy(() => import("./pages/JungleScoutAlternative"));
const SellTheTrendAlternative = lazy(() => import("./pages/SellTheTrendAlternative"));
const PexdaAlternative = lazy(() => import("./pages/PexdaAlternative"));
const ExplodingTopicsAlternative = lazy(() => import("./pages/ExplodingTopicsAlternative"));
const AlgopixAlternative = lazy(() => import("./pages/AlgopixAlternative"));
const TrendHunterAlternative = lazy(() => import("./pages/TrendHunterAlternative"));
const EcomhuntAlternative = lazy(() => import("./pages/EcomhuntAlternative"));
const DropshipSpyAlternative = lazy(() => import("./pages/DropshipSpyAlternative"));
const GlimpseAlternative = lazy(() => import("./pages/GlimpseAlternative"));
const CompetitorPriceTrackingSoftware = lazy(() => import("./pages/CompetitorPriceTrackingSoftware"));
const AmazonProductPriceTracker = lazy(() => import("./pages/AmazonProductPriceTracker"));
const FindDistributors = lazy(() => import("./pages/FindDistributors"));
const FindSuppliers = lazy(() => import("./pages/FindSuppliers"));
const SourceMarketplace = lazy(() => import("./pages/SourceMarketplace"));
const SourceProductDetail = lazy(() => import("./pages/SourceProductDetail"));
const SourceCommunityVote = lazy(() => import("./pages/SourceCommunityVote"));
const SourceListProduct = lazy(() => import("./pages/SourceListProduct"));
const SourceProductAnalytics = lazy(() => import("./pages/SourceProductAnalytics"));
const SourceVerifyBrand = lazy(() => import("./pages/SourceVerifyBrand"));
const BuyerTrendingNow = lazy(() => import("./pages/BuyerTrendingNow"));
const BuyerShortlist = lazy(() => import("./pages/BuyerShortlist"));
const BuyerEnquiries = lazy(() => import("./pages/BuyerEnquiries"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary" /></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/price-tracking" element={<PriceTracking />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
            <Route path="/competitor-analysis/:id" element={<CompetitorDetailPage />} />
            <Route path="/trend-discovery" element={<TrendDiscovery />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<Help />} />
            <Route path="/pricing" element={<Pricing />} />
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
            <Route path="/competitor-price-tracking-software" element={<CompetitorPriceTrackingSoftware />} />
            <Route path="/amazon-product-price-tracker" element={<AmazonProductPriceTracker />} />
            <Route path="/find-distributors" element={<FindDistributors />} />
            <Route path="/find-suppliers" element={<FindSuppliers />} />
            <Route path="/source" element={<SourceMarketplace />} />
            <Route path="/source/new" element={<SourceListProduct />} />
            <Route path="/source/:slug" element={<SourceProductDetail />} />
            <Route path="/source/:slug/vote" element={<SourceCommunityVote />} />
            <Route path="/source/:slug/analytics" element={<SourceProductAnalytics />} />
            <Route path="/source/:slug/verify" element={<SourceVerifyBrand />} />
            <Route path="/trending-now" element={<BuyerTrendingNow />} />
            <Route path="/my-shortlist" element={<BuyerShortlist />} />
            <Route path="/enquiries" element={<BuyerEnquiries />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
