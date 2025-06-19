/**
 * Entity-Aware PDF Parser for Medical Documents
 * Based on successful production medical NLP systems like CLEAR
 * Uses flexible entity recognition + context retrieval approach
 */

class EntityAwarePDFParser {
  constructor() {
    // Medical entity patterns - flexible and comprehensive
    this.medicalEntityPatterns = {
      // Biomarker names (flexible matching)
      biomarkers: [
        // Common lab values
        /\b(?:cholesterol|hdl|ldl|triglycerides?)\b/gi,
        /\b(?:glucose|blood\s*sugar|a1c|hba1c)\b/gi,
        /\b(?:creatinine|bun|egfr)\b/gi,
        /\b(?:hemoglobin|hgb|hematocrit|hct)\b/gi,
        /\b(?:white\s*blood\s*cells?|wbc|platelets?)\b/gi,
        /\b(?:sodium|potassium|chloride)\b/gi,
        /\b(?:vitamin\s*[a-z0-9]+|vit\s*[a-z0-9]+)\b/gi,
        /\b(?:iron|ferritin|b12|folate)\b/gi,
        /\b(?:psa|cea|ca\s*\d+\-\d+)\b/gi,
        /\b(?:tsh|t3|t4|free\s*t[34])\b/gi,
        
        // General pattern for lab-like terms
        /\b[a-z]{2,15}(?:\s*\-\s*[a-z0-9]{1,8})?\b/gi
      ],
      
      // SNP and genetic patterns
      snps: [
        /\brs\d{4,}\b/gi,
        /\b[A-Z]{2,8}\s+[A-Z]\d+[A-Z]\b/gi,
        /\b[ATCG]{1,2}\/[ATCG]{1,2}\b/gi,
        /\b[ATCG]{2,4}\b/gi
      ],
      
      // Measurement patterns (values with units)
      measurements: [
        /\b\d+\.?\d*\s*(?:mg\/dl|mmol\/l|ng\/ml|μg\/dl|iu\/l|u\/l|g\/dl|%)\b/gi,
        /\b\d+\.?\d*\s*(?:mg|ml|dl|l|g|kg|mcg|μg)\b/gi,
        /\b\d+\.?\d*\s*(?:normal|high|low|elevated|decreased)\b/gi
      ],
      
      // Medical conditions
      conditions: [
        /\b(?:diabetes|hypertension|hyperlipidemia|obesity)\b/gi,
        /\b(?:cancer|carcinoma|tumor|malignancy)\b/gi,
        /\b(?:infection|inflammation|disease|syndrome)\b/gi
      ]
    };

    // Medical units and reference indicators
    this.medicalUnits = new Set([
      'mg/dl', 'mmol/l', 'ng/ml', 'μg/dl', 'iu/l', 'u/l', 'g/dl', '%',
      'mg', 'ml', 'dl', 'l', 'g', 'kg', 'mcg', 'μg', 'copies/ml'
    ]);

    this.referenceIndicators = new Set([
      'normal', 'abnormal', 'high', 'low', 'elevated', 'decreased', 
      'critical', 'borderline', 'within', 'outside', 'range'
    ]);
  }

  /**
   * Parse PDF text using entity-aware approach
   */
  async parseText(text) {
    console.log('🔬 Starting entity-aware parsing...');
    
    // Step 1: Clean and prepare text
    const cleanedText = this.cleanMedicalText(text);
    
    // Step 2: Extract all medical entities
    const entities = this.extractMedicalEntities(cleanedText);
    console.log(`📋 Found ${entities.length} medical entities`);
    
    // Step 3: Extract biomarkers from entity contexts
    const biomarkers = this.extractBiomarkersFromEntities(entities, cleanedText);
    
    // Step 4: Extract SNPs from entity contexts  
    const snps = this.extractSNPsFromEntities(entities, cleanedText);
    
    // Step 5: Calculate confidence
    const confidence = this.calculateConfidence(biomarkers, snps, entities);
    
    console.log(`✅ Entity-aware parsing complete: ${biomarkers.length} biomarkers, ${snps.length} SNPs`);
    
    return {
      biomarkers,
      snps,
      confidence,
      method: 'entity-aware'
    };
  }

  /**
   * Clean text while preserving medical terminology
   */
  cleanMedicalText(text) {
    return text
      // Normalize whitespace but preserve structure
      .replace(/\s+/g, ' ')
      // Preserve medical units
      .replace(/(\d+)\s*\.\s*(\d+)/g, '$1.$2')
      // Preserve ranges
      .replace(/(\d+)\s*\-\s*(\d+)/g, '$1-$2')
      // Clean up but preserve medical abbreviations
      .replace(/([a-zA-Z])\s+([a-zA-Z])\b/g, (match, p1, p2) => {
        if (match.length <= 4) return p1 + p2; // Keep short abbreviations together
        return match;
      })
      .trim();
  }

  /**
   * Extract all medical entities using flexible NER approach
   */
  extractMedicalEntities(text) {
    const entities = [];
    const lines = text.split('\n');
    
    lines.forEach((line, lineIndex) => {
      // Extract biomarker entities
      this.medicalEntityPatterns.biomarkers.forEach(pattern => {
        // Reset regex lastIndex for global patterns
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const entityText = match[0].trim();
          if (entityText.length >= 2) {
            entities.push({
              text: entityText,
              type: 'biomarker',
              context: this.getContextWindow(text, match.index, line),
              confidence: this.calculateEntityConfidence(entityText, 'biomarker'),
              position: {
                start: match.index,
                end: match.index + entityText.length,
                line: lineIndex
              }
            });
          }
        }
      });
      
      // Extract SNP entities
      this.medicalEntityPatterns.snps.forEach(pattern => {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const entityText = match[0].trim();
          entities.push({
            text: entityText,
            type: 'snp',
            context: this.getContextWindow(text, match.index, line),
            confidence: this.calculateEntityConfidence(entityText, 'snp'),
            position: {
              start: match.index,
              end: match.index + entityText.length,
              line: lineIndex
            }
          });
        }
      });
      
      // Extract measurement entities
      this.medicalEntityPatterns.measurements.forEach(pattern => {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const entityText = match[0].trim();
          entities.push({
            text: entityText,
            type: 'measurement',
            context: this.getContextWindow(text, match.index, line),
            confidence: this.calculateEntityConfidence(entityText, 'measurement'),
            position: {
              start: match.index,
              end: match.index + entityText.length,
              line: lineIndex
            }
          });
        }
      });
    });
    
    // Remove duplicates and sort by confidence
    return this.deduplicateEntities(entities)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get context window around entity (like CLEAR approach)
   */
  getContextWindow(text, position, currentLine) {
    const words = text.split(/\s+/);
    const currentLineWords = currentLine.split(/\s+/);
    
    // Find the position in the word array
    let wordPosition = 0;
    let charCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      if (charCount >= position) {
        wordPosition = i;
        break;
      }
      charCount += words[i].length + 1;
    }
    
    // Get context window (±10 words)
    const start = Math.max(0, wordPosition - 10);
    const end = Math.min(words.length, wordPosition + 10);
    
    return words.slice(start, end).join(' ');
  }

  /**
   * Calculate entity confidence based on medical relevance
   */
  calculateEntityConfidence(entityText, type) {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence for known medical terms
    const knownMedicalTerms = [
      'cholesterol', 'glucose', 'hemoglobin', 'creatinine', 'sodium',
      'potassium', 'hdl', 'ldl', 'triglycerides', 'vitamin', 'iron'
    ];
    
    if (knownMedicalTerms.some(term => 
      entityText.toLowerCase().includes(term))) {
      confidence += 0.3;
    }
    
    // Boost for proper medical formatting
    if (type === 'snp' && /^rs\d+$/.test(entityText)) {
      confidence += 0.4;
    }
    
    if (type === 'measurement' && /\d+\.?\d*\s*[a-z\/]+/i.test(entityText)) {
      confidence += 0.3;
    }
    
    return Math.min(1.0, confidence);
  }

  /**
   * Extract biomarkers from medical entities and their contexts
   */
  extractBiomarkersFromEntities(entities, fullText) {
    const biomarkers = [];
    
    // Group entities by proximity to find biomarker-value pairs
    entities.forEach(entity => {
      if (entity.type === 'biomarker' || entity.type === 'measurement') {
        const biomarker = this.extractBiomarkerFromContext(entity, fullText);
        if (biomarker) {
          biomarkers.push(biomarker);
        }
      }
    });
    
    return this.deduplicateBiomarkers(biomarkers);
  }

  /**
   * Extract biomarker information from entity context
   */
  extractBiomarkerFromContext(entity, fullText) {
    const context = entity.context;
    
    // Look for value-unit patterns in the context
    const valueUnitPattern = /(\d+\.?\d*)\s*(mg\/dl|mmol\/l|ng\/ml|μg\/dl|iu\/l|u\/l|g\/dl|%|mg|ml|g)/gi;
    const valueMatch = valueUnitPattern.exec(context);
    
    if (valueMatch) {
      const value = parseFloat(valueMatch[1]);
      const unit = valueMatch[2].toLowerCase();
      
      // Look for reference range
      const rangePattern = /(?:range|normal|ref)[\s:]*(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)/gi;
      const rangeMatch = rangePattern.exec(context);
      const referenceRange = rangeMatch ? `${rangeMatch[1]}-${rangeMatch[2]}` : undefined;
      
      // Determine status
      let status;
      if (/\b(?:high|elevated|increased)\b/i.test(context)) status = 'high';
      else if (/\b(?:low|decreased|reduced)\b/i.test(context)) status = 'low';
      else if (/\b(?:critical|urgent|abnormal)\b/i.test(context)) status = 'critical';
      else if (/\b(?:normal|within|range)\b/i.test(context)) status = 'normal';
      
      return {
        name: entity.text,
        value,
        unit,
        reference_range: referenceRange,
        status,
        context: entity.context,
        confidence: entity.confidence
      };
    }
    
    return null;
  }

  /**
   * Extract SNPs from medical entities and their contexts
   */
  extractSNPsFromEntities(entities, fullText) {
    const snps = [];
    
    entities.forEach(entity => {
      if (entity.type === 'snp') {
        const snp = this.extractSNPFromContext(entity);
        if (snp) {
          snps.push(snp);
        }
      }
    });
    
    return this.deduplicateSNPs(snps);
  }

  /**
   * Extract SNP information from entity context
   */
  extractSNPFromContext(entity) {
    const context = entity.context;
    const entityText = entity.text;
    
    let snpId;
    let geneName;
    let genotype = entityText;
    
    // Check if entity is an rsID
    if (/^rs\d+$/i.test(entityText)) {
      snpId = entityText;
      
      // Look for genotype in context
      const genotypeMatch = context.match(/\b([ATCG]{1,2}\/[ATCG]{1,2}|[ATCG]{2,4})\b/);
      if (genotypeMatch) {
        genotype = genotypeMatch[1];
      }
      
      // Look for gene name in context
      const geneMatch = context.match(/\b([A-Z]{2,8})\b/);
      if (geneMatch && geneMatch[1] !== entityText) {
        geneName = geneMatch[1];
      }
    }
    // Check if entity is a genotype
    else if (/^[ATCG]{1,4}$|^[ATCG]{1,2}\/[ATCG]{1,2}$/.test(entityText)) {
      genotype = entityText;
      
      // Look for rsID in context
      const rsMatch = context.match(/\b(rs\d+)\b/i);
      if (rsMatch) {
        snpId = rsMatch[1];
      }
      
      // Look for gene name in context
      const geneMatch = context.match(/\b([A-Z]{2,8})\b/);
      if (geneMatch) {
        geneName = geneMatch[1];
      }
    }
    
    if (snpId || geneName || /^[ATCG]/.test(genotype)) {
      return {
        snp_id: snpId,
        gene_name: geneName,
        genotype,
        context: entity.context,
        confidence: entity.confidence
      };
    }
    
    return null;
  }

  /**
   * Remove duplicate entities
   */
  deduplicateEntities(entities) {
    const seen = new Set();
    return entities.filter(entity => {
      const key = `${entity.text.toLowerCase()}-${entity.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Remove duplicate biomarkers
   */
  deduplicateBiomarkers(biomarkers) {
    const seen = new Set();
    return biomarkers.filter(biomarker => {
      const key = `${biomarker.name.toLowerCase()}-${biomarker.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Remove duplicate SNPs
   */
  deduplicateSNPs(snps) {
    const seen = new Set();
    return snps.filter(snp => {
      const key = `${snp.snp_id || snp.gene_name || 'unknown'}-${snp.genotype}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Calculate overall confidence based on entities found
   */
  calculateConfidence(biomarkers, snps, entities) {
    let confidence = 0.3; // Base confidence
    
    // Boost for medical entities found
    confidence += Math.min(0.4, entities.length * 0.05);
    
    // Boost for structured biomarkers
    confidence += Math.min(0.2, biomarkers.length * 0.1);
    
    // Boost for valid SNPs
    confidence += Math.min(0.1, snps.length * 0.05);
    
    return Math.min(1.0, confidence);
  }
}

module.exports = { EntityAwarePDFParser }; 