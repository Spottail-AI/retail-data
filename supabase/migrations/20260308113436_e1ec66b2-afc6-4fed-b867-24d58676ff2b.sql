
CREATE TABLE public.competitor_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID NOT NULL REFERENCES public.tracked_competitors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  analysis_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  migrated BOOLEAN NOT NULL DEFAULT false,
  last_analyzed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(competitor_id)
);

ALTER TABLE public.competitor_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own competitor analysis"
  ON public.competitor_analysis FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own competitor analysis"
  ON public.competitor_analysis FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own competitor analysis"
  ON public.competitor_analysis FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own competitor analysis"
  ON public.competitor_analysis FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
