-- Create the storage bucket for lab reports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('lab_reports', 'lab_reports', FALSE, 10485760, ARRAY['application/pdf', 'text/plain', 'application/zip', 'text/csv'])
ON CONFLICT (id) DO NOTHING;

-- Create user_profiles table with all fields
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text,
    age integer,
    gender text,
    height_total_inches integer,
    weight_lbs integer,
    health_goals text[],
    activity_level text,
    sleep_hours integer,
    energy_levels text,
    effort_fatigue text,
    caffeine_effect text,
    brain_fog text,
    anxiety_level text,
    stress_resilience text,
    sleep_quality text,
    sleep_aids text,
    bloating text,
    anemia_history text,
    digestion_speed text,
    low_nutrients text[],
    bruising_bleeding text,
    belly_fat text,
    joint_pain text
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    supplement_name text,
    brand text,
    product_name text,
    product_url text,
    price numeric
);

-- Create supported_snps table
CREATE TABLE IF NOT EXISTS public.supported_snps (
    id serial PRIMARY KEY,
    rsid text NOT NULL UNIQUE,
    gene text
);

-- Create user_lab_reports table
CREATE TABLE IF NOT EXISTS public.user_lab_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    file_path text,
    status text DEFAULT 'pending'::text,
    mimetype text,
    parsed_data jsonb
);

-- Create user_biomarkers table with index
CREATE TABLE IF NOT EXISTS public.user_biomarkers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    report_id uuid REFERENCES public.user_lab_reports(id) ON DELETE SET NULL,
    marker_name text,
    value double precision,
    unit text,
    reference_range text,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_biomarkers_marker_name ON public.user_biomarkers(marker_name);

-- Create user_snps table with foreign key to supported_snps
CREATE TABLE IF NOT EXISTS public.user_snps (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    report_id uuid REFERENCES public.user_lab_reports(id) ON DELETE SET NULL,
    supported_snp_id integer REFERENCES public.supported_snps(id) ON DELETE CASCADE,
    genotype text,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(user_id, supported_snp_id)
);

-- Join tables with composite primary keys
CREATE TABLE IF NOT EXISTS public.user_allergies (
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    ingredient_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, ingredient_name)
);

CREATE TABLE IF NOT EXISTS public.user_conditions (
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    condition_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, condition_name)
);

CREATE TABLE IF NOT EXISTS public.user_medications (
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    medication_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, medication_name)
);

-- Supplement mapping tables
CREATE TABLE IF NOT EXISTS public.supplement_snps (
    supplement_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    supported_snp_id integer NOT NULL REFERENCES public.supported_snps(id) ON DELETE CASCADE,
    PRIMARY KEY (supplement_id, supported_snp_id)
);

CREATE TABLE IF NOT EXISTS public.supplement_biomarkers (
    supplement_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    biomarker_name text NOT NULL,
    PRIMARY KEY (supplement_id, biomarker_name)
);

-- Create supplement_plans table
CREATE TABLE IF NOT EXISTS public.supplement_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile" ON public.user_profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE public.user_lab_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own lab reports" ON public.user_lab_reports FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_biomarkers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own biomarkers" ON public.user_biomarkers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_snps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own SNPs" ON public.user_snps FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_allergies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own allergies" ON public.user_allergies FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own conditions" ON public.user_conditions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own medications" ON public.user_medications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.supplement_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own supplement plans" ON public.supplement_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow public read access to products and SNPs for recommendations
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);

ALTER TABLE public.supported_snps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to supported SNPs" ON public.supported_snps FOR SELECT USING (true);

-- RLS Policies for Storage
CREATE POLICY "Users can view their own lab reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'lab_reports' AND auth.uid() = (string_to_array(name, '/'))[1]::uuid);

CREATE POLICY "Users can upload their own lab reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lab_reports' AND auth.uid() = (string_to_array(name, '/'))[1]::uuid);

CREATE POLICY "Users can update their own lab reports"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lab_reports' AND auth.uid() = (string_to_array(name, '/'))[1]::uuid);

CREATE POLICY "Users can delete their own lab reports"
ON storage.objects FOR DELETE
USING (bucket_id = 'lab_reports' AND auth.uid() = (string_to_array(name, '/'))[1]::uuid);
