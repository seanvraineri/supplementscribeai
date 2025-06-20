-- FINAL DEFINITIVE FIX for supplement_plans RLS issues
-- This will resolve the 406 errors once and for all

-- Step 1: Completely disable RLS temporarily
ALTER TABLE public.supplement_plans DISABLE ROW LEVEL SECURITY;

-- Step 2: Remove ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can view their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can create their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can insert their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can update their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "Users can delete their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "supplement_plans_user_policy" ON public.supplement_plans;
DROP POLICY IF EXISTS "supplement_plans_all_operations" ON public.supplement_plans;
DROP POLICY IF EXISTS "Enable all for authenticated users on supplement_plans" ON public.supplement_plans;

-- Step 3: Ensure user_id column is properly configured
ALTER TABLE public.supplement_plans ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Re-enable RLS with a simple, working policy
ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;

-- Step 5: Create ONE comprehensive policy that works
CREATE POLICY "supplement_plans_secure_policy" ON public.supplement_plans
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 6: Grant proper permissions
GRANT ALL ON public.supplement_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 