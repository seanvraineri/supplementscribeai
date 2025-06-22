-- CRITICAL FIX: Resolve 406 errors by fixing foreign key conflicts and RLS policies
-- This addresses the core issue causing 406 errors on supplement_plans and diet_plans

-- =============================================================================
-- 1. FIX FOREIGN KEY CONFLICTS
-- =============================================================================

-- Drop existing foreign key constraints that might be conflicting
ALTER TABLE public.supplement_plans DROP CONSTRAINT IF EXISTS supplement_plans_user_id_fkey;
ALTER TABLE public.diet_plans DROP CONSTRAINT IF EXISTS diet_plans_user_id_fkey;

-- Recreate with consistent auth.users(id) references
ALTER TABLE public.supplement_plans 
ADD CONSTRAINT supplement_plans_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.diet_plans 
ADD CONSTRAINT diet_plans_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =============================================================================
-- 2. CLEAN UP ALL EXISTING RLS POLICIES
-- =============================================================================

-- Supplement plans: Remove ALL existing policies
ALTER TABLE public.supplement_plans DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON public.supplement_plans;
DROP POLICY IF EXISTS "supplement_plans_user_policy" ON public.supplement_plans;
DROP POLICY IF EXISTS "supplement_plans_all_operations" ON public.supplement_plans;
DROP POLICY IF EXISTS "supplement_plans_secure_policy" ON public.supplement_plans;
DROP POLICY IF EXISTS "Enable all for authenticated users on supplement_plans" ON public.supplement_plans;

-- Diet plans: Remove ALL existing policies
ALTER TABLE public.diet_plans DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own diet plans" ON public.diet_plans;
DROP POLICY IF EXISTS "diet_plans_user_policy" ON public.diet_plans;
DROP POLICY IF EXISTS "diet_plans_all_operations" ON public.diet_plans;
DROP POLICY IF EXISTS "diet_plans_secure_policy" ON public.diet_plans;
DROP POLICY IF EXISTS "Enable all for authenticated users on diet_plans" ON public.diet_plans;

-- =============================================================================
-- 3. CREATE SIMPLE, WORKING RLS POLICIES
-- =============================================================================

-- Re-enable RLS with clean, simple policies
ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "supplement_plans_policy" ON public.supplement_plans
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diet_plans_policy" ON public.diet_plans
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 4. ENSURE PROPER PERMISSIONS
-- =============================================================================

-- Grant necessary permissions
GRANT ALL ON public.supplement_plans TO authenticated;
GRANT ALL ON public.diet_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =============================================================================
-- 5. VERIFY TABLE STRUCTURE
-- =============================================================================

-- Ensure user_id columns are properly configured
ALTER TABLE public.supplement_plans ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.diet_plans ALTER COLUMN user_id SET NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_supplement_plans_user_id ON public.supplement_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_user_id ON public.diet_plans(user_id); 