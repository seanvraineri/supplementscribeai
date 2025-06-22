'use client'

import React from 'react'

const BackgroundAnimation: React.FC = () => {
  // More dramatic, emotionally-charged questions
  const agonyOfUncertainty = [
    'Deceived by wellness marketing?',
    'Lost in the contradictions?',
    'Is this science or a sales pitch?',
    'Another influencer, another empty promise?',
    'Drowning in a sea of "shoulds"?',
  ]

  const silentWarWithin = [
    "Why do my results say 'normal' when I feel broken?",
    'What if the root cause is still hiding?',
    'Am I funding a multi-billion dollar placebo?',
    "Is my body fighting a battle I can't see?",
    "What does my DNA know that I don't?",
  ]

  const frustrationOfFutility = [
    'All this effort... for nothing?',
    'Is your supplement cabinet a graveyard of hope?',
    'Doing everything right, feeling all wrong?',
    'Trapped in endless trial and error?',
    "Is 'pill fatigue' your new reality?",
  ]

  const glimmerOfPossibility = [
    'What if your biology held the blueprint?',
    'Could your data unlock your true potential?',
    'Imagine a formula built just for you.',
    "What if 'optimized' wasn't a fantasy?",
    "Ready to know your body's secrets?",
  ]

  // Create rows with different data types
  const rows = [
    { data: agonyOfUncertainty, delay: '0s', speed: '120s' },
    { data: silentWarWithin, delay: '-15s', speed: '100s' },
    { data: frustrationOfFutility, delay: '-30s', speed: '140s' },
    { data: glimmerOfPossibility, delay: '-45s', speed: '110s' },
    { data: agonyOfUncertainty, delay: '-60s', speed: '160s' },
    { data: silentWarWithin, delay: '-75s', speed: '90s' },
    { data: frustrationOfFutility, delay: '-90s', speed: '180s' },
    { data: glimmerOfPossibility, delay: '-105s', speed: '95s' },
    { data: agonyOfUncertainty, delay: '-120s', speed: '200s' },
    { data: silentWarWithin, delay: '-135s', speed: '105s' }
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
      
             {/* Bloomberg-style fade edges */}
       <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
       <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />
    </div>
  )
}

export default BackgroundAnimation 