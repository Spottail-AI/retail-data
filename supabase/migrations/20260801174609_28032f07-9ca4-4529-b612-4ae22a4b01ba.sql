-- STEP 1 of 2 — additive only. Safe to apply at any time, before or after the
-- frontend deploys. Nothing is revoked here, so existing code keeps working.
--
-- Creates the function that serves wholesale pricing to entitled callers only.
-- Step 2 (20260801130000_gate_wholesale_pricing.sql) revokes direct column
-- access once the new frontend — which reads pricing through this function
-- rather than selecting the columns — is live.
--
-- Note: this checks user_roles directly rather than calling public.has_role(),
-- so it doesn't depend on that function's parameter names.

CREATE OR REPLACE FUNCTION public.get_source_trade_terms(p_slug text)
RETURNS TABLE (
  wholesale_price_min numeric,
  wholesale_price_max numeric,
  currency text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT sp.wholesale_price_min, sp.wholesale_price_max, sp.currency
  FROM public.source_products sp
  WHERE sp.slug = p_slug
    AND (
      -- verified retail buyers
      EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.role = 'buyer'::public.app_role
      )
      -- or the brand viewing its own listing
      OR sp.user_id = auth.uid()
    );
$$;

-- auth.uid() is NULL for anonymous callers, so both branches are false and no
-- row is returned. EXECUTE is withheld from anon as well, belt and braces.
REVOKE ALL ON FUNCTION public.get_source_trade_terms(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_source_trade_terms(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_source_trade_terms(text) TO authenticated;