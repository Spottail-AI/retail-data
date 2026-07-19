-- CRITICAL: supplier contact details were readable by every authenticated user.
-- Anonymous users were already blocked (column grants exclude these fields), but
-- authenticated users had a column grant on contact_email / contact_whatsapp plus a
-- "view all source products USING (true)" policy — so anyone could sign up and
-- scrape every brand's contact info via the API, even though the UI hides it.
--
-- Buyers reach brands through the enquiry flow (source_enquiries), and no client
-- code reads these columns for display, so revoking read access from authenticated
-- closes the exposure with no functional change. (When a listing-edit flow is built,
-- expose the owner's own contact back via a SECURITY DEFINER RPC scoped to the owner.)
REVOKE SELECT (contact_email, contact_whatsapp) ON public.source_products FROM authenticated;

-- Payments hardening: these policies were meant for the service role (which bypasses
-- RLS anyway), but were written as permissive USING/WITH CHECK (true). Because RLS
-- permissive policies are OR'd, the sibling "Prevent client updates ... USING (false)"
-- never actually blocked anything. No client code writes to payments, so drop all
-- client-facing write policies: RLS then denies client INSERT/UPDATE by default while
-- the service role continues to work unaffected.
DROP POLICY IF EXISTS "Service role can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can update payments" ON public.payments;
DROP POLICY IF EXISTS "Prevent client updates to payments" ON public.payments;
