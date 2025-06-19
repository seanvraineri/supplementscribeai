'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { isValidReferralCode } from '@/lib/referral-utils'

export default function ReferralRedirectPage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string

  useEffect(() => {
    // Validate the referral code
    if (code && isValidReferralCode(code)) {
      // Redirect to signup with referral code
      router.push(`/auth/signup?ref=${code}`)
    } else {
      // Invalid code, redirect to normal signup
      router.push('/auth/signup')
    }
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent mx-auto mb-4"></div>
        <p className="text-dark-secondary">Redirecting to signup...</p>
      </div>
    </div>
  )
} 