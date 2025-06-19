import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BiomarkerData, SNPData } from '@/lib/types';

const supabase = createClient();

interface AnalysisData {
  [key: string]: {
    name: string;
    description: string;
    currentValue?: string;
    referenceRange?: string;
    status?: string;
    statusColor?: 'green' | 'yellow' | 'red' | 'blue';
    interpretation?: string;
    recommendations?: string[];
    symptoms?: string[];
    genotype?: string;
    variantEffect?: string;
    functionalImpact?: string;
    riskLevel?: string;
    riskColor?: 'green' | 'orange' | 'red' | 'blue';
    // Enhanced analysis properties
    whatItDoes?: string;
    inRangeStatus?: string;
    actionPlan?: string;
    variantStatus?: string;
  };
}

export function useComprehensiveAnalysis(biomarkers: any[], snps: any[]) {
  const [biomarkerAnalysis, setBiomarkerAnalysis] = useState<AnalysisData>({});
  const [snpAnalysis, setSnpAnalysis] = useState<AnalysisData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [computing, setComputing] = useState<boolean>(false);

  useEffect(() => {
    if (biomarkers.length > 0 || snps.length > 0) {
      loadAnalysis();
    }
  }, [biomarkers, snps]);

  const loadAnalysis = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Call the updated comprehensive-analysis function
      const { data, error } = await supabase.functions.invoke('comprehensive-analysis', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Comprehensive analysis error:', error);
        return;
      }

      // Check if analysis is being computed
      if (data?.computing) {
        setComputing(true);
        console.log('Analysis is being computed, will retry...');
        
        // Retry after a delay
        setTimeout(() => {
          loadAnalysis();
        }, 3000);
        return;
      }

      setComputing(false);

      // Process the response - ✅ Keep any here for flexible API response
      if (data?.biomarkerAnalysis && Array.isArray(data.biomarkerAnalysis)) {
        const biomarkerData: AnalysisData = {};
        data.biomarkerAnalysis.forEach((analysis: any) => {
          // Extract marker name from the analysis or use a key
          const markerName = analysis.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
          biomarkerData[markerName] = analysis;
        });
        setBiomarkerAnalysis(biomarkerData);
      }

      if (data?.snpAnalysis && Array.isArray(data.snpAnalysis)) {
        const snpData: AnalysisData = {};
        data.snpAnalysis.forEach((analysis: any) => {
          // Extract SNP identifier from the analysis
          const snpKey = analysis.name || 'unknown';
          snpData[snpKey] = analysis;
        });
        setSnpAnalysis(snpData);
      }

    } catch (error) {
      console.error('Analysis loading failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerRecomputation = async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setComputing(true);
      
      const { error } = await supabase.functions.invoke('compute-comprehensive-analysis', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Failed to trigger recomputation:', error);
        return;
      }

      // Wait a moment then reload
      setTimeout(() => {
        loadAnalysis();
      }, 2000);

    } catch (error) {
      console.error('Recomputation failed:', error);
      setComputing(false);
    }
  };

  return {
    biomarkerAnalysis,
    snpAnalysis,
    loading,
    computing,
    triggerRecomputation
  };
} 