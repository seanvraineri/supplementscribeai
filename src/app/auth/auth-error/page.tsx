'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-background p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-background via-dark-panel/20 to-dark-background"></div>
      
      <div className="max-w-md w-full bg-dark-panel border border-dark-border rounded-2xl shadow-2xl p-8 text-center relative z-10">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-dark-primary mb-4 tracking-tight">Authentication Error</h1>
          <p className="text-dark-secondary text-base leading-relaxed">
            There was a problem with your authentication. This could be due to an expired link or invalid credentials.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full h-12 text-base font-semibold bg-dark-accent hover:bg-dark-accent/90 text-dark-background">
            <Link href="/login">
              Try Signing In Again
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full h-12 text-base font-semibold bg-transparent border-dark-border text-dark-primary hover:bg-dark-border hover:text-dark-primary">
            <Link href="/auth/signup">
              Create New Account
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-border">
          <p className="text-sm text-dark-secondary">
            Need help?{' '}
            <Link href="/contact" className="font-semibold text-dark-accent hover:text-dark-accent/80 transition-colors">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 