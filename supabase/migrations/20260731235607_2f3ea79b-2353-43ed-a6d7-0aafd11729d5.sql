-- Contact enrichment state on pipeline rows.
--
-- Previously a blank Contact cell was ambiguous: it could mean "never looked up",
-- "lookup running right now", or "looked and found nothing". That made a working
-- pipeline look identical to a broken one. These columns make the state explicit
-- so the UI can render Finding… / channel / No channel found / Find contact.
--
--   enrichment_status: null = never queued
--                      'pending'   = queued for background lookup
--                      'running'   = lookup in flight
--                      'done'      = lookup finished, a channel was found
--                      'not_found' = lookup finished, genuinely no channel
--   enriched_at:       when the last lookup completed (drives the staleness TTL)

ALTER TABLE public.pipeline_rows
  ADD COLUMN IF NOT EXISTS enrichment_status text,
  ADD COLUMN IF NOT EXISTS enriched_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pipeline_rows_enrichment_status_check'
  ) THEN
    ALTER TABLE public.pipeline_rows
      ADD CONSTRAINT pipeline_rows_enrichment_status_check
      CHECK (enrichment_status IS NULL OR enrichment_status IN ('pending','running','done','not_found'));
  END IF;
END $$;

-- Backfill: rows that already have a resolved channel/email count as done, so
-- existing pipelines don't all show as un-enriched after this ships.
UPDATE public.pipeline_rows
SET enrichment_status = 'done',
    enriched_at = COALESCE(enriched_at, created_at)
WHERE enrichment_status IS NULL
  AND (contact_channel IS NOT NULL OR email IS NOT NULL OR contact_form_url IS NOT NULL);

-- Lets the batch job find rows still needing a lookup without a full scan.
CREATE INDEX IF NOT EXISTS pipeline_rows_enrichment_status_idx
  ON public.pipeline_rows (product_id, enrichment_status);