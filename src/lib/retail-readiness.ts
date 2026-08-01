/**
 * Retail readiness — the checklist buyers screen a product on.
 *
 * Two parts:
 *   • CORE   — items every physical product needs, whatever it is
 *   • PACKS  — items specific to the product's category
 *
 * The pack is chosen from the product's existing `category`, so a founder never
 * picks a checklist: a pet toy is never asked for allergen labelling, and a
 * chocolate bar is never asked for EN 71 toy safety testing.
 *
 * Core items are derived from columns the listing already has, so most of the
 * list fills itself in. Category items are brand-declared and live in the
 * `readiness_declarations` jsonb.
 *
 * Nothing here is verified by Spottail — the UI must say so wherever it renders.
 */

export interface ReadinessItem {
  key: string;
  label: string;
  done: boolean;
  /** true when derived from listing data rather than a brand declaration */
  derived: boolean;
}

export interface Readiness {
  items: ReadinessItem[];
  done: number;
  total: number;
  /** Human label for the pack applied, e.g. "Food & Beverage" */
  packLabel: string;
  headline: string;
}

/** Category-specific declarations, keyed to `readiness_declarations`. */
const PACKS: Record<string, { label: string; items: { key: string; label: string }[] }> = {
  "Food & Beverage": {
    label: "Food & Beverage",
    items: [
      { key: "food_safety_cert", label: "Food safety certification (BRCGS / SALSA)" },
      { key: "allergens", label: "Allergen information" },
      { key: "ingredients_nutrition", label: "Ingredient & nutritional labelling" },
      { key: "shelf_life", label: "Shelf life & storage" },
    ],
  },
  "Beauty & Skincare": {
    label: "Beauty & Skincare",
    items: [
      { key: "cpsr", label: "CPSR safety report" },
      { key: "responsible_person", label: "UK/EU Responsible Person" },
      { key: "inci", label: "INCI ingredient labelling" },
    ],
  },
  "Health & Wellness": {
    label: "Health & Wellness",
    items: [
      { key: "claims_substantiation", label: "Health claims substantiation" },
      { key: "supplement_compliance", label: "Supplement / labelling compliance" },
      { key: "shelf_life", label: "Shelf life & storage" },
    ],
  },
  "Toys & Games": {
    label: "Toys & Games",
    items: [
      { key: "toy_safety", label: "Toy safety testing (EN 71 / ASTM F963)" },
      { key: "ce_ukca", label: "CE / UKCA marking" },
      { key: "age_grading", label: "Age grading & warnings" },
    ],
  },
  "Pet Supplies": {
    label: "Pet Supplies",
    items: [
      { key: "material_safety", label: "Material safety declaration" },
      { key: "hazard_guidance", label: "Choking-hazard / size guidance" },
    ],
  },
  Electronics: {
    label: "Electronics",
    items: [
      { key: "ce_ukca", label: "CE / UKCA marking" },
      { key: "electrical_safety", label: "Electrical safety testing" },
      { key: "power_spec", label: "Plug type & voltage" },
    ],
  },
  "Home & Living": {
    label: "Home & Living",
    items: [
      { key: "fire_safety", label: "Fire safety compliance" },
      { key: "material_composition", label: "Material composition & care" },
    ],
  },
  "Fashion & Apparel": {
    label: "Fashion & Apparel",
    items: [
      { key: "fibre_composition", label: "Fibre composition labelling" },
      { key: "care_labelling", label: "Care labelling" },
    ],
  },
  "Sports & Outdoors": {
    label: "Sports & Outdoors",
    items: [
      { key: "safety_testing", label: "Safety testing for intended use" },
      { key: "material_composition", label: "Material composition & care" },
    ],
  },
  Automotive: {
    label: "Automotive",
    items: [
      { key: "fitment_spec", label: "Vehicle fitment specification" },
      { key: "safety_standards", label: "Applicable safety standards" },
    ],
  },
};

/**
 * The category-specific declarations a product needs, for rendering the edit form.
 * Returns an empty list for categories with no pack (they only need the core items).
 */
export function getCategoryPack(category?: string | null): { label: string; items: { key: string; label: string }[] } {
  const pack = (category && PACKS[category]) || null;
  return pack ?? { label: category || "General", items: [] };
}

/** Shape this needs from a source_products row. Loose on purpose. */
export interface ReadinessInput {
  category?: string | null;
  product_images?: unknown;
  wholesale_price_min?: number | null;
  wholesale_price_max?: number | null;
  moq?: number | null;
  lead_time?: string | null;
  case_size?: number | null;
  gtin?: string | null;
  has_liability_insurance?: boolean | null;
  readiness_declarations?: Record<string, unknown> | null;
  /** Pricing is served separately by the trade-terms RPC, so it can be passed in. */
  hasPricing?: boolean;
}

export function computeReadiness(p: ReadinessInput): Readiness {
  const images = Array.isArray(p.product_images) ? p.product_images : [];
  const declarations = (p.readiness_declarations || {}) as Record<string, unknown>;

  const core: ReadinessItem[] = [
    { key: "images", label: "Product images", done: images.length > 0, derived: true },
    {
      key: "pricing",
      label: "Wholesale pricing",
      done: p.hasPricing ?? !!(p.wholesale_price_min || p.wholesale_price_max),
      derived: true,
    },
    { key: "moq_lead", label: "MOQ & lead time", done: !!(p.moq && p.lead_time), derived: true },
    { key: "case_size", label: "Case configuration", done: !!p.case_size, derived: true },
    { key: "gtin", label: "Barcode / GTIN", done: !!p.gtin, derived: true },
    {
      key: "insurance",
      label: "Product liability insurance",
      done: p.has_liability_insurance === true,
      derived: true,
    },
  ];

  const pack = (p.category && PACKS[p.category]) || null;
  const packItems: ReadinessItem[] = (pack?.items || []).map((i) => ({
    key: i.key,
    label: i.label,
    done: declarations[i.key] === true,
    derived: false,
  }));

  const items = [...core, ...packItems];
  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const ratio = total === 0 ? 0 : done / total;

  return {
    items,
    done,
    total,
    packLabel: pack?.label || p.category || "General",
    headline: ratio === 1 ? "Fully retail-ready" : ratio >= 0.6 ? "Mostly retail-ready" : "Getting there",
  };
}

/**
 * Profit on return — the margin measure independent retailers actually buy on.
 * Returns null when the numbers can't produce a sensible figure, so callers can
 * show "below cost" rather than a negative percentage.
 */
export function calcPor(retailPrice: number, wholesalePrice: number): { por: number; cash: number } | null {
  if (!retailPrice || retailPrice <= 0 || !wholesalePrice || wholesalePrice <= 0) return null;
  const cash = retailPrice - wholesalePrice;
  if (cash <= 0) return null;
  return { por: (cash / retailPrice) * 100, cash };
}
