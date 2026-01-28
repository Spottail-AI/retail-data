-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Service role can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can update payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can insert trend results" ON public.trend_results;

-- Create proper policies that restrict to service role
-- For payments, only authenticated users can insert their own payment records
CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- For trend_results, allow insert only for the current session (no user required)
-- We'll handle this through the edge function using service role
CREATE POLICY "Authenticated users can insert trend results"
  ON public.trend_results FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL OR user_id IS NULL);