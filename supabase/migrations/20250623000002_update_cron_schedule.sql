-- Update the daily tracker automation cron job schedule
-- This will run at 4 AM EDT (8 AM UTC) to ensure questions are ready before users wake up

-- First unschedule the existing job
SELECT cron.unschedule('daily-tracker-automation');

-- Reschedule for 4 AM EDT (8 AM UTC)
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

-- Log the update
DO $$
BEGIN
  RAISE NOTICE 'Daily tracker automation rescheduled to 4 AM EDT (8 AM UTC)';
END $$; 