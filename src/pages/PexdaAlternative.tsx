import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Pexda – Discover Trends Before They Go Viral",
  metaDescription: "Compare Spottail and Pexda to find the best tool for spotting winning ecommerce products early.",
  competitorName: "Pexda",
  hero: {
    headline: "A Modern Alternative to Pexda",
    subheadline: "Spottail helps you identify real demand signals instead of relying on curated lists.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Pexda provides curated product suggestions. Spottail identifies trends through real demand signals and early indicators.",
  comparisonTable: [
    { feature: "Trend timing", spottail: "Early", competitor: "Often late" },
    { feature: "Signal quality", spottail: "Data-driven", competitor: "Curated" },
    { feature: "Validation workflow", spottail: "Fast", competitor: "Manual" },
    { feature: "Insights depth", spottail: "High", competitor: "Moderate" },
    { feature: "Best for", spottail: "Discovery", competitor: "Product browsing" },
  ],
  whyLookForAlternative: [
    "Products often already saturated",
    "Limited insight depth",
    "Hard to validate demand",
  ],
  whySpottailBetter: [
    { title: "Real signals, not lists" },
    { title: "Faster research workflow" },
    { title: "Better decision confidence" },
  ],
  useCompetitorIf: [
    { condition: "You prefer browsing curated products" },
  ],
  useSpottailIf: [
    { condition: "You want earlier opportunities" },
    { condition: "You want clearer validation" },
  ],
  finalCta: {
    headline: "Start spotting trends earlier.",
    buttonText: "Start Using Spottail",
  },
};

const PexdaAlternative = () => <CompetitorLandingPage data={data} />;
export default PexdaAlternative;
