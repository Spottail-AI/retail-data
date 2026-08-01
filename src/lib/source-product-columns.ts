/**
 * Columns of source_products the client is allowed to read.
 *
 * contact_email and contact_whatsapp are deliberately excluded — SELECT on those is
 * revoked for both anon and authenticated at the database level, so a `select("*")`
 * would fail with a permission error. Brands are reached through the enquiry flow,
 * which runs server-side on the service role.
 *
 * wholesale_price_min and wholesale_price_max are excluded for the same reason
 * (migration 20260801130000). Gating them in the UI alone was cosmetic — the values
 * still reached every visitor's browser. They are now served by the
 * `get_source_trade_terms` RPC, which checks the caller is a retail buyer or the
 * listing's owner. Use `useSourceTradeTerms(slug)` rather than selecting them here.
 */
// Kept as a single string literal (not an array .join) so supabase-js can infer
// the row type from it — a runtime-built `string` degrades to GenericStringError.
export const SOURCE_PRODUCT_COLUMNS =
  "id, user_id, slug, product_name, tagline, description, category, product_images, currency, moq, available_skus, shipping_countries, lead_time, contact_preference, is_verified, is_featured, is_trending, launched_at, created_at, updated_at, brand_name, rrp, case_size, gtin, has_liability_insurance, readiness_declarations" as const;
