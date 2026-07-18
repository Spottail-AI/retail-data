-- ============================================================
-- Source growth loop: page events (ref attribution), cached
-- trend signals, weekly community-vote counts RPC.
-- ============================================================

-- 1. PAGE EVENTS --------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_page_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.source_products(id) ON DELETE CASCADE,
  event text NOT NULL CHECK (event IN ('view','share','vote_buyer','vote_community','enquiry','sample_request','cta_launch_click','badge_click')),
  ref text,
  visitor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.source_page_events ENABLE ROW LEVEL SECURITY;
-- Public pages: anyone (incl. anonymous) may record events; ref is capped by a check.
ALTER TABLE public.source_page_events ADD CONSTRAINT source_page_events_ref_len CHECK (ref IS NULL OR length(ref) <= 40);
CREATE POLICY "events_insert_public" ON public.source_page_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Owners read their own products' events; used by analytics.
CREATE POLICY "events_select_owner" ON public.source_page_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.source_products p WHERE p.id = product_id AND p.user_id = auth.uid())
  );
CREATE INDEX IF NOT EXISTS idx_source_page_events_product ON public.source_page_events(product_id, event, created_at);

-- Aggregate view counts must be publicly readable (momentum card) without
-- exposing rows: security-definer counter.
CREATE OR REPLACE FUNCTION public.get_source_weekly_views(p_product_id uuid, p_since timestamptz)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::integer FROM public.source_page_events
  WHERE product_id = p_product_id AND event = 'view' AND created_at >= p_since
$$;

-- 2. TREND SIGNALS CACHE ------------------------------------
CREATE TABLE IF NOT EXISTS public.source_trend_signals (
  product_id uuid PRIMARY KEY REFERENCES public.source_products(id) ON DELETE CASCADE,
  signals jsonb NOT NULL DEFAULT '[]'::jsonb,
  refreshed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.source_trend_signals ENABLE ROW LEVEL SECURITY;
-- Launch pages are public; cached signals are public reads. Writes: service role only.
CREATE POLICY "signals_select_public" ON public.source_trend_signals
  FOR SELECT TO anon, authenticated USING (true);

-- 3. WEEKLY COMMUNITY VOTES RPC -----------------------------
-- Community votes table holds emails (private); expose only counts.
CREATE OR REPLACE FUNCTION public.get_weekly_community_vote_counts(p_product_ids uuid[], p_since timestamptz)
RETURNS TABLE(product_id uuid, vote_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT product_id, count(*) FROM public.source_community_votes
  WHERE product_id = ANY(p_product_ids) AND verified = true AND created_at >= p_since
  GROUP BY product_id
$$;
