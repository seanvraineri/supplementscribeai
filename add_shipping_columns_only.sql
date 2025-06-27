-- SAFE: Only add shipping columns if they don't exist
-- NO RLS changes, NO policy changes, NO existing schema modifications

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS shipping_name text,
ADD COLUMN IF NOT EXISTS shipping_address_line1 text,
ADD COLUMN IF NOT EXISTS shipping_address_line2 text,
ADD COLUMN IF NOT EXISTS shipping_city text,
ADD COLUMN IF NOT EXISTS shipping_state text,
ADD COLUMN IF NOT EXISTS shipping_postal_code text,
ADD COLUMN IF NOT EXISTS shipping_country text,
ADD COLUMN IF NOT EXISTS shipping_phone text;
