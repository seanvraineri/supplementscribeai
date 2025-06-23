-- =============================================================================
-- FIX MISSING HEALTH DOMAINS ANALYSIS TABLE
-- =============================================================================
-- This migration creates the missing user_health_domains_analysis table
-- that's needed for the comprehensive health analysis system

-- =============================================================================
-- 1. CREATE HEALTH DOMAINS ANALYSIS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_health_domains_analysis (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- =============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_health_domains_analysis_user_id 
ON public.user_health_domains_analysis(user_id);

CREATE INDEX IF NOT EXISTS idx_user_health_domains_analysis_created_at 
ON public.user_health_domains_analysis(user_id, created_at DESC);

-- =============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.user_health_domains_analysis ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policy
CREATE POLICY "user_health_domains_analysis_policy" ON public.user_health_domains_analysis
FOR ALL
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 4. GRANT PERMISSIONS
-- =============================================================================

GRANT ALL ON public.user_health_domains_analysis TO authenticated;

-- =============================================================================
-- 5. CREATE UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_user_health_domains_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_health_domains_analysis_updated_at
    BEFORE UPDATE ON public.user_health_domains_analysis
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_health_domains_analysis_updated_at();

-- =============================================================================
-- 6. HELPER FUNCTION FOR RETRIEVAL
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_latest_health_domains_analysis(user_uuid uuid)
RETURNS TABLE (
    id uuid,
    analysis_data jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hda.id,
        hda.analysis_data,
        hda.created_at,
        hda.updated_at
    FROM public.user_health_domains_analysis hda
    WHERE hda.user_id = user_uuid
    ORDER BY hda.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_latest_health_domains_analysis(uuid) TO authenticated;
