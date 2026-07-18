-- ============================================================
-- Pipeline upgrade: product pipelines + canonical retailers
-- Replaces the list-centric model (saved_searches/list_items)
-- with accumulating product pipelines. Legacy tables are kept
-- (read-only path) and fully backfilled into the new model.
-- ============================================================

-- 1. PRODUCTS ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  url text,
  profile jsonb,                -- Stage A cache: vertical, category, price_point, attributes, comparable_brands, ...
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select_own" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "products_insert_own" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "products_update_own" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "products_delete_own" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- 2. RETAILERS (canonical, global, cache grows with usage) ---
CREATE TABLE IF NOT EXISTS public.retailers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text UNIQUE NOT NULL,  -- normalized: lowercase, no protocol/www/path
  name text NOT NULL,
  website text,
  segment text,                 -- national_distributor | regional_distributor | retail_chain | independent_marketplace
  channel text,                 -- Physical | Online | Both
  location text,
  enrichment jsonb NOT NULL DEFAULT '{}'::jsonb, -- how_to_get_in{steps[],requirements[],submission_url}, contact_channel, email, phone, contact_form_url
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
-- Globally readable by signed-in users; writes only via edge functions (service role).
CREATE POLICY "retailers_select_authed" ON public.retailers FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE TRIGGER retailers_updated_at BEFORE UPDATE ON public.retailers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. PIPELINE ROWS ------------------------------------------
CREATE TABLE IF NOT EXISTS public.pipeline_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  retailer_id uuid NOT NULL REFERENCES public.retailers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  stage text NOT NULL DEFAULT 'to_contact'
    CHECK (stage IN ('to_contact','contacted','in_conversation','sampling','stocked','passed')),
  fit integer,                  -- 0-100 rubric score
  why text,
  pitch_angle text,
  how_to_get_in jsonb,          -- row-level copy (may be refined per product)
  contact_channel text,         -- e.g. "via RangeMe", "Supplier portal", "Marketplace", "Email"
  email text,
  phone text,
  contact_form_url text,
  location text,
  next_action text,
  next_due date,
  notes text,
  last_touch date,
  sources text[] NOT NULL DEFAULT '{}',  -- "search:<id>" | "manual" | "legacy:<list_id>"
  is_new boolean NOT NULL DEFAULT true,
  user_edited boolean NOT NULL DEFAULT false, -- guards against overwrites on re-search
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, retailer_id)
);
ALTER TABLE public.pipeline_rows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rows_select_own" ON public.pipeline_rows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rows_insert_own" ON public.pipeline_rows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rows_update_own" ON public.pipeline_rows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "rows_delete_own" ON public.pipeline_rows FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_rows_product ON public.pipeline_rows(product_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_rows_user_retailer ON public.pipeline_rows(user_id, retailer_id);

-- 4. PIPELINE EVENTS (activity log) -------------------------
CREATE TABLE IF NOT EXISTS public.pipeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  row_id uuid NOT NULL REFERENCES public.pipeline_rows(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  label text NOT NULL,
  at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pipeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select_own" ON public.pipeline_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "events_insert_own" ON public.pipeline_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_events_row ON public.pipeline_events(row_id);

-- 5. PIPELINE SEARCHES (feeds) ------------------------------
CREATE TABLE IF NOT EXISTS public.pipeline_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  params jsonb NOT NULL DEFAULT '{}'::jsonb, -- country/region, brand_stage, mode(normal|deep)
  new_count integer NOT NULL DEFAULT 0,
  existing_count integer NOT NULL DEFAULT 0,
  legacy_list_id uuid,          -- backfill provenance + legacy route redirects
  ran_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pipeline_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "searches_select_own" ON public.pipeline_searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "searches_insert_own" ON public.pipeline_searches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_searches_product ON public.pipeline_searches(product_id);

-- 6. BACKFILL from saved_searches / list_items ---------------
-- Helper: normalize a website into a domain key.
CREATE OR REPLACE FUNCTION public._normalize_domain(website text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT NULLIF(
    regexp_replace(
      regexp_replace(lower(coalesce(website,'')), '^https?://', ''),
      '^www\.|/.*$', '', 'g'
    ), ''
  )
$$;

DO $$
DECLARE
  s RECORD;
  li RECORD;
  v_product_id uuid;
  v_retailer_id uuid;
  v_domain text;
  v_stage text;
BEGIN
  FOR s IN SELECT * FROM public.saved_searches ORDER BY created_at LOOP
    -- one product per (user, product_name)
    INSERT INTO public.products (user_id, name, url)
    VALUES (
      s.user_id,
      s.product_name,
      CASE WHEN s.product_name ~* '^https?://|^[\w-]+(\.[\w-]+)+/' THEN s.product_name ELSE NULL END
    )
    ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_product_id;

    INSERT INTO public.pipeline_searches (product_id, user_id, params, new_count, legacy_list_id, ran_at)
    VALUES (v_product_id, s.user_id,
            jsonb_build_object('country', s.country, 'legacy', true),
            coalesce(s.results_found, 0), s.id, s.created_at);

    FOR li IN SELECT * FROM public.list_items WHERE list_id = s.id LOOP
      v_domain := public._normalize_domain(li.website);
      IF v_domain IS NULL THEN
        v_domain := 'unknown-' || regexp_replace(lower(li.name), '[^a-z0-9]+', '-', 'g');
      END IF;

      INSERT INTO public.retailers (domain, name, website, channel, location)
      VALUES (v_domain, li.name, li.website, li.channel, li.location)
      ON CONFLICT (domain) DO UPDATE SET updated_at = now()
      RETURNING id INTO v_retailer_id;

      v_stage := CASE li.status
        WHEN 'To contact' THEN 'to_contact'
        WHEN 'Contacted'  THEN 'contacted'
        WHEN 'In talks'   THEN 'in_conversation'
        WHEN 'Won'        THEN 'stocked'
        WHEN 'Passed'     THEN 'passed'
        ELSE 'to_contact' END;

      INSERT INTO public.pipeline_rows (
        product_id, retailer_id, user_id, stage,
        fit, why, pitch_angle, contact_channel, email, phone, contact_form_url,
        location, notes, sources, is_new, sort_order, created_at
      ) VALUES (
        v_product_id, v_retailer_id, li.user_id, v_stage,
        CASE li.fit_score WHEN 'High' THEN 85 WHEN 'Medium' THEN 70 ELSE 55 END,
        li.why_it_matches, li.pitch_angle,
        CASE WHEN li.contact_form_url IS NOT NULL THEN 'Contact form'
             WHEN li.email IS NOT NULL THEN 'Email' ELSE NULL END,
        li.email, li.phone, li.contact_form_url,
        li.location, li.notes,
        ARRAY['legacy:' || s.id::text],
        false, coalesce(li.sort_order, 0), s.created_at
      )
      ON CONFLICT (product_id, retailer_id) DO UPDATE
        SET sources = array_append(public.pipeline_rows.sources, 'legacy:' || s.id::text);
    END LOOP;
  END LOOP;
END $$;
