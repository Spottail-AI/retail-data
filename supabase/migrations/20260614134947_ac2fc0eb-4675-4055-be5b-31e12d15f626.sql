-- Extend saved_searches with editable list title
ALTER TABLE public.saved_searches
  ADD COLUMN IF NOT EXISTS list_title text;

-- Pipeline items for each saved list
CREATE TABLE IF NOT EXISTS public.list_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id uuid NOT NULL REFERENCES public.saved_searches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  -- Identity
  name text NOT NULL,
  website text,
  channel text NOT NULL DEFAULT 'Both',           -- Physical | Online | Both
  location text,
  -- Match
  fit_score text NOT NULL DEFAULT 'Medium',       -- High | Medium | Low
  why_it_matches text,
  pitch_angle text,
  -- Details
  store_type text,
  audience_category text,
  price_tier text,
  stocks_similar text,                            -- Competitors | Complements | Neither
  decision_maker_name text,
  decision_maker_role text,
  buy_direct_or_distributor text,                 -- Direct | Distributor | Both
  -- Contact
  email text,
  phone text,
  whatsapp text,
  contact_form_url text,
  -- Pipeline
  status text NOT NULL DEFAULT 'To contact',      -- To contact | Contacted | In talks | Won | Passed
  priority text NOT NULL DEFAULT 'Medium',        -- High | Medium | Low
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS list_items_list_id_idx ON public.list_items(list_id);
CREATE INDEX IF NOT EXISTS list_items_user_id_idx ON public.list_items(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.list_items TO authenticated;
GRANT ALL ON public.list_items TO service_role;

ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own list items"
  ON public.list_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own list items"
  ON public.list_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own list items"
  ON public.list_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own list items"
  ON public.list_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_list_items_updated_at
  BEFORE UPDATE ON public.list_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();