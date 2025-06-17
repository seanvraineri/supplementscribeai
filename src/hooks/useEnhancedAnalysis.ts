import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AnalysisResult {
  markerType: 'biomarker' | 'snp'
  name: string
  displayName: string
  userValue: string
  referenceRange?: string
  status: 'optimal' | 'borderline' | 'concerning'
  whyItMatters: string
  personalizedRisk?: string
  recommendations: {
    lifestyle: string
    supplement: string
  }
  evidenceLevel: 'strong' | 'moderate' | 'limited'
  category: string
}

interface CategoryStats {
  category: string
  total: number
  concerning: number
  borderline: number
  optimal: number
}

interface UserContext {
  age?: number
  sex?: string
  goals?: string
  hasConditions: boolean
  hasMedications: boolean
  hasAllergies: boolean
  totalBiomarkers: number
  totalSNPs: number
}

interface EnhancedAnalysisResponse {
  results: AnalysisResult[]
  resultsByCategory: Record<string, AnalysisResult[]>
  priorityItems: AnalysisResult[]
  categoryStats: CategoryStats[]
  userContext: UserContext
  summary: {
    totalAnalyzed: number
    concerningCount: number
    categoriesAnalyzed: number
  }
}

export function useEnhancedAnalysis() {
  const [data, setData] = useState<EnhancedAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      console.log('Calling enhanced-analysis function with session:', !!session)

      const { data: analysisData, error: functionError } = await supabase.functions.invoke('enhanced-analysis', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      })

      console.log('Function response:', { analysisData, functionError })
      console.log('Analysis data details:', analysisData)

      if (functionError) {
        throw new Error(`Analysis failed: ${functionError.message}`)
      }
      
      if (analysisData?.error) {
        throw new Error(analysisData.error)
      }

      console.log('Setting analysis data:', analysisData)
      setData(analysisData)
    } catch (err) {
      console.error('Enhanced analysis error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  return {
    results: data?.results || [],
    resultsByCategory: data?.resultsByCategory || {},
    priorityItems: data?.priorityItems || [],
    categoryStats: data?.categoryStats || [],
    userContext: data?.userContext || {
      hasConditions: false,
      hasMedications: false,
      hasAllergies: false,
      totalBiomarkers: 0,
      totalSNPs: 0
    },
    summary: data?.summary || {
      totalAnalyzed: 0,
      concerningCount: 0,
      categoriesAnalyzed: 0
    },
    loading,
    error,
    refetch: fetchAnalysis
  }
} 