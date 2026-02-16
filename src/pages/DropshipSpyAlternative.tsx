import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Dropship Spy – A Smarter Way to Research Products",
  metaDescription: "Compare Spottail and Dropship Spy to discover which tool helps you find better opportunities.",
  competitorName: "Dropship Spy",
  hero: {
    headline: "The Dropship Spy Alternative Built for Modern Brands",
    subheadline: "Spottail helps brands discover trends using real demand signals.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Dropship Spy focuses on competitor and product monitoring. Spottail focuses on predictive trend discovery.",
  comparisonTable: [
    { feature: "Predictive signals", spottail: "High", competitor: "Low" },
    { feature: "Research workflow", spottail: "Fast", competitor: "Manual" },
    { feature: "Trend timing", spottail: "Early", competitor: "After traction" },
    { feature: "Insights clarity", spottail: "High", competitor: "Moderate" },
    { feature: "Best for", spottail: "Brand builders", competitor: "Dropshippers" },
  ],
  whyLookForAlternative: [
    "Copycat product strategies",
    "Limited predictive insights",
  ],
  whySpottailBetter: [
    { title: "Predictive signals" },
    { title: "Cleaner research workflow" },
  ],
  useCompetitorIf: [
    { condition: "You monitor competitors" },
  ],
  useSpottailIf: [
    { condition: "You want to find trends first" },
  ],
  finalCta: {
    headline: "Research products smarter.",
    buttonText: "Start Using Spottail",
  },
};

const DropshipSpyAlternative = () => <CompetitorLandingPage data={data} />;
export default DropshipSpyAlternative;
