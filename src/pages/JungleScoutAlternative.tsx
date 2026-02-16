import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Jungle Scout – Find Winning Products Before Everyone Else",
  metaDescription: "Compare Spottail and Jungle Scout to see which tool helps you discover product opportunities earlier.",
  competitorName: "Jungle Scout",
  hero: {
    headline: "A Smarter Jungle Scout Alternative for Early Trend Discovery",
    subheadline: "Spottail helps you identify product opportunities before they reach peak competition on marketplaces.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Jungle Scout is a powerful Amazon analytics tool for validating products already selling. Spottail focuses on discovering trends earlier so brands can move first.",
  comparisonTable: [
    { feature: "Trend timing", spottail: "Early signals", competitor: "Mature demand" },
    { feature: "Workflow speed", spottail: "Fast validation", competitor: "Analytical workflow" },
    { feature: "Interface complexity", spottail: "Simple", competitor: "Moderate" },
    { feature: "Best use case", spottail: "Discovery", competitor: "Marketplace analysis" },
    { feature: "Data scope", spottail: "Cross-signal trends", competitor: "Amazon data" },
  ],
  whyLookForAlternative: [
    "Trends often identified after strong competition exists",
    "Marketplace-only insights",
    "Slower workflow for rapid product testing",
  ],
  whySpottailBetter: [
    { title: "Spot trends earlier" },
    { title: "Reduce risk before investing" },
    { title: "Make faster product decisions" },
    { title: "Focus on high-potential opportunities sooner" },
  ],
  useCompetitorIf: [
    { condition: "You optimize existing Amazon products" },
    { condition: "You rely heavily on Amazon sales data" },
  ],
  useSpottailIf: [
    { condition: "You are exploring new product ideas" },
    { condition: "You want early trend visibility" },
  ],
  finalCta: {
    headline: "Find products before they peak.",
    buttonText: "Start Using Spottail",
  },
};

const JungleScoutAlternative = () => <CompetitorLandingPage data={data} />;
export default JungleScoutAlternative;
