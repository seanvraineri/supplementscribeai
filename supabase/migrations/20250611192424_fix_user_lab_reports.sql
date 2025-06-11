-- Fix user_lab_reports table and RLS policies
-- This migration addresses the mimetype column and RLS policy issues

-- First, ensure the table exists with correct structure
DROP TABLE IF EXISTS public.user_lab_reports CASCADE;

CREATE TABLE public.user_lab_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    file_path text,
    status text DEFAULT 'pending'::text,
    mimetype text,
    parsed_data jsonb
);

-- Update user_biomarkers and user_snps to reference auth.users directly as well
ALTER TABLE public.user_biomarkers DROP CONSTRAINT IF EXISTS user_biomarkers_user_id_fkey;
ALTER TABLE public.user_biomarkers ADD CONSTRAINT user_biomarkers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_snps DROP CONSTRAINT IF EXISTS user_snps_user_id_fkey;
ALTER TABLE public.user_snps ADD CONSTRAINT user_snps_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.user_lab_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own lab reports" ON public.user_lab_reports;

-- Create new RLS policy that works with auth.users directly
CREATE POLICY "Users can manage their own lab reports" ON public.user_lab_reports 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Also update policies for biomarkers and snps to be consistent
DROP POLICY IF EXISTS "Users can manage their own biomarkers" ON public.user_biomarkers;
CREATE POLICY "Users can manage their own biomarkers" ON public.user_biomarkers 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own SNPs" ON public.user_snps;
CREATE POLICY "Users can manage their own SNPs" ON public.user_snps 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_lab_reports_user_id ON public.user_lab_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lab_reports_status ON public.user_lab_reports(status);
