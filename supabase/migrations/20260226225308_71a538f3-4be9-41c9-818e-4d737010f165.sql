-- Deny all client-side UPDATE operations on payments (only service role can update)
CREATE POLICY "Prevent client updates to payments"
  ON public.payments FOR UPDATE
  USING (false);