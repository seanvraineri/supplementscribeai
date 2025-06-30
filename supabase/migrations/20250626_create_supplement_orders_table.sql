-- =============================================================================
-- CREATE SUPPLEMENT ORDERS TABLE
-- =============================================================================
-- This table tracks Shopify orders for supplement fulfillment
-- Integrates with existing user_profiles and supplement_plans tables
-- Prevents duplicate orders and enables monthly recurring fulfillment

-- Create the supplement_orders table
CREATE TABLE IF NOT EXISTS public.supplement_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    supplement_plan_id uuid NOT NULL REFERENCES public.supplement_plans(id) ON DELETE CASCADE,
    shopify_order_id text,
    order_date date NOT NULL DEFAULT CURRENT_DATE,
    next_order_date date,
    subscription_tier text NOT NULL DEFAULT 'full' 
        CHECK (subscription_tier IN ('full', 'software_only')),
    status text DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'failed', 'cancelled')),
    order_total numeric(10,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Prevent duplicate orders on same date for same user
    UNIQUE(user_id, order_date)
);

-- Add helpful comments
COMMENT ON TABLE public.supplement_orders IS 'Tracks Shopify orders for supplement fulfillment and prevents duplicates';
COMMENT ON COLUMN public.supplement_orders.subscription_tier IS 'Must match user subscription tier - only full tier gets orders';
COMMENT ON COLUMN public.supplement_orders.next_order_date IS 'When the next monthly order should be created (30 days from order_date)';
COMMENT ON COLUMN public.supplement_orders.shopify_order_id IS 'Shopify order ID for tracking fulfillment status';

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_supplement_orders_user_id ON public.supplement_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_orders_next_order_date ON public.supplement_orders(next_order_date);
CREATE INDEX IF NOT EXISTS idx_supplement_orders_status ON public.supplement_orders(status);
CREATE INDEX IF NOT EXISTS idx_supplement_orders_subscription_tier ON public.supplement_orders(subscription_tier);

-- Enable RLS following the same pattern as other tables
ALTER TABLE public.supplement_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policy that matches the pattern from other user-owned tables
-- Drop existing policy if it exists (safe to re-create)
DROP POLICY IF EXISTS "Users can manage their own supplement orders" ON public.supplement_orders;

CREATE POLICY "Users can manage their own supplement orders" 
ON public.supplement_orders 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Grant permissions following the same pattern
GRANT ALL ON public.supplement_orders TO authenticated;

-- Add updated_at trigger for automatic timestamp updates
-- Create or replace the function (safe to re-create)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS update_supplement_orders_updated_at ON public.supplement_orders;

CREATE TRIGGER update_supplement_orders_updated_at 
    BEFORE UPDATE ON public.supplement_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 