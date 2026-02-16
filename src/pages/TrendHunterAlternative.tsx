import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs TrendHunter – Find Trends You Can Actually Sell",
  metaDescription: "Compare Spottail and TrendHunter to see which platform is better for ecommerce product discovery.",
  competitorName: "TrendHunter",
  hero: {
    headline: "A TrendHunter Alternative Built for Ecommerce",
    subheadline: "Spottail focuses on actionable product opportunities, not just inspiration.",
    cta: "Try Spottail Free",
  },
  quickSummary: "TrendHunter is built for inspiration and trend exploration. Spottail is built for product decisions.",
  comparisonTable: [
    { feature: "Actionability", spottail: "High", competitor: "Low" },
    { feature: "Validation", spottail: "Built-in", competitor: "External" },
    { feature: "Trend relevance", spottail: "Ecommerce-focused", competitor: "Broad" },
    { feature: "Decision speed", spottail: "Fast", competitor: "Research heavy" },
    { feature: "Best for", spottail: "Founders", competitor: "Researchers" },
  ],
  whyLookForAlternative: [
    "Inspiration without validation",
    "Hard to translate trends into products",
  ],
  whySpottailBetter: [
    { title: "Actionable insights" },
    { title: "Validation-ready data" },
    { title: "Faster execution" },
  ],
  useCompetitorIf: [
    { condition: "You want creative inspiration" },
  ],
  useSpottailIf: [
    { condition: "You want product decisions" },
  ],
  finalCta: {
    headline: "Turn trends into revenue.",
    buttonText: "Start Using Spottail",
  },
};

const TrendHunterAlternative = () => <CompetitorLandingPage data={data} />;
export default TrendHunterAlternative;
