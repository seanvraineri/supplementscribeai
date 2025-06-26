-- Additional Safe Performance Optimizations
-- These are completely safe and won't affect your application

-- =============================================================================
-- 1. VACUUM AND ANALYZE OPTIMIZATION
-- =============================================================================

-- Update table statistics for better query planning
ANALYZE public.user_profiles;
ANALYZE public.user_biomarkers;
ANALYZE public.user_snps;
ANALYZE public.supplement_plans;
ANALYZE public.user_dynamic_responses;

-- =============================================================================
-- 2. SAFE DATABASE SETTINGS (These can be applied if needed)
-- =============================================================================

-- These settings can improve performance but should be tested first:
-- ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
-- ALTER SYSTEM SET track_activity_query_size = 2048;
-- ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log slow queries

-- =============================================================================
-- 3. PARTIAL INDEXES FOR BETTER PERFORMANCE
-- =============================================================================

-- Only index active/relevant records to save space and improve speed

-- Index only active dynamic questions
CREATE INDEX IF NOT EXISTS idx_dynamic_questions_active_only 
ON public.user_dynamic_questions(user_id, generated_date) 
WHERE is_active = true;

-- Index only recent responses (last 30 days for better performance) - removed for compatibility
-- CREATE INDEX IF NOT EXISTS idx_recent_responses 
-- ON public.user_dynamic_responses(user_id, response_date, response_value) 
-- WHERE response_date >= (CURRENT_DATE - INTERVAL '30 days');

-- Index only completed supplement plans
CREATE INDEX IF NOT EXISTS idx_supplement_plans_completed 
ON public.supplement_plans(user_id, created_at) 
WHERE plan_details IS NOT NULL;

-- =============================================================================
-- 4. EXPRESSION INDEXES (For specific query patterns)
-- =============================================================================

-- If you search biomarkers case-insensitively
CREATE INDEX IF NOT EXISTS idx_biomarkers_marker_lower 
ON public.user_biomarkers(user_id, LOWER(marker_name));

-- If you frequently query by date ranges (simplified version)
CREATE INDEX IF NOT EXISTS idx_biomarkers_date_range 
ON public.user_biomarkers(user_id, created_at);

-- =============================================================================
-- 5. FOREIGN KEY INDEXES (Critical for joins)
-- =============================================================================

-- These might already exist, but let's ensure they do
CREATE INDEX IF NOT EXISTS idx_user_allergies_user_fk 
ON public.user_allergies(user_id);

CREATE INDEX IF NOT EXISTS idx_user_conditions_user_fk 
ON public.user_conditions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_medications_user_fk 
ON public.user_medications(user_id);

-- =============================================================================
-- 6. COVERING INDEXES (Include frequently selected columns)
-- =============================================================================

-- Include commonly selected columns in the index itself
-- This avoids table lookups entirely for some queries

CREATE INDEX IF NOT EXISTS idx_biomarkers_with_value 
ON public.user_biomarkers(user_id, marker_name) 
INCLUDE (value, unit, created_at);

CREATE INDEX IF NOT EXISTS idx_snps_with_genotype 
ON public.user_snps(user_id, supported_snp_id) 
INCLUDE (genotype, created_at);

-- =============================================================================
-- NOTES FOR MAINTENANCE
-- =============================================================================

-- To check index usage after a week of running:
-- SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public' ORDER BY idx_scan DESC;

-- To find unused indexes (careful before dropping):
-- SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0 AND schemaname = 'public';

-- To see index sizes:
-- SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid)) 
-- FROM pg_stat_user_indexes WHERE schemaname = 'public' ORDER BY pg_relation_size(indexrelid) DESC;