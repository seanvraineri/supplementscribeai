'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function AuthDebugger() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // Check current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        // Test API endpoint
        let apiTest = null
        try {
          const response = await fetch('/api/test-auth', {
            credentials: 'include'
          })
          apiTest = {
            status: response.status,
            data: await response.json()
          }
        } catch (error: any) {
          apiTest = { error: error.message }
        }

        setAuthState({
          session: session ? {
            access_token: session.access_token ? 'Present' : 'Missing',
            refresh_token: session.refresh_token ? 'Present' : 'Missing',
            expires_at: session.expires_at,
            user_id: session.user?.id
          } : null,
          sessionError: sessionError?.message,
          user: user ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at
          } : null,
          userError: userError?.message,
          apiTest,
          timestamp: new Date().toISOString()
        })
      } catch (error: any) {
        setAuthState({ error: error.message })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      checkAuth()
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading auth state...</div>

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md text-xs font-mono z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-96">
        {JSON.stringify(authState, null, 2)}
      </pre>
    </div>
  )
} 