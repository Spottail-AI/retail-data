-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view trend results by session" ON public.trend_results;

-- Create owner-scoped SELECT policy
-- Allow users to view their own trend results, plus allow session-based access for results with matching session_id
CREATE POLICY "Users can view their own trend results"
  ON public.trend_results FOR SELECT
  USING (auth.uid() = user_id);

-- Also update INSERT policy to require authenticated user_id
DROP POLICY IF EXISTS "Authenticated users can insert trend results" ON public.trend_results;

CREATE POLICY "Authenticated users can insert their own trend results"
  ON public.trend_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update the UPDATE policy to be stricter
DROP POLICY IF EXISTS "Users can update their own results" ON public.trend_results;

CREATE POLICY "Users can update their own trend results"
  ON public.trend_results FOR UPDATE
  USING (auth.uid() = user_id);