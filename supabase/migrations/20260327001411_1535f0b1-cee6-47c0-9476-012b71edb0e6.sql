
-- Source products table
CREATE TABLE public.source_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  slug text NOT NULL UNIQUE,
  product_name text NOT NULL,
  tagline text,
  description text,
  category text,
  product_images jsonb DEFAULT '[]'::jsonb,
  wholesale_price_min numeric,
  wholesale_price_max numeric,
  currency text DEFAULT 'USD',
  moq integer,
  available_skus integer,
  shipping_countries jsonb DEFAULT '[]'::jsonb,
  lead_time text,
  contact_preference text DEFAULT 'email',
  contact_email text,
  contact_whatsapp text,
  is_verified boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  launched_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.source_products ENABLE ROW LEVEL SECURITY;

-- Anyone can view source products (marketplace is public for logged-in users)
CREATE POLICY "Anyone can view source products" ON public.source_products
  FOR SELECT TO authenticated USING (true);

-- Suppliers can insert their own products
CREATE POLICY "Suppliers can insert own products" ON public.source_products
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Suppliers can update their own products
CREATE POLICY "Suppliers can update own products" ON public.source_products
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Suppliers can delete their own products
CREATE POLICY "Suppliers can delete own products" ON public.source_products
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Buyer votes table
CREATE TABLE public.source_buyer_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.source_products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE public.source_buyer_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view buyer votes" ON public.source_buyer_votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own votes" ON public.source_buyer_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.source_buyer_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Community votes table (public, no auth required for viewing)
CREATE TABLE public.source_community_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.source_products(id) ON DELETE CASCADE,
  email text NOT NULL,
  verified boolean DEFAULT false,
  verification_token uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(product_id, email)
);

ALTER TABLE public.source_community_votes ENABLE ROW LEVEL SECURITY;

-- Public read for vote counts
CREATE POLICY "Anyone can view community votes" ON public.source_community_votes
  FOR SELECT USING (true);

-- Public insert for community votes (no auth needed)
CREATE POLICY "Anyone can submit community votes" ON public.source_community_votes
  FOR INSERT WITH CHECK (true);

-- Update for verification
CREATE POLICY "Anyone can verify community votes" ON public.source_community_votes
  FOR UPDATE USING (true);

-- Shortlists table
CREATE TABLE public.source_shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.source_products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE public.source_shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shortlists" ON public.source_shortlists
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shortlists" ON public.source_shortlists
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shortlists" ON public.source_shortlists
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enquiries table
CREATE TABLE public.source_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.source_products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL,
  supplier_id uuid NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.source_enquiries ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own enquiries
CREATE POLICY "Buyers can view own enquiries" ON public.source_enquiries
  FOR SELECT TO authenticated USING (auth.uid() = buyer_id);

-- Suppliers can view enquiries for their products
CREATE POLICY "Suppliers can view enquiries for their products" ON public.source_enquiries
  FOR SELECT TO authenticated USING (auth.uid() = supplier_id);

-- Buyers can create enquiries
CREATE POLICY "Buyers can create enquiries" ON public.source_enquiries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- Suppliers can update enquiry status
CREATE POLICY "Suppliers can update enquiry status" ON public.source_enquiries
  FOR UPDATE TO authenticated USING (auth.uid() = supplier_id);

-- Enable realtime for votes
ALTER PUBLICATION supabase_realtime ADD TABLE public.source_buyer_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.source_community_votes;

-- Product views table for analytics
CREATE TABLE public.source_product_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.source_products(id) ON DELETE CASCADE,
  viewer_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.source_product_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views" ON public.source_product_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Product owners can view their analytics" ON public.source_product_views
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.source_products sp 
      WHERE sp.id = product_id AND sp.user_id = auth.uid()
    )
  );
