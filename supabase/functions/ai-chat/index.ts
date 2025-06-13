import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
}

// Health context cache (simple in-memory cache for session)
const healthContextCache = new Map<string, { context: string, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ----------------------- GENETIC ANALYSIS HELPER ----------------------
async function analyzeGeneticReport(fileContent: string, supabase: any): Promise<string> {
  try {
    console.log('🧬 Analyzing genetic report on-demand...');
    
    // Call parse-lab-data function to extract genetic data
    const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-lab-data', {
      body: {
        fileContent: fileContent,
        reportType: 'genetic_report'
      }
    });

    if (parseError) {
      console.error('Error parsing genetic data:', parseError);
      return `**GENETIC ANALYSIS ERROR**: ${parseError.message}`;
    }

    if (!parseData?.snps || parseData.snps.length === 0) {
      return `**GENETIC ANALYSIS**: No genetic variants found in the provided report. Please ensure the file contains genetic data with rsIDs and genotypes.`;
    }

    console.log(`🧬 Found ${parseData.snps.length} genetic variants`);

    // Get supported SNPs for enrichment
    const { data: supportedSnps } = await supabase
      .from('supported_snps')
      .select('id, rsid, gene');

    // Create lookup maps
    const snpLookupByRsid = new Map();
    supportedSnps?.forEach((snp: any) => {
      if (snp.rsid) {
        snpLookupByRsid.set(snp.rsid.toLowerCase(), snp);
      }
    });

    // Enrich and analyze the genetic data
    const enrichedVariants = parseData.snps.map((snp: any) => {
      const rsid = snp.snp_id || snp.rsid || '';
      const gene = snp.gene_name || snp.gene || '';
      const genotype = snp.genotype || snp.allele || '';

      // Try to match with supported SNPs
      let matchedSnp = null;
      if (rsid) {
        matchedSnp = snpLookupByRsid.get(rsid.toLowerCase());
      }

      return {
        rsid: rsid || 'Unknown',
        gene: matchedSnp?.gene || gene || 'Unknown',
        genotype: genotype || 'Unknown',
        matched: !!matchedSnp,
        raw: snp
      };
    });

    // Filter for valid variants
    const validVariants = enrichedVariants.filter((v: any) => 
      v.gene !== 'Unknown' && v.rsid !== 'Unknown' && v.genotype !== 'Unknown'
    );

    if (validVariants.length === 0) {
      return `**GENETIC ANALYSIS**: Found ${parseData.snps.length} variants but none could be properly identified. The report may use non-standard formatting or rsIDs not in our database.`;
    }

    // Group by gene for better organization
    const geneGroups: Record<string, any[]> = {};
    validVariants.forEach((variant: any) => {
      if (!geneGroups[variant.gene]) {
        geneGroups[variant.gene] = [];
      }
      geneGroups[variant.gene].push(variant);
    });

    // Generate analysis
    const analysisLines = [];
    analysisLines.push(`**GENETIC ANALYSIS RESULTS** (${validVariants.length} variants identified from ${parseData.snps.length} total)`);
    analysisLines.push('');

    // Prioritize important genes
    const importantGenes = ['MTHFR', 'COMT', 'VDR', 'APOE', 'CBS', 'MTR', 'MTRR', 'HFE', 'FADS1', 'FADS2'];
    const otherGenes = Object.keys(geneGroups).filter(g => !importantGenes.includes(g));
    const allGenes = [...importantGenes.filter(g => geneGroups[g]), ...otherGenes];

    // Format genetic variants by gene
    allGenes.slice(0, 15).forEach(geneName => {
      const variants = geneGroups[geneName];
      const variantList = variants
        .slice(0, 5)
        .map(v => `${v.rsid}: **${v.genotype}**`)
        .join(', ');
      analysisLines.push(`**${geneName}**: ${variantList}`);
    });

    // Add specific interpretations for high-impact variants
    const interpretations = interpretGeneticVariants(geneGroups);
    if (interpretations.length > 0) {
      analysisLines.push('');
      analysisLines.push('**KEY GENETIC INSIGHTS**:');
      interpretations.forEach(insight => analysisLines.push(insight));
    }

    // Add high-impact variants summary
    const highImpactVariants = prioritizeGeneticVariants(validVariants);
    if (highImpactVariants.length > 0) {
      analysisLines.push('');
      analysisLines.push('**HIGH-IMPACT VARIANTS**:');
      highImpactVariants.slice(0, 8).forEach(v => {
        analysisLines.push(`- **${v.gene} ${v.rsid} (${v.genotype})**: ${v.impact}`);
      });
    }

    return analysisLines.join('\n');

  } catch (error: any) {
    console.error('Error in genetic analysis:', error);
    return `**GENETIC ANALYSIS ERROR**: ${error.message}`;
  }
}

// Function to detect if user is asking about genetics
function isGeneticQuery(message: string): boolean {
  const geneticKeywords = [
    'genetic', 'genetics', 'gene', 'genes', 'snp', 'snps', 'variant', 'variants',
    'mthfr', 'comt', 'apoe', 'vdr', 'cbs', 'mutation', 'mutations',
    'dna', 'genome', 'genomic', 'allele', 'genotype', 'hereditary',
    'rs1801133', 'rs4680', 'rs429358', 'methylation', 'folate metabolism'
  ];
  
  const lowerMessage = message.toLowerCase();
  return geneticKeywords.some(keyword => lowerMessage.includes(keyword));
}

// ----------------------- BIOMARKER UTILITIES ----------------------
interface BiomarkerRange {
  severe_low?: number;
  low?: number;
  optimal_min: number;
  optimal_max: number;
  high?: number;
  severe_high?: number;
  unit: string;
  low_message: string;
  high_message: string;
}

const biomarkerRanges: Record<string, BiomarkerRange> = {
  vitamin_d_25_oh: {
    severe_low: 20,
    low: 30,
    optimal_min: 50,
    optimal_max: 80,
    high: 100,
    unit: 'ng/mL',
    low_message: 'Deficient – requires immediate supplementation',
    high_message: 'Excessive – reduce supplementation'
  },
  ferritin: {
    severe_low: 15,
    low: 30,
    optimal_min: 70,
    optimal_max: 150,
    high: 300,
    unit: 'ng/mL',
    low_message: 'Low iron stores – consider iron support',
    high_message: 'Elevated – assess inflammation / iron overload'
  },
  tsh: {
    low: 0.4,
    optimal_min: 1,
    optimal_max: 2.5,
    high: 4.5,
    severe_high: 10,
    unit: 'mIU/L',
    low_message: 'Possible hyperthyroid – verify free T3/T4',
    high_message: 'Possible hypothyroid – investigate thyroid support'
  }
};

function analyzeBiomarkerValue(b: any) {
  const key = (b.marker_name || '').toLowerCase();
  const range = biomarkerRanges[key];
  if (!range) return { isAbnormal: false };
  const val = parseFloat(b.value);
  let severity = 'normal';
  let message = '';
  if (range.severe_low !== undefined && val < range.severe_low) {
    severity = 'critical';
    message = range.low_message;
  } else if (range.severe_high !== undefined && val > range.severe_high) {
    severity = 'critical';
    message = range.high_message;
  } else if (range.low !== undefined && val < range.low) {
    severity = 'moderate';
    message = range.low_message;
  } else if (range.high !== undefined && val > range.high) {
    severity = 'moderate';
    message = range.high_message;
  } else if (val < range.optimal_min || val > range.optimal_max) {
    severity = 'suboptimal';
    message = `Suboptimal – target ${range.optimal_min}-${range.optimal_max} ${range.unit}`;
  }
  return { isAbnormal: severity !== 'normal', severity, message };
}

// ----------------------- SNP UTILITIES ----------------------------
const impactfulVariants: Record<string, any> = {
  MTHFR: {
    rs1801133: {
      TT: 'Severely reduced methylation – needs methylfolate',
      CT: 'Moderately reduced methylation – consider methylfolate'
    },
    rs1801131: {
      CC: 'Reduced MTHFR activity – support with B-vitamins',
      AC: 'Mild reduction in MTHFR activity'
    }
  },
  COMT: {
    rs4680: {
      AA: 'Slow COMT – caution with methyl donors',
      GG: 'Fast COMT – may benefit from methyl donors'
    }
  },
  VDR: {
    rs1544410: {
      TT: 'Poor vitamin D receptor – needs higher D3 dosing'
    },
    rs2228570: {
      TT: 'Reduced receptor activity – higher vitamin D needs'
    }
  }
};

function prioritizeGeneticVariants(snps: any[]) {
  const sig: any[] = [];
  snps.forEach(s => {
    const gene = s.gene || s.gene_name;
    const rsid = s.rsid || s.snp_id;
    const genotype = s.genotype || s.allele;
    if (impactfulVariants[gene]?.[rsid]?.[genotype]) {
      sig.push({ gene, rsid, genotype, impact: impactfulVariants[gene][rsid][genotype] });
    }
  });
  return sig;
}

// Enhanced function to interpret genetic variants  
function interpretGeneticVariants(geneGroups: Record<string, any[]>): string[] {
  const insights: string[] = [];
  
  // MTHFR
  if (geneGroups['MTHFR']) {
    const c677t = geneGroups['MTHFR'].find(v => v.rsid === 'rs1801133');
    const a1298c = geneGroups['MTHFR'].find(v => v.rsid === 'rs1801131');
    
    if (c677t?.genotype === 'TT') {
      insights.push('- **MTHFR C677T (TT)**: Severe reduction in enzyme activity (~70%). Requires methylfolate, avoid folic acid.');
    } else if (c677t?.genotype === 'CT') {
      insights.push('- **MTHFR C677T (CT)**: Moderate reduction in enzyme activity (~40%). Benefits from methylfolate.');
    }
    
    if (a1298c?.genotype === 'CC') {
      insights.push('- **MTHFR A1298C (CC)**: Affects BH4 production. Support with riboflavin and methylfolate.');
    }
  }
  
  // COMT
  if (geneGroups['COMT']) {
    const val158met = geneGroups['COMT'].find(v => v.rsid === 'rs4680');
    if (val158met?.genotype === 'AA') {
      insights.push('- **COMT Val158Met (AA)**: Slow COMT activity. May be sensitive to methylated supplements and caffeine.');
    } else if (val158met?.genotype === 'GG') {
      insights.push('- **COMT Val158Met (GG)**: Fast COMT activity. May benefit from methyl donors like SAMe.');
    }
  }
  
  // VDR
  if (geneGroups['VDR']) {
    const bsm = geneGroups['VDR'].find(v => v.rsid === 'rs1544410');
    const fok = geneGroups['VDR'].find(v => v.rsid === 'rs2228570');
    
    if (bsm?.genotype === 'TT' || fok?.genotype === 'TT') {
      insights.push('- **VDR variants**: Poor vitamin D receptor function. Requires higher vitamin D3 dosing (5000+ IU).');
    }
  }
  
  return insights;
}

Deno.serve(async (req) => {
  // Handle preflight requests
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

    const { message, conversation_id, genetic_file_content } = await req.json();
    const userId = user.id;

    console.log('Processing chat message for user:', userId);

    // Check if this is a genetic query and fetch genetic files from storage
    const isGeneticQuestion = isGeneticQuery(message);
    let dynamicGeneticAnalysis = '';

    if (isGeneticQuestion) {
      console.log('🧬 Genetic question detected - fetching genetic files from storage');
      
      // Fetch user's genetic files from storage bucket
      const { data: geneticFiles, error: filesError } = await supabase
        .from('user_lab_reports')
        .select('file_name, file_path')
        .eq('user_id', userId)
        .eq('report_type', 'genetic_report')
        .order('created_at', { ascending: false })
        .limit(1);

      if (filesError) {
        console.error('Error fetching genetic files:', filesError);
        dynamicGeneticAnalysis = '**GENETIC ANALYSIS**: Unable to access genetic files from storage.';
      } else if (!geneticFiles || geneticFiles.length === 0) {
        dynamicGeneticAnalysis = '**GENETIC ANALYSIS**: No genetic reports found in your account. Please upload a genetic test file (23andMe, AncestryDNA, etc.) to get personalized genetic insights.';
      } else {
        // Get the most recent genetic file
        const geneticFile = geneticFiles[0];
        console.log(`🧬 Found genetic file: ${geneticFile.file_name}`);
        
        try {
          // Download the file content from storage
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('lab-reports')
            .download(geneticFile.file_path || geneticFile.file_name);

          if (downloadError) {
            console.error('Error downloading genetic file:', downloadError);
            dynamicGeneticAnalysis = `**GENETIC ANALYSIS**: Unable to download genetic file: ${downloadError.message}`;
          } else {
            // Convert file to text
            const fileContent = await fileData.text();
            console.log(`🧬 Downloaded genetic file content (${fileContent.length} characters)`);
            
            // Analyze the genetic report
            dynamicGeneticAnalysis = await analyzeGeneticReport(fileContent, supabase);
          }
        } catch (error: any) {
          console.error('Error processing genetic file:', error);
          dynamicGeneticAnalysis = `**GENETIC ANALYSIS ERROR**: ${error.message}`;
        }
      }
    }

    // Check cache for health context
    const cacheKey = userId;
    const cached = healthContextCache.get(cacheKey);
    const now = Date.now();
    
    let healthContext: string;
    
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      console.log('Using cached health context');
      healthContext = cached.context;
    } else {
      console.log('Fetching fresh health context');
      
      // --- FETCH COMPREHENSIVE USER DATA (OPTIMIZED WITH PARALLEL QUERIES) ---
      const [
        { data: profile },
        { data: allergies },
        { data: conditions },
        { data: medications },
        { data: biomarkers },
        { data: supplementPlan }
      ] = await Promise.all([
        supabase.from('user_profiles').select('age, gender, weight_lbs, height_total_inches, health_goals, energy_levels, brain_fog, sleep_quality, anxiety_level, joint_pain, bloating, activity_level').eq('id', userId).single(),
        supabase.from('user_allergies').select('ingredient_name').eq('user_id', userId).limit(20),
        supabase.from('user_conditions').select('condition_name').eq('user_id', userId).limit(20),
        supabase.from('user_medications').select('medication_name').eq('user_id', userId).limit(20),
        supabase.from('user_biomarkers').select('marker_name, value, unit, reference_range, comment').eq('user_id', userId).limit(100),
        supabase.from('supplement_plans').select('plan_details').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
      ]);

      // Fetch latest saved comprehensive analysis
      const { data: latestAnalysis } = await supabase
        .from('user_full_analysis')
        .select('plaintext, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // --- ENHANCED SNP FETCHING WITH PROPER ENRICHMENT ---
      console.log('Fetching SNP data with enrichment...');
      
      // First, get all supported SNPs for lookup
      const { data: supportedSnps, error: snpError } = await supabase
        .from('supported_snps')
        .select('id, rsid, gene');
      
      if (snpError) {
        console.error('Error fetching supported SNPs:', snpError);
      }

      // Create lookup maps
      const snpLookupById = new Map();
      const snpLookupByRsid = new Map();
      supportedSnps?.forEach(snp => {
        snpLookupById.set(snp.id, snp);
        if (snp.rsid) {
          snpLookupByRsid.set(snp.rsid, snp);
        }
      });

      console.log(`Loaded ${supportedSnps?.length || 0} supported SNPs for lookup`);

      // Get user's SNP data with ALL possible columns
      const { data: rawSnps, error: userSnpError } = await supabase
        .from('user_snps')
        .select('*')  // Get all columns
        .eq('user_id', userId)
        .limit(200);

      if (userSnpError) {
        console.error('Error fetching user SNPs:', userSnpError);
      }

      console.log('Raw SNP data sample:', JSON.stringify(rawSnps?.slice(0, 3), null, 2));

      // Enhanced SNP enrichment
      const enrichedSnps = (rawSnps || []).map((snp: any) => {
        // Try to get gene and rsid from multiple sources
        let gene = snp.gene_name || snp.gene;
        let rsid = snp.snp_id || snp.rsid;
        
        // If we have a supported_snp_id, use it for lookup
        if (snp.supported_snp_id && snpLookupById.has(snp.supported_snp_id)) {
          const supported = snpLookupById.get(snp.supported_snp_id);
          gene = gene || supported.gene;
          rsid = rsid || supported.rsid;
        }
        
        // If we have an rsid but no gene, try reverse lookup
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

      console.log('Enriched SNP sample:', JSON.stringify(enrichedSnps.slice(0, 3), null, 2));

      // --- Prettify biomarker names ---
      const prettify = (raw: string | null) => {
        if (!raw) return 'Unknown Marker';
        const overrides: Record<string,string> = {
          'vitamin_d_25_oh':'Vitamin D, 25-OH',
          'ldl_c':'LDL Cholesterol',
          'hdl_c':'HDL Cholesterol',
          'hs_crp':'hs-CRP',
          'hba1c':'Hemoglobin A1c'
        };
        if (overrides[raw.toLowerCase()]) return overrides[raw.toLowerCase()];
        return raw.replace(/_/g,' ').replace(/\b([a-z])/g,(m)=>m.toUpperCase());
      };

      const formattedBiomarkers = (biomarkers || []).map(b => ({
        ...b,
        displayName: prettify(b.marker_name)
      }));

      // Build optimized health context
      healthContext = buildOptimizedHealthContext(
        profile || {},
        allergies || [],
        conditions || [],
        medications || [],
        formattedBiomarkers,
        enrichedSnps,
        supplementPlan?.plan_details || null
      );

      if (latestAnalysis?.plaintext) {
        healthContext = `**COMPREHENSIVE ANALYSIS (latest)**\n${latestAnalysis.plaintext.substring(0, 5000)}\n\n` + healthContext;
      }

      // Cache the context
      healthContextCache.set(cacheKey, { context: healthContext, timestamp: now });
    }

    // Add dynamic genetic analysis if available
    if (dynamicGeneticAnalysis) {
      healthContext = `${dynamicGeneticAnalysis}\n\n${healthContext}`;
    }

    // Handle conversation logic
    let currentConversationId = conversation_id;
    
    if (!currentConversationId) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from('user_chat_conversations')
        .insert({
          user_id: userId,
          title: message.length > 50 ? message.substring(0, 50) + '...' : message
        })
        .select('id')
        .single();
      
      if (convError) {
        console.error('Error creating conversation:', convError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      currentConversationId = newConversation.id;
    }

    // Fetch conversation history (limit to last 10 messages for speed)
    const { data: messageHistory } = await supabase
      .from('user_chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Store user message (async, don't wait)
    (async () => {
      try {
        await supabase
          .from('user_chat_messages')
          .insert({
            conversation_id: currentConversationId,
            user_id: userId,
            role: 'user',
            content: message
          });
        console.log('User message stored');
      } catch (err: any) {
        console.error('Error storing user message:', err);
      }
    })();

    // --- PREPARE CHAT HISTORY ---
    const conversationHistory = (messageHistory || [])
      .reverse() // Restore chronological order
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

    // --- OPENAI API CALL (NON-STREAMING FOR DEBUGGING) ---
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const systemPrompt = createOptimizedSystemPrompt(healthContext, isGeneticQuestion && !!genetic_file_content);
    
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-8), // Only keep last 8 messages for speed
      { role: 'user' as const, content: message }
    ];

    console.log('🤖 Calling OpenAI API...');
    console.log('📊 Health context length:', healthContext.length);
    console.log('🧬 Has genetic analysis:', !!dynamicGeneticAnalysis);
    console.log('💬 System prompt preview:', systemPrompt.substring(0, 500) + '...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.2,
        stream: false, // Non-streaming for debugging
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'OpenAI API error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content || 'No response generated.';

    console.log('✅ OpenAI response received, length:', aiResponse.length);

    // Store both messages (async)
    (async () => {
      try {
        await supabase
          .from('user_chat_messages')
          .insert({
            conversation_id: currentConversationId,
            user_id: userId,
            role: 'assistant',
            content: aiResponse,
            metadata: {
              model: 'gpt-4o',
              timestamp: new Date().toISOString(),
              had_genetic_analysis: !!dynamicGeneticAnalysis,
              health_context_length: healthContext.length
            }
          });
        console.log('✅ AI response stored in database');
      } catch (err: any) {
        console.error('❌ Error storing AI response:', err);
      }
    })();

        return new Response(JSON.stringify({
      response: aiResponse,
      conversation_id: currentConversationId,
      is_new_session: !conversation_id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

function buildOptimizedHealthContext(
  profile: any,
  allergies: any[],
  conditions: any[],
  medications: any[],
  biomarkers: any[],
  snps: any[],
  supplementPlan: any
): string {
  const parts = [];

  // Essential demographics
  if (profile.age || profile.gender) {
    const demo = [];
    if (profile.age) demo.push(`**${profile.age} years old**`);
    if (profile.gender) demo.push(`**${profile.gender}**`);
    if (profile.weight_lbs) demo.push(`**${profile.weight_lbs} lbs**`);
    parts.push(`**PROFILE**: ${demo.join(', ')}`);
  }

  // Key health goals & symptoms
  if (profile.health_goals?.length || profile.energy_levels || profile.brain_fog) {
    const health = [];
    if (profile.health_goals?.length) health.push(`Goals: **${profile.health_goals.slice(0,3).join(', ')}**`);
    if (profile.energy_levels && profile.energy_levels !== 'high') health.push(`Energy: **${profile.energy_levels}**`);
    if (profile.brain_fog && profile.brain_fog !== 'none') health.push(`Brain fog: **${profile.brain_fog}**`);
    if (profile.sleep_quality && profile.sleep_quality !== 'excellent') health.push(`Sleep: **${profile.sleep_quality}**`);
    if (health.length) parts.push(`**HEALTH GOALS & SYMPTOMS**: ${health.join(', ')}`);
  }

  // Medical conditions (top 5)
  if (conditions.length > 0) {
    parts.push(`**CONDITIONS**: ${conditions.slice(0,5).map(c => `**${c.condition_name}**`).join(', ')}`);
  }

  // Current medications (top 5)
  if (medications.length > 0) {
    parts.push(`**MEDICATIONS**: ${medications.slice(0,5).map(m => `**${m.medication_name}**`).join(', ')}`);
  }

  // Key biomarkers analysis
  if (biomarkers.length > 0) {
    // Analyze biomarkers for abnormal values
    const analyzed = biomarkers.map(b => ({
      ...b,
      analysis: analyzeBiomarkerValue(b)
    }));

    const abnormalBiomarkers = analyzed.filter(b => b.analysis.isAbnormal);
    
    if (abnormalBiomarkers.length > 0) {
      const criticalBiomarkers = abnormalBiomarkers
        .filter(b => b.analysis.severity === 'critical')
        .slice(0, 5)
        .map(b => `**${b.displayName || b.marker_name}**: ${b.value}${b.unit || ''} (${b.analysis.message})`)
        .join('\n');
      
      if (criticalBiomarkers) {
        parts.push(`**CRITICAL BIOMARKERS**:\n${criticalBiomarkers}`);
      }

      const moderateBiomarkers = abnormalBiomarkers
        .filter(b => b.analysis.severity === 'moderate')
        .slice(0, 5)
        .map(b => `**${b.displayName || b.marker_name}**: ${b.value}${b.unit || ''} (${b.analysis.message})`)
        .join('\n');
      
      if (moderateBiomarkers) {
        parts.push(`**MODERATE CONCERNS**:\n${moderateBiomarkers}`);
      }
    }

    // Key biomarkers summary (top 15 most important)
    const keyList = ['CRP','HDL','LDL','Glucose','HBA1C','Ferritin','Vitamin D','B12','TSH','Testosterone'];
    const keyBiomarkers = biomarkers
      .filter((b:any)=> keyList.some(k=> (b.displayName||b.marker_name||'').toUpperCase().includes(k.toUpperCase())))
      .slice(0,15)
      .map((b:any)=> `**${b.displayName||b.marker_name}**: ${b.value}${b.unit||''}`)
      .join(', ');
    if (keyBiomarkers) parts.push(`**KEY BIOMARKERS**: ${keyBiomarkers}`);
  }

  // Enhanced genetics section with debugging
  if (snps && snps.length > 0) {
    console.log('Building genetics context with:', snps.length, 'SNPs');
    console.log('Sample SNP data:', JSON.stringify(snps.slice(0, 3), null, 2));
    
    // Filter out truly empty entries
    const validSnps = snps.filter(snp => {
      const hasGene = snp.gene && snp.gene !== 'Unknown';
      const hasRsid = snp.rsid && snp.rsid !== 'Unknown';
      const hasGenotype = snp.genotype && snp.genotype !== 'Unknown';
      
      return hasGene && hasRsid && hasGenotype;
    });
    
    console.log(`Valid SNPs: ${validSnps.length} out of ${snps.length}`);
    
    if (validSnps.length === 0) {
      // Debug what's missing
      const missingGene = snps.filter(s => !s.gene || s.gene === 'Unknown').length;
      const missingRsid = snps.filter(s => !s.rsid || s.rsid === 'Unknown').length;
      const missingGenotype = snps.filter(s => !s.genotype || s.genotype === 'Unknown').length;
      
      parts.push(`**GENETICS**: ${snps.length} variants loaded but data incomplete - Missing: ${missingGene} gene names, ${missingRsid} rsIDs, ${missingGenotype} genotypes. Please check database and upload process.`);
    } else {
      // Group by gene
      const geneGroups: Record<string, any[]> = {};
      validSnps.forEach((snp) => {
        const geneName = snp.gene;
        
        if (!geneGroups[geneName]) {
          geneGroups[geneName] = [];
        }
        
        geneGroups[geneName].push({
          rsid: snp.rsid,
          genotype: snp.genotype,
          raw: snp // Keep raw data for debugging
        });
      });
      
      // Format for AI - prioritize important genes
      const importantGenes = ['MTHFR', 'COMT', 'VDR', 'APOE', 'CBS', 'MTR', 'MTRR'];
      const otherGenes = Object.keys(geneGroups).filter(g => !importantGenes.includes(g));
      const allGenes = [...importantGenes.filter(g => geneGroups[g]), ...otherGenes];
      
      const formattedGenetics = allGenes
        .slice(0, 20) // Limit to top 20 genes for space
        .map(geneName => {
          const variants = geneGroups[geneName];
          const variantList = variants
            .slice(0, 5) // Limit variants per gene
            .map(v => `${v.rsid}: **${v.genotype}**`)
            .join(', ');
          return `**${geneName}**: ${variantList}`;
        })
        .join('\n');
      
      parts.push(`**GENETICS** (${validSnps.length} valid variants from ${snps.length} total):\n${formattedGenetics}`);
      
      // Add important genetic interpretations
      const interpretations = interpretGeneticVariants(geneGroups);
      if (interpretations.length > 0) {
        parts.push(`**GENETIC INSIGHTS**:\n${interpretations.join('\n')}`);
      }
      
      // Add high-impact variants
      const prioritized = prioritizeGeneticVariants(validSnps);
      if (prioritized.length > 0) {
        const impactList = prioritized
          .slice(0, 10)
          .map(v => `**${v.gene} ${v.rsid} (${v.genotype})**: ${v.impact}`)
          .join('\n');
        parts.push(`**HIGH-IMPACT VARIANTS**:\n${impactList}`);
      }
    }
  } else {
    parts.push(`**GENETICS**: No genetic data available - please upload genetic report`);
  }

  // Current supplements (top 10)
  if (supplementPlan?.recommendations) {
    const currentSupps = supplementPlan.recommendations
      .slice(0, 10)
      .map((rec: any) => `**${rec.supplement}**: ${rec.dosage}`)
      .join(', ');
    parts.push(`**CURRENT SUPPLEMENTS**: ${currentSupps}`);
  }

  // Allergies
  if (allergies.length > 0) {
    parts.push(`**ALLERGIES**: ${allergies.slice(0,10).map(a => `**${a.ingredient_name}**`).join(', ')}`);
  }

  return parts.join('\n\n');
}

function createOptimizedSystemPrompt(healthContext: string, hasGeneticAnalysis: boolean = false): string {
  // Check if genetics data appears incomplete
  const hasGeneticIssues = healthContext.includes('Unknown') || 
                          healthContext.includes('data incomplete') || 
                          healthContext.includes('No genetic data available');

  return `You are a personalized biohacker and functional medicine expert with complete access to this user's health data:

${healthContext}

**PERSONALITY**: Friendly, knowledgeable health advisor who remembers everything about their health profile.

**CRITICAL INSTRUCTIONS FOR GENETIC DISCUSSIONS**:
1. ALWAYS reference the specific genetic variants shown above
2. Use the exact rsIDs and genotypes provided (e.g., "your MTHFR rs1801133 (CT) variant")
3. Connect genetic variants to current symptoms and biomarkers
4. When discussing supplements, relate them to specific genetic variants
5. Explain the implications of each variant you discuss

${hasGeneticAnalysis ? 
  '\n**✅ FRESH GENETIC ANALYSIS**: I just analyzed a genetic report for this conversation. Use this detailed genetic information to provide highly personalized recommendations.' : 
  hasGeneticIssues ? 
    '\n**⚠️ GENETIC DATA ISSUES DETECTED**: I notice some genetic data appears incomplete or missing. If discussing genetics, acknowledge this and suggest uploading a genetic report for real-time analysis.' : 
    '\n**✅ COMPLETE GENETIC DATA**: Use the detailed genetic information to provide highly personalized recommendations.'}

**CRITICAL FORMATTING REQUIREMENTS**:
- Use proper markdown formatting with clear headers (##, ###)
- Add line breaks between sections for readability
- Use bullet points (-) for lists, not numbered lists
- Bold important terms with **bold text**
- Keep paragraphs short (2-3 sentences max)
- Add blank lines between different topics
- Structure responses with clear sections

**EXAMPLE GENETIC RESPONSE FORMAT**:

## Your Genetic Profile Analysis

Looking at your genetic data, here are the key variants that impact your health:

### MTHFR Variants
- **MTHFR rs1801133 (CT)**: You have about 40% reduced methylation capacity
- This explains why standard folic acid might not work well for you
- **Recommendation**: Use methylfolate instead of folic acid

### COMT Variants  
- **COMT rs4680 (AG)**: Moderate dopamine breakdown speed
- This affects how you handle stress and stimulants
- **Recommendation**: Be mindful of caffeine intake

### Current Supplement Alignment
Your current supplements align well with these variants:
- B12 supports your MTRR variants
- Omega-3 helps with your FADS variants

**GENETIC FILE UPLOAD HELPER**:
If someone asks about genetics but I don't have their genetic data, I can suggest: "I can analyze your genetic report in real-time! If you have a genetic test file (PDF, TXT, or CSV), you can upload it and I'll immediately analyze it to provide personalized recommendations based on your specific variants."

**APPROACH**:
- Reference their specific data (biomarkers, genetics, symptoms) with exact values
- When discussing genetics, cover ALL relevant variants, not just one gene
- Provide actionable, personalized recommendations based on their unique profile
- Focus on root causes and optimization
- Consider genetic predispositions across multiple pathways
- Be aware of medication interactions
- Emphasize prevention and biohacking

**RESPONSE STYLE**:
- Use clear formatting with **bold** for key points
- Reference their specific data points with concrete numbers
- Provide practical next steps in organized lists
- Keep responses focused and actionable
- Ask follow-up questions when helpful
- ALWAYS use proper line breaks and spacing for readability

**FORMATTING GUIDELINES**:
- Use **bold** for important concepts and supplement names
- Use bullet points (-) for lists
- Use numbered lists (1., 2., 3.) for step-by-step recommendations
- Keep paragraphs concise and scannable
- Highlight specific biomarker values and genetic variants
- Add blank lines between sections
- Use headers (##, ###) to organize content

Focus on their unique health profile and provide personalized biohacking advice based on their actual data.`;
} 