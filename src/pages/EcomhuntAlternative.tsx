import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Ecomhunt – Discover Products Before They Saturate",
  metaDescription: "Looking for an Ecomhunt alternative? See how Spottail helps you find earlier opportunities.",
  competitorName: "Ecomhunt",
  hero: {
    headline: "A Better Alternative to Ecomhunt",
    subheadline: "Spottail helps you find opportunities before they appear in curated lists.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Ecomhunt curates products already performing. Spottail identifies products before saturation.",
  comparisonTable: [
    { feature: "Trend timing", spottail: "Early", competitor: "Late" },
    { feature: "Signal transparency", spottail: "High", competitor: "Moderate" },
    { feature: "Workflow speed", spottail: "Fast", competitor: "Browsing heavy" },
    { feature: "Insights depth", spottail: "High", competitor: "Basic" },
    { feature: "Best for", spottail: "Discovery", competitor: "Product browsing" },
  ],
  whyLookForAlternative: [
    "Many products already saturated",
    "Limited signal transparency",
  ],
  whySpottailBetter: [
    { title: "Earlier signals" },
    { title: "Higher quality insights" },
  ],
  useCompetitorIf: [
    { condition: "You browse ready-made ideas" },
  ],
  useSpottailIf: [
    { condition: "You want first-mover advantage" },
  ],
  finalCta: {
    headline: "Find your next product first.",
    buttonText: "Start Using Spottail",
  },
};

const EcomhuntAlternative = () => <CompetitorLandingPage data={data} />;
export default EcomhuntAlternative;
