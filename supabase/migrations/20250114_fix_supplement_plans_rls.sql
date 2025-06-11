-- Fix supplement_plans RLS policy to prevent 406 errors

-- Drop and recreate the RLS policy for supplement_plans
DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON public.supplement_plans;

-- Ensure RLS is enabled
ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;

-- Create a comprehensive policy that allows all operations for authenticated users on their own data
CREATE POLICY "Users can manage their own supplement plans" ON public.supplement_plans 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Additional policy for SELECT to ensure reads work
CREATE POLICY "Users can view their own supplement plans" ON public.supplement_plans 
FOR SELECT 
USING (auth.uid() = user_id);

-- Additional policy for INSERT to ensure inserts work
CREATE POLICY "Users can create their own supplement plans" ON public.supplement_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id); 