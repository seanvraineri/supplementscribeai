import { UnstructuredClient } from 'unstructured-client';
import { Strategy } from 'unstructured-client/sdk/models/shared';

// Types for better medical document parsing
export interface MedicalPDFParseResult {
  text: string;
  tables: Array<{
    type: 'biomarker' | 'snp' | 'general';
    data: Record<string, any>[];
    confidence: number;
  }>;
  elements: Array<{
    type: 'text' | 'table' | 'header' | 'list';
    content: string;
    metadata?: Record<string, any>;
  }>;
  biomarkers: Array<{
    name: string;
    value: string | number;
    unit?: string;
    reference_range?: string;
    status?: 'normal' | 'high' | 'low' | 'critical';
  }>;
  snps: Array<{
    rsid: string;
    genotype: string;
    chromosome?: string;
    position?: number;
    risk_level?: 'high' | 'moderate' | 'low' | 'protective';
  }>;
}

export class UnstructuredMedicalParser {
  private client: UnstructuredClient;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.UNSTRUCTURED_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Unstructured API key is required');
    }
    
    this.client = new UnstructuredClient({
      serverURL: 'https://api.unstructuredapp.io',
      security: {
        apiKeyAuth: this.apiKey,
      },
    });
  }

  async parseMedicalPDF(file: File | Buffer, filename: string): Promise<MedicalPDFParseResult> {
    try {
      // Convert File to Buffer if needed
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
      
      // Use Unstructured's advanced strategy for medical documents
      const response = await this.client.general.partition({
        partitionParameters: {
          files: {
            content: buffer,
            fileName: filename,
          },
          strategy: Strategy.HiRes, // High resolution for medical accuracy
          hiResModelName: 'yolox', // Better table detection
          coordinates: true, // Get coordinates for elements
          skipInferTableTypes: [], // Don't skip table inference for any types
          languages: ['en'], // Can add more languages as needed
        },
      });

      // Handle both string and array responses
      let elements: any[] = [];
      if (typeof response === 'string') {
        try {
          elements = JSON.parse(response);
        } catch (e) {
          throw new Error('Failed to parse response string as JSON');
        }
      } else if (Array.isArray(response)) {
        elements = response;
      } else {
        throw new Error('Unexpected response format from Unstructured API');
      }

      if (!elements || elements.length === 0) {
        throw new Error('No elements returned from Unstructured API');
      }

      // Process the structured elements
      const result = this.processElements(elements);
      return result;

    } catch (error) {
      console.error('Unstructured parsing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to parse PDF with Unstructured: ${errorMessage}`);
    }
  }

  private processElements(elements: any[]): MedicalPDFParseResult {
    const result: MedicalPDFParseResult = {
      text: '',
      tables: [],
      elements: [],
      biomarkers: [],
      snps: [],
    };

    let fullText = '';

    for (const element of elements) {
      // Build full text
      if (element.text) {
        fullText += element.text + '\n';
      }

      // Process element types
      result.elements.push({
        type: this.mapElementType(element.type),
        content: element.text || '',
        metadata: element.metadata || {},
      });

      // Extract tables (critical for lab results)
      if (element.type === 'Table') {
        const table = this.processTable(element);
        if (table) {
          result.tables.push(table);
        }
      }

      // Extract biomarkers from text and tables
      const biomarkers = this.extractBiomarkers(element.text || '');
      result.biomarkers.push(...biomarkers);

      // Extract SNPs
      const snps = this.extractSNPs(element.text || '');
      result.snps.push(...snps);
    }

    result.text = fullText.trim();
    
    // Deduplicate biomarkers and SNPs
    result.biomarkers = this.deduplicateBiomarkers(result.biomarkers);
    result.snps = this.deduplicateSNPs(result.snps);

    return result;
  }

  private mapElementType(elementType: string): 'text' | 'table' | 'header' | 'list' {
    switch (elementType?.toLowerCase()) {
      case 'table':
        return 'table';
      case 'header':
      case 'title':
        return 'header';
      case 'list':
      case 'listitem':
        return 'list';
      default:
        return 'text';
    }
  }

  private processTable(element: any): any | null {
    try {
      // Check if this looks like a biomarker or SNP table
      const text = element.text || '';
      const tableType = this.identifyTableType(text);
      
      // Parse table structure if available
      let tableData: Record<string, any>[] = [];
      
      if (element.metadata?.table_as_cells) {
        tableData = this.parseCellStructure(element.metadata.table_as_cells);
      } else {
        // Fallback to text parsing
        tableData = this.parseTableFromText(text);
      }

      return {
        type: tableType,
        data: tableData,
        confidence: this.calculateTableConfidence(text, tableType),
      };
    } catch (error) {
      console.warn('Error processing table:', error);
      return null;
    }
  }

  private identifyTableType(text: string): 'biomarker' | 'snp' | 'general' {
    const biomarkerKeywords = [
      'cholesterol', 'glucose', 'hemoglobin', 'vitamin', 'protein',
      'triglycerides', 'hdl', 'ldl', 'creatinine', 'urea', 'range',
      'normal', 'high', 'low', 'mg/dl', 'mmol/l', 'reference'
    ];
    
    const snpKeywords = [
      'rs', 'snp', 'genotype', 'allele', 'chromosome', 'position',
      'variant', 'mutation', 'polymorphism', 'a/a', 'a/g', 'g/g',
      'c/c', 'c/t', 't/t'
    ];

    const lowerText = text.toLowerCase();
    
    const biomarkerScore = biomarkerKeywords.reduce((score, keyword) => 
      score + (lowerText.includes(keyword) ? 1 : 0), 0);
    
    const snpScore = snpKeywords.reduce((score, keyword) => 
      score + (lowerText.includes(keyword) ? 1 : 0), 0);

    if (biomarkerScore > snpScore && biomarkerScore > 2) return 'biomarker';
    if (snpScore > biomarkerScore && snpScore > 2) return 'snp';
    return 'general';
  }

  private parseCellStructure(cells: any[]): Record<string, any>[] {
    // Convert Unstructured's cell structure to table rows
    const rows: Record<string, any>[] = [];
    const cellsByRow: { [key: number]: any[] } = {};

    // Group cells by row
    for (const cell of cells) {
      const rowIndex = cell.row_index || 0;
      if (!cellsByRow[rowIndex]) {
        cellsByRow[rowIndex] = [];
      }
      cellsByRow[rowIndex].push(cell);
    }

    // Convert to row objects
    const headers = cellsByRow[0]?.map(cell => cell.text || `col_${cell.col_index}`) || [];
    
    for (let i = 1; i < Object.keys(cellsByRow).length; i++) {
      const row: Record<string, any> = {};
      const rowCells = cellsByRow[i] || [];
      
      rowCells.forEach((cell, index) => {
        const header = headers[index] || `col_${index}`;
        row[header] = cell.text || '';
      });
      
      rows.push(row);
    }

    return rows;
  }

  private parseTableFromText(text: string): Record<string, any>[] {
    // Fallback text-based table parsing
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(/\s{2,}|\t/).map(h => h.trim());
    const rows: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/\s{2,}|\t/).map(v => v.trim());
      const row: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      rows.push(row);
    }

    return rows;
  }

  private calculateTableConfidence(text: string, tableType: string): number {
    // Simple confidence scoring based on content
    const hasNumbers = /\d+/.test(text);
    const hasUnits = /(mg\/dl|mmol\/l|g\/l|%|µg\/l)/i.test(text);
    const hasRanges = /(normal|high|low|reference|range)/i.test(text);
    
    let confidence = 0.5; // Base confidence
    
    if (hasNumbers) confidence += 0.2;
    if (hasUnits) confidence += 0.2;
    if (hasRanges) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private extractBiomarkers(text: string): Array<{
    name: string;
    value: string | number;
    unit?: string;
    reference_range?: string;
    status?: 'normal' | 'high' | 'low' | 'critical';
  }> {
    const biomarkers: any[] = [];
    
    // Common biomarker patterns - more precise regex
    const patterns = [
      // "Vitamin D: 25 ng/mL (Normal: 20-50)" or "Vitamin D: 25 ng/mL (Normal)"
      /([A-Za-z][A-Za-z\s]+[A-Za-z])\s*:\s*(\d+(?:\.\d+)?)\s*([a-zA-Z\/µ%]+)\s*(?:\([^)]*\))?/g,
      // "HDL Cholesterol 35 mg/dL Low" - name followed by value, unit, status
      /([A-Za-z][A-Za-z\s]+[A-Za-z])\s+(\d+(?:\.\d+)?)\s+([a-zA-Z\/µ%]+)\s+(normal|high|low|critical)/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const [fullMatch, name, value, unit, extra] = match;
        
        // Skip if name is too short or contains generic words
        const cleanName = name.trim();
        if (cleanName.length < 3 || 
            /^(the|and|or|in|at|to|of|for|with|by)$/i.test(cleanName) ||
            /^\d+/.test(cleanName)) {
          continue;
        }
        
        const biomarker: any = {
          name: cleanName,
          value: parseFloat(value) || value,
          unit: unit?.trim(),
        };

        // Parse status from the fourth capture group (for second pattern)
        if (extra && /^(normal|high|low|critical)$/i.test(extra)) {
          biomarker.status = extra.toLowerCase() as 'normal' | 'high' | 'low' | 'critical';
        } else if (fullMatch.includes('Normal')) {
          biomarker.status = 'normal';
        }

        biomarkers.push(biomarker);
      }
    }

    return biomarkers;
  }

  private extractSNPs(text: string): Array<{
    rsid: string;
    genotype: string;
    chromosome?: string;
    position?: number;
    risk_level?: 'high' | 'moderate' | 'low' | 'protective';
  }> {
    const snps: any[] = [];
    
    // SNP patterns
    const patterns = [
      // "rs123456 A/G Chr1:12345" or "rs123456 A/G Chr1:12345 (High Risk)"
      /(rs\d+)\s+([ATCG]\/[ATCG])\s*(?:Chr(\d+):(\d+))?\s*(?:\(([^)]+)\))?/gi,
      // "rs789012: GG (High Risk)"
      /(rs\d+)\s*:?\s*([ATCG]{2})\s*(?:\(([^)]+)\))?/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const snp: any = {
          rsid: match[1],
          genotype: match[2],
        };

        // Handle chromosome and position (first pattern)
        if (match[3]) snp.chromosome = match[3];
        if (match[4]) snp.position = parseInt(match[4]);

        // Parse risk level from parentheses or surrounding context
        const riskContext = match[5] || match[3] || text.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20);
        
        if (riskContext) {
          const lowerContext = riskContext.toLowerCase();
          if (/high.{0,10}risk/i.test(lowerContext)) {
            snp.risk_level = 'high';
          } else if (/moderate.{0,10}risk/i.test(lowerContext)) {
            snp.risk_level = 'moderate';
          } else if (/low.{0,10}risk/i.test(lowerContext)) {
            snp.risk_level = 'low';
          } else if (/protective/i.test(lowerContext)) {
            snp.risk_level = 'protective';
          }
        }

        snps.push(snp);
      }
    }

    return snps;
  }

  private deduplicateBiomarkers(biomarkers: any[]): any[] {
    const seen = new Set();
    return biomarkers.filter(biomarker => {
      const key = `${biomarker.name}_${biomarker.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private deduplicateSNPs(snps: any[]): any[] {
    const seen = new Set();
    return snps.filter(snp => {
      const key = `${snp.rsid}_${snp.genotype}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// Convenience function for easy usage
export async function parseMedicalPDF(
  file: File | Buffer, 
  filename: string,
  apiKey?: string
): Promise<MedicalPDFParseResult> {
  const parser = new UnstructuredMedicalParser(apiKey);
  return parser.parseMedicalPDF(file, filename);
} 