-- Performance Optimization: Add Strategic Database Indexes
-- This migration is 100% safe - no schema changes, only performance improvements
-- All indexes are created with IF NOT EXISTS to prevent conflicts
-- Note: CONCURRENTLY removed for migration compatibility

-- =============================================================================
-- 1. USER PROFILE LOOKUPS (Most Critical)
-- =============================================================================

-- Primary user identification (used in every authenticated request)
CREATE INDEX IF NOT EXISTS idx_user_profiles_id_active 
ON public.user_profiles(id) 
WHERE id IS NOT NULL;

-- Referral system lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code 
ON public.user_profiles(referral_code) 
WHERE referral_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_profiles_referred_by 
ON public.user_profiles(referred_by_code) 
WHERE referred_by_code IS NOT NULL;

-- Family system lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_family_admin 
ON public.user_profiles(family_admin_id) 
WHERE family_admin_id IS NOT NULL;

-- =============================================================================
-- 2. HEALTH DATA QUERIES (High Impact)
-- =============================================================================

-- Biomarker lookups by user and marker name (used in AI analysis)
CREATE INDEX IF NOT EXISTS idx_user_biomarkers_user_marker 
ON public.user_biomarkers(user_id, marker_name);

-- Biomarker temporal queries (latest results)
CREATE INDEX IF NOT EXISTS idx_user_biomarkers_user_date 
ON public.user_biomarkers(user_id, created_at DESC);

-- SNP lookups by user (genetic analysis)
CREATE INDEX IF NOT EXISTS idx_user_snps_user_snp 
ON public.user_snps(user_id, supported_snp_id);

-- SNP lookups by genetic variant ID
CREATE INDEX IF NOT EXISTS idx_user_snps_snp_id 
ON public.user_snps(snp_id) 
WHERE snp_id IS NOT NULL;

-- =============================================================================
-- 3. SUPPLEMENT PLAN QUERIES
-- =============================================================================

-- Latest supplement plans per user
CREATE INDEX IF NOT EXISTS idx_supplement_plans_user_date 
ON public.supplement_plans(user_id, created_at DESC);

-- Plan lookup optimization
CREATE INDEX IF NOT EXISTS idx_supplement_plans_user_updated 
ON public.supplement_plans(user_id, updated_at DESC);

-- =============================================================================
-- 4. LAB REPORT FILE MANAGEMENT
-- =============================================================================

-- Lab report status queries
CREATE INDEX IF NOT EXISTS idx_user_lab_reports_user_status 
ON public.user_lab_reports(user_id, status);

-- Recent lab reports
CREATE INDEX IF NOT EXISTS idx_user_lab_reports_user_date 
ON public.user_lab_reports(user_id, created_at DESC);

-- =============================================================================
-- 5. DYNAMIC TRACKING SYSTEM (Real-time Performance)
-- =============================================================================

-- Active questions for user
CREATE INDEX IF NOT EXISTS idx_dynamic_questions_user_active 
ON public.user_dynamic_questions(user_id, is_active, generated_date DESC) 
WHERE is_active = true;

-- Question responses by date
CREATE INDEX IF NOT EXISTS idx_dynamic_responses_user_date 
ON public.user_dynamic_responses(user_id, response_date DESC);

-- Question-response relationship
CREATE INDEX IF NOT EXISTS idx_dynamic_responses_question_date 
ON public.user_dynamic_responses(question_id, response_date DESC);

-- =============================================================================
-- 6. ANALYSIS AND INSIGHTS STORAGE
-- =============================================================================

-- Comprehensive analysis lookups
CREATE INDEX IF NOT EXISTS idx_comprehensive_analysis_user_type 
ON public.user_comprehensive_analysis(user_id, analysis_type);

-- Latest analysis per user
CREATE INDEX IF NOT EXISTS idx_comprehensive_analysis_user_updated 
ON public.user_comprehensive_analysis(user_id, updated_at DESC);

-- Health scores temporal queries
CREATE INDEX IF NOT EXISTS idx_health_scores_user_date 
ON public.user_health_scores(user_id, created_at DESC);

-- Tracking insights
CREATE INDEX IF NOT EXISTS idx_tracking_insights_user_period 
ON public.user_tracking_insights(user_id, data_period_end DESC);

-- =============================================================================
-- 7. PRODUCT CATALOG OPTIMIZATION
-- =============================================================================

-- Product searches by supplement name
CREATE INDEX IF NOT EXISTS idx_products_supplement_name 
ON public.products(supplement_name);

-- Brand-based filtering
CREATE INDEX IF NOT EXISTS idx_products_brand 
ON public.products(brand);

-- =============================================================================
-- 8. SUPPORTED SNPs REFERENCE TABLE
-- =============================================================================

-- Gene-based SNP lookups (for genetic analysis)
CREATE INDEX IF NOT EXISTS idx_supported_snps_gene 
ON public.supported_snps(gene);

-- RSID lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_supported_snps_rsid 
ON public.supported_snps(rsid);

-- =============================================================================
-- 9. COMPOSITE INDEXES FOR COMPLEX QUERIES
-- =============================================================================

-- User health data timeline (biomarkers + date)
CREATE INDEX IF NOT EXISTS idx_biomarkers_user_marker_date 
ON public.user_biomarkers(user_id, marker_name, created_at DESC);

-- SNP analysis optimization
CREATE INDEX IF NOT EXISTS idx_user_snps_composite 
ON public.user_snps(user_id, supported_snp_id, genotype);

-- Dynamic tracking pattern analysis
CREATE INDEX IF NOT EXISTS idx_responses_pattern_analysis 
ON public.user_dynamic_responses(user_id, question_id, response_date DESC, response_value);

-- =============================================================================
-- 10. TEXT SEARCH OPTIMIZATION (Future-Proofing)
-- =============================================================================

-- Product text search (if you add search functionality)
-- CREATE INDEX IF NOT EXISTS idx_products_text_search 
-- ON public.products USING gin(to_tsvector('english', supplement_name || ' ' || COALESCE(product_name, '')));

-- EXPLAIN: Why CONCURRENTLY?
-- CONCURRENTLY builds indexes without locking tables, so your app stays online
-- This is crucial for production databases with active users

-- EXPLAIN: Why IF NOT EXISTS?
-- Prevents errors if you run this migration multiple times
-- Safe for development and production environments

-- =============================================================================
-- PERFORMANCE MONITORING QUERIES (Optional - for monitoring index effectiveness)
-- =============================================================================

-- Uncomment these if you want to monitor index usage after deployment:

-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY idx_scan DESC;

-- SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch,
--        round(idx_scan::numeric / (seq_scan + idx_scan) * 100, 2) AS index_usage_pct
-- FROM pg_stat_user_tables 
-- WHERE schemaname = 'public' 
-- AND (seq_scan + idx_scan) > 0
-- ORDER BY index_usage_pct ASC;