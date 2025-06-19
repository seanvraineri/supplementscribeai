/**
 * Context-Aware Two-Phase PDF Parser
 * Phase 1: Document type detection + highlighting
 * Phase 2: Deep extraction from highlights
 */

class ContextAwarePDFParser {
  constructor() {
    // Document type detection patterns
    this.documentTypePatterns = {
      genetic: [
        /\brs\d{4,}\b/gi,
        /\b[A-Z]{2,8}\s+[A-Z]\d+[A-Z]\b/gi,
        /\bgenotype\b/gi,
        /\bsnp\b/gi,
        /\ballele\b/gi,
        /\bmutation\b/gi,
        /\bvariant\b/gi,
        /\bheterozygous\b/gi,
        /\bhomozygous\b/gi,
        /\bwild\s+type\b/gi,
        /\b[ATCG]{2,4}\b/gi,
        /\b[ATCG]\/[ATCG]\b/gi
      ],
      
      blood: [
        /\bcholesterol\b/gi,
        /\bglucose\b/gi,
        /\bhemoglobin\b/gi,
        /\bcreatinine\b/gi,
        /\btriglycerides\b/gi,
        /\bhdl\b/gi,
        /\bldl\b/gi,
        /\bwbc\b/gi,
        /\brbc\b/gi,
        /\bplatelet\b/gi,
        /\bmg\/dl\b/gi,
        /\bmmol\/l\b/gi,
        /\bng\/ml\b/gi,
        /\bu\/l\b/gi,
        /\bg\/dl\b/gi,
        /\blab\s+report\b/gi,
        /\bblood\s+test\b/gi,
        /\bcbc\b/gi,
        /\bcmp\b/gi,
        /\bbasic\s+metabolic\b/gi
      ]
    };

    // Phase 1: Highlighting patterns (cast wide net)
    this.highlightPatterns = {
      genetic: {
        // RSIDs - very specific
        rsids: /\brs\d{4,}\b/gi,
        
        // Gene names - common genetic terms
        genes: /\b(MTHFR|COMT|APOE|CYP1A2|CYP2D6|ACE|ACTN3|ALDH2|BDNF|CACNA1C|CLOCK|DRD2|FTO|IL6|MCM6|OPRM1|OXTR|SLC6A4|TNF|GSTT1|GSTM1|DAOA|MYRF|SUOX|MAO|VDR|FADS1|DHFR|DAO|PON1|SOD2|SOD3|AHCY|CYP2E1)\b/gi,
        
        // Genotypes - DNA sequences
        genotypes: /\b[ATCG]{1,4}\b/gi,
        genotypeSlash: /\b[ATCG]{1,2}\/[ATCG]{1,2}\b/gi,
        
        // Mutation nomenclature
        mutations: /\b[A-Z]\d+[A-Z]\b/gi,
        
        // Zygosity terms
        zygosity: /\b(heterozygous|homozygous|wild\s+type)\b/gi,
        
        // Genetic context words
        context: /\b(variant|mutation|allele|genotype|polymorphism)\b/gi
      },
      
      blood: {
        // Common biomarker names
        biomarkers: /\b(cholesterol|hdl|ldl|triglycerides|glucose|blood\s*sugar|a1c|hba1c|creatinine|bun|egfr|hemoglobin|hgb|hematocrit|hct|white\s*blood\s*cells?|wbc|platelets?|sodium|potassium|chloride|vitamin\s*[a-z0-9]+|iron|ferritin|b12|folate|psa|cea|tsh|t3|t4|free\s*t[34]|calcium|albumin|globulin|bilirubin|alkaline\s*phosphatase|ast|alt|protein)\b/gi,
        
        // Values with units
        valuesWithUnits: /\b\d+\.?\d*\s*(mg\/dl|mmol\/l|ng\/ml|μg\/dl|iu\/l|u\/l|g\/dl|%|mg|ml|g|mcg|μg)\b/gi,
        
        // Reference ranges
        ranges: /\b\d+\.?\d*\s*[-–]\s*\d+\.?\d*\b/gi,
        
        // Status indicators
        status: /\b(normal|abnormal|high|low|elevated|decreased|critical|borderline)\b/gi,
        
        // Lab context
        context: /\b(desired\s+range|reference\s+range|result|test|analysis|panel)\b/gi
      }
    };
  }

  /**
   * Main parsing function - two-phase approach
   */
  async parseText(text) {
    console.log('🔍 Phase 1: Document type detection...');
    
    // Phase 1: Detect document type
    const documentType = this.detectDocumentType(text);
    console.log(`📋 Document type detected: ${documentType}`);
    
    if (documentType === 'unknown') {
      return {
        biomarkers: [],
        snps: [],
        confidence: 0.1,
        method: 'context-aware',
        documentType: 'unknown',
        error: 'Could not determine document type'
      };
    }
    
    // Phase 2: Context-aware highlighting and extraction
    console.log('🎯 Phase 2: Context-aware highlighting...');
    const highlights = this.highlightPotentialEntities(text, documentType);
    console.log(`✨ Found ${highlights.length} potential entities`);
    
    // Phase 3: Deep extraction from highlights
    console.log('🔬 Phase 3: Deep extraction from highlights...');
    const results = await this.extractFromHighlights(highlights, text, documentType);
    
    console.log(`✅ Context-aware parsing complete: ${results.biomarkers.length} biomarkers, ${results.snps.length} SNPs`);
    
    return {
      ...results,
      documentType,
      method: 'context-aware'
    };
  }

  /**
   * Phase 1: Detect if this is a genetic test or blood test
   */
  detectDocumentType(text) {
    let geneticScore = 0;
    let bloodScore = 0;
    
    // Count genetic indicators
    this.documentTypePatterns.genetic.forEach(pattern => {
      const matches = text.match(pattern) || [];
      geneticScore += matches.length;
    });
    
    // Count blood test indicators  
    this.documentTypePatterns.blood.forEach(pattern => {
      const matches = text.match(pattern) || [];
      bloodScore += matches.length;
    });
    
    console.log(`📊 Genetic score: ${geneticScore}, Blood score: ${bloodScore}`);
    
    // Determine document type
    if (geneticScore > bloodScore && geneticScore >= 5) {
      return 'genetic';
    } else if (bloodScore > geneticScore && bloodScore >= 5) {
      return 'blood';
    } else if (geneticScore >= 3) {
      return 'genetic';
    } else if (bloodScore >= 3) {
      return 'blood';
    } else {
      return 'unknown';
    }
  }

  /**
   * Phase 2: Highlight all potential entities based on document type
   */
  highlightPotentialEntities(text, documentType) {
    const highlights = [];
    const patterns = this.highlightPatterns[documentType];
    
    if (!patterns) return highlights;
    
    // Get all pattern categories for this document type
    Object.keys(patterns).forEach(category => {
      const pattern = patterns[category];
      let match;
      
      // Reset pattern for global search
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(text)) !== null) {
        const highlight = {
          text: match[0].trim(),
          category,
          position: match.index,
          context: this.getContextWindow(text, match.index, 20), // ±20 words
          confidence: this.calculateHighlightConfidence(match[0], category, documentType)
        };
        
        highlights.push(highlight);
      }
    });
    
    // Remove duplicates and sort by confidence
    return this.deduplicateHighlights(highlights)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get context window around a position
   */
  getContextWindow(text, position, windowSize = 20) {
    const words = text.split(/\s+/);
    let wordPosition = 0;
    let charCount = 0;
    
    // Find word position
    for (let i = 0; i < words.length; i++) {
      if (charCount >= position) {
        wordPosition = i;
        break;
      }
      charCount += words[i].length + 1;
    }
    
    // Get context window
    const start = Math.max(0, wordPosition - windowSize);
    const end = Math.min(words.length, wordPosition + windowSize);
    
    return words.slice(start, end).join(' ');
  }

  /**
   * Calculate confidence for a highlight
   */
  calculateHighlightConfidence(text, category, documentType) {
    let confidence = 0.5; // Base confidence
    
    if (documentType === 'genetic') {
      if (category === 'rsids' && /^rs\d{4,}$/.test(text)) {
        confidence = 0.95; // Very high confidence for proper RSIDs
      } else if (category === 'genes' && text.length >= 3 && text.length <= 8) {
        confidence = 0.85; // High confidence for gene names
      } else if (category === 'genotypes' && /^[ATCG]{1,4}$/.test(text)) {
        confidence = 0.8; // High confidence for genotypes
      } else if (category === 'genotypeSlash' && /^[ATCG]{1,2}\/[ATCG]{1,2}$/.test(text)) {
        confidence = 0.9; // Very high confidence for slash genotypes
      }
    } else if (documentType === 'blood') {
      if (category === 'biomarkers') {
        confidence = 0.85; // High confidence for known biomarkers
      } else if (category === 'valuesWithUnits' && /\d+\.?\d*\s*(mg\/dl|mmol\/l|ng\/ml|u\/l|g\/dl)/.test(text)) {
        confidence = 0.9; // Very high confidence for values with medical units
      }
    }
    
    return Math.min(1.0, confidence);
  }

  /**
   * Phase 3: Extract structured data from highlights
   */
  async extractFromHighlights(highlights, fullText, documentType) {
    if (documentType === 'genetic') {
      return {
        biomarkers: [],
        snps: this.extractSNPsFromHighlights(highlights, fullText),
        confidence: this.calculateOverallConfidence(highlights, 'genetic')
      };
    } else if (documentType === 'blood') {
      return {
        biomarkers: this.extractBiomarkersFromHighlights(highlights, fullText),
        snps: [],
        confidence: this.calculateOverallConfidence(highlights, 'blood')
      };
    }
    
    return { biomarkers: [], snps: [], confidence: 0.1 };
  }

  /**
   * Extract SNPs from genetic test highlights
   */
  extractSNPsFromHighlights(highlights, fullText) {
    const snps = [];
    const processedRSIDs = new Set();
    
    // Group highlights by proximity to find SNP clusters
    const rsidHighlights = highlights.filter(h => h.category === 'rsids');
    
    rsidHighlights.forEach(rsidHighlight => {
      if (processedRSIDs.has(rsidHighlight.text)) return;
      
      const snp = this.extractSNPFromContext(rsidHighlight, highlights, fullText);
      if (snp) {
        snps.push(snp);
        processedRSIDs.add(rsidHighlight.text);
      }
    });
    
    // Also look for gene-based SNPs without RSIDs
    const geneHighlights = highlights.filter(h => h.category === 'genes');
    geneHighlights.forEach(geneHighlight => {
      const snp = this.extractGeneBasedSNP(geneHighlight, highlights, fullText);
      if (snp && !snps.some(s => s.gene_name === snp.gene_name && s.genotype === snp.genotype)) {
        snps.push(snp);
      }
    });
    
    return snps;
  }

  /**
   * Extract SNP data from RSID context
   */
  extractSNPFromContext(rsidHighlight, allHighlights, fullText) {
    const context = rsidHighlight.context;
    const rsid = rsidHighlight.text;
    
    // Look for genotype in the same context
    let genotype = '';
    const genotypeMatch = context.match(/\b([ATCG]{1,2}\/[ATCG]{1,2}|[ATCG]{2,4})\b/);
    if (genotypeMatch) {
      genotype = genotypeMatch[1];
    }
    
    // Look for gene name in context
    let geneName = '';
    const geneMatch = context.match(/\b(MTHFR|COMT|APOE|CYP1A2|CYP2D6|ACE|ACTN3|ALDH2|BDNF|CACNA1C|CLOCK|DRD2|FTO|IL6|MCM6|OPRM1|OXTR|SLC6A4|TNF|GSTT1|GSTM1|DAOA|MYRF|SUOX|MAO|VDR|FADS1|DHFR|DAO|PON1|SOD2|SOD3|AHCY|CYP2E1)\b/i);
    if (geneMatch) {
      geneName = geneMatch[1].toUpperCase();
    }
    
    // Look for zygosity
    let zygosity = '';
    const zygosityMatch = context.match(/\b(heterozygous|homozygous|wild\s+type)\b/i);
    if (zygosityMatch) {
      zygosity = zygosityMatch[1].toLowerCase();
    }
    
    if (genotype || geneName || zygosity) {
      return {
        snp_id: rsid,
        gene_name: geneName || undefined,
        genotype: genotype || zygosity || 'unknown',
        context: context,
        confidence: rsidHighlight.confidence
      };
    }
    
    return null;
  }

  /**
   * Extract gene-based SNP without RSID
   */
  extractGeneBasedSNP(geneHighlight, allHighlights, fullText) {
    const context = geneHighlight.context;
    const geneName = geneHighlight.text;
    
    // Look for mutation nomenclature like V158M
    const mutationMatch = context.match(/\b([A-Z]\d+[A-Z])\b/);
    if (mutationMatch) {
      // Look for genotype
      const genotypeMatch = context.match(/\b([ATCG]{1,2}\/[ATCG]{1,2}|[ATCG]{2,4})\b/);
      
      return {
        snp_id: undefined,
        gene_name: geneName,
        genotype: genotypeMatch ? genotypeMatch[1] : mutationMatch[1],
        mutation: mutationMatch[1],
        context: context,
        confidence: geneHighlight.confidence
      };
    }
    
    return null;
  }

  /**
   * Extract biomarkers from blood test highlights
   */
  extractBiomarkersFromHighlights(highlights, fullText) {
    const biomarkers = [];
    const processedBiomarkers = new Set();
    
    // Get biomarker name highlights
    const biomarkerHighlights = highlights.filter(h => h.category === 'biomarkers');
    
    biomarkerHighlights.forEach(biomarkerHighlight => {
      const biomarkerKey = biomarkerHighlight.text.toLowerCase();
      if (processedBiomarkers.has(biomarkerKey)) return;
      
      const biomarker = this.extractBiomarkerFromContext(biomarkerHighlight, highlights, fullText);
      if (biomarker) {
        biomarkers.push(biomarker);
        processedBiomarkers.add(biomarkerKey);
      }
    });
    
    return biomarkers;
  }

  /**
   * Extract biomarker data from context
   */
  extractBiomarkerFromContext(biomarkerHighlight, allHighlights, fullText) {
    const context = biomarkerHighlight.context;
    const name = biomarkerHighlight.text;
    
    // Look for value with unit in context
    const valueUnitMatch = context.match(/\b(\d+\.?\d*)\s*(mg\/dl|mmol\/l|ng\/ml|μg\/dl|iu\/l|u\/l|g\/dl|%|mg|ml|g)\b/i);
    if (!valueUnitMatch) return null;
    
    const value = parseFloat(valueUnitMatch[1]);
    const unit = valueUnitMatch[2].toLowerCase();
    
    // Look for reference range
    const rangeMatch = context.match(/(?:range|normal|ref)[\s:]*(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)/i);
    const referenceRange = rangeMatch ? `${rangeMatch[1]}-${rangeMatch[2]}` : undefined;
    
    // Look for status
    let status;
    if (/\b(high|elevated|increased)\b/i.test(context)) status = 'high';
    else if (/\b(low|decreased|reduced)\b/i.test(context)) status = 'low';
    else if (/\b(critical|urgent|abnormal)\b/i.test(context)) status = 'critical';
    else if (/\b(normal|within|range)\b/i.test(context)) status = 'normal';
    
    return {
      name,
      value,
      unit,
      reference_range: referenceRange,
      status,
      context: context,
      confidence: biomarkerHighlight.confidence
    };
  }

  /**
   * Remove duplicate highlights
   */
  deduplicateHighlights(highlights) {
    const seen = new Set();
    return highlights.filter(highlight => {
      const key = `${highlight.text.toLowerCase()}-${highlight.category}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Calculate overall confidence
   */
  calculateOverallConfidence(highlights, documentType) {
    if (highlights.length === 0) return 0.1;
    
    const avgConfidence = highlights.reduce((sum, h) => sum + h.confidence, 0) / highlights.length;
    let bonus = 0;
    
    if (documentType === 'genetic') {
      const rsidCount = highlights.filter(h => h.category === 'rsids').length;
      bonus = Math.min(0.3, rsidCount * 0.05);
    } else if (documentType === 'blood') {
      const biomarkerCount = highlights.filter(h => h.category === 'biomarkers').length;
      bonus = Math.min(0.3, biomarkerCount * 0.05);
    }
    
    return Math.min(1.0, avgConfidence + bonus);
  }
}

module.exports = { ContextAwarePDFParser }; 