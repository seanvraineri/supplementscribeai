'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { extractReferralFromUrl, storeReferralCode } from '@/lib/referral-utils'
import { Users, X, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FamilyMember {
  name: string
  email: string
}

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showFamilyModal, setShowFamilyModal] = useState(false)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{ name: '', email: '' }])
  const [isCreatingFamily, setIsCreatingFamily] = useState(false)
  const [familyAdminId, setFamilyAdminId] = useState<string | null>(null)
  const [isJoiningFamily, setIsJoiningFamily] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Handle referral code and family invite from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlReferralCode = urlParams.get('ref')
    const familyAdmin = urlParams.get('family_admin_id')
    
    if (urlReferralCode) {
      setReferralCode(urlReferralCode)
      storeReferralCode(urlReferralCode)
    }
    
    if (familyAdmin) {
      setFamilyAdminId(familyAdmin)
      setIsJoiningFamily(true)
      console.log('👨‍👩‍👧‍👦 Joining family with admin ID:', familyAdmin)
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
        
        // Store family admin info if joining a family
        if (familyAdminId) {
          localStorage.setItem('familyJoin', JSON.stringify({
            familyAdminId: familyAdminId,
            isJoiningFamily: true
          }))
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

  const handleFamilySignUp = async () => {
    setIsCreatingFamily(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setIsCreatingFamily(false)
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setIsCreatingFamily(false)
      return
    }

    // Validate family members
    const validMembers = familyMembers.filter(member => member.name.trim() && member.email.trim())
    if (validMembers.length === 0) {
      setMessage('Please add at least one family member')
      setIsCreatingFamily(false)
      return
    }

    try {
      // Create the main account (family admin)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
        setIsCreatingFamily(false)
        return
      }

      // Store family setup info for use during onboarding
      localStorage.setItem('familySetup', JSON.stringify({
        isAdmin: true,
        familyMembers: validMembers,
        familySize: validMembers.length + 1 // +1 for the admin
      }))

      if (referralCode) {
        storeReferralCode(referralCode)
      }
      
      setMessage('Family account created! Redirecting to onboarding...')
      setTimeout(() => {
        router.push('/onboarding')
      }, 1000)

    } catch (error) {
      setMessage('An unexpected error occurred')
      setIsCreatingFamily(false)
    }
  }

  const addFamilyMember = () => {
    if (familyMembers.length < 8) { // Max 9 total (8 + admin)
      setFamilyMembers([...familyMembers, { name: '', email: '' }])
    }
  }

  const removeFamilyMember = (index: number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((_, i) => i !== index))
    }
  }

  const updateFamilyMember = (index: number, field: 'name' | 'email', value: string) => {
    const updated = familyMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    )
    setFamilyMembers(updated)
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

          {/* Family Plan Button */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dark-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-panel px-2 text-dark-secondary">or</span>
            </div>
          </div>

          <Button 
            onClick={() => setShowFamilyModal(true)}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-2 border-dark-accent/50 text-dark-accent hover:bg-dark-accent/10 hover:border-dark-accent transition-all duration-200"
          >
            <Users className="w-5 h-5 mr-2" />
            Get the Whole Family Healthy!
          </Button>
          
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.includes('Check your email') || message.includes('successfully')
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

      {/* Family Setup Modal */}
      <AnimatePresence>
        {showFamilyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-2xl bg-dark-panel border border-dark-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-dark-border bg-dark-background/50">
                <div>
                  <h2 className="text-2xl font-bold text-dark-primary">Family Plan Setup</h2>
                  <p className="text-dark-secondary mt-1">Add your family members (2-9 people total)</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowFamilyModal(false)}
                  className="text-dark-secondary hover:text-dark-primary hover:bg-dark-border/50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <p className="text-sm text-dark-secondary mb-4">
                  Each family member will receive their own personalized onboarding and supplement plan.
                </p>
                
                {familyMembers.map((member, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 bg-dark-background rounded-xl border border-dark-border"
                  >
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Family member name"
                        value={member.name}
                        onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                        className="bg-dark-panel border-dark-border text-dark-primary placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/20"
                      />
                      <Input
                        type="email"
                        placeholder="Their email address"
                        value={member.email}
                        onChange={(e) => updateFamilyMember(index, 'email', e.target.value)}
                        className="bg-dark-panel border-dark-border text-dark-primary placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/20"
                      />
                    </div>
                    {familyMembers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFamilyMember(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
                
                {familyMembers.length < 8 && (
                  <Button
                    variant="outline"
                    onClick={addFamilyMember}
                    className="w-full border-2 border-dashed border-dark-border hover:border-dark-accent text-dark-secondary hover:text-dark-accent transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Family Member
                  </Button>
                )}
              </div>
              
              <div className="p-6 border-t border-dark-border bg-dark-background/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-dark-primary">
                      Total: {familyMembers.filter(m => m.name.trim() && m.email.trim()).length + 1} people
                    </p>
                    <p className="text-xs text-dark-secondary">
                      You + {familyMembers.filter(m => m.name.trim() && m.email.trim()).length} family members
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleFamilySignUp}
                  disabled={isCreatingFamily || familyMembers.filter(m => m.name.trim() && m.email.trim()).length === 0}
                  className="w-full h-12 text-base font-semibold bg-dark-accent hover:bg-dark-accent/90 text-dark-background transition-all duration-200"
                >
                  {isCreatingFamily ? 'Creating Family Account...' : 'Create Family Account'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 