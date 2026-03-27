-- Drop the existing authenticated-only SELECT policy
DROP POLICY "Anyone can view source products" ON public.source_products;

-- Recreate as truly public (anon + authenticated)
CREATE POLICY "Anyone can view source products"
  ON public.source_products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Also fix buyer votes SELECT to include anon
DROP POLICY "Anyone can view buyer votes" ON public.source_buyer_votes;

CREATE POLICY "Anyone can view buyer votes"
  ON public.source_buyer_votes
  FOR SELECT
  TO anon, authenticated
  USING (true);