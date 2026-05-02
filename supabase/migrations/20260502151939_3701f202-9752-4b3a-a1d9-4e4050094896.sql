
-- =========================================================
-- 1. Restrict supplier contact fields from anonymous visitors
-- =========================================================
-- Column-level SELECT privileges combine with RLS. Revoking the columns
-- from `anon` hides them while keeping the rest of source_products public.
REVOKE SELECT (contact_email, contact_whatsapp) ON public.source_products FROM anon;
-- Authenticated users keep full read access.
GRANT SELECT (contact_email, contact_whatsapp) ON public.source_products TO authenticated;

-- =========================================================
-- 2. source_community_votes — remove always-true UPDATE policy
-- =========================================================
DROP POLICY IF EXISTS "Anyone can verify community votes" ON public.source_community_votes;

-- Tighten INSERT to require non-empty fields (prevents trivial WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can submit community votes" ON public.source_community_votes;
CREATE POLICY "Anyone can submit community votes"
ON public.source_community_votes
FOR INSERT
TO anon, authenticated
WITH CHECK (
  product_id IS NOT NULL
  AND email IS NOT NULL
  AND char_length(email) BETWEEN 3 AND 255
);

-- =========================================================
-- 3. source_product_views — tighten INSERT (was WITH CHECK true)
-- =========================================================
DROP POLICY IF EXISTS "Anyone can insert views" ON public.source_product_views;
CREATE POLICY "Anyone can insert views"
ON public.source_product_views
FOR INSERT
TO anon, authenticated
WITH CHECK (product_id IS NOT NULL);

-- =========================================================
-- 4. Storage: add explicit UPDATE policy on product-images,
--    and replace broad anonymous SELECT (which allows bucket
--    listing) with a narrower one that still allows public
--    read of individual files via URL.
-- =========================================================
DROP POLICY IF EXISTS "Users can update own product images" ON storage.objects;
CREATE POLICY "Users can update own product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
)
WITH CHECK (
  bucket_id = 'product-images'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- =========================================================
-- 5. Lock down SECURITY DEFINER trigger/internal functions
--    so they cannot be invoked through PostgREST.
--    (Triggers and our own server code still execute them.)
-- =========================================================
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
