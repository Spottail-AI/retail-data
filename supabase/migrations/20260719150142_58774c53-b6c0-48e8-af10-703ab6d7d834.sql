REVOKE SELECT (contact_email, contact_whatsapp) ON public.source_products FROM authenticated;

DROP POLICY IF EXISTS "Service role can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can update payments" ON public.payments;
DROP POLICY IF EXISTS "Prevent client updates to payments" ON public.payments;