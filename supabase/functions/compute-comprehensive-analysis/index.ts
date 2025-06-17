import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Load JSON using import assertion so it works in Edge runtime bundle
let healthDB: any = {};
try {
  // @ts-ignore Deno import assertion
  healthDB = (await import('../../../src/lib/health_database_final.json', {
    assert: { type: 'json' }
  })).default;
} catch (err) {
  console.error('Health DB load error', err);
  healthDB = { biomarkers: [], snps: [] };
}

// Enhanced biomarker analysis with comprehensive health information
function generateEnhancedBiomarkerAnalysis(biomarker: any) {
  const name = biomarker.marker_name?.toLowerCase() || '';
  const value = parseFloat(biomarker.value || '0');
  const unit = biomarker.unit || '';
  const displayName = formatBiomarkerName(name);

  // Get comprehensive analysis
  const analysis = getComprehensiveBiomarkerAnalysis(name, value, unit);
  
  return {
    name: displayName,
    description: analysis.description,
    currentValue: `${value} ${unit}`,
    referenceRange: analysis.referenceRange,
    status: analysis.status,
    statusColor: analysis.statusColor,
    interpretation: analysis.interpretation,
    recommendations: analysis.recommendations,
    symptoms: analysis.symptoms,
    whatItDoes: analysis.whatItDoes,
    inRangeStatus: analysis.inRangeStatus,
    actionPlan: analysis.actionPlan
  };
}

// Enhanced SNP analysis with comprehensive genetic information
function generateEnhancedSNPAnalysis(snp: any) {
  const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
  const rsid = snp.supported_snps?.rsid || snp.snp_id || 'Unknown';
  const genotype = snp.genotype || 'Unknown';
  
  // Get comprehensive analysis
  const analysis = getComprehensiveSNPAnalysis(gene, rsid, genotype);
  
  return {
    name: `${gene} (${rsid})`,
    description: analysis.description,
    genotype: genotype,
    variantEffect: analysis.variantEffect,
    functionalImpact: analysis.functionalImpact,
    riskLevel: analysis.riskLevel,
    riskColor: analysis.riskColor,
    recommendations: analysis.recommendations,
    whatItDoes: analysis.whatItDoes,
    variantStatus: analysis.variantStatus,
    actionPlan: analysis.actionPlan
  };
}

// Comprehensive biomarker analysis function
function getComprehensiveBiomarkerAnalysis(name: string, value: number, unit: string) {
  const biomarker = (healthDB.biomarkers as any[]).find(b => b.name.toLowerCase() === name.toLowerCase());
  if (!biomarker) {
    return {
      description: `${name} is an important health biomarker. Reference information not found in database.`,
      referenceRange: 'N/A',
      status: 'Unknown',
      statusColor: 'blue',
      interpretation: 'No reference data – value recorded for tracking.',
      recommendations: [],
      actionPlan: 'Discuss this result with your healthcare provider for personalised guidance.'
    };
  }

  const [lowRef, highRef] = biomarker.optimal_range;
  let status = 'Optimal';
  let statusColor = 'green';
  let section = null;
  if (value < lowRef) {
    status = 'Low';
    statusColor = 'orange';
    section = biomarker.low;
  } else if (value > highRef) {
    status = 'High';
    statusColor = 'orange';
    section = biomarker.high;
  }

  const recommendations: string[] = [];
  const symptoms: string[] = [];
  if (section) {
    recommendations.push(...(section.lifestyle_recommendations || []));
    recommendations.push(...(section.supplement_recommendations || []));
    if (section.symptom_recommendations) symptoms.push(...section.symptom_recommendations);
  }

  const description = section?.description || `Your ${biomarker.name} level is within the optimal range, supporting healthy physiological function.`;

  const inRangeStatus = status === 'Optimal' ? '✅ Within optimal range' : status === 'Low' ? '⚠️ Below optimal' : '⚠️ Above optimal';

  return {
    description,
    referenceRange: `Optimal: ${lowRef}-${highRef} ${biomarker.unit}`,
    status,
    statusColor,
    interpretation: description,
    whatItDoes: biomarker.impact || `${biomarker.name} is a key biomarker involved in overall wellness.`,
    recommendations,
    symptoms,
    inRangeStatus,
    actionPlan: status === 'Optimal' ? 'Maintain your healthy habits to keep levels within range.' : 'Follow the recommendations above and retest in 8-12 weeks.'
  };
}

// Comprehensive SNP analysis function
function getComprehensiveSNPAnalysis(gene: string, rsid: string, genotype: string) {
  const snp = (healthDB.snps as any[]).find(s => s.rsid === rsid || s.name.toLowerCase() === gene.toLowerCase());
  if (!snp) {
    return {
      description: 'Genetic variant not found in reference database.',
      riskLevel: 'Unknown',
      riskColor: 'blue',
      recommendations: [],
      variantStatus: 'Information unavailable'
    };
  }
  const variant = (snp.variants as any[]).find(v => v.genotype === genotype.toUpperCase());
  if (!variant) {
    return {
      description: 'No specific data for your genotype; standard healthy lifestyle advised.',
      riskLevel: 'Unknown',
      riskColor: 'blue',
      whatItDoes: snp.impact,
      recommendations: [],
      variantStatus: 'Genotype data not in database'
    };
  }

  const riskColorMap: any = { High: 'red', Medium: 'orange', Low: 'green' };
  const recommendations = [
    ...variant.lifestyle_recommendations,
    ...variant.dietary_recommendations,
    ...variant.supplement_recommendations
  ];

  return {
    description: variant.effect,
    variantEffect: variant.effect,
    functionalImpact: snp.impact,
    riskLevel: variant.risk_level,
    riskColor: riskColorMap[variant.risk_level] || 'blue',
    variantStatus: variant.risk_level === 'Low' ? '✅ Normal variant' : variant.risk_level === 'Medium' ? '⚠️ Moderate impact' : '❌ High impact',
    whatItDoes: snp.impact,
    recommendations,
    actionPlan: 'Implement the above recommendations and monitor related biomarkers/health outcomes.'
  };
}

// Helper function to format biomarker names
function formatBiomarkerName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // service role client for privileged DB operations (bypasses RLS for upsert)
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Get user's biomarkers
    const { data: biomarkers, error: biomarkersError } = await supabaseClient
      .from('user_biomarkers')
      .select('*')
      .eq('user_id', user.id)

    if (biomarkersError) {
      throw biomarkersError
    }

    // Get user's SNPs with supported SNP data
    const { data: snps, error: snpsError } = await supabaseClient
      .from('user_snps')
      .select(`*, supported_snps ( gene, rsid )`)
      .eq('user_id', user.id)

    if (snpsError) {
      throw snpsError
    }

    // Generate enhanced analyses
    const biomarkerAnalysis = biomarkers?.map(generateEnhancedBiomarkerAnalysis) || []
    const snpAnalysis = snps?.map(generateEnhancedSNPAnalysis) || []

    // Transform analyses into rows expected by user_comprehensive_analysis table
    const biomarkerRows = biomarkerAnalysis.map((b) => ({
      user_id: user.id,
      analysis_type: 'biomarker',
      item_id: b.name,
      analysis_data: b,
    }));

    const snpRows = snpAnalysis.map((s) => ({
      user_id: user.id,
      analysis_type: 'snp',
      item_id: s.name,
      analysis_data: s,
    }));

    const allRows = [...biomarkerRows, ...snpRows];

    // Upsert rows based on unique (user_id, analysis_type, item_id)
    const upsertClient = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? supabaseService : supabaseClient;

    const { error: upsertError } = await upsertClient
      .from('user_comprehensive_analysis')
      .upsert(allRows, { onConflict: 'user_id,analysis_type,item_id' });

    if (upsertError) {
      throw upsertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        biomarkerCount: biomarkerAnalysis.length,
        snpCount: snpAnalysis.length,
        message: 'Comprehensive analysis completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Comprehensive analysis error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to generate comprehensive analysis'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 