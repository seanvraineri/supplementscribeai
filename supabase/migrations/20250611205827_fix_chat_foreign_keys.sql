-- Fix foreign key constraints for chat tables to reference auth.users directly
-- This ensures consistency with other tables and avoids dependency issues

-- Drop existing foreign key constraints
ALTER TABLE public.user_chat_conversations 
DROP CONSTRAINT IF EXISTS user_chat_conversations_user_id_fkey;

ALTER TABLE public.user_chat_messages 
DROP CONSTRAINT IF EXISTS user_chat_messages_user_id_fkey;

-- Recreate with auth.users(id) references for consistency
ALTER TABLE public.user_chat_conversations 
ADD CONSTRAINT user_chat_conversations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_chat_messages 
ADD CONSTRAINT user_chat_messages_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE; 