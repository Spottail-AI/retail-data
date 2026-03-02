
-- Table for tracked price items
CREATE TABLE public.tracked_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  url TEXT,
  product_name TEXT,
  product_label TEXT NOT NULL,
  tracking_type TEXT NOT NULL DEFAULT 'competitor' CHECK (tracking_type IN ('competitor', 'supplier')),
  update_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (update_frequency IN ('daily', '3days', 'weekly', 'manual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  currency TEXT DEFAULT 'USD',
  last_checked TIMESTAMPTZ,
  last_error TEXT,
  error_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tracked_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tracked prices"
  ON public.tracked_prices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracked prices"
  ON public.tracked_prices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracked prices"
  ON public.tracked_prices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracked prices"
  ON public.tracked_prices FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_tracked_prices_updated_at
  BEFORE UPDATE ON public.tracked_prices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Table for price history data points
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracked_price_id UUID NOT NULL REFERENCES public.tracked_prices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'limited', 'out_of_stock', 'unknown')),
  is_on_sale BOOLEAN DEFAULT false,
  discount_percent NUMERIC(5, 2),
  notes TEXT,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own price history"
  ON public.price_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own price history"
  ON public.price_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price history"
  ON public.price_history FOR DELETE
  USING (auth.uid() = user_id);
