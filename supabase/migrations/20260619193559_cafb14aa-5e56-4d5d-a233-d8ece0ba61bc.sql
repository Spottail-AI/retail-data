DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
CREATE POLICY "Users can insert their own pending payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');