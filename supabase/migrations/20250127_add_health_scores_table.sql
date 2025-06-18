-- Create table for storing user health scores
CREATE TABLE IF NOT EXISTS public.user_health_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
  score_breakdown JSONB NOT NULL,
  analysis_summary TEXT,
  strengths TEXT[],
  concerns TEXT[],
  recommendations TEXT[],
  score_explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.user_health_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own health scores" ON public.user_health_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores" ON public.user_health_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_user_health_scores_user_id ON public.user_health_scores(user_id);
CREATE INDEX idx_user_health_scores_created_at ON public.user_health_scores(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_user_health_scores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_health_scores_updated_at
  BEFORE UPDATE ON public.user_health_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_user_health_scores_updated_at(); 