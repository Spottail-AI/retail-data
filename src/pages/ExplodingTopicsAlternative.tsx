import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Exploding Topics – Turn Trends Into Products Faster",
  metaDescription: "See how Spottail compares to Exploding Topics for discovering product opportunities.",
  competitorName: "Exploding Topics",
  hero: {
    headline: "A Practical Alternative to Exploding Topics for Ecommerce",
    subheadline: "Spottail helps you go beyond trend awareness to real product validation.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Exploding Topics highlights rising trends broadly. Spottail focuses specifically on product opportunities and validation.",
  comparisonTable: [
    { feature: "Trend scope", spottail: "Product-focused", competitor: "Broad topics" },
    { feature: "Actionability", spottail: "High", competitor: "Moderate" },
    { feature: "Validation tools", spottail: "Built-in", competitor: "Limited" },
    { feature: "Workflow speed", spottail: "Fast", competitor: "Research heavy" },
    { feature: "Best for", spottail: "Ecommerce teams", competitor: "Researchers" },
  ],
  whyLookForAlternative: [
    "Trends are broad rather than product-specific",
    "Hard to translate trends into products",
    "Limited ecommerce workflows",
  ],
  whySpottailBetter: [
    { title: "Product-focused insights" },
    { title: "Faster validation" },
    { title: "Actionable recommendations" },
  ],
  useCompetitorIf: [
    { condition: "You research general trends" },
  ],
  useSpottailIf: [
    { condition: "You want product-ready insights" },
  ],
  finalCta: {
    headline: "Find trends you can actually sell.",
    buttonText: "Start Using Spottail",
  },
};

const ExplodingTopicsAlternative = () => <CompetitorLandingPage data={data} />;
export default ExplodingTopicsAlternative;
