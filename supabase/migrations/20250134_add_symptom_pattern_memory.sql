-- =============================================================================
-- SYMPTOM PATTERN MEMORY MIGRATION  
-- =============================================================================
-- This migration adds AI-generated symptom pattern storage for synchronization
-- across all Edge Functions. This provides "memory" for root cause analysis.

-- =============================================================================
-- 1. CREATE SYMPTOM PATTERNS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_symptom_patterns (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Pattern identification
    pattern_type text NOT NULL, -- e.g., 'methylation_dysfunction', 'energy_metabolism', 'gut_dysbiosis'
    pattern_name text NOT NULL, -- Human-readable name
    confidence_score integer NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    
    -- Pattern details (JSON arrays for flexibility)
    symptoms_involved jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of symptoms
    root_causes jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of underlying causes
    pattern_description text, -- Detailed explanation
    recommendations jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of recommendations
    
    -- Metadata
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Source tracking
    source text DEFAULT 'generate_plan' NOT NULL -- Which function generated this pattern
);

-- =============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_symptom_patterns_user_id 
    ON public.user_symptom_patterns(user_id);

CREATE INDEX IF NOT EXISTS idx_user_symptom_patterns_confidence 
    ON public.user_symptom_patterns(user_id, confidence_score DESC);

CREATE INDEX IF NOT EXISTS idx_user_symptom_patterns_type 
    ON public.user_symptom_patterns(user_id, pattern_type);

CREATE INDEX IF NOT EXISTS idx_user_symptom_patterns_created 
    ON public.user_symptom_patterns(user_id, created_at DESC);

-- =============================================================================
-- 3. CREATE RLS POLICIES (CONSISTENT WITH EXISTING PATTERN)
-- =============================================================================

ALTER TABLE public.user_symptom_patterns ENABLE ROW LEVEL SECURITY;

-- Users can only see their own patterns
CREATE POLICY "Users can view own symptom patterns" ON public.user_symptom_patterns
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own patterns  
CREATE POLICY "Users can insert own symptom patterns" ON public.user_symptom_patterns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own patterns
CREATE POLICY "Users can update own symptom patterns" ON public.user_symptom_patterns
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own patterns
CREATE POLICY "Users can delete own symptom patterns" ON public.user_symptom_patterns
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- 4. ADD TRIGGER FOR UPDATED_AT TIMESTAMP
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_symptom_patterns_updated_at 
    BEFORE UPDATE ON public.user_symptom_patterns 
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- =============================================================================
-- 5. HELPER FUNCTION FOR RETRIEVING PATTERNS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_user_symptom_patterns(target_user_id uuid)
RETURNS TABLE (
    pattern_type text,
    pattern_name text,
    confidence_score integer,
    symptoms_involved jsonb,
    root_causes jsonb,
    pattern_description text,
    recommendations jsonb
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        usp.pattern_type,
        usp.pattern_name,
        usp.confidence_score,
        usp.symptoms_involved,
        usp.root_causes,
        usp.pattern_description,
        usp.recommendations
    FROM public.user_symptom_patterns usp
    WHERE usp.user_id = target_user_id
      AND usp.user_id = auth.uid() -- Additional security check
    ORDER BY usp.confidence_score DESC, usp.created_at DESC;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_user_symptom_patterns(uuid) TO authenticated;

-- =============================================================================
-- MIGRATION COMPLETE ✅
-- =============================================================================
-- This adds symptom pattern memory functionality while maintaining:
-- - Consistent RLS security model
-- - Performance optimizations via indexes  
-- - Backward compatibility (no breaking changes)
-- - Proper foreign key relationships
-- ============================================================================= 