import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Glimpse – Discover Trends Earlier and Act Faster",
  metaDescription: "Looking for a Glimpse alternative? See how Spottail helps ecommerce teams move from trend discovery to product validation faster.",
  competitorName: "Glimpse",
  hero: {
    headline: "A Faster Alternative to Glimpse",
    subheadline: "Spottail turns trend signals into actionable product opportunities quickly.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Glimpse surfaces trend data from search signals. Spottail focuses on turning trends into product decisions quickly.",
  comparisonTable: [
    { feature: "Product focus", spottail: "High", competitor: "Moderate" },
    { feature: "Decision speed", spottail: "Fast", competitor: "Moderate" },
    { feature: "Validation workflow", spottail: "Built-in", competitor: "Limited" },
    { feature: "Trend relevance", spottail: "Ecommerce-focused", competitor: "Broad" },
    { feature: "Best for", spottail: "Operators", competitor: "Analysts" },
  ],
  whyLookForAlternative: [
    "Trends not always product-focused",
    "Limited validation workflows",
  ],
  whySpottailBetter: [
    { title: "Product-ready insights" },
    { title: "Faster decision cycles" },
  ],
  useCompetitorIf: [
    { condition: "You research search trends" },
  ],
  useSpottailIf: [
    { condition: "You want product opportunities" },
  ],
  finalCta: {
    headline: "Spot the next winning product today.",
    buttonText: "Start Using Spottail",
  },
};

const GlimpseAlternative = () => <CompetitorLandingPage data={data} />;
export default GlimpseAlternative;
