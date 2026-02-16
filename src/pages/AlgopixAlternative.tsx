import { CompetitorLandingPage, CompetitorPageData } from "@/components/CompetitorLandingPage";

const data: CompetitorPageData = {
  title: "Spottail vs Algopix – A Faster Way to Validate Product Ideas",
  metaDescription: "Looking for an Algopix alternative? Compare Spottail to see how early trend discovery improves product decisions.",
  competitorName: "Algopix",
  hero: {
    headline: "The Algopix Alternative Built for Speed",
    subheadline: "Spottail reduces the time it takes to evaluate a product opportunity.",
    cta: "Try Spottail Free",
  },
  quickSummary: "Algopix focuses on analytics across marketplaces. Spottail focuses on early discovery and faster decisions.",
  comparisonTable: [
    { feature: "Analytics depth", spottail: "Moderate", competitor: "Deep" },
    { feature: "Decision speed", spottail: "Fast", competitor: "Slower" },
    { feature: "Ease of use", spottail: "Simple", competitor: "Complex" },
    { feature: "Trend discovery", spottail: "Early", competitor: "Reactive" },
    { feature: "Best for", spottail: "Discovery", competitor: "Analytics" },
  ],
  whyLookForAlternative: [
    "Complex dashboards",
    "Slower workflows",
    "Harder interpretation",
  ],
  whySpottailBetter: [
    { title: "Simplified decision process" },
    { title: "Faster evaluation" },
    { title: "Clearer insights" },
  ],
  useCompetitorIf: [
    { condition: "You need deep analytics" },
  ],
  useSpottailIf: [
    { condition: "You want speed and clarity" },
  ],
  finalCta: {
    headline: "Make faster product decisions.",
    buttonText: "Start Using Spottail",
  },
};

const AlgopixAlternative = () => <CompetitorLandingPage data={data} />;
export default AlgopixAlternative;
