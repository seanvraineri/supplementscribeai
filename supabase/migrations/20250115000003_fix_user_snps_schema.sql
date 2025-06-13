-- Fix user_snps table schema to support both matched and unmatched SNPs
-- This addresses the critical issue where snp_id and gene_name columns don't exist

-- Add missing columns to user_snps table
ALTER TABLE public.user_snps 
ADD COLUMN IF NOT EXISTS snp_id text,
ADD COLUMN IF NOT EXISTS gene_name text;

-- Allow supported_snp_id to be nullable for unmatched SNPs
ALTER TABLE public.user_snps 
ALTER COLUMN supported_snp_id DROP NOT NULL;

-- Drop the existing unique constraint that requires supported_snp_id
ALTER TABLE public.user_snps 
DROP CONSTRAINT IF EXISTS user_snps_user_id_supported_snp_id_key;

-- Add flexible constraints that work for both matched and unmatched SNPs
-- For matched SNPs (with supported_snp_id)
CREATE UNIQUE INDEX IF NOT EXISTS user_snps_matched_unique 
ON public.user_snps(user_id, supported_snp_id) 
WHERE supported_snp_id IS NOT NULL;

-- For unmatched SNPs (without supported_snp_id, using direct fields)
CREATE UNIQUE INDEX IF NOT EXISTS user_snps_unmatched_unique 
ON public.user_snps(user_id, snp_id, gene_name) 
WHERE supported_snp_id IS NULL AND snp_id IS NOT NULL; 