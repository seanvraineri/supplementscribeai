-- Add AI Chat System
-- Create table for storing chat conversations
CREATE TABLE IF NOT EXISTS public.user_chat_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title text DEFAULT 'New Conversation',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create table for storing individual chat messages
CREATE TABLE IF NOT EXISTS public.user_chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    conversation_id uuid NOT NULL REFERENCES public.user_chat_conversations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_chat_conversations_user_id ON public.user_chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chat_conversations_updated_at ON public.user_chat_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_chat_messages_conversation_id ON public.user_chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_user_chat_messages_created_at ON public.user_chat_messages(created_at ASC);

-- Enable RLS on chat tables
ALTER TABLE public.user_chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies following existing patterns
CREATE POLICY "Enable all for authenticated users on user_chat_conversations"
ON user_chat_conversations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable all for authenticated users on user_chat_messages"
ON user_chat_messages FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT ALL ON user_chat_conversations TO authenticated;
GRANT ALL ON user_chat_messages TO authenticated;

-- Add function to update conversation timestamp when message is added
CREATE OR REPLACE FUNCTION update_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_chat_conversations 
    SET updated_at = now() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update conversation timestamp
CREATE TRIGGER trigger_update_conversation_timestamp
    AFTER INSERT ON user_chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_updated_at(); 