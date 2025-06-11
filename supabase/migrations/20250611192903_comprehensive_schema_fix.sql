-- Comprehensive Schema Fix for SupplementScribe
-- This migration ensures all tables, foreign keys, and RLS policies are consistent

-- =============================================================================
-- 1. ENSURE CONSISTENT FOREIGN KEY REFERENCES
-- =============================================================================

-- All user-related tables should reference auth.users(id) directly for consistency
-- This avoids dependency issues where user_profiles might not exist yet

-- Drop existing foreign key constraints
ALTER TABLE public.user_allergies DROP CONSTRAINT IF EXISTS user_allergies_user_id_fkey;
ALTER TABLE public.user_conditions DROP CONSTRAINT IF EXISTS user_conditions_user_id_fkey;
ALTER TABLE public.user_medications DROP CONSTRAINT IF EXISTS user_medications_user_id_fkey;
ALTER TABLE public.supplement_plans DROP CONSTRAINT IF EXISTS supplement_plans_user_id_fkey;

-- Recreate with auth.users(id) references
ALTER TABLE public.user_allergies ADD CONSTRAINT user_allergies_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_conditions ADD CONSTRAINT user_conditions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_medications ADD CONSTRAINT user_medications_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.supplement_plans ADD CONSTRAINT supplement_plans_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =============================================================================
-- 2. ADD MISSING FIELDS TO USER_LAB_REPORTS
-- =============================================================================

-- Add fields that the frontend/dashboard actions expect
ALTER TABLE public.user_lab_reports 
ADD COLUMN IF NOT EXISTS file_name text,
ADD COLUMN IF NOT EXISTS report_type text;

-- =============================================================================
-- 3. FIX USER_SNPS TABLE STRUCTURE
-- =============================================================================

-- The edge functions expect different field names, let's add them
ALTER TABLE public.user_snps 
ADD COLUMN IF NOT EXISTS snp_id text,
ADD COLUMN IF NOT EXISTS gene_name text,
ADD COLUMN IF NOT EXISTS allele text;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_snps_snp_id ON public.user_snps(snp_id);

-- =============================================================================
-- 4. ADD MISSING ALCOHOL_INTAKE FIELD TO USER_PROFILES
-- =============================================================================

-- The onboarding schema expects this field
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS alcohol_intake text;

-- =============================================================================
-- 5. ENSURE ALL RLS POLICIES ARE CONSISTENT
-- =============================================================================

-- Update all RLS policies to use auth.uid() consistently
DROP POLICY IF EXISTS "Users can manage their own allergies" ON public.user_allergies;
CREATE POLICY "Users can manage their own allergies" ON public.user_allergies 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own conditions" ON public.user_conditions;
CREATE POLICY "Users can manage their own conditions" ON public.user_conditions 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own medications" ON public.user_medications;
CREATE POLICY "Users can manage their own medications" ON public.user_medications 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON public.supplement_plans;
CREATE POLICY "Users can manage their own supplement plans" ON public.supplement_plans 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 6. ADD TRIGGER TO AUTO-POPULATE SNP FIELDS
-- =============================================================================

-- Create function to automatically populate snp_id and gene_name from supported_snps
CREATE OR REPLACE FUNCTION populate_snp_details()
RETURNS TRIGGER AS $$
BEGIN
  -- If supported_snp_id is provided, auto-populate snp_id and gene_name
  IF NEW.supported_snp_id IS NOT NULL THEN
    SELECT rsid, gene INTO NEW.snp_id, NEW.gene_name
    FROM public.supported_snps 
    WHERE id = NEW.supported_snp_id;
  END IF;
  
  -- Map genotype to allele for consistency
  IF NEW.genotype IS NOT NULL AND NEW.allele IS NULL THEN
    NEW.allele = NEW.genotype;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS auto_populate_snp_details ON public.user_snps;
CREATE TRIGGER auto_populate_snp_details
  BEFORE INSERT OR UPDATE ON public.user_snps
  FOR EACH ROW EXECUTE FUNCTION populate_snp_details();

-- =============================================================================
-- 7. ADD ADDITIONAL INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_allergies_user_id ON public.user_allergies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_conditions_user_id ON public.user_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_medications_user_id ON public.user_medications(user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_plans_user_id ON public.supplement_plans(user_id);

-- =============================================================================
-- 8. INSERT SOME SUPPORTED SNPS FOR TESTING
-- =============================================================================

INSERT INTO public.supported_snps (rsid, gene) VALUES 
('rs1801133', 'MTHFR'),
('rs1801131', 'MTHFR'),
('rs4680', 'COMT'),
('rs429358', 'APOE'),
('rs7412', 'APOE')
ON CONFLICT (rsid) DO NOTHING;

-- =============================================================================
-- 9. ADD SAMPLE PRODUCTS FOR TESTING
-- =============================================================================

INSERT INTO public.products (supplement_name, brand, product_name, product_url, price) VALUES 
('Vitamin D3', 'Thorne', 'Vitamin D/K2 Liquid', 'https://example.com', 29.00),
('Magnesium', 'Designs for Health', 'Magnesium Malate', 'https://example.com', 23.00),
('Omega-3', 'Nordic Naturals', 'Ultimate Omega', 'https://example.com', 45.00),
('B12', 'Jarrow', 'Methyl B-12', 'https://example.com', 15.00),
('Folate', 'Thorne', '5-MTHF', 'https://example.com', 22.00)
ON CONFLICT DO NOTHING;
