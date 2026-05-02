GRANT SELECT ON public.source_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.source_products TO authenticated;
GRANT ALL ON public.source_products TO service_role;

GRANT SELECT ON public.source_buyer_votes TO anon;
GRANT SELECT, INSERT, DELETE ON public.source_buyer_votes TO authenticated;

GRANT INSERT ON public.source_community_votes TO anon, authenticated;

GRANT INSERT ON public.source_product_views TO anon, authenticated;
GRANT SELECT ON public.source_product_views TO authenticated;