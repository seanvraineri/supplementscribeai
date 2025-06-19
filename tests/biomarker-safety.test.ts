/**
 * CRITICAL HEALTH SAFETY TESTS
 * 
 * These tests prevent life-threatening errors in biomarker interpretation.
 * They ensure users get correct health advice and are warned of dangerous values.
 */

import { interpretBiomarker } from '@/lib/analysis-helpers'

describe('🩺 BIOMARKER SAFETY TESTS - CRITICAL HEALTH CALCULATIONS', () => {
  
  describe('🚨 EMERGENCY VALUES - Must be flagged as HIGH RISK', () => {
    test('Dangerously high cholesterol (>300) should be HIGH RISK', () => {
      const result = interpretBiomarker({
        marker_name: 'cholesterol',
        value: 350,
        unit: 'mg/dL'
      })
      
      expect(result.color).toBe('red')
      expect(result.status?.toLowerCase()).toContain('high')
      expect(result.impact).toBeDefined()
      expect(result.impact.length).toBeGreaterThan(10)
    })

    test('Diabetic emergency glucose (>400) should be HIGH RISK', () => {
      const result = interpretBiomarker({
        marker_name: 'glucose',
        value: 450,
        unit: 'mg/dL'
      })
      
      expect(result.color).toBe('red')
      expect(result.status?.toLowerCase()).toContain('diabetes')
      expect(result.impact).toContain('Medical evaluation')
    })

    test('Critically high triglycerides (>500) should be HIGH RISK', () => {
      const result = interpretBiomarker({
        marker_name: 'triglycerides',
        value: 600,
        unit: 'mg/dL'
      })
      
      expect(result.color).toBe('red')
      expect(result.status?.toLowerCase()).toContain('high')
      expect(result.impact).toContain('medical attention')
    })

    test('Dangerously high HbA1c (>8) should be HIGH RISK', () => {
      const result = interpretBiomarker({
        marker_name: 'hba1c',
        value: 9.5,
        unit: '%'
      })
      
      expect(result.color).toBe('red')
      expect(result.status?.toLowerCase()).toContain('poor control')
      expect(result.impact).toContain('intervention')
    })
  })

  describe('✅ NORMAL VALUES - Should be reassuring', () => {
    test('Normal cholesterol (180) should be NORMAL/GREEN', () => {
      const result = interpretBiomarker({
        marker_name: 'cholesterol',
        value: 180,
        unit: 'mg/dL'
      })
      
      expect(result.color).toBe('green')
      expect(result.status?.toLowerCase()).toContain('desirable')
      expect(result.impact).toContain('Optimal')
    })

    test('Normal glucose (90) should be NORMAL/GREEN', () => {
      const result = interpretBiomarker({
        marker_name: 'glucose',
        value: 90,
        unit: 'mg/dL'
      })
      
      expect(result.color).toBe('green')
      expect(result.status?.toLowerCase()).toContain('normal')
      expect(result.impact).toContain('Healthy')
    })

    test('Normal HbA1c (5.2) should be NORMAL/GREEN', () => {
      const result = interpretBiomarker({
        marker_name: 'hba1c',
        value: 5.2,
        unit: '%'
      })
      
      expect(result.color).toBe('green')
      expect(result.status?.toLowerCase()).toContain('normal')
      expect(result.impact).toContain('Excellent')
    })
  })

  describe('⚠️ BORDERLINE VALUES - Should be flagged for monitoring', () => {
    test('Pre-diabetic glucose (110) should be ORANGE/WARNING', () => {
      const result = interpretBiomarker({
        marker_name: 'glucose',
        value: 110,
        unit: 'mg/dL'
      })
      
      expect(result.color).toBe('orange')
      expect(result.status?.toLowerCase()).toContain('prediabetes')
      expect(result.impact).toContain('Lifestyle')
    })

    test('Elevated cholesterol (220) should be ORANGE/WARNING', () => {
      const result = interpretBiomarker({
        marker_name: 'cholesterol',
        value: 220,
        unit: 'mg/dL'
      })
      
      expect(result.color).toBe('orange')
      expect(result.status?.toLowerCase()).toContain('borderline')
      expect(result.impact).toContain('Lifestyle')
    })

    test('Pre-diabetic HbA1c (6.0) should be ORANGE/WARNING', () => {
      const result = interpretBiomarker({
        marker_name: 'hba1c',
        value: 6.0,
        unit: '%'
      })
      
      expect(result.color).toBe('orange')
      expect(result.status?.toLowerCase()).toContain('prediabetes')
      expect(result.impact).toContain('Lifestyle')
    })
  })

  describe('🛡️ ERROR HANDLING - Must not crash on bad data', () => {
    test('Should handle null/undefined values safely', () => {
      expect(() => interpretBiomarker({ marker_name: 'glucose', value: null as any, unit: 'mg/dL' })).not.toThrow()
      expect(() => interpretBiomarker({ marker_name: 'glucose', value: undefined as any, unit: 'mg/dL' })).not.toThrow()
    })

    test('Should handle missing marker name', () => {
      expect(() => interpretBiomarker({ marker_name: '', value: 100, unit: 'mg/dL' })).not.toThrow()
      expect(() => interpretBiomarker({ marker_name: undefined as any, value: 100, unit: 'mg/dL' })).not.toThrow()
    })

    test('Should handle extreme values without crashing', () => {
      expect(() => interpretBiomarker({ marker_name: 'glucose', value: 99999, unit: 'mg/dL' })).not.toThrow()
      expect(() => interpretBiomarker({ marker_name: 'glucose', value: 0.001, unit: 'mg/dL' })).not.toThrow()
    })

    test('Should handle negative values', () => {
      expect(() => interpretBiomarker({ marker_name: 'glucose', value: -50, unit: 'mg/dL' })).not.toThrow()
    })

    test('Should handle string values that can be parsed', () => {
      expect(() => interpretBiomarker({ marker_name: 'glucose', value: '100' as any, unit: 'mg/dL' })).not.toThrow()
    })
  })

  describe('🎯 CRITICAL BIOMARKERS - Must have proper interpretation', () => {
    test('glucose must have proper interpretation for dangerous values', () => {
      const critical = interpretBiomarker({ marker_name: 'glucose', value: 500, unit: 'mg/dL' })
      expect(critical.color).toBe('red')
      expect(critical.impact).toContain('Medical evaluation')
    })

    test('cholesterol must have proper interpretation for dangerous values', () => {
      const critical = interpretBiomarker({ marker_name: 'cholesterol', value: 350, unit: 'mg/dL' })
      expect(critical.color).toBe('red')
      expect(critical.status?.toLowerCase()).toContain('high')
    })

    test('triglycerides must have proper interpretation for dangerous values', () => {
      const critical = interpretBiomarker({ marker_name: 'triglycerides', value: 600, unit: 'mg/dL' })
      expect(critical.color).toBe('red')
      expect(critical.impact).toContain('medical attention')
    })

    test('hba1c must have proper interpretation for dangerous values', () => {
      const critical = interpretBiomarker({ marker_name: 'hba1c', value: 10, unit: '%' })
      expect(critical.color).toBe('red')
      expect(critical.impact).toContain('intervention')
    })

    test('ferritin must have proper interpretation for dangerous values', () => {
      const high = interpretBiomarker({ marker_name: 'ferritin', value: 1000, unit: 'ng/mL' })
      expect(high.color).toBe('red')
      expect(high.impact).toContain('overload')
    })
  })

  describe('🔬 SPECIFIC BIOMARKER LOGIC TESTS', () => {
    test('LDL cholesterol should have specific ranges', () => {
      const optimal = interpretBiomarker({ marker_name: 'ldl_cholesterol', value: 80, unit: 'mg/dL' })
      expect(optimal.color).toBe('green')
      
      const high = interpretBiomarker({ marker_name: 'ldl_cholesterol', value: 180, unit: 'mg/dL' })
      expect(high.color).toBe('red')
    })

    test('HDL cholesterol should recognize protective levels', () => {
      const protective = interpretBiomarker({ marker_name: 'hdl_cholesterol', value: 70, unit: 'mg/dL' })
      expect(protective.color).toBe('green')
      expect(protective.impact).toContain('protection')
    })

    test('Vitamin D should have proper deficiency detection', () => {
      const deficient = interpretBiomarker({ marker_name: 'vitamin_d', value: 15, unit: 'ng/mL' })
      expect(deficient.color).toBe('red')
      expect(deficient.status).toContain('Deficient')
      
      const optimal = interpretBiomarker({ marker_name: 'vitamin_d', value: 45, unit: 'ng/mL' })
      expect(optimal.color).toBe('green')
      expect(optimal.status).toContain('Sufficient')
    })
  })
}) 