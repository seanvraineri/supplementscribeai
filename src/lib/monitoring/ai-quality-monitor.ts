/**
 * Simple AI Quality Monitor - Run this separately to evaluate your AI outputs
 * COMPLETELY SEPARATE from user-facing code
 */

export interface AIOutput {
  functionName: string;
  userId: string;
  input: any;
  output: any;
  timestamp: Date;
}

export class AIQualityMonitor {
  
  // Simple evaluation that just logs to console
  static evaluateOutput(data: AIOutput): void {
    console.log(`\n🔍 EVAL: ${data.functionName} for user ${data.userId}`);
    
    try {
      switch (data.functionName) {
        case 'generate-plan':
          this.checkSupplementPlan(data);
          break;
        case 'health-score':
          this.checkHealthScore(data);
          break;
        case 'ai-health-analysis':
          this.checkHealthAnalysis(data);
          break;
        case 'ai-chat':
          this.checkChatResponse(data);
          break;
        default:
          this.checkGeneric(data);
      }
    } catch (error) {
      console.error(`❌ Eval failed for ${data.functionName}:`, error);
    }
  }

  private static checkSupplementPlan(data: AIOutput): void {
    const output = data.output;
    const issues: string[] = [];
    
    // Check structure
    if (!output?.supplements || !Array.isArray(output.supplements)) {
      issues.push('Missing supplements array');
    } else {
      console.log(`✅ Found ${output.supplements.length} supplements`);
      
      // Check for weird supplements
      const suspiciousSupps = output.supplements.filter((supp: any) => {
        const name = supp.name || supp.supplement_name || '';
        return name.length < 3 || name.includes('XYZ') || name.includes('ABC');
      });
      
      if (suspiciousSupps.length > 0) {
        issues.push(`Suspicious supplements: ${suspiciousSupps.map((s: any) => s.name).join(', ')}`);
      }
      
      // Check dosages
      const badDosages = output.supplements.filter((supp: any) => {
        const dosage = supp.dosage || supp.recommended_dosage || '';
        const num = parseInt(dosage.toString().replace(/[^\d]/g, ''));
        return num > 50000; // Extremely high dosage
      });
      
      if (badDosages.length > 0) {
        issues.push(`Extreme dosages detected`);
      }
    }
    
    if (issues.length === 0) {
      console.log('🟢 Supplement plan looks good!');
    } else {
      console.warn('🟡 Issues found:', issues);
    }
  }

  private static checkHealthScore(data: AIOutput): void {
    const output = data.output;
    const score = output?.health_score || output?.score;
    
    if (score === undefined) {
      console.warn('🔴 Missing health score');
      return;
    }
    
    if (score < 0 || score > 100) {
      console.warn(`🔴 Invalid score range: ${score}`);
      return;
    }
    
    console.log(`🟢 Health score: ${score}/100`);
  }

  private static checkHealthAnalysis(data: AIOutput): void {
    const output = data.output;
    const analysis = output?.analysis || output?.result || '';
    
    if (!analysis || analysis.length < 50) {
      console.warn('🔴 Analysis too short or missing');
      return;
    }
    
    // Check for medical disclaimers
    const hasDisclaimer = analysis.toLowerCase().includes('consult') || 
                         analysis.toLowerCase().includes('doctor');
    
    if (!hasDisclaimer) {
      console.warn('🟡 Missing medical disclaimer');
    } else {
      console.log('🟢 Analysis includes medical disclaimer');
    }
  }

  private static checkChatResponse(data: AIOutput): void {
    const output = data.output;
    const response = output?.response || output?.message || '';
    
    if (!response || response.length < 10) {
      console.warn('🔴 Chat response too short');
      return;
    }
    
    if (response.length > 2000) {
      console.warn('🟡 Chat response very long');
    }
    
    console.log(`🟢 Chat response: ${response.length} characters`);
  }

  private static checkGeneric(data: AIOutput): void {
    if (!data.output || Object.keys(data.output).length === 0) {
      console.warn('🔴 Empty output');
    } else {
      console.log('🟢 Output present');
    }
  }
}

// Simple usage example (you can call this manually when testing):
// AIQualityMonitor.evaluateOutput({
//   functionName: 'generate-plan',
//   userId: 'test-user',
//   input: { age: 30, gender: 'male' },
//   output: { supplements: [{ name: 'Vitamin D', dosage: '1000 IU' }] },
//   timestamp: new Date()
// }); 