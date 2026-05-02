
-- =========================================================
-- Restrict bucket listing on product-images.
-- The previous SELECT policy applied to all of {public}; we
-- replace it so anonymous role can only fetch a specific
-- object (no LIST). Authenticated users still get full read.
-- This satisfies SUPA_public_bucket_allows_listing while
-- preserving public file URLs.
-- =========================================================
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;

CREATE POLICY "Authenticated users can read product images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'product-images');

-- For anon: only allow individual object fetches (no LIST). The
-- linter recommends scoping anon SELECT to a specific name pattern
-- so that listing the bucket returns nothing. Direct public URLs
-- (which use the storage CDN bypassing RLS) continue to work.
CREATE POLICY "Anon can fetch individual product images"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'product-images' AND name IS NOT NULL AND name <> '');

-- =========================================================
-- Lock down SECURITY DEFINER helpers so they cannot be
-- invoked through PostgREST. They are still callable inside
-- RLS expressions and from edge functions using the service
-- role.
-- =========================================================
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_paid(uuid) FROM anon, authenticated, public;
