-- Create table for storing user studies
CREATE TABLE IF NOT EXISTS public.user_studies (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_url text NOT NULL,
    study_title text,
    study_abstract text,
    study_authors text,
    publication_date text,
    journal_name text,
    pmid text,
    doi text,
    study_type text,
    relevance_score integer,
    personalized_summary text,
    key_findings text[],
    personalized_explanation text,
    actionable_recommendations text[],
    limitations text[],
    full_analysis jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for efficient user queries
CREATE INDEX IF NOT EXISTS idx_user_studies_user_id ON public.user_studies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_studies_created_at ON public.user_studies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_studies_relevance ON public.user_studies(relevance_score DESC);

-- Enable RLS following existing pattern
ALTER TABLE public.user_studies ENABLE ROW LEVEL SECURITY;

-- Create RLS policy following your established pattern
CREATE POLICY "Enable all for authenticated users on user_studies" 
ON user_studies FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant permissions following your pattern
GRANT ALL ON user_studies TO authenticated; 