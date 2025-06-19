// SupplementScribe AI - Master Types File
// This file provides type safety while maintaining flexibility for data extraction

// =============================================================================
// FLEXIBLE INPUT TYPES (for PDF extraction and external data)
// =============================================================================

export interface FlexibleInput {
  [key: string]: any; // ✅ KEEP any here - perfect for unpredictable data
}

export interface FlexibleBiomarkerInput extends FlexibleInput {
  // Common field variations from PDFs/APIs
  marker_name?: any;
  test?: any;
  name?: any;
  value?: any;
  result?: any;
  amount?: any;
  unit?: any;
  units?: any;
  reference_range?: any;
  ref_range?: any;
}

export interface FlexibleSNPInput extends FlexibleInput {
  // Common field variations from genetic files
  rsid?: any;
  snp_id?: any;
  gene?: any;
  gene_name?: any;
  genotype?: any;
  allele?: any;
  supported_snps?: any;
}

// =============================================================================
// PROCESSED DATA TYPES (after extraction and validation)
// =============================================================================

export interface Biomarker {
  id?: string;
  user_id?: string;
  marker_name: string;
  value: number;
  unit: string;
  reference_range?: string;
  comment?: string;
  created_at?: string;
  report_id?: string;
}

export interface SNP {
  id?: string;
  user_id?: string;
  supported_snp_id?: number;
  snp_id?: string;
  gene_name?: string;
  genotype: string;
  comment?: string;
  created_at?: string;
  report_id?: string;
  rsid?: string;
  supported_snps?: {
    gene: string;
    rsid: string;
  };
}

// =============================================================================
// ANALYSIS RESULT TYPES (for component props)
// =============================================================================

export interface BiomarkerAnalysis {
  name: string;
  description?: string;
  currentValue?: string;
  referenceRange?: string;
  status?: string;
  statusColor?: 'green' | 'yellow' | 'red' | 'blue';
  interpretation?: string;
  recommendations?: string[];
  symptoms?: string[];
  whatItDoes?: string;
  inRangeStatus?: string;
  actionPlan?: string;
}

export interface SNPAnalysis {
  name: string;
  description?: string;
  genotype?: string;
  variantEffect?: string;
  functionalImpact?: string;
  riskLevel?: string;
  riskColor?: 'green' | 'orange' | 'red' | 'blue';
  recommendations?: string[];
  whatItDoes?: string;
  variantStatus?: string;
  actionPlan?: string;
}

// =============================================================================
// COMPONENT PROP TYPES (flexible but guided)
// =============================================================================

// These allow both typed and flexible data
export type BiomarkerData = Biomarker | FlexibleBiomarkerInput;
export type BiomarkerAnalysisData = BiomarkerAnalysis | FlexibleInput;
export type SNPData = SNP | FlexibleSNPInput;
export type SNPAnalysisData = SNPAnalysis | FlexibleInput;

// =============================================================================
// TYPE GUARDS (for runtime safety)
// =============================================================================

export function isBiomarker(data: unknown): data is Biomarker {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.marker_name === 'string' && 
         typeof obj.value === 'number' && 
         typeof obj.unit === 'string';
}

export function isSNP(data: unknown): data is SNP {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.genotype === 'string' && obj.genotype.length > 0;
}

export function isBiomarkerAnalysis(data: unknown): data is BiomarkerAnalysis {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.name === 'string';
}

export function isSNPAnalysis(data: unknown): data is SNPAnalysis {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.name === 'string';
}

// =============================================================================
// SAFE EXTRACTION HELPERS
// =============================================================================

export function extractBiomarker(input: FlexibleBiomarkerInput): Biomarker | null {
  try {
    const name = String(input.marker_name || input.test || input.name || '').trim();
    const rawValue = input.value || input.result || input.amount;
    const value = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue));
    const unit = String(input.unit || input.units || '').trim();
    
    if (!name || isNaN(value)) return null;
    
    return {
      marker_name: name,
      value,
      unit,
      reference_range: String(input.reference_range || input.ref_range || '').trim() || undefined
    };
  } catch {
    return null;
  }
}

export function extractSNP(input: FlexibleSNPInput): SNP | null {
  try {
    const genotype = String(input.genotype || input.allele || '').trim();
    const gene_name = String(input.gene || input.gene_name || '').trim();
    const rsid = String(input.rsid || input.snp_id || '').trim();
    
    if (!genotype) return null;
    
    return {
      genotype,
      gene_name: gene_name || undefined,
      snp_id: rsid || undefined,
      rsid: rsid || undefined
    };
  } catch {
    return null;
  }
} 