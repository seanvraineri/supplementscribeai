-- Final comprehensive fix for supplement_plans RLS issues

-- Temporarily disable RLS to clear all policies
ALTER TABLE public.supplement_plans DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies completely
DROP POLICY IF EXISTS "supplement_plans_user_policy" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can view their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can create their own supplement plans" ON public.supplement_plans;

-- Ensure the table structure is correct
ALTER TABLE public.supplement_plans ALTER COLUMN user_id SET NOT NULL;

-- Re-enable RLS
ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;

-- Create ONE simple policy for all operations
CREATE POLICY "supplement_plans_all_operations" ON public.supplement_plans 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.supplement_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 