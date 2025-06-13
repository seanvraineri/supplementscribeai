-- =============================================================================
-- CREATE PRODUCT CHECK HISTORY TABLE
-- =============================================================================
-- This migration creates a table to store user's product compatibility check history

-- Drop table if it exists to avoid conflicts
DROP TABLE IF EXISTS public.product_check_history;

-- Create the table
CREATE TABLE public.product_check_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_url text NOT NULL,
    product_name text,
    brand text,
    overall_score integer,
    analysis_summary text,
    pros text[],
    cons text[],
    warnings text[],
    full_analysis jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for efficient user queries
CREATE INDEX idx_product_check_history_user_id ON public.product_check_history(user_id);
CREATE INDEX idx_product_check_history_created_at ON public.product_check_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.product_check_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage their own product check history" 
ON public.product_check_history 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
