-- Fix foreign key constraint in product_check_history table
-- Change from auth.users(id) to user_profiles(id) for consistency

-- Drop the existing foreign key constraint
ALTER TABLE public.product_check_history 
DROP CONSTRAINT IF EXISTS product_check_history_user_id_fkey;

-- Add the correct foreign key constraint to user_profiles
ALTER TABLE public.product_check_history 
ADD CONSTRAINT product_check_history_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE; 