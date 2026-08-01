-- FIX: restores SELECT grants on the commercial columns added in 20260801140000.
--
-- What went wrong: 20260801130000_gate_wholesale_pricing.sql revokes SELECT on
-- source_products and grants back an *explicit column list*. That list was written
-- before 20260801140000 added brand_name, rrp, case_size, gtin,
-- has_liability_insurance and readiness_declarations — so when 130000 ran last, its
-- REVOKE removed every column grant and the re-GRANT restored only the older
-- columns. The six new ones lost their permission.
--
-- Effect: the product page selects those columns, the query failed for anon and
-- authenticated alike, and SourceProductDetail rendered its "Product not found"
-- fallback for every listing.
--
-- Column-level GRANTs are additive, so re-granting is all that's needed.
--
-- Lesson for future migrations on this table: any migration that REVOKEs SELECT and
-- re-grants a column list must enumerate *every* readable column, including ones
-- added by later-numbered migrations that may already have run. Prefer additive
-- GRANTs over revoke-and-relist wherever possible.

GRANT SELECT (
  brand_name, rrp, case_size, gtin, has_liability_insurance, readiness_declarations
) ON public.source_products TO anon;

GRANT SELECT (
  brand_name, rrp, case_size, gtin, has_liability_insurance, readiness_declarations
) ON public.source_products TO authenticated;
