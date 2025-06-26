-- Add shipping address fields to user_profiles table for supplement delivery
-- These fields are collected during Stripe checkout for complete package subscribers

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS shipping_name text,
ADD COLUMN IF NOT EXISTS shipping_address_line1 text,
ADD COLUMN IF NOT EXISTS shipping_address_line2 text,
ADD COLUMN IF NOT EXISTS shipping_city text,
ADD COLUMN IF NOT EXISTS shipping_state text,
ADD COLUMN IF NOT EXISTS shipping_postal_code text,
ADD COLUMN IF NOT EXISTS shipping_country text,
ADD COLUMN IF NOT EXISTS shipping_phone text;

-- Add helpful comments
COMMENT ON COLUMN public.user_profiles.shipping_name IS 'Full name for supplement delivery (collected during Stripe checkout)';
COMMENT ON COLUMN public.user_profiles.shipping_address_line1 IS 'Primary shipping address line for supplement delivery';
COMMENT ON COLUMN public.user_profiles.shipping_address_line2 IS 'Secondary shipping address line (apartment, suite, etc.)';
COMMENT ON COLUMN public.user_profiles.shipping_city IS 'Shipping city for supplement delivery';
COMMENT ON COLUMN public.user_profiles.shipping_state IS 'Shipping state/province for supplement delivery';
COMMENT ON COLUMN public.user_profiles.shipping_postal_code IS 'Shipping postal/ZIP code for supplement delivery';
COMMENT ON COLUMN public.user_profiles.shipping_country IS 'Shipping country code (US, CA, etc.) for supplement delivery';
COMMENT ON COLUMN public.user_profiles.shipping_phone IS 'Phone number for delivery notifications and coordination';

-- Create index for efficient lookups by location (useful for shipping cost calculations)
CREATE INDEX IF NOT EXISTS idx_user_profiles_shipping_location 
ON public.user_profiles(shipping_country, shipping_state, shipping_postal_code)
WHERE shipping_country IS NOT NULL;

-- No RLS changes needed - existing user_profiles policies already cover all columns
