-- Create a function to trigger comprehensive analysis computation
CREATE OR REPLACE FUNCTION trigger_comprehensive_analysis()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a job to compute comprehensive analysis
  -- We'll use a simple approach: insert into a queue table
  INSERT INTO comprehensive_analysis_queue (user_id, triggered_at)
  VALUES (NEW.user_id, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    triggered_at = NOW(),
    processed = false;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a queue table for analysis computation
CREATE TABLE IF NOT EXISTS comprehensive_analysis_queue (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the queue table
ALTER TABLE comprehensive_analysis_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the queue table
CREATE POLICY "Users can view their own analysis queue" ON comprehensive_analysis_queue
  FOR SELECT USING (auth.uid() = user_id);

-- Create triggers for biomarkers
DROP TRIGGER IF EXISTS trigger_biomarker_analysis ON user_biomarkers;
CREATE TRIGGER trigger_biomarker_analysis
  AFTER INSERT OR UPDATE ON user_biomarkers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_comprehensive_analysis();

-- Create triggers for SNPs
DROP TRIGGER IF EXISTS trigger_snp_analysis ON user_snps;
CREATE TRIGGER trigger_snp_analysis
  AFTER INSERT OR UPDATE ON user_snps
  FOR EACH ROW
  EXECUTE FUNCTION trigger_comprehensive_analysis();

-- Create a function to check if analysis needs to be computed
CREATE OR REPLACE FUNCTION needs_analysis_computation(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  queue_exists BOOLEAN;
  analysis_exists BOOLEAN;
BEGIN
  -- Check if user is in the queue
  SELECT EXISTS(
    SELECT 1 FROM comprehensive_analysis_queue 
    WHERE user_id = p_user_id AND processed = false
  ) INTO queue_exists;
  
  -- Check if user has any existing analysis
  SELECT EXISTS(
    SELECT 1 FROM user_comprehensive_analysis 
    WHERE user_id = p_user_id
  ) INTO analysis_exists;
  
  -- Return true if in queue or no analysis exists
  RETURN queue_exists OR NOT analysis_exists;
END;
$$ LANGUAGE plpgsql;

-- Create a function to mark analysis as processed
CREATE OR REPLACE FUNCTION mark_analysis_processed(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE comprehensive_analysis_queue 
  SET processed = true 
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql; 