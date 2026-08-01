/**
 * Columns of source_products the client is allowed to read.
 *
 * contact_email and contact_whatsapp are deliberately excluded — SELECT on those is
 * revoked for both anon and authenticated at the database level, so a `select("*")`
 * would fail with a permission error. Brands are reached through the enquiry flow,
 * which runs server-side on the service role.
 */
export const SOURCE_PRODUCT_COLUMNS = [
  "id",
  "user_id",
  "slug",
  "product_name",
  "tagline",
  "description",
  "category",
  "product_images",
  "wholesale_price_min",
  "wholesale_price_max",
  "currency",
  "moq",
  "available_skus",
  "shipping_countries",
  "lead_time",
  "contact_preference",
  "is_verified",
  "is_featured",
  "is_trending",
  "launched_at",
  "created_at",
  "updated_at",
].join(", ");
