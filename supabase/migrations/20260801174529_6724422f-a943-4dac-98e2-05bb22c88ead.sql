-- Commercial fields for the Source product page redesign.
--
-- Adds the data behind three new sections:
--   • brand_name              — the maker behind the SKU (byline + brand card)
--   • rrp                     — recommended retail price, so the page can show a
--                               buyer their POR (profit on return) rather than a
--                               bare wholesale figure
--   • case_size               — units per case
--   • gtin                    — barcode
--   • has_liability_insurance — universal retail-readiness item
--   • readiness_declarations  — category-specific readiness items, e.g.
--                               {"food_safety_cert": true, "allergens": true}
--
-- readiness_declarations is a jsonb blob rather than columns because the required
-- items differ by category: a pet toy has no use for allergen labelling and a
-- food product has no use for EN 71 toy safety testing. See src/lib/retail-readiness.ts
-- for the core + per-category pack model that reads it.
--
-- Everything here is brand-declared, not verified by Spottail. The UI says so.

ALTER TABLE public.source_products
  ADD COLUMN IF NOT EXISTS brand_name              text,
  ADD COLUMN IF NOT EXISTS rrp                     numeric,
  ADD COLUMN IF NOT EXISTS case_size               integer,
  ADD COLUMN IF NOT EXISTS gtin                    text,
  ADD COLUMN IF NOT EXISTS has_liability_insurance boolean,
  ADD COLUMN IF NOT EXISTS readiness_declarations  jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Column-level GRANTs are additive, so this is safe to run before or after the
-- wholesale-pricing revoke in 20260801130000 — it doesn't disturb the existing
-- column grants either way.
--
-- None of these are commercially sensitive: RRP is the shelf price a shopper
-- already sees, and the rest are compliance facts a buyer needs before ordering.
GRANT SELECT (
  brand_name, rrp, case_size, gtin, has_liability_insurance, readiness_declarations
) ON public.source_products TO anon;

GRANT SELECT (
  brand_name, rrp, case_size, gtin, has_liability_insurance, readiness_declarations
) ON public.source_products TO authenticated;

COMMENT ON COLUMN public.source_products.rrp IS
  'Recommended retail price. Used to show buyers a POR calculation; the buyer can override with their own retail price.';
COMMENT ON COLUMN public.source_products.readiness_declarations IS
  'Brand-declared, category-specific retail readiness items. Not verified by Spottail.';