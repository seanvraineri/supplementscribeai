-- =============================================================================
-- DYNAMIC PERSONALIZED TRACKING SYSTEM
-- =============================================================================
-- This migration adds AI-generated personalized tracking questions and responses
-- that adapt based on user's onboarding data, conditions, and goals

-- =============================================================================
-- 1. DYNAMIC TRACKING QUESTIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_dynamic_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    question_context text, -- Why this question was chosen
    scale_description text DEFAULT '1 (Poor) to 10 (Excellent)',
    question_category text, -- 'energy', 'sleep', 'mood', 'condition_specific', etc.
    is_active boolean DEFAULT true,
    generated_date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Prevent duplicate questions for same user
    UNIQUE(user_id, question_text)
);

-- =============================================================================
-- 2. DYNAMIC TRACKING RESPONSES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_dynamic_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES public.user_dynamic_questions(id) ON DELETE CASCADE,
    response_value integer NOT NULL CHECK (response_value >= 1 AND response_value <= 10),
    response_date date NOT NULL DEFAULT CURRENT_DATE,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- One response per question per day per user
    UNIQUE(user_id, question_id, response_date)
);

-- =============================================================================
-- 3. AI INSIGHTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_tracking_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_text text NOT NULL,
    insight_type text, -- 'pattern', 'recommendation', 'concern', 'improvement'
    confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
    data_period_start date,
    data_period_end date,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- =============================================================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Dynamic questions indexes
CREATE INDEX IF NOT EXISTS idx_user_dynamic_questions_user_id 
ON public.user_dynamic_questions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_dynamic_questions_active 
ON public.user_dynamic_questions(user_id, is_active) WHERE is_active = true;

-- Dynamic responses indexes
CREATE INDEX IF NOT EXISTS idx_user_dynamic_responses_user_id 
ON public.user_dynamic_responses(user_id);

CREATE INDEX IF NOT EXISTS idx_user_dynamic_responses_date 
ON public.user_dynamic_responses(user_id, response_date DESC);

CREATE INDEX IF NOT EXISTS idx_user_dynamic_responses_question 
ON public.user_dynamic_responses(question_id, response_date DESC);

-- Insights indexes
CREATE INDEX IF NOT EXISTS idx_user_tracking_insights_user_id 
ON public.user_tracking_insights(user_id);

CREATE INDEX IF NOT EXISTS idx_user_tracking_insights_date 
ON public.user_tracking_insights(user_id, created_at DESC);

-- =============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on dynamic questions
ALTER TABLE public.user_dynamic_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own dynamic questions" 
ON public.user_dynamic_questions 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable RLS on dynamic responses
ALTER TABLE public.user_dynamic_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own dynamic responses" 
ON public.user_dynamic_responses 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Enable RLS on tracking insights
ALTER TABLE public.user_tracking_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tracking insights" 
ON public.user_tracking_insights 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 6. HELPER FUNCTION TO GET USER CONTEXT FOR AI
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_tracking_context(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
    user_context jsonb;
BEGIN
    SELECT jsonb_build_object(
        'profile', jsonb_build_object(
            'age', age,
            'gender', gender,
            'primary_health_concern', primary_health_concern,
            'energy_levels', energy_levels,
            'brain_fog', brain_fog,
            'anxiety_level', anxiety_level,
            'sleep_quality', sleep_quality,
            'digestive_issues', digestive_issues,
            'stress_levels', stress_levels,
            'mood_changes', mood_changes,
            'sugar_cravings', sugar_cravings,
            'joint_pain', joint_pain,
            'custom_health_goal', custom_health_goal
        ),
        'conditions', (
            SELECT jsonb_agg(condition_name)
            FROM public.user_conditions 
            WHERE user_id = p_user_id
        ),
        'allergies', (
            SELECT jsonb_agg(ingredient_name)
            FROM public.user_allergies 
            WHERE user_id = p_user_id
        ),
        'existing_questions', (
            SELECT jsonb_agg(question_text)
            FROM public.user_dynamic_questions 
            WHERE user_id = p_user_id AND is_active = true
        )
    ) INTO user_context
    FROM public.user_profiles
    WHERE id = p_user_id;
    
    RETURN COALESCE(user_context, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 