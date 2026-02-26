
-- User preferences table (country, onboarding status)
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  country TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Tracked products table
CREATE TABLE public.tracked_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  current_price NUMERIC,
  previous_price NUMERIC,
  price_change_pct NUMERIC,
  region TEXT,
  currency TEXT DEFAULT 'USD',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tracked_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tracked products" ON public.tracked_products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tracked products" ON public.tracked_products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tracked products" ON public.tracked_products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tracked products" ON public.tracked_products FOR DELETE USING (auth.uid() = user_id);

-- Tracked competitors table
CREATE TABLE public.tracked_competitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  competitor_name TEXT NOT NULL,
  website_url TEXT,
  category TEXT,
  pricing_position TEXT,
  last_price_change NUMERIC,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tracked_competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own competitors" ON public.tracked_competitors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own competitors" ON public.tracked_competitors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own competitors" ON public.tracked_competitors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own competitors" ON public.tracked_competitors FOR DELETE USING (auth.uid() = user_id);

-- Suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  supplier_name TEXT NOT NULL,
  location TEXT,
  average_price NUMERIC,
  reliability_score NUMERIC,
  moq INTEGER,
  product_category TEXT,
  region TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own suppliers" ON public.suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own suppliers" ON public.suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own suppliers" ON public.suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own suppliers" ON public.suppliers FOR DELETE USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
