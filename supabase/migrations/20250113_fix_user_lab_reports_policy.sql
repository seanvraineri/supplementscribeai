-- Fix user_lab_reports table structure and RLS policies
-- This migration properly handles the policy dependency issue

-- =============================================================================
-- 1. TEMPORARILY DROP RLS POLICIES THAT DEPEND ON user_id
-- =============================================================================

-- Drop the policy that's preventing us from altering the user_id column
DROP POLICY IF EXISTS "Users can manage their own lab reports" ON public.user_lab_reports;

-- =============================================================================
-- 2. FIX USER_LAB_REPORTS TABLE STRUCTURE
-- =============================================================================

-- Add missing columns if they don't exist
ALTER TABLE public.user_lab_reports 
ADD COLUMN IF NOT EXISTS file_name text,
ADD COLUMN IF NOT EXISTS report_type text,
ADD COLUMN IF NOT EXISTS mimetype text;

-- Fix the foreign key constraint to reference auth.users directly
ALTER TABLE public.user_lab_reports DROP CONSTRAINT IF EXISTS user_lab_reports_user_id_fkey;

-- Ensure user_id is UUID type (only if it's not already)
DO $$
BEGIN
  -- Check if user_id is already UUID type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_lab_reports' 
    AND column_name = 'user_id' 
    AND data_type = 'uuid'
    AND table_schema = 'public'
  ) THEN
    -- Only alter if it's not already UUID
    ALTER TABLE public.user_lab_reports ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
  END IF;
END $$;

-- Add the proper foreign key constraint
ALTER TABLE public.user_lab_reports ADD CONSTRAINT user_lab_reports_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =============================================================================
-- 3. RECREATE RLS POLICIES WITH PROPER auth.uid() USAGE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.user_lab_reports ENABLE ROW LEVEL SECURITY;

-- Recreate the policy with proper auth.uid() usage
CREATE POLICY "Users can manage their own lab reports" ON public.user_lab_reports 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 4. FIX OTHER CRITICAL TABLES' RLS POLICIES
-- =============================================================================

-- Fix supplement_plans table
ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON public.supplement_plans;
CREATE POLICY "Users can manage their own supplement plans" ON public.supplement_plans 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Fix user_biomarkers table
ALTER TABLE public.user_biomarkers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own biomarkers" ON public.user_biomarkers;
CREATE POLICY "Users can manage their own biomarkers" ON public.user_biomarkers 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Fix user_snps table
ALTER TABLE public.user_snps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own SNPs" ON public.user_snps;
CREATE POLICY "Users can manage their own SNPs" ON public.user_snps 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 5. ENSURE PRODUCTS TABLE IS READABLE
-- =============================================================================

-- Allow public read access to products for the AI recommendations
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
CREATE POLICY "Allow public read access to products" ON public.products 
FOR SELECT USING (true);

-- =============================================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_lab_reports_user_id ON public.user_lab_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_plans_user_id ON public.supplement_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_products_supplement_name ON public.products(supplement_name); 