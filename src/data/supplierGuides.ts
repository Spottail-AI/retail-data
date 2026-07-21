import { SupplierGuide } from "./supplierGuideTypes";
import { supplierGuidesUK } from "./supplierGuidesUK";
import { supplierGuidesUS } from "./supplierGuidesUS";

// All supplier guides. The hub and guide pages render from this array —
// adding a retailer to a country file makes it appear everywhere automatically.
export const supplierGuides: SupplierGuide[] = [...supplierGuidesUK, ...supplierGuidesUS];

export const guideBySlug = (slug: string): SupplierGuide | undefined =>
  supplierGuides.find((g) => g.slug === slug);

export type { SupplierGuide } from "./supplierGuideTypes";
