-- =============================================================================
-- DAILY TRACKER AUTOMATION CRON JOB
-- =============================================================================
-- This migration sets up automatic daily generation of personalized tracking
-- questions for all users

-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove any existing cron job with the same name (safe version)
SELECT CASE 
  WHEN EXISTS(SELECT 1 FROM cron.job WHERE jobname = 'daily-tracker-automation') 
  THEN cron.unschedule('daily-tracker-automation')
  ELSE false 
END;

-- Schedule daily tracker automation to run every day at 4 AM EDT (8 AM UTC)
-- This ensures all users have fresh questions when they wake up
SELECT cron.schedule(
  'daily-tracker-automation',
  '0 8 * * *', -- Every day at 8 AM UTC (4 AM EDT)
  $$
  SELECT
    net.http_post(
      url := 'https://lsdfxmiixmmgawhzyvza.supabase.co/functions/v1/daily-tracker-automation',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object()
    ) as request_id;
  $$
);

-- Add a comment explaining the automation
COMMENT ON EXTENSION pg_cron IS 'Used for daily automation of personalized health tracking questions';

-- Log the cron job creation
DO $$
BEGIN
  RAISE NOTICE 'Daily tracker automation cron job scheduled for 6 AM UTC daily';
END $$; 