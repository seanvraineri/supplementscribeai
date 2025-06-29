'use client'

import React from 'react'

const BackgroundAnimation: React.FC = () => {
  // High-traffic supplement pain points (millions of searches)
  const supplementFailures = [
    'Why don\'t supplements work for me?',
    'Supplement side effects nobody talks about',
    'Wasted $1000s on useless supplements',
    'Generic vitamins making me feel worse',
    'Taking 20 pills daily with zero results',
    'Supplement cabinet graveyard of false hope',
  ]

  // Top health pain points (10M+ searches)
  const healthPainPoints = [
    'Why am I tired all the time?',
    'Gut health destroying my life',
    'Weight loss plateau won\'t budge',
    'Brain fog ruining my productivity',
    'Hormone chaos wreaking havoc',
    'Sleep problems stealing my energy',
    'Chronic fatigue mystery symptoms',
  ]

  // Root cause frustrations (millions of searches)
  const rootCauseFrustrations = [
    'Normal blood work but feel terrible',
    'Doctors can\'t find what\'s wrong',
    'Generic advice isn\'t working',
    'One-size-fits-all approach failing',
    'Missing the real root cause',
    'Treating symptoms not the source',
    'My genetics hold the answers',
  ]

  // Personalized solution promises (high-intent searches)
  const personalizedSolutions = [
    'DNA-based supplement recommendations',
    'Personalized nutrition actually works',
    'Custom supplements for my genetics',
    'AI-powered health optimization',
    'Precision dosing based on my data',
    'Finally supplements that work for ME',
    'Biomarker-driven supplement selection',
  ]

  // Create rows with different data types
  const rows = [
    { data: supplementFailures, delay: '0s', speed: '120s' },
    { data: healthPainPoints, delay: '-15s', speed: '100s' },
    { data: rootCauseFrustrations, delay: '-30s', speed: '140s' },
    { data: personalizedSolutions, delay: '-45s', speed: '110s' },
    { data: supplementFailures, delay: '-60s', speed: '160s' },
    { data: healthPainPoints, delay: '-75s', speed: '90s' },
    { data: rootCauseFrustrations, delay: '-90s', speed: '180s' },
    { data: personalizedSolutions, delay: '-105s', speed: '95s' },
    { data: supplementFailures, delay: '-120s', speed: '200s' },
    { data: healthPainPoints, delay: '-135s', speed: '105s' }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {rows.map((row, index) => (
        <div
          key={index}
          className="absolute left-0 w-full"
          style={{
            top: `${15 + index * 12}%`,
          }}
        >
          <div 
            className="flex whitespace-nowrap animate-scrollLeft"
            style={{
              animationDelay: row.delay,
              animationDuration: row.speed,
            }}
          >
            <div className="flex space-x-12 text-gray-500/30 text-sm font-mono tracking-wide">
              {Array(8).fill(row.data).flat().map((item, itemIndex) => (
                <span key={itemIndex} className="px-4">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Bloomberg-style fade edges - reduced opacity to prevent black screen issues */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-dark-background/80 via-dark-background/40 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-dark-background/80 via-dark-background/40 to-transparent z-10" />
    </div>
  )
}

export default BackgroundAnimation 