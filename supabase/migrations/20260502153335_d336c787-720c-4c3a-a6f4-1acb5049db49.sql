
-- 1. source_products: hide contact fields from anon
DROP POLICY IF EXISTS "Anyone can view source products" ON public.source_products;

CREATE POLICY "Authenticated users can view all source products"
ON public.source_products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anon can view source products"
ON public.source_products
FOR SELECT
TO anon
USING (true);

REVOKE SELECT ON public.source_products FROM anon;
GRANT SELECT (
  id, user_id, product_name, slug, tagline, description, category,
  product_images, currency, wholesale_price_min, wholesale_price_max,
  moq, lead_time, shipping_countries, contact_preference,
  is_verified, is_featured, is_trending, available_skus,
  launched_at, created_at, updated_at
) ON public.source_products TO anon;

-- 2. source_community_votes: remove public SELECT, expose counts via RPC
DROP POLICY IF EXISTS "Anyone can view community votes" ON public.source_community_votes;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'source_community_votes'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.source_community_votes';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_community_vote_count(p_product_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.source_community_votes
  WHERE product_id = p_product_id
    AND verified = true
$$;

REVOKE EXECUTE ON FUNCTION public.get_community_vote_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_community_vote_count(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_community_vote_counts(p_product_ids uuid[])
RETURNS TABLE(product_id uuid, vote_count integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT product_id, COUNT(*)::int AS vote_count
  FROM public.source_community_votes
  WHERE product_id = ANY(p_product_ids)
    AND verified = true
  GROUP BY product_id
$$;

REVOKE EXECUTE ON FUNCTION public.get_community_vote_counts(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_community_vote_counts(uuid[]) TO anon, authenticated;

-- 3. user_roles: prevent self-assigning admin role
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

CREATE POLICY "Users can self-assign non-admin roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role <> 'admin'::public.app_role
);
