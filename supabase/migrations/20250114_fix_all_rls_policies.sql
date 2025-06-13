-- Fix all RLS policies to prevent 406 errors
-- Drop all existing policies first to clean slate
DROP POLICY IF EXISTS "Users can view their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON user_profiles;

DROP POLICY IF EXISTS "Users can manage their own lab reports" ON user_lab_reports;
DROP POLICY IF EXISTS "Users can view their own lab reports" ON user_lab_reports;
DROP POLICY IF EXISTS "Users can insert their own lab reports" ON user_lab_reports;
DROP POLICY IF EXISTS "Users can update their own lab reports" ON user_lab_reports;
DROP POLICY IF EXISTS "Users can delete their own lab reports" ON user_lab_reports;

DROP POLICY IF EXISTS "Users can manage their own biomarkers" ON user_biomarkers;
DROP POLICY IF EXISTS "Users can view their own biomarkers" ON user_biomarkers;
DROP POLICY IF EXISTS "Users can insert their own biomarkers" ON user_biomarkers;
DROP POLICY IF EXISTS "Users can update their own biomarkers" ON user_biomarkers;
DROP POLICY IF EXISTS "Users can delete their own biomarkers" ON user_biomarkers;

DROP POLICY IF EXISTS "Users can manage their own SNPs" ON user_snps;
DROP POLICY IF EXISTS "Users can view their own SNPs" ON user_snps;
DROP POLICY IF EXISTS "Users can insert their own SNPs" ON user_snps;
DROP POLICY IF EXISTS "Users can update their own SNPs" ON user_snps;
DROP POLICY IF EXISTS "Users can delete their own SNPs" ON user_snps;

DROP POLICY IF EXISTS "Users can manage their own supplement plans" ON supplement_plans;
DROP POLICY IF EXISTS "Users can view their own supplement plans" ON supplement_plans;
DROP POLICY IF EXISTS "Users can insert their own supplement plans" ON supplement_plans;
DROP POLICY IF EXISTS "Users can update their own supplement plans" ON supplement_plans;
DROP POLICY IF EXISTS "Users can delete their own supplement plans" ON supplement_plans;

-- Temporarily disable RLS on supplement_plans to fix 406 errors
ALTER TABLE supplement_plans DISABLE ROW LEVEL SECURITY;

-- Create simple, working policies for all tables
-- User profiles
CREATE POLICY "Enable all for authenticated users on user_profiles" 
ON user_profiles FOR ALL 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Lab reports  
CREATE POLICY "Enable all for authenticated users on user_lab_reports"
ON user_lab_reports FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Biomarkers
CREATE POLICY "Enable all for authenticated users on user_biomarkers"
ON user_biomarkers FOR ALL
TO authenticated  
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- SNPs
CREATE POLICY "Enable all for authenticated users on user_snps"
ON user_snps FOR ALL
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Re-enable RLS on supplement_plans with working policy
ALTER TABLE supplement_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users on supplement_plans"
ON supplement_plans FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_lab_reports TO authenticated;
GRANT ALL ON user_biomarkers TO authenticated;
GRANT ALL ON user_snps TO authenticated;
GRANT ALL ON supplement_plans TO authenticated;
GRANT ALL ON products TO authenticated; 