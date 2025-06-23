-- Create missing user_health_domains_analysis table
CREATE TABLE IF NOT EXISTS public.user_health_domains_analysis (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_health_domains_analysis_user_id 
ON public.user_health_domains_analysis(user_id);

CREATE INDEX IF NOT EXISTS idx_user_health_domains_analysis_created_at 
ON public.user_health_domains_analysis(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.user_health_domains_analysis ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "user_health_domains_analysis_policy" ON public.user_health_domains_analysis
FOR ALL
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_health_domains_analysis TO authenticated;
