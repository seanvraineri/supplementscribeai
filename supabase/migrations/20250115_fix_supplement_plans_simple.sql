-- Simple fix for supplement_plans RLS issues

-- Disable RLS temporarily
ALTER TABLE public.supplement_plans DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can view their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can create their own supplement plans" ON public.supplement_plans;

-- Re-enable RLS
ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;

-- Create one simple policy that allows everything for authenticated users on their own data
CREATE POLICY "supplement_plans_user_policy" ON public.supplement_plans
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); 