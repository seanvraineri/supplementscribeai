-- Add fields for frictionless onboarding
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS medication_history TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS known_biomarkers TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS known_genetic_variants TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS alcohol_intake TEXT;

-- Update RLS to include new fields (already covered by existing policies)
-- No additional RLS changes needed as existing policies cover all columns 