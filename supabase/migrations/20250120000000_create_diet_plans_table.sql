-- Create diet_plans table with identical structure to supplement_plans
-- This ensures perfect database alignment and consistency

-- Create diet_plans table
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS and create comprehensive policy (identical to supplement_plans)
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policy that works (same pattern as supplement_plans)
CREATE POLICY "diet_plans_secure_policy" ON public.diet_plans
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant proper permissions
GRANT ALL ON public.diet_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_diet_plans_user_id ON public.diet_plans(user_id); 