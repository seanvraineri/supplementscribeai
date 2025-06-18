"use client"

import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { OnboardingData } from "@/lib/schemas"

const HEALTH_GOALS = [
  { id: 'energy_performance', label: 'Boost Energy & Performance', icon: '⚡' },
  { id: 'cognitive_focus', label: 'Enhance Focus & Memory', icon: '🧠' },
  { id: 'sleep_recovery', label: 'Improve Sleep & Recovery', icon: '😴' },
  { id: 'stress_mood', label: 'Better Stress & Mood', icon: '🧘' },
  { id: 'digestive_health', label: 'Optimize Digestion', icon: '🌱' },
  { id: 'athletic_performance', label: 'Athletic Performance', icon: '🏃' },
  { id: 'longevity_wellness', label: 'Longevity & Wellness', icon: '🌟' },
  { id: 'weight_management', label: 'Weight Management', icon: '⚖️' },
  { id: 'custom', label: 'Custom Goal', icon: '✏️' }
]

export function HealthGoalsStep() {
  const form = useFormContext<OnboardingData>()
  const [selectedGoals, setSelectedGoals] = useState<string[]>(form.watch('healthGoals') || [])
  const [customGoal, setCustomGoal] = useState(form.watch('customHealthGoal') || '')
  const [showCustomInput, setShowCustomInput] = useState(false)
  
  const toggleGoal = (goalId: string) => {
    if (goalId === 'custom') {
      setShowCustomInput(true)
      return
    }
    
    const updatedGoals = selectedGoals.includes(goalId) 
      ? selectedGoals.filter(g => g !== goalId)
      : [...selectedGoals, goalId]
    
    setSelectedGoals(updatedGoals)
    form.setValue('healthGoals', updatedGoals, { shouldValidate: true })
  }
  
  const addCustomGoal = () => {
    if (customGoal.trim()) {
      const updatedGoals = [...selectedGoals, `custom:${customGoal}`]
      setSelectedGoals(updatedGoals)
      form.setValue('healthGoals', updatedGoals, { shouldValidate: true })
      form.setValue('customHealthGoal', customGoal)
      setShowCustomInput(false)
      setCustomGoal('')
    }
  }
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-dark-primary">What are your health goals?</h2>
        <p className="text-dark-secondary mt-2">Select all that apply</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {HEALTH_GOALS.map(goal => (
          <button
            key={goal.id}
            type="button"
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedGoals.includes(goal.id) || selectedGoals.some(g => g.startsWith('custom:'))
                ? 'border-dark-accent bg-dark-accent/10 shadow-md' 
                : 'border-dark-border hover:border-dark-accent/50 bg-dark-background'
            }`}
          >
            <div className="text-2xl mb-2">{goal.icon}</div>
            <div className="font-medium text-sm text-dark-primary">{goal.label}</div>
          </button>
        ))}
      </div>
      
      {/* Custom Goal Input */}
      {showCustomInput && (
        <div className="space-y-4 p-4 bg-dark-surface rounded-xl border border-dark-border">
          <label className="block text-lg font-semibold text-dark-primary">
            What's your custom health goal?
          </label>
          <input
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="e.g., Improve hormone balance, reduce inflammation..."
            className="w-full p-3 border border-dark-border rounded-lg bg-dark-background text-dark-primary placeholder-dark-secondary"
            maxLength={100}
          />
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={addCustomGoal}
              className="px-4 py-2 bg-dark-accent text-white rounded-lg hover:bg-dark-accent/90 transition-colors"
            >
              Add Goal
            </button>
            <button 
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="px-4 py-2 bg-dark-border text-dark-primary rounded-lg hover:bg-dark-border/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Show selected goals */}
      {selectedGoals.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-dark-secondary">Selected goals:</p>
          <div className="flex flex-wrap gap-2">
            {selectedGoals.map(goalId => {
              const isCustom = goalId.startsWith('custom:')
              const displayName = isCustom 
                ? goalId.replace('custom:', '') 
                : HEALTH_GOALS.find(g => g.id === goalId)?.label || goalId
              
              return (
                <span 
                  key={goalId}
                  className="px-3 py-1 bg-dark-accent/10 text-dark-accent rounded-full text-sm border border-dark-accent/20"
                >
                  {displayName}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 