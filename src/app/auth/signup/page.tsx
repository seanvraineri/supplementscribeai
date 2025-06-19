'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { extractReferralFromUrl, storeReferralCode } from '@/lib/referral-utils'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Handle referral code from URL parameter
  useEffect(() => {
    const urlReferralCode = extractReferralFromUrl()
    if (urlReferralCode) {
      setReferralCode(urlReferralCode)
      storeReferralCode(urlReferralCode)
    }
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        // Store referral code for use during onboarding
        if (referralCode) {
          storeReferralCode(referralCode)
        }
        
        setMessage('Account created successfully! Redirecting to onboarding...')
        // Use Next.js router for proper navigation
        setTimeout(() => {
          router.push('/onboarding')
        }, 1000)
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-background p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-background via-dark-panel/20 to-dark-background"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-dark-panel border-dark-border shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-dark-primary tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-dark-secondary text-lg">
            Join SupplementScribe for personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-dark-primary tracking-wide">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 px-4 text-base bg-dark-background border-dark-border text-dark-primary placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-dark-primary tracking-wide">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 px-4 text-base bg-dark-background border-dark-border text-dark-primary placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-dark-primary tracking-wide">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 px-4 text-base bg-dark-background border-dark-border text-dark-primary placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/20 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="referralCode" className="text-sm font-semibold text-dark-primary tracking-wide">
                Referral Code <span className="text-dark-secondary font-normal">(Optional)</span>
              </label>
              <Input
                id="referralCode"
                type="text"
                placeholder="Enter referral code (e.g., SUPP87A9)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="h-12 px-4 text-base bg-dark-background border-dark-border text-dark-primary placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/20 transition-all duration-200"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-dark-accent hover:bg-dark-accent/90 text-dark-background transition-all duration-200" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.includes('Check your email') 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center pt-4 border-t border-dark-border">
            <p className="text-sm text-dark-secondary">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-dark-accent hover:text-dark-accent/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 