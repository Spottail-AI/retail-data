-- Lock down the enriched contact directory.
--
-- retailers is globally readable by any signed-in user (retailers_select_authed),
-- which is fine for display fields (name/domain/segment/location) but NOT for the
-- enrichment JSON: that holds vendor contact emails, phones and submission routes
-- for every retailer we've ever enriched. With open signup, anyone could create an
-- account and scrape the entire directory.
--
-- NOTE: the table-level SELECT grant must be dropped BEFORE granting a column list.
-- A column-level REVOKE cannot subtract from a table-level GRANT in PostgreSQL —
-- that mistake is exactly why the source_products contact revokes were silent no-ops.
--
-- The client never selects enrichment (it reads name/domain/website/segment/location,
-- and per-row contact details come from the owner-scoped pipeline_rows copy).
-- Edge functions use the service role, which bypasses grants entirely — so this
-- closes the exposure with no functional change.

REVOKE SELECT ON public.retailers FROM authenticated;
GRANT SELECT (
  id, domain, name, website, segment, channel, location, verified, created_at, updated_at
) ON public.retailers TO authenticated;

REVOKE SELECT ON public.retailers FROM anon;
