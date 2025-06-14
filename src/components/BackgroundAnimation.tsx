'use client'

import React from 'react'

const BackgroundAnimation: React.FC = () => {
  // Real health data arrays
  const genes = [
    'MTHFR', 'COMT', 'APOE', 'CYP1A2', 'FADS1', 'VDR', 'ALDH2', 'GSTP1', 'BDNF', 'ACE'
  ]

  const snps = [
    'rs1801133', 'rs4680', 'rs429358', 'rs762551', 'rs174547', 'rs2228570', 'rs671', 'rs1695', 'rs6265', 'rs4340'
  ]

  const biomarkers = [
    'Vitamin D', 'B12', 'Folate', 'CRP', 'LDL', 'HDL', 'HbA1c', 'TSH', 'Ferritin', 'Homocysteine'
  ]

  const supplements = [
    'Magnesium', 'Omega-3', 'Vitamin D3', 'B-Complex', 'NAC', 'Curcumin', 'Ashwagandha', 'CoQ10', 'Zinc', 'Probiotics'
  ]

  const healthTerms = [
    'Methylation', 'Inflammation', 'Oxidative Stress', 'Detoxification', 'Neurotransmitters', 'Cardiovascular', 'Metabolic', 'Cognitive', 'Immune', 'Hormonal'
  ]

  const dnaSequences = [
    'A T C G', 'G C T A', 'T A G C', 'C G A T', 'A T T A', 'G C C G', 'T A A T', 'C G G C', 'A T G C', 'G C A T'
  ]

  // Create rows with different data types
  const rows = [
    { data: genes, delay: '0s', speed: '120s' },
    { data: dnaSequences, delay: '-15s', speed: '100s' },
    { data: snps, delay: '-30s', speed: '140s' },
    { data: dnaSequences, delay: '-45s', speed: '110s' },
    { data: biomarkers, delay: '-60s', speed: '160s' },
    { data: dnaSequences, delay: '-75s', speed: '90s' },
    { data: supplements, delay: '-90s', speed: '180s' },
    { data: dnaSequences, delay: '-105s', speed: '95s' },
    { data: healthTerms, delay: '-120s', speed: '200s' },
    { data: dnaSequences, delay: '-135s', speed: '105s' }
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