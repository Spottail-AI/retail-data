-- STEP 2 of 2 — APPLY ONLY AFTER THE FRONTEND USING get_source_trade_terms IS LIVE.
--
-- This revokes direct read access to wholesale pricing. Any deployed client that
-- still lists wholesale_price_min / wholesale_price_max in its SELECT will start
-- getting a permission error, which would break the product page, the marketplace
-- grid and the buyer shortlist. The updated frontend no longer selects those
-- columns (see src/lib/source-product-columns.ts) and reads pricing through the
-- RPC created in step 1, so once it is deployed this is safe.
--
-- Background: the product page gated the Wholesale terms card behind
-- `isBuyer || isOwner`, but the values were still delivered to every visitor's
-- browser and readable from the network tab, or harvestable in bulk with a single
-- anon-key query. The gate was cosmetic.
--
-- Follows the same pattern as 20260721150000 for contact_email/contact_whatsapp:
-- a column-level REVOKE cannot subtract from a table-level GRANT, so the
-- table-level SELECT is dropped first and an explicit column list granted back.
--
-- Deliberately NOT locked: moq, lead_time, available_skus. Those are already
-- displayed publicly on the Source marketplace cards, so revoking them would be a
-- product change rather than a security fix.

-- ── anon: public browsing, no contact fields, no wholesale pricing ──
REVOKE SELECT ON public.source_products FROM anon;
GRANT SELECT (
  id, user_id, slug, product_name, tagline, description, category,
  product_images, currency,
  moq, available_skus, shipping_countries, lead_time, contact_preference,
  is_verified, is_featured, is_trending, launched_at, created_at, updated_at
) ON public.source_products TO anon;

-- ── authenticated: same visible columns; pricing comes from the RPC ──
REVOKE SELECT ON public.source_products FROM authenticated;
GRANT SELECT (
  id, user_id, slug, product_name, tagline, description, category,
  product_images, currency,
  moq, available_skus, shipping_countries, lead_time, contact_preference,
  is_verified, is_featured, is_trending, launched_at, created_at, updated_at
) ON public.source_products TO authenticated;
