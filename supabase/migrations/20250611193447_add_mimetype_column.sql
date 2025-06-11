-- Add missing mimetype column to user_lab_reports table
-- This fixes the PGRST204 error when uploading files

ALTER TABLE public.user_lab_reports 
ADD COLUMN IF NOT EXISTS mimetype text;
