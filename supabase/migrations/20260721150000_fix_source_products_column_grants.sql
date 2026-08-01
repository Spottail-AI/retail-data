-- CRITICAL FIX: supplier contact emails were still readable by anonymous users.
--
-- Why the earlier revokes did nothing: migration 20260502235853 ran
--   GRANT SELECT ON public.source_products TO anon;
--   GRANT SELECT, INSERT, UPDATE, DELETE ON public.source_products TO authenticated;
-- which are TABLE-level privileges covering every column. In PostgreSQL a
-- column-level REVOKE cannot subtract from a table-level GRANT, so all the later
-- "REVOKE SELECT (contact_email, contact_whatsapp)" statements were silent no-ops
-- and contact_email/contact_whatsapp kept being returned to anon requests.
--
-- The fix is to drop the table-level SELECT first, then grant back an explicit
-- column list that omits the two contact fields. INSERT/UPDATE/DELETE are separate
-- privilege types and are deliberately left untouched, so owners can still create
-- and edit their own listings.
--
-- Contact details remain available server-side (service_role bypasses grants), which
-- is how the buyer enquiry flow reaches brands.

-- ── anon: public marketplace browsing, no contact fields ──
REVOKE SELECT ON public.source_products FROM anon;
GRANT SELECT (
  id, user_id, slug, product_name, tagline, description, category,
  product_images, wholesale_price_min, wholesale_price_max, currency,
  moq, available_skus, shipping_countries, lead_time, contact_preference,
  is_verified, is_featured, is_trending, launched_at, created_at, updated_at
) ON public.source_products TO anon;

-- ── authenticated: same visible columns, contact fields withheld ──
REVOKE SELECT ON public.source_products FROM authenticated;
GRANT SELECT (
  id, user_id, slug, product_name, tagline, description, category,
  product_images, wholesale_price_min, wholesale_price_max, currency,
  moq, available_skus, shipping_countries, lead_time, contact_preference,
  is_verified, is_featured, is_trending, launched_at, created_at, updated_at
) ON public.source_products TO authenticated;
