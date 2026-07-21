// Types for the Become a Supplier guide system.
// Add a new retailer by adding one entry to supplierGuidesUK.ts or
// supplierGuidesUS.ts — the hub and guide pages render from data.

export interface GuideFact {
  n: string; // headline number, e.g. "3,400+"
  l: string; // label, e.g. "UK stores"
}

export interface GuideRoute {
  title: string;
  body: string; // supports **bold** and [text](href)
}

export interface GuideRequirement {
  k: string;
  v: string;
}

export interface GuideStep {
  title: string;
  body: string;
  time: string; // e.g. "1–3 months"
}

export interface GuideCost {
  item: string;
  range: string; // keep currency correct: £ for UK, $ for US
}

export interface GuideTip {
  title: string;
  body: string;
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface GuideSource {
  label: string;
  href: string;
}

export interface SupplierGuide {
  slug: string;
  name: string; // display name, e.g. "Tesco"
  country: "UK" | "US";
  category: string; // e.g. "Grocery"
  cardBlurb: string; // one-liner for hub card
  topGun: boolean; // featured tier on hub
  metaTitle: string;
  metaDescription: string;
  kicker: string; // e.g. "UK · Grocery · Supplier Guide"
  h1Pre: string; // text before the italic em, e.g. "How to become a"
  h1Em: string; // italic part, e.g. "Tesco"
  h1Post: string; // after em, e.g. "supplier"
  readTime: string; // e.g. "12 min read"
  quickAnswer: string;
  facts: GuideFact[];
  intro: string;
  routesHeading: { pre: string; em: string }; // "The four routes" / "into Tesco"
  routes: GuideRoute[];
  requirements: GuideRequirement[];
  note?: string;
  steps: GuideStep[];
  costs: GuideCost[];
  costNote?: string;
  tips: GuideTip[];
  faqs: GuideFaq[];
  sources: GuideSource[];
}
