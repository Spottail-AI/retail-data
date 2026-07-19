DROP POLICY IF EXISTS "products_update_own" ON public.products;
CREATE POLICY "products_update_own" ON public.products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "rows_update_own" ON public.pipeline_rows;
CREATE POLICY "rows_update_own" ON public.pipeline_rows FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Suppliers can update enquiry status" ON public.source_enquiries;
CREATE POLICY "Suppliers can update enquiry status" ON public.source_enquiries FOR UPDATE TO authenticated USING (auth.uid() = supplier_id) WITH CHECK (auth.uid() = supplier_id);

DROP POLICY IF EXISTS "Suppliers can update own products" ON public.source_products;
CREATE POLICY "Suppliers can update own products" ON public.source_products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own suppliers" ON public.suppliers;
CREATE POLICY "Users can update their own suppliers" ON public.suppliers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own competitors" ON public.tracked_competitors;
CREATE POLICY "Users can update their own competitors" ON public.tracked_competitors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tracked prices" ON public.tracked_prices;
CREATE POLICY "Users can update their own tracked prices" ON public.tracked_prices FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tracked products" ON public.tracked_products;
CREATE POLICY "Users can update their own tracked products" ON public.tracked_products FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trend results" ON public.trend_results;
CREATE POLICY "Users can update their own trend results" ON public.trend_results FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);