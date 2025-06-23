-- Add last_question_refresh to track when user's questions were last generated
ALTER TABLE user_profiles 
ADD COLUMN last_question_refresh TIMESTAMP WITH TIME ZONE;

-- Set initial value to yesterday for all existing users so they get new questions
UPDATE user_profiles 
SET last_question_refresh = (CURRENT_TIMESTAMP - INTERVAL '1 day')
WHERE last_question_refresh IS NULL;

-- Add index for efficient querying during batch processing
CREATE INDEX idx_user_profiles_last_question_refresh 
ON user_profiles(last_question_refresh);

-- Add comment
COMMENT ON COLUMN user_profiles.last_question_refresh IS 'Timestamp of when daily tracking questions were last generated for this user'; 