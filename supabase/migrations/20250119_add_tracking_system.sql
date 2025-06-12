-- =============================================================================
-- TRACKING SYSTEM MIGRATION
-- =============================================================================
-- This migration adds comprehensive tracking functionality for symptoms and 
-- supplement adherence with proper RLS policies and indexes

-- =============================================================================
-- 1. SYMPTOM TRACKING TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_symptom_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    symptom_name text NOT NULL,
    value integer NOT NULL CHECK (value >= 1 AND value <= 10),
    scale text DEFAULT '1-10' NOT NULL,
    notes text,
    entry_date date NOT NULL DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Ensure one entry per symptom per day per user
    UNIQUE(user_id, symptom_name, entry_date)
);

-- =============================================================================
-- 2. SUPPLEMENT ADHERENCE TRACKING TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_supplement_adherence (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    supplement_name text NOT NULL,
    dosage text,
    taken boolean DEFAULT false NOT NULL,
    taken_at timestamp with time zone,
    entry_date date NOT NULL DEFAULT CURRENT_DATE,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Ensure one entry per supplement per day per user
    UNIQUE(user_id, supplement_name, entry_date)
);

-- =============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Symptom tracking indexes
CREATE INDEX IF NOT EXISTS idx_user_symptom_entries_user_id 
ON public.user_symptom_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_user_symptom_entries_date 
ON public.user_symptom_entries(user_id, entry_date DESC);

CREATE INDEX IF NOT EXISTS idx_user_symptom_entries_symptom 
ON public.user_symptom_entries(user_id, symptom_name, entry_date DESC);

-- Supplement adherence indexes
CREATE INDEX IF NOT EXISTS idx_user_supplement_adherence_user_id 
ON public.user_supplement_adherence(user_id);

CREATE INDEX IF NOT EXISTS idx_user_supplement_adherence_date 
ON public.user_supplement_adherence(user_id, entry_date DESC);

CREATE INDEX IF NOT EXISTS idx_user_supplement_adherence_supplement 
ON public.user_supplement_adherence(user_id, supplement_name, entry_date DESC);

-- =============================================================================
-- 4. ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on symptom tracking
ALTER TABLE public.user_symptom_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own symptom entries" 
ON public.user_symptom_entries 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable RLS on supplement adherence
ALTER TABLE public.user_supplement_adherence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own supplement adherence" 
ON public.user_supplement_adherence 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 5. TRIGGER FUNCTIONS FOR UPDATED_AT
-- =============================================================================

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tracking tables
DROP TRIGGER IF EXISTS update_symptom_entries_updated_at ON public.user_symptom_entries;
CREATE TRIGGER update_symptom_entries_updated_at
    BEFORE UPDATE ON public.user_symptom_entries
    FOR EACH ROW EXECUTE FUNCTION update_tracking_updated_at();

DROP TRIGGER IF EXISTS update_supplement_adherence_updated_at ON public.user_supplement_adherence;
CREATE TRIGGER update_supplement_adherence_updated_at
    BEFORE UPDATE ON public.user_supplement_adherence
    FOR EACH ROW EXECUTE FUNCTION update_tracking_updated_at();

-- =============================================================================
-- 6. HELPER FUNCTIONS FOR TRACKING ANALYTICS
-- =============================================================================

-- Function to calculate adherence percentage for a user and date range
CREATE OR REPLACE FUNCTION calculate_adherence_percentage(
    p_user_id uuid,
    p_start_date date DEFAULT CURRENT_DATE - INTERVAL '7 days',
    p_end_date date DEFAULT CURRENT_DATE
)
RETURNS numeric AS $$
DECLARE
    total_entries integer;
    taken_entries integer;
    adherence_percentage numeric;
BEGIN
    -- Count total supplement entries in date range
    SELECT COUNT(*) INTO total_entries
    FROM public.user_supplement_adherence
    WHERE user_id = p_user_id
    AND entry_date BETWEEN p_start_date AND p_end_date;
    
    -- Count taken supplement entries in date range
    SELECT COUNT(*) INTO taken_entries
    FROM public.user_supplement_adherence
    WHERE user_id = p_user_id
    AND entry_date BETWEEN p_start_date AND p_end_date
    AND taken = true;
    
    -- Calculate percentage
    IF total_entries = 0 THEN
        RETURN 0;
    ELSE
        adherence_percentage := (taken_entries::numeric / total_entries::numeric) * 100;
        RETURN ROUND(adherence_percentage, 1);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current streak of adherence
CREATE OR REPLACE FUNCTION get_adherence_streak(p_user_id uuid)
RETURNS integer AS $$
DECLARE
    streak_count integer := 0;
    check_date date := CURRENT_DATE;
    daily_adherence numeric;
BEGIN
    LOOP
        -- Calculate adherence for this specific date
        SELECT calculate_adherence_percentage(p_user_id, check_date, check_date) 
        INTO daily_adherence;
        
        -- If no data for this date or adherence < 80%, break the streak
        IF daily_adherence = 0 OR daily_adherence < 80 THEN
            EXIT;
        END IF;
        
        -- Increment streak and check previous day
        streak_count := streak_count + 1;
        check_date := check_date - INTERVAL '1 day';
        
        -- Prevent infinite loop (max 365 days)
        IF streak_count >= 365 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 7. PREDEFINED SYMPTOM TYPES (FOR CONSISTENCY)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.symptom_types (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    icon text,
    color text,
    scale text DEFAULT '1-10',
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Insert predefined symptom types
INSERT INTO public.symptom_types (name, icon, color, description) VALUES 
('Energy Level', '⚡', 'emerald', 'Overall energy and vitality throughout the day'),
('Sleep Quality', '😴', 'blue', 'Quality of sleep and feeling rested upon waking'),
('Brain Fog', '🧠', 'purple', 'Mental clarity and cognitive function'),
('Mood', '😊', 'yellow', 'Overall emotional state and mood stability'),
('Joint Pain', '🦴', 'red', 'Joint discomfort and mobility issues'),
('Digestive Health', '🫃', 'orange', 'Digestive comfort and gut health'),
('Stress Level', '😰', 'pink', 'Perceived stress and anxiety levels'),
('Focus', '🎯', 'indigo', 'Ability to concentrate and maintain attention')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on symptom types (read-only for all authenticated users)
ALTER TABLE public.symptom_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read symptom types" 
ON public.symptom_types FOR SELECT USING (auth.role() = 'authenticated'); 