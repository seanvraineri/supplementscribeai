-- Add fields for frictionless onboarding
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS 
  medication_history TEXT,           -- For ADHD/anxiety medication effectiveness question
  known_biomarkers TEXT,            -- Optional manual biomarker input
  known_genetic_variants TEXT,      -- Optional manual genetic variant input
  alcohol_intake TEXT;              -- For alcohol consumption question

-- Update RLS to include new fields (already covered by existing policies)
-- No additional RLS changes needed as existing policies cover all columns 