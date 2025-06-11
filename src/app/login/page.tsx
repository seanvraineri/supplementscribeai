'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.refresh()
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.refresh()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          SupplementScribe Login
        </h1>
        <div className="flex flex-col w-full max-w-sm">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 p-2 border rounded"
          />
          <div className="flex justify-between">
            <button onClick={handleSignUp} className="p-2 bg-green-500 text-white rounded">
              Sign Up
            </button>
            <button onClick={handleSignIn} className="p-2 bg-blue-500 text-white rounded">
              Sign In
            </button>
          </div>
          <button onClick={handleSignOut} className="mt-4 p-2 bg-red-500 text-white rounded">
            Sign Out
          </button>
        </div>
      </main>
    </div>
  )
} 