REVOKE SELECT ON public.source_products FROM anon;
GRANT SELECT (
  id, user_id, slug, product_name, tagline, description, category,
  product_images, currency,
  moq, available_skus, shipping_countries, lead_time, contact_preference,
  is_verified, is_featured, is_trending, launched_at, created_at, updated_at
) ON public.source_products TO anon;

REVOKE SELECT ON public.source_products FROM authenticated;
GRANT SELECT (
  id, user_id, slug, product_name, tagline, description, category,
  product_images, currency,
  moq, available_skus, shipping_countries, lead_time, contact_preference,
  is_verified, is_featured, is_trending, launched_at, created_at, updated_at
) ON public.source_products TO authenticated;