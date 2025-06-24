-- Database Performance Monitoring Script
-- Run these queries to verify your indexes are working

-- 1. Check which indexes are being used most
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as "Times Used",
  idx_tup_read as "Tuples Read",
  idx_tup_fetch as "Tuples Fetched"
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' 
ORDER BY idx_scan DESC
LIMIT 20;

-- 2. Check table scan vs index usage ratio
SELECT 
  schemaname,
  tablename,
  seq_scan as "Table Scans",
  seq_tup_read as "Rows Read via Table Scan",
  idx_scan as "Index Scans",
  idx_tup_fetch as "Rows Read via Index",
  CASE 
    WHEN (seq_scan + idx_scan) > 0 
    THEN round(idx_scan::numeric / (seq_scan + idx_scan) * 100, 2) 
    ELSE 0 
  END AS "Index Usage %"
FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
AND (seq_scan + idx_scan) > 0
ORDER BY "Index Usage %" ASC;

-- 3. Find slow queries (if query logging is enabled)
-- This requires log_min_duration_statement to be set
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE query LIKE '%user_profiles%' OR query LIKE '%user_biomarkers%'
ORDER BY mean_time DESC
LIMIT 10;

-- 4. Check index sizes
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as "Size"
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;