-- Add session tracking to chat conversations
ALTER TABLE public.user_chat_conversations 
ADD COLUMN IF NOT EXISTS session_id uuid;

-- Create index for session-based queries
CREATE INDEX IF NOT EXISTS idx_user_chat_conversations_session_id 
ON public.user_chat_conversations(user_id, session_id);

-- Update the trigger function to handle session-based conversation updates
CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_chat_conversations 
    SET updated_at = now() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; 