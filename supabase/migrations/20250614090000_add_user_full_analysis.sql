CREATE TABLE IF NOT EXISTS public.user_full_analysis (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    html text,
    plaintext text
);

-- Simple RLS: owner can read/write
ALTER TABLE public.user_full_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User owns full analysis" ON public.user_full_analysis
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id); 