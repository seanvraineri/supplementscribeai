import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting comprehensive analysis request...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    console.log('Supabase client created, checking auth...')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return new Response(JSON.stringify({ error: 'Authentication failed', details: authError.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    if (!user) {
      console.log('No user found')
      return new Response(JSON.stringify({ error: 'Unauthorized - no user' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`User authenticated: ${user.id}`)

    // Read pre-computed analysis from database
    console.log('Fetching stored analysis...')
    const { data: storedAnalysis, error } = await supabaseClient
      .from('user_comprehensive_analysis')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error fetching stored analysis:', error)
      return new Response(JSON.stringify({ 
        error: 'Database error', 
        details: error.message,
        biomarkerAnalysis: [],
        snpAnalysis: []
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Found ${storedAnalysis?.length || 0} stored analysis items`)

    // Organize data by type
    const biomarkerAnalysis: any[] = []
    const snpAnalysis: any[] = []

    storedAnalysis?.forEach(item => {
      if (item.analysis_type === 'biomarker') {
        biomarkerAnalysis.push(item.analysis_data)
      } else if (item.analysis_type === 'snp') {
        snpAnalysis.push(item.analysis_data)
      }
    })

    console.log(`Organized: ${biomarkerAnalysis.length} biomarkers, ${snpAnalysis.length} SNPs`)

    // If no stored analysis exists, check if user has any data to analyze
    if (!storedAnalysis || storedAnalysis.length === 0) {
      console.log('No stored analysis found, checking for user data...')
      
      // Check if user has biomarkers or SNPs to analyze
      const { data: biomarkers } = await supabaseClient
        .from('user_biomarkers')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      const { data: snps } = await supabaseClient
        .from('user_snps')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      const hasData = (biomarkers && biomarkers.length > 0) || (snps && snps.length > 0)
      
      if (!hasData) {
        console.log('No user data found to analyze')
        return new Response(JSON.stringify({
          biomarkerAnalysis: [],
          snpAnalysis: [],
          message: 'No biomarker or genetic data found. Upload your lab results or genetic test to get analysis.',
          totalItems: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('User has data but no analysis, triggering computation...')
      
      // Trigger the compute function (but don't wait for it)
      try {
        // Fire and forget - don't await this
        supabaseClient.functions.invoke('compute-comprehensive-analysis', {
          headers: {
            Authorization: req.headers.get('Authorization')!,
          }
        }).catch(err => console.error('Background computation error:', err))
        
        console.log('Computation triggered in background')
        
        // Return a response indicating computation is in progress
        return new Response(JSON.stringify({ 
          computing: true,
          message: 'Analysis is being computed. Please refresh in a moment.',
          biomarkerAnalysis: [],
          snpAnalysis: [],
          totalItems: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } catch (computeError) {
        console.error('Error triggering computation:', computeError)
        // Don't fail the request if computation trigger fails
        return new Response(JSON.stringify({ 
          computing: false,
          message: 'Analysis will be computed on next data upload.',
          biomarkerAnalysis: [],
          snpAnalysis: [],
          totalItems: 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    console.log('Returning stored analysis')
    return new Response(JSON.stringify({
      biomarkerAnalysis,
      snpAnalysis,
      lastUpdated: storedAnalysis[0]?.updated_at,
      totalItems: storedAnalysis.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Comprehensive analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    console.error('Error stack:', errorStack)
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      biomarkerAnalysis: [],
      snpAnalysis: [],
      totalItems: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}) 