import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const userId = user.id;
    console.log('🔍 Debug for user:', userId);

    // ============= COMPREHENSIVE DATA ANALYSIS =============
    
    // 1. Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // 2. Check lab reports
    const { data: labReports, error: reportsError } = await supabase
      .from('user_lab_reports')
      .select('*')
      .eq('user_id', userId);

    // 3. Check biomarkers
    const { data: biomarkers, error: biomarkersError } = await supabase
      .from('user_biomarkers')
      .select('*')
      .eq('user_id', userId);

    // 4. Check SNPs with all columns  
    const { data: rawSnps, error: snpsError } = await supabase
      .from('user_snps')
      .select('*')
      .eq('user_id', userId);

    // 5. Check supported SNPs
    const { data: supportedSnps, error: supportedError } = await supabase
      .from('supported_snps')
      .select('id, rsid, gene')
      .limit(20);

    // 6. Check latest analysis
    const { data: latestAnalysis, error: analysisError } = await supabase
      .from('user_full_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    // 7. Test the SNP enrichment logic (same as in ai-chat)
    const snpLookupById = new Map();
    const snpLookupByRsid = new Map();
    supportedSnps?.forEach(snp => {
      snpLookupById.set(snp.id, snp);
      if (snp.rsid) {
        snpLookupByRsid.set(snp.rsid, snp);
      }
    });

    const enrichedSnps = (rawSnps || []).map((snp: any) => {
      let gene = snp.gene_name || snp.gene;
      let rsid = snp.snp_id || snp.rsid;
      
      if (snp.supported_snp_id && snpLookupById.has(snp.supported_snp_id)) {
        const supported = snpLookupById.get(snp.supported_snp_id);
        gene = gene || supported.gene;
        rsid = rsid || supported.rsid;
      }
      
      if (rsid && !gene && snpLookupByRsid.has(rsid)) {
        const supported = snpLookupByRsid.get(rsid);
        gene = supported.gene;
      }
      
      return {
        ...snp,
        gene: gene || 'Unknown',
        rsid: rsid || 'Unknown', 
        genotype: snp.genotype || snp.allele || 'Unknown'
      };
    });

    // 8. Analyze data quality
    const dataQuality = {
      profile: {
        exists: !!profile,
        hasBasicInfo: !!(profile?.age && profile?.gender)
      },
      labReports: {
        count: labReports?.length || 0,
        parsed: labReports?.filter(r => r.status === 'parsed').length || 0,
        failed: labReports?.filter(r => r.status === 'failed').length || 0
      },
      biomarkers: {
        total: biomarkers?.length || 0,
        withUnits: biomarkers?.filter(b => b.unit && b.unit !== 'not specified').length || 0,
        withRanges: biomarkers?.filter(b => b.reference_range).length || 0
      },
      snps: {
        total: rawSnps?.length || 0,
        matched: rawSnps?.filter(s => s.supported_snp_id).length || 0,
        unmatched: rawSnps?.filter(s => !s.supported_snp_id).length || 0,
        withGenes: enrichedSnps.filter(s => s.gene && s.gene !== 'Unknown').length,
        withRsids: enrichedSnps.filter(s => s.rsid && s.rsid !== 'Unknown').length,
        withGenotypes: enrichedSnps.filter(s => s.genotype && s.genotype !== 'Unknown').length,
        complete: enrichedSnps.filter(s => 
          s.gene && s.gene !== 'Unknown' && 
          s.rsid && s.rsid !== 'Unknown' && 
          s.genotype && s.genotype !== 'Unknown'
        ).length
      },
      analysis: {
        exists: !!(latestAnalysis && latestAnalysis.length > 0),
        hasPlaintext: !!(latestAnalysis && latestAnalysis.length > 0 && latestAnalysis[0]?.plaintext),
        lastUpdated: (latestAnalysis && latestAnalysis.length > 0) ? latestAnalysis[0]?.created_at : null
      }
    };

    // 9. Sample data for inspection
    const samples = {
      biomarkers: biomarkers?.slice(0, 5).map(b => ({
        name: b.marker_name,
        value: b.value,
        unit: b.unit,
        range: b.reference_range
      })) || [],
      rawSnps: rawSnps?.slice(0, 5).map(s => ({
        supported_snp_id: s.supported_snp_id,
        snp_id: s.snp_id,
        gene_name: s.gene_name,
        genotype: s.genotype,
        allele: s.allele
      })) || [],
      enrichedSnps: enrichedSnps.slice(0, 5).map(s => ({
        gene: s.gene,
        rsid: s.rsid,
        genotype: s.genotype,
        enriched: s.gene !== 'Unknown' && s.rsid !== 'Unknown'
      }))
    };

    // 10. Identify specific issues
    const issues = [];
    
    if (dataQuality.snps.total > 0 && dataQuality.snps.complete === 0) {
      issues.push({
        type: 'CRITICAL',
        category: 'SNP_DATA',
        message: 'All SNPs missing complete data (gene/rsid/genotype)',
        details: {
          total: dataQuality.snps.total,
          withGenes: dataQuality.snps.withGenes,
          withRsids: dataQuality.snps.withRsids,
          withGenotypes: dataQuality.snps.withGenotypes
        }
      });
    }

    if (dataQuality.snps.total > 0 && dataQuality.snps.matched === 0) {
      issues.push({
        type: 'WARNING',
        category: 'SNP_MATCHING',
        message: 'No SNPs matched with supported_snps table',
        suggestion: 'Check SNP ID formats and supported_snps table content'
      });
    }

    if (dataQuality.biomarkers.total > 0 && dataQuality.biomarkers.withUnits < dataQuality.biomarkers.total * 0.5) {
      issues.push({
        type: 'WARNING',
        category: 'BIOMARKER_UNITS',
        message: 'Many biomarkers missing units',
        details: {
          total: dataQuality.biomarkers.total,
          withUnits: dataQuality.biomarkers.withUnits
        }
      });
    }

    if (!dataQuality.analysis.exists && (dataQuality.biomarkers.total > 0 || dataQuality.snps.total > 0)) {
      issues.push({
        type: 'INFO',
        category: 'ANALYSIS',
        message: 'No saved analysis found - AI will build context dynamically',
        suggestion: 'Consider running analyze-study function to generate persistent analysis'
      });
    }

    // 11. Generate recommendations
    const recommendations = [];
    
    if (dataQuality.snps.total > 0 && dataQuality.snps.complete < dataQuality.snps.total * 0.3) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Fix SNP data enrichment',
        steps: [
          'Check supported_snps table has rsid and gene data',
          'Verify SNP ID formats in user uploads',
          'REMOVED: parse-lab-data function no longer exists',
          'Check user_snps table schema has snp_id and gene_name columns'
        ]
      });
    }

    if (dataQuality.biomarkers.total === 0 && dataQuality.snps.total === 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Upload health data',
        steps: [
          'Upload lab reports via onboarding',
          'Upload genetic reports',
          'Ensure files are being parsed correctly'
        ]
      });
    }

    if (!dataQuality.analysis.exists && dataQuality.biomarkers.total > 5 && dataQuality.snps.complete > 5) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Generate comprehensive analysis',
        steps: [
          'Run analyze-study function with health data',
          'This will create persistent memory for AI chat'
        ]
      });
    }

    // 12. Test context building
    const contextPreview = buildTestHealthContext(profile, biomarkers?.slice(0, 10) || [], enrichedSnps.slice(0, 10));

    const result = {
      userId,
      timestamp: new Date().toISOString(),
      dataQuality,
      samples,
      issues,
      recommendations,
      contextPreview: contextPreview.substring(0, 1000) + '...',
      errors: {
        profile: profileError?.message,
        labReports: reportsError?.message,
        biomarkers: biomarkersError?.message,
        snps: snpsError?.message,
        supported: supportedError?.message,
        analysis: analysisError?.message
      },
      summary: {
        overallHealth: issues.filter(i => i.type === 'CRITICAL').length === 0 ? 'GOOD' : 'NEEDS_ATTENTION',
        readyForAI: dataQuality.snps.complete > 0 && dataQuality.biomarkers.total > 0,
        dataCompleteness: Math.round(
          ((dataQuality.snps.complete / Math.max(1, dataQuality.snps.total)) * 0.5 +
           (dataQuality.biomarkers.withUnits / Math.max(1, dataQuality.biomarkers.total)) * 0.3 +
           (dataQuality.profile.hasBasicInfo ? 1 : 0) * 0.2) * 100
        )
      }
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Debug function error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

function buildTestHealthContext(profile: any, biomarkers: any[], snps: any[]): string {
  const parts = [];
  
  if (profile?.age) {
    parts.push(`**PROFILE**: ${profile.age} years old, ${profile.gender || 'unspecified gender'}`);
  }
  
  if (biomarkers?.length > 0) {
    const biomarkerList = biomarkers
      .slice(0, 5)
      .map(b => `${b.marker_name}: ${b.value}${b.unit || ''}`)
      .join(', ');
    parts.push(`**BIOMARKERS**: ${biomarkerList}`);
  }
  
  if (snps?.length > 0) {
    const validSnps = snps.filter(s => 
      s.gene && s.gene !== 'Unknown' && 
      s.rsid && s.rsid !== 'Unknown' && 
      s.genotype && s.genotype !== 'Unknown'
    );
    
    if (validSnps.length > 0) {
      const geneGroups: { [key: string]: any[] } = {};
      validSnps.forEach(snp => {
        if (!geneGroups[snp.gene]) geneGroups[snp.gene] = [];
        geneGroups[snp.gene].push(snp);
      });
      
      const geneticsList = Object.entries(geneGroups)
        .slice(0, 5)
        .map(([gene, variants]) => {
          const variantList = variants
            .slice(0, 3)
            .map(v => `${v.rsid}: ${v.genotype}`)
            .join(', ');
          return `${gene}: ${variantList}`;
        })
        .join(' | ');
      
      parts.push(`**GENETICS**: ${geneticsList}`);
    } else {
      parts.push(`**GENETICS**: ${snps.length} variants loaded but missing gene/rsid data`);
    }
  }
  
  return parts.join('\n\n');
} 