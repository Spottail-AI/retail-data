import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Sell The Trend – A Faster Way to Find Winning Products",
  metaDescription: "Looking for a Sell The Trend alternative? Discover how Spottail helps you identify product trends earlier.",
  competitorName: "Sell The Trend",
  hero: {
    headline: "The Best Sell The Trend Alternative for Serious Product Research",
    subheadline: "Spottail helps founders discover emerging opportunities with clearer signals and faster validation.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Sell The Trend focuses on dropshipping product catalogs and trend tracking. Spottail focuses on early signals and decision-ready insights.",
  comparisonTable: [
    { feature: "Product discovery", spottail: "Signal-driven", competitor: "Catalog-driven" },
    { feature: "Trend timing", spottail: "Early", competitor: "Often late" },
    { feature: "Ease of research", spottail: "Fast", competitor: "Browsing heavy" },
    { feature: "Insights clarity", spottail: "High", competitor: "Mixed" },
    { feature: "Best for", spottail: "Brand builders", competitor: "Dropshippers" },
  ],
  whyLookForAlternative: [
    "Saturated product lists",
    "Overwhelming browsing experience",
    "Limited signal transparency",
  ],
  whySpottailBetter: [
    { title: "Cleaner signals" },
    { title: "Earlier discovery" },
    { title: "Better decision clarity" },
    { title: "Faster workflows" },
  ],
  useCompetitorIf: [
    { condition: "You are browsing dropshipping products" },
    { condition: "You prefer curated product lists" },
  ],
  useSpottailIf: [
    { condition: "You want higher-quality opportunities" },
    { condition: "You care about timing and differentiation" },
  ],
  finalCta: {
    headline: "Discover smarter opportunities today.",
    buttonText: "Start Using Spottail",
  },
};

const SellTheTrendAlternative = () => <CompetitorLandingPage data={data} />;
export default SellTheTrendAlternative;
