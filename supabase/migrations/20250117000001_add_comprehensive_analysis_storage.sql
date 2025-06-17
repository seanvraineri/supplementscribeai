-- Create table to store pre-computed comprehensive analysis results
CREATE TABLE user_comprehensive_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('biomarker', 'snp')),
  item_id TEXT NOT NULL, -- biomarker name or SNP rsid
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_user_comprehensive_analysis_user_id ON user_comprehensive_analysis(user_id);
CREATE INDEX idx_user_comprehensive_analysis_type ON user_comprehensive_analysis(user_id, analysis_type);
CREATE INDEX idx_user_comprehensive_analysis_item ON user_comprehensive_analysis(user_id, item_id);

-- Create unique constraint to prevent duplicates
CREATE UNIQUE INDEX idx_user_comprehensive_analysis_unique ON user_comprehensive_analysis(user_id, analysis_type, item_id);

-- Enable RLS
ALTER TABLE user_comprehensive_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own comprehensive analysis" ON user_comprehensive_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comprehensive analysis" ON user_comprehensive_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comprehensive analysis" ON user_comprehensive_analysis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comprehensive analysis" ON user_comprehensive_analysis
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_comprehensive_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER trigger_update_comprehensive_analysis_updated_at
  BEFORE UPDATE ON user_comprehensive_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_comprehensive_analysis_updated_at(); 