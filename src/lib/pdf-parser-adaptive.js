/**
 * Adaptive PDF Parser - Finds ALL biomarkers and SNPs
 * Uses flexible pattern matching instead of rigid predefined lists
 */

class AdaptivePDFParser {
  constructor() {
    // Document type detection patterns
    this.documentTypePatterns = {
      genetic: [
        /\brs\d{4,}\b/gi,
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
        /\bmg\/dl\b/gi,
        /\bmmol\/l\b/gi,
        /\bng\/ml\b/gi,
        /\bu\/l\b/gi,
        /\bg\/dl\b/gi,
        /\blab\s+report\b/gi,
        /\bblood\s+test\b/gi,
        /\bcbc\b/gi,
        /\bcmp\b/gi,
        /\bdesired\s+range\b/gi,
        /\breference\s+range\b/gi
      ]
    };

    // Medical units - used to identify potential biomarkers
    this.medicalUnits = [
      'mg/dl', 'mg/dL', 'mmol/l', 'mmol/L', 'ng/ml', 'ng/mL', 
      'μg/dl', 'μg/dL', 'iu/l', 'IU/L', 'u/l', 'U/L', 
      'g/dl', 'g/dL', '%', 'mg', 'ml', 'mL', 'g', 'mcg', 'μg',
      'copies/ml', 'cells/uL', 'Thousand/uL', 'Million/uL',
      'pg', 'fL', 'nmol/L'
    ];

    // Status indicators
    this.statusIndicators = [
      'normal', 'abnormal', 'high', 'low', 'elevated', 'decreased', 
      'critical', 'borderline', 'within', 'outside', 'range',
      'desirable', 'undesirable', 'optimal', 'suboptimal'
    ];

    // Common lab context words
    this.labContextWords = [
      'desired', 'range', 'reference', 'result', 'test', 'analysis', 
      'panel', 'count', 'level', 'concentration', 'total', 'free'
    ];
  }

  /**
   * Main parsing function
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
        method: 'adaptive',
        documentType: 'unknown',
        error: 'Could not determine document type'
      };
    }
    
    // Phase 2: Adaptive extraction based on document type
    console.log('🎯 Phase 2: Adaptive extraction...');
    let results;
    
    if (documentType === 'blood') {
      results = await this.extractAllBiomarkers(text);
    } else if (documentType === 'genetic') {
      results = await this.extractAllSNPs(text);
    }
    
    console.log(`✅ Adaptive parsing complete: ${results.biomarkers.length} biomarkers, ${results.snps.length} SNPs`);
    
    return {
      ...results,
      documentType,
      method: 'adaptive'
    };
  }

  /**
   * Detect document type
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
   * Extract ALL biomarkers from blood test - adaptive approach
   */
  async extractAllBiomarkers(text) {
    console.log('🩸 Extracting ALL biomarkers adaptively...');
    
    const biomarkers = [];
    const lines = text.split('\n');
    
    // Strategy 1: Find any word followed by a value with medical units
    console.log('🔍 Strategy 1: Value-unit patterns...');
    const valueUnitPattern = new RegExp(
      `([A-Za-z][A-Za-z\\s,\\-()0-9]{1,40})\\s+` + // Biomarker name (flexible)
      `(\\d+\\.?\\d*)\\s*` + // Value
      `(${this.medicalUnits.join('|').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, // Units
      'gi'
    );
    
    let match;
    while ((match = valueUnitPattern.exec(text)) !== null) {
      const [fullMatch, name, valueStr, unit] = match;
      const value = parseFloat(valueStr);
      
      if (this.isValidBiomarkerName(name.trim()) && !isNaN(value)) {
        const context = this.getContextWindow(text, match.index, 15);
        const biomarker = this.createBiomarker(name.trim(), value, unit, context);
        if (biomarker) biomarkers.push(biomarker);
      }
    }
    
    // Strategy 2: Find lines with "Desired Range" or "Reference Range" patterns
    console.log('🔍 Strategy 2: Range-based patterns...');
    lines.forEach(line => {
      if (/desired\s+range|reference\s+range/i.test(line)) {
        const rangeMatches = this.extractFromRangeLine(line, text);
        rangeMatches.forEach(biomarker => {
          if (biomarker && !biomarkers.some(b => b.name.toLowerCase() === biomarker.name.toLowerCase())) {
            biomarkers.push(biomarker);
          }
        });
      }
    });
    
    // Strategy 3: Find colon-separated values (Name: Value Unit)
    console.log('🔍 Strategy 3: Colon-separated patterns...');
    const colonPattern = new RegExp(
      `([A-Za-z][A-Za-z\\s,\\-()0-9]{1,40})\\s*:\\s*` + // Name:
      `(\\d+\\.?\\d*)\\s*` + // Value
      `(${this.medicalUnits.join('|').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})?`, // Optional unit
      'gi'
    );
    
    while ((match = colonPattern.exec(text)) !== null) {
      const [fullMatch, name, valueStr, unit] = match;
      const value = parseFloat(valueStr);
      
      if (this.isValidBiomarkerName(name.trim()) && !isNaN(value)) {
        const context = this.getContextWindow(text, match.index, 15);
        const biomarker = this.createBiomarker(name.trim(), value, unit || 'not specified', context);
        if (biomarker && !biomarkers.some(b => b.name.toLowerCase() === biomarker.name.toLowerCase())) {
          biomarkers.push(biomarker);
        }
      }
    }
    
    // Strategy 4: Find table-like structures
    console.log('🔍 Strategy 4: Table structures...');
    const tableMatches = this.extractFromTableStructures(text);
    tableMatches.forEach(biomarker => {
      if (biomarker && !biomarkers.some(b => b.name.toLowerCase() === biomarker.name.toLowerCase())) {
        biomarkers.push(biomarker);
      }
    });
    
    console.log(`🎯 Found ${biomarkers.length} unique biomarkers`);
    
    return {
      biomarkers: this.deduplicateBiomarkers(biomarkers),
      snps: [],
      confidence: this.calculateBiomarkerConfidence(biomarkers)
    };
  }

  /**
   * Extract ALL SNPs from genetic test - adaptive approach
   */
  async extractAllSNPs(text) {
    console.log('🧬 Extracting ALL SNPs adaptively...');
    
    const snps = [];
    
    // Strategy 1: Find all RSIDs and their contexts
    console.log('🔍 Strategy 1: RSID patterns...');
    const rsidPattern = /\brs\d{4,}\b/gi;
    let match;
    
    while ((match = rsidPattern.exec(text)) !== null) {
      const rsid = match[0];
      const context = this.getContextWindow(text, match.index, 25);
      const snp = this.extractSNPFromRSIDContext(rsid, context);
      if (snp && !snps.some(s => s.snp_id === snp.snp_id)) {
        snps.push(snp);
      }
    }
    
    // Strategy 2: Find gene names and look for associated data
    console.log('🔍 Strategy 2: Gene-based patterns...');
    const genePattern = /\b[A-Z]{2,8}\b/g;
    const potentialGenes = new Set();
    
    while ((match = genePattern.exec(text)) !== null) {
      const gene = match[0];
      if (this.isLikelyGeneName(gene)) {
        potentialGenes.add(gene);
      }
    }
    
    potentialGenes.forEach(gene => {
      const geneSnps = this.extractSNPsForGene(gene, text);
      geneSnps.forEach(snp => {
        if (!snps.some(s => (s.snp_id === snp.snp_id || (s.gene_name === snp.gene_name && s.genotype === snp.genotype)))) {
          snps.push(snp);
        }
      });
    });
    
    // Strategy 3: Find genotype patterns (AA, CT, GG, etc.)
    console.log('🔍 Strategy 3: Genotype patterns...');
    const genotypePattern = /\b([ATCG]{1,2}\/[ATCG]{1,2}|[ATCG]{2,4})\b/gi;
    
    while ((match = genotypePattern.exec(text)) !== null) {
      const genotype = match[0];
      const context = this.getContextWindow(text, match.index, 20);
      const snp = this.extractSNPFromGenotypeContext(genotype, context);
      if (snp && !snps.some(s => s.genotype === snp.genotype && s.gene_name === snp.gene_name)) {
        snps.push(snp);
      }
    }
    
    // Strategy 4: Find mutation nomenclature (V158M, C677T, etc.)
    console.log('🔍 Strategy 4: Mutation nomenclature...');
    const mutationPattern = /\b([A-Z]\d+[A-Z])\b/gi;
    
    while ((match = mutationPattern.exec(text)) !== null) {
      const mutation = match[0];
      const context = this.getContextWindow(text, match.index, 20);
      const snp = this.extractSNPFromMutationContext(mutation, context);
      if (snp && !snps.some(s => s.mutation === snp.mutation)) {
        snps.push(snp);
      }
    }
    
    console.log(`🎯 Found ${snps.length} unique SNPs`);
    
    return {
      biomarkers: [],
      snps: this.deduplicateSNPs(snps),
      confidence: this.calculateSNPConfidence(snps)
    };
  }

  /**
   * Check if a name could be a biomarker
   */
  isValidBiomarkerName(name) {
    // Remove common false positives
    const falsePositives = [
      'page', 'report', 'date', 'time', 'patient', 'name', 'address',
      'phone', 'fax', 'email', 'doctor', 'physician', 'lab', 'laboratory',
      'collected', 'received', 'status', 'final', 'preliminary', 'see',
      'note', 'comment', 'or', 'and', 'the', 'of', 'to', 'for', 'with',
      'by', 'in', 'on', 'at', 'is', 'are', 'was', 'were', 'been', 'being'
    ];
    
    const lowerName = name.toLowerCase().trim();
    
    // Must be reasonable length
    if (lowerName.length < 2 || lowerName.length > 40) return false;
    
    // Cannot be a false positive
    if (falsePositives.includes(lowerName)) return false;
    
    // Cannot be just numbers
    if (/^\d+$/.test(lowerName)) return false;
    
    // Must contain at least one letter
    if (!/[a-zA-Z]/.test(lowerName)) return false;
    
    return true;
  }

  /**
   * Check if a term is likely a gene name
   */
  isLikelyGeneName(gene) {
    // Common gene patterns
    if (gene.length >= 3 && gene.length <= 8 && /^[A-Z]+$/.test(gene)) {
      // Exclude common false positives
      const falsePositives = ['THE', 'AND', 'FOR', 'YOU', 'ARE', 'NOT', 'BUT', 'CAN', 'ALL', 'ANY', 'NEW', 'NOW', 'WAY', 'MAY', 'SAY', 'USE', 'HER', 'HIM', 'HIS', 'SHE', 'TWO', 'HOW', 'ITS', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HAD', 'HE', 'HE', 'IN', 'IS', 'IT', 'OF', 'ON', 'TO', 'UP', 'US', 'WE'];
      return !falsePositives.includes(gene);
    }
    return false;
  }

  /**
   * Extract biomarkers from range lines
   */
  extractFromRangeLine(line, fullText) {
    const biomarkers = [];
    
    // Pattern: "Name Desired Range: min-max unit value"
    const rangePattern = /([A-Za-z][A-Za-z\s,\-()0-9]{1,40})\s+Desired\s+Range:\s*([<>]?\s*\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)\s*([a-zA-Z\/μ%°\-\s]+)?\s+(\d+\.?\d*)/gi;
    
    let match;
    while ((match = rangePattern.exec(line)) !== null) {
      const [fullMatch, name, minVal, maxVal, unit, value] = match;
      
      if (this.isValidBiomarkerName(name.trim())) {
        const biomarker = this.createBiomarker(
          name.trim(), 
          parseFloat(value), 
          unit?.trim() || 'not specified', 
          line,
          `${minVal}-${maxVal}`
        );
        if (biomarker) biomarkers.push(biomarker);
      }
    }
    
    return biomarkers;
  }

  /**
   * Extract biomarkers from table structures
   */
  extractFromTableStructures(text) {
    const biomarkers = [];
    const lines = text.split('\n');
    
    // Look for lines that look like: "Name    Value    Unit    Range    Status"
    lines.forEach(line => {
      // Split by multiple spaces (table columns)
      const columns = line.split(/\s{2,}/).map(col => col.trim()).filter(col => col.length > 0);
      
      if (columns.length >= 3) {
        const [name, value, unit, ...rest] = columns;
        
        if (this.isValidBiomarkerName(name) && /^\d+\.?\d*$/.test(value)) {
          const biomarker = this.createBiomarker(
            name,
            parseFloat(value),
            unit,
            line
          );
          if (biomarker) biomarkers.push(biomarker);
        }
      }
    });
    
    return biomarkers;
  }

  /**
   * Extract SNP from RSID context
   */
  extractSNPFromRSIDContext(rsid, context) {
    // Look for genotype
    const genotypeMatch = context.match(/\b([ATCG]{1,2}\/[ATCG]{1,2}|[ATCG]{2,4})\b/);
    
    // Look for gene name
    const geneMatch = context.match(/\b([A-Z]{2,8})\b/);
    
    // Look for zygosity
    const zygosityMatch = context.match(/\b(heterozygous|homozygous|wild\s+type)\b/i);
    
    return {
      snp_id: rsid,
      gene_name: geneMatch ? geneMatch[1] : undefined,
      genotype: genotypeMatch ? genotypeMatch[1] : (zygosityMatch ? zygosityMatch[1] : 'unknown'),
      context: context,
      confidence: 0.9
    };
  }

  /**
   * Extract SNPs for a specific gene
   */
  extractSNPsForGene(gene, text) {
    const snps = [];
    
    // Find all contexts where this gene appears
    const geneRegex = new RegExp(`\\b${gene}\\b`, 'gi');
    let match;
    
    while ((match = geneRegex.exec(text)) !== null) {
      const context = this.getContextWindow(text, match.index, 25);
      
      // Look for RSIDs in this context
      const rsidMatch = context.match(/\b(rs\d{4,})\b/i);
      
      // Look for genotypes
      const genotypeMatch = context.match(/\b([ATCG]{1,2}\/[ATCG]{1,2}|[ATCG]{2,4})\b/);
      
      // Look for mutations
      const mutationMatch = context.match(/\b([A-Z]\d+[A-Z])\b/);
      
      if (rsidMatch || genotypeMatch || mutationMatch) {
        snps.push({
          snp_id: rsidMatch ? rsidMatch[1] : undefined,
          gene_name: gene,
          genotype: genotypeMatch ? genotypeMatch[1] : 'unknown',
          mutation: mutationMatch ? mutationMatch[1] : undefined,
          context: context,
          confidence: 0.8
        });
      }
    }
    
    return snps;
  }

  /**
   * Extract SNP from genotype context
   */
  extractSNPFromGenotypeContext(genotype, context) {
    // Look for gene name
    const geneMatch = context.match(/\b([A-Z]{2,8})\b/);
    
    // Look for RSID
    const rsidMatch = context.match(/\b(rs\d{4,})\b/i);
    
    return {
      snp_id: rsidMatch ? rsidMatch[1] : undefined,
      gene_name: geneMatch ? geneMatch[1] : undefined,
      genotype: genotype,
      context: context,
      confidence: 0.7
    };
  }

  /**
   * Extract SNP from mutation context
   */
  extractSNPFromMutationContext(mutation, context) {
    // Look for gene name
    const geneMatch = context.match(/\b([A-Z]{2,8})\b/);
    
    // Look for RSID
    const rsidMatch = context.match(/\b(rs\d{4,})\b/i);
    
    return {
      snp_id: rsidMatch ? rsidMatch[1] : undefined,
      gene_name: geneMatch ? geneMatch[1] : undefined,
      genotype: 'unknown',
      mutation: mutation,
      context: context,
      confidence: 0.8
    };
  }

  /**
   * Create a biomarker object
   */
  createBiomarker(name, value, unit, context, referenceRange = undefined) {
    // Determine status from context
    let status;
    if (/\b(high|elevated|increased)\b/i.test(context)) status = 'high';
    else if (/\b(low|decreased|reduced)\b/i.test(context)) status = 'low';
    else if (/\b(critical|urgent|abnormal)\b/i.test(context)) status = 'critical';
    else if (/\b(normal|within|range)\b/i.test(context)) status = 'normal';
    
    return {
      name,
      value,
      unit: unit || 'not specified',
      reference_range: referenceRange,
      status,
      context: context,
      confidence: 0.8
    };
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
      const key = `${snp.snp_id || snp.gene_name || 'unknown'}-${snp.genotype}-${snp.mutation || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Calculate biomarker confidence
   */
  calculateBiomarkerConfidence(biomarkers) {
    if (biomarkers.length === 0) return 0.1;
    
    const avgConfidence = biomarkers.reduce((sum, b) => sum + b.confidence, 0) / biomarkers.length;
    const bonus = Math.min(0.3, biomarkers.length * 0.01);
    
    return Math.min(1.0, avgConfidence + bonus);
  }

  /**
   * Calculate SNP confidence
   */
  calculateSNPConfidence(snps) {
    if (snps.length === 0) return 0.1;
    
    const avgConfidence = snps.reduce((sum, s) => sum + s.confidence, 0) / snps.length;
    const bonus = Math.min(0.3, snps.length * 0.01);
    
    return Math.min(1.0, avgConfidence + bonus);
  }
}

module.exports = { AdaptivePDFParser }; 