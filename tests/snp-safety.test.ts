/**
 * SNP ANALYSIS SAFETY TESTS
 * 
 * These tests prevent wrong genetic risk assessments that could mislead users
 * about their genetic predispositions and health risks.
 */

import { interpretSNP } from '@/lib/analysis-helpers'

describe('🧬 SNP SAFETY TESTS - GENETIC RISK ACCURACY', () => {
  
  describe('🚨 HIGH RISK VARIANTS - Must be flagged appropriately', () => {
    test('MTHFR C677T TT (homozygous) should be HIGH RISK', () => {
      const result = interpretSNP({
        gene_name: 'MTHFR',
        genotype: 'TT',
        snp_id: 'rs1801133'
      })
      
      expect(result.color).toBe('red')
      expect(result.severity).toBe('High')
      expect(result.impact).toContain('reduced MTHFR enzyme')
      expect(result.recommendations).toBeDefined()
      expect(result.recommendations.length).toBeGreaterThan(0)
      expect(result.recommendations.some((rec: string) => rec.includes('Methylfolate'))).toBe(true)
    })

    test('APOE4 variant should show increased Alzheimer risk', () => {
      const result = interpretSNP({
        gene_name: 'APOE',
        genotype: 'TT', // E4 variant
        snp_id: 'rs429358'
      })
      
      expect(result.color).toBe('red')
      expect(result.severity).toBe('Significant')
      expect(result.impact).toContain('Alzheimer')
      expect(result.recommendations).toBeDefined()
      expect(result.recommendations.some((rec: string) => rec.includes('Omega-3'))).toBe(true)
    })
  })

  describe('⚠️ MODERATE RISK VARIANTS - Should be flagged for monitoring', () => {
    test('MTHFR C677T CT (heterozygous) should be MODERATE RISK', () => {
      const result = interpretSNP({
        gene_name: 'MTHFR',
        genotype: 'CT',
        snp_id: 'rs1801133'
      })
      
      expect(result.color).toBe('orange')
      expect(result.severity).toBe('Moderate')
      expect(result.impact).toContain('Moderately reduced')
      expect(result.recommendations).toBeDefined()
      expect(result.recommendations.some((rec: string) => rec.includes('Methylfolate'))).toBe(true)
    })

    test('COMT Val158Met variants should have specific recommendations', () => {
      // Met/Met (slow dopamine breakdown)
      const metMet = interpretSNP({
        gene_name: 'COMT',
        genotype: 'AA',
        snp_id: 'rs4680'
      })
      
      expect(metMet.color).toBe('orange')
      expect(metMet.severity).toBe('Moderate')
      expect(metMet.impact).toContain('Slower dopamine')
      expect(metMet.recommendations.some((rec: string) => rec.includes('Avoid stimulants'))).toBe(true)

      // Val/Val (fast dopamine breakdown)
      const valVal = interpretSNP({
        gene_name: 'COMT',
        genotype: 'GG',
        snp_id: 'rs4680'
      })
      
      expect(valVal.color).toBe('yellow')
      expect(valVal.severity).toBe('Moderate')
      expect(valVal.impact).toContain('Faster dopamine')
      expect(valVal.recommendations.some((rec: string) => rec.includes('Tyrosine'))).toBe(true)
    })
  })

  describe('✅ NORMAL/PROTECTIVE VARIANTS - Should be reassuring', () => {
    test('MTHFR C677T CC (normal) should be NORMAL', () => {
      const result = interpretSNP({
        gene_name: 'MTHFR',
        genotype: 'CC',
        snp_id: 'rs1801133'
      })
      
      expect(result.color).toBe('green')
      expect(result.severity).toBe('Normal')
      expect(result.impact).toContain('Normal MTHFR')
      expect(result.recommendations).toBeDefined()
    })

    test('APOE2 variant should show protective effects', () => {
      const result = interpretSNP({
        gene_name: 'APOE',
        genotype: 'CC', // E2 variant
        snp_id: 'rs7412'
      })
      
      expect(result.color).toBe('green')
      expect(result.severity).toBe('Protective')
      expect(result.impact).toContain('protective')
      expect(result.impact).toContain('Alzheimer')
    })

    test('COMT Val/Met (balanced) should be NORMAL', () => {
      const result = interpretSNP({
        gene_name: 'COMT',
        genotype: 'AG',
        snp_id: 'rs4680'
      })
      
      expect(result.color).toBe('green')
      expect(result.severity).toBe('Normal')
      expect(result.impact).toContain('Balanced dopamine')
    })
  })

  describe('🛡️ ERROR HANDLING - Must not crash on bad data', () => {
    test('Should handle missing gene name', () => {
      expect(() => {
        interpretSNP({
          gene_name: '',
          genotype: 'TT',
          snp_id: 'rs1801133'
        })
      }).not.toThrow()
    })

    test('Should handle missing genotype', () => {
      expect(() => {
        interpretSNP({
          gene_name: 'MTHFR',
          genotype: '',
          snp_id: 'rs1801133'
        })
      }).not.toThrow()
    })

    test('Should handle unknown SNP IDs', () => {
      expect(() => {
        interpretSNP({
          gene_name: 'UNKNOWN',
          genotype: 'TT',
          snp_id: 'rs999999999'
        })
      }).not.toThrow()
    })

    test('Should handle null/undefined values', () => {
      expect(() => {
        interpretSNP({
          gene_name: null,
          genotype: null,
          snp_id: null
        })
      }).not.toThrow()
    })

    test('Should handle alternative genotype formats', () => {
      // Test different genotype formats
      const formats = ['TT', 'T/T', 'T;T', 'tt']
      
      formats.forEach(format => {
        expect(() => {
          interpretSNP({
            gene_name: 'MTHFR',
            genotype: format,
            snp_id: 'rs1801133'
          })
        }).not.toThrow()
      })
    })
  })

  describe('🎯 CRITICAL SNPs - Must have proper interpretation', () => {
    const criticalSNPs = [
      { gene: 'MTHFR', rsid: 'rs1801133', riskGenotype: 'TT' },
      { gene: 'COMT', rsid: 'rs4680', riskGenotype: 'AA' },
      { gene: 'APOE', rsid: 'rs429358', riskGenotype: 'TT' },
    ]

    criticalSNPs.forEach(snp => {
      test(`${snp.gene} (${snp.rsid}) must have proper interpretation`, () => {
        const result = interpretSNP({
          gene_name: snp.gene,
          genotype: snp.riskGenotype,
          snp_id: snp.rsid
        })
        
        // Must have all required fields
        expect(result.impact).toBeDefined()
        expect(result.severity).toBeDefined()
        expect(result.color).toBeDefined()
        expect(result.recommendations).toBeDefined()
        
        // Should have meaningful content
        expect(result.impact.length).toBeGreaterThan(20)
        expect(result.recommendations.length).toBeGreaterThan(0)
        
        // Risk variants should not be green (except protective ones)
        if (!result.impact.includes('protective')) {
          expect(result.color).not.toBe('green')
        }
      })
    })
  })

  describe('🔬 SPECIFIC SNP LOGIC TESTS', () => {
    test('MTHFR variants should have methylfolate recommendations', () => {
      const homozygous = interpretSNP({
        gene_name: 'MTHFR',
        genotype: 'TT',
        snp_id: 'rs1801133'
      })
      
      const heterozygous = interpretSNP({
        gene_name: 'MTHFR',
        genotype: 'CT',
        snp_id: 'rs1801133'
      })
      
      // Both should recommend methylfolate
      expect(homozygous.recommendations.some((rec: string) => 
        rec.toLowerCase().includes('methylfolate') || rec.includes('5-MTHF')
      )).toBe(true)
      
      expect(heterozygous.recommendations.some((rec: string) => 
        rec.toLowerCase().includes('methylfolate') || rec.includes('5-MTHF')
      )).toBe(true)
      
      // Homozygous should have higher dose recommendations
      const homozygousHasHighDose = homozygous.recommendations.some((rec: string) => 
        rec.includes('800') || rec.includes('1000')
      )
      expect(homozygousHasHighDose).toBe(true)
    })

    test('COMT variants should have opposite recommendations', () => {
      const slowCOMT = interpretSNP({
        gene_name: 'COMT',
        genotype: 'AA', // Met/Met - slow
        snp_id: 'rs4680'
      })
      
      const fastCOMT = interpretSNP({
        gene_name: 'COMT',
        genotype: 'GG', // Val/Val - fast
        snp_id: 'rs4680'
      })
      
      // Slow COMT should avoid stimulants
      expect(slowCOMT.recommendations.some((rec: string) => 
        rec.toLowerCase().includes('avoid stimulants')
      )).toBe(true)
      
      // Fast COMT should benefit from stimulation
      expect(fastCOMT.recommendations.some((rec: string) => 
        rec.toLowerCase().includes('tyrosine') || rec.toLowerCase().includes('coffee')
      )).toBe(true)
    })

    test('APOE4 should have neuroprotective recommendations', () => {
      const apoe4 = interpretSNP({
        gene_name: 'APOE',
        genotype: 'TT',
        snp_id: 'rs429358'
      })
      
      // Should recommend neuroprotective supplements
      const hasOmega3 = apoe4.recommendations.some((rec: string) => 
        rec.toLowerCase().includes('omega-3') || rec.includes('EPA/DHA')
      )
      expect(hasOmega3).toBe(true)
      
      // Should recommend exercise
      const hasExercise = apoe4.recommendations.some((rec: string) => 
        rec.toLowerCase().includes('exercise') || rec.toLowerCase().includes('aerobic')
      )
      expect(hasExercise).toBe(true)
    })
  })

  describe('🧠 GENOTYPE FORMAT FLEXIBILITY', () => {
    test('Should handle different genotype formats for same variant', () => {
      const formats = [
        { genotype: 'TT', expected: 'red' },
        { genotype: 'T/T', expected: 'red' },
        { genotype: 'CT', expected: 'orange' },
        { genotype: 'C/T', expected: 'orange' },
        { genotype: 'CC', expected: 'green' },
        { genotype: 'C/C', expected: 'green' }
      ]
      
      formats.forEach(format => {
        const result = interpretSNP({
          gene_name: 'MTHFR',
          genotype: format.genotype,
          snp_id: 'rs1801133'
        })
        
        expect(result.color).toBe(format.expected)
      })
    })
  })
}) 