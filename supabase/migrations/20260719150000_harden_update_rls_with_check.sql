-- Security hardening: add explicit WITH CHECK to owner-scoped UPDATE policies so
-- a user cannot rewrite a row's owner column (user_id / supplier_id) and hand the
-- row to another account. Also removes an overly permissive public UPDATE policy
-- on community votes (verification is done server-side with the service role, which
-- bypasses RLS, so no client UPDATE policy is needed — anonymous voting uses INSERT,
-- which is left untouched).
--
-- Each policy is dropped and recreated with the same name, USING unchanged, plus a
-- matching WITH CHECK. Clears the 12 Detected Issues warnings without changing
-- legitimate behaviour.

-- ── user_id-scoped tables ──
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tracked products" ON public.tracked_products;
CREATE POLICY "Users can update their own tracked products" ON public.tracked_products
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own competitors" ON public.tracked_competitors;
CREATE POLICY "Users can update their own competitors" ON public.tracked_competitors
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own suppliers" ON public.suppliers;
CREATE POLICY "Users can update their own suppliers" ON public.suppliers
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tracked prices" ON public.tracked_prices;
CREATE POLICY "Users can update their own tracked prices" ON public.tracked_prices
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trend results" ON public.trend_results;
CREATE POLICY "Users can update their own trend results" ON public.trend_results
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "products_update_own" ON public.products;
CREATE POLICY "products_update_own" ON public.products
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "rows_update_own" ON public.pipeline_rows;
CREATE POLICY "rows_update_own" ON public.pipeline_rows
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Suppliers can update own products" ON public.source_products;
CREATE POLICY "Suppliers can update own products" ON public.source_products
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── supplier_id-scoped table ──
DROP POLICY IF EXISTS "Suppliers can update enquiry status" ON public.source_enquiries;
CREATE POLICY "Suppliers can update enquiry status" ON public.source_enquiries
  FOR UPDATE TO authenticated USING (auth.uid() = supplier_id) WITH CHECK (auth.uid() = supplier_id);

-- ── remove overly permissive public UPDATE on community votes ──
-- Verification runs via the verify-vote edge function using the service role
-- (bypasses RLS). Anonymous voting uses the INSERT policy, which stays in place.
DROP POLICY IF EXISTS "Anyone can verify community votes" ON public.source_community_votes;
