-- Allow users to delete their own trend search history.
-- Previously trend_results had SELECT/INSERT/UPDATE owner-scoped policies but no
-- DELETE policy, so deletes from the UI never persisted (rows returned on reload).
DROP POLICY IF EXISTS "Users can delete their own trend results" ON public.trend_results;

CREATE POLICY "Users can delete their own trend results"
  ON public.trend_results FOR DELETE
  USING (auth.uid() = user_id);
