'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link'
import AuthDebugger from '@/components/AuthDebugger'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)
    console.log('Attempting to sign in user:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    setIsLoading(false)
    
    if (!error) {
      console.log('Sign in successful for:', email, 'Redirecting to onboarding.')
      router.push('/onboarding')
    } else {
      console.error('Sign in error:', error.message)
      setMessage(`Sign in failed: ${error.message}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back to <span className="text-blue-600">SupplementScribe</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Sign in to access your personalized supplement recommendations
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {message && (
              <div className="p-3 rounded-lg text-sm bg-red-100 text-red-700">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-300"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Get started here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <AuthDebugger />
    </div>
  )
} 