import { UnstructuredMedicalParser, parseMedicalPDF } from '../src/lib/pdf-parser-unstructured';

// Mock the UnstructuredClient since we don't want to make real API calls in tests
jest.mock('unstructured-client', () => {
  return {
    UnstructuredClient: jest.fn().mockImplementation(() => ({
      general: {
        partition: jest.fn().mockResolvedValue([
          {
            type: 'Table',
            text: 'Biomarker\tValue\tUnit\tReference Range\nCholesterol\t180\tmg/dL\t150-200\nHDL\t45\tmg/dL\t40-60',
            metadata: {
              table_as_cells: [
                { row_index: 0, col_index: 0, text: 'Biomarker' },
                { row_index: 0, col_index: 1, text: 'Value' },
                { row_index: 0, col_index: 2, text: 'Unit' },
                { row_index: 0, col_index: 3, text: 'Reference Range' },
                { row_index: 1, col_index: 0, text: 'Cholesterol' },
                { row_index: 1, col_index: 1, text: '180' },
                { row_index: 1, col_index: 2, text: 'mg/dL' },
                { row_index: 1, col_index: 3, text: '150-200' },
                { row_index: 2, col_index: 0, text: 'HDL' },
                { row_index: 2, col_index: 1, text: '45' },
                { row_index: 2, col_index: 2, text: 'mg/dL' },
                { row_index: 2, col_index: 3, text: '40-60' },
              ]
            }
          },
          {
            type: 'Text',
            text: 'SNP Analysis: rs123456 A/G Chr1:12345 (High Risk)',
            metadata: {}
          },
          {
            type: 'Text',
            text: 'Vitamin D: 25 ng/mL (Normal: 20-50)',
            metadata: {}
          }
        ])
      }
    })),
    Strategy: {
      HiRes: 'hi_res'
    }
  };
});

describe('UnstructuredMedicalParser', () => {
  let parser: UnstructuredMedicalParser;
  
  beforeEach(() => {
    // Set a mock API key
    process.env.UNSTRUCTURED_API_KEY = 'test-api-key';
    parser = new UnstructuredMedicalParser();
  });

  afterEach(() => {
    delete process.env.UNSTRUCTURED_API_KEY;
  });

  describe('Constructor', () => {
    it('should throw error if no API key provided', () => {
      delete process.env.UNSTRUCTURED_API_KEY;
      expect(() => new UnstructuredMedicalParser()).toThrow('Unstructured API key is required');
    });

    it('should accept API key as parameter', () => {
      delete process.env.UNSTRUCTURED_API_KEY;
      expect(() => new UnstructuredMedicalParser('test-key')).not.toThrow();
    });
  });

  describe('parseMedicalPDF', () => {
    it('should parse PDF and extract biomarkers and SNPs', async () => {
      const mockBuffer = Buffer.from('mock pdf content');
      const result = await parser.parseMedicalPDF(mockBuffer, 'test.pdf');

      // Should have parsed content
      expect(result.text).toContain('Cholesterol');
      expect(result.text).toContain('rs123456');
      expect(result.text).toContain('Vitamin D');

      // Should identify table as biomarker type
      expect(result.tables).toHaveLength(1);
      expect(result.tables[0].type).toBe('biomarker');
      expect(result.tables[0].confidence).toBeGreaterThan(0.5);

      // Should extract biomarkers
      expect(result.biomarkers).toHaveLength(1); // Vitamin D from text
      expect(result.biomarkers[0].name).toBe('Vitamin D');
      expect(result.biomarkers[0].value).toBe(25);
      expect(result.biomarkers[0].unit).toBe('ng/mL');

      // Should extract SNPs
      expect(result.snps).toHaveLength(1);
      expect(result.snps[0].rsid).toBe('rs123456');
      expect(result.snps[0].genotype).toBe('A/G');
      expect(result.snps[0].chromosome).toBe('1');
      expect(result.snps[0].position).toBe(12345);
      expect(result.snps[0].risk_level).toBe('high');
    });

    it('should handle File input', async () => {
      const mockFile = new File(['mock content'], 'test.pdf', { type: 'application/pdf' });
      
      const result = await parser.parseMedicalPDF(mockFile, 'test.pdf');
      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
    });

    it('should handle string response from API', async () => {
      // Mock string response
      const mockClient = parser['client'] as any;
      mockClient.general.partition.mockResolvedValueOnce(JSON.stringify([
        {
          type: 'Text',
          text: 'Glucose: 95 mg/dL (Normal)',
          metadata: {}
        }
      ]));

      const mockBuffer = Buffer.from('mock pdf content');
      const result = await parser.parseMedicalPDF(mockBuffer, 'test.pdf');

      expect(result.text).toContain('Glucose');
      expect(result.biomarkers).toHaveLength(1);
      expect(result.biomarkers[0].name).toBe('Glucose');
      expect(result.biomarkers[0].status).toBe('normal');
    });

    it('should handle API errors gracefully', async () => {
      const mockClient = parser['client'] as any;
      mockClient.general.partition.mockRejectedValueOnce(new Error('API Error'));

      const mockBuffer = Buffer.from('mock pdf content');
      
      await expect(parser.parseMedicalPDF(mockBuffer, 'test.pdf'))
        .rejects.toThrow('Failed to parse PDF with Unstructured: API Error');
    });
  });

  describe('Table Processing', () => {
    it('should identify biomarker tables correctly', () => {
      const text = 'Cholesterol 180 mg/dL Normal Range 150-200';
      const tableType = parser['identifyTableType'](text);
      expect(tableType).toBe('biomarker');
    });

    it('should identify SNP tables correctly', () => {
      const text = 'rs123456 A/G Chr1:12345 High Risk Variant';
      const tableType = parser['identifyTableType'](text);
      expect(tableType).toBe('snp');
    });

    it('should parse cell structure correctly', () => {
      const cells = [
        { row_index: 0, col_index: 0, text: 'Name' },
        { row_index: 0, col_index: 1, text: 'Value' },
        { row_index: 1, col_index: 0, text: 'Test' },
        { row_index: 1, col_index: 1, text: '123' },
      ];

      const result = parser['parseCellStructure'](cells);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ Name: 'Test', Value: '123' });
    });
  });

  describe('Biomarker Extraction', () => {
    it('should extract biomarkers with units and ranges', () => {
      const text = 'Total Cholesterol: 220 mg/dL (Reference: 150-200)';
      const biomarkers = parser['extractBiomarkers'](text);
      
      expect(biomarkers).toHaveLength(1);
      expect(biomarkers[0].name).toBe('Total Cholesterol');
      expect(biomarkers[0].value).toBe(220);
      expect(biomarkers[0].unit).toBe('mg/dL');
    });

    it('should extract biomarkers with status', () => {
      const text = 'HDL Cholesterol 35 mg/dL Low';
      const biomarkers = parser['extractBiomarkers'](text);
      
      expect(biomarkers).toHaveLength(1);
      expect(biomarkers[0].name).toBe('HDL Cholesterol');
      expect(biomarkers[0].value).toBe(35);
      expect(biomarkers[0].status).toBe('low');
    });

    it('should skip generic words', () => {
      const text = 'The 123 and 456 or 789';
      const biomarkers = parser['extractBiomarkers'](text);
      expect(biomarkers).toHaveLength(0);
    });
  });

  describe('SNP Extraction', () => {
    it('should extract SNPs with chromosome and position', () => {
      const text = 'rs1234567 A/G Chr2:54321';
      const snps = parser['extractSNPs'](text);
      
      expect(snps).toHaveLength(1);
      expect(snps[0].rsid).toBe('rs1234567');
      expect(snps[0].genotype).toBe('A/G');
      expect(snps[0].chromosome).toBe('2');
      expect(snps[0].position).toBe(54321);
    });

    it('should extract SNPs with risk levels', () => {
      const text = 'rs9876543: GG (Moderate Risk)';
      const snps = parser['extractSNPs'](text);
      
      expect(snps).toHaveLength(1);
      expect(snps[0].rsid).toBe('rs9876543');
      expect(snps[0].genotype).toBe('GG');
      expect(snps[0].risk_level).toBe('moderate');
    });
  });

  describe('Deduplication', () => {
    it('should deduplicate biomarkers', () => {
      const biomarkers = [
        { name: 'Cholesterol', value: 180, unit: 'mg/dL' },
        { name: 'Cholesterol', value: 180, unit: 'mg/dL' }, // duplicate
        { name: 'HDL', value: 45, unit: 'mg/dL' },
      ];

      const deduplicated = parser['deduplicateBiomarkers'](biomarkers);
      expect(deduplicated).toHaveLength(2);
    });

    it('should deduplicate SNPs', () => {
      const snps = [
        { rsid: 'rs123', genotype: 'A/G' },
        { rsid: 'rs123', genotype: 'A/G' }, // duplicate
        { rsid: 'rs456', genotype: 'C/C' },
      ];

      const deduplicated = parser['deduplicateSNPs'](snps);
      expect(deduplicated).toHaveLength(2);
    });
  });
});

describe('parseMedicalPDF convenience function', () => {
  it('should create parser and parse PDF', async () => {
    process.env.UNSTRUCTURED_API_KEY = 'test-api-key';
    
    const mockBuffer = Buffer.from('mock pdf content');
    const result = await parseMedicalPDF(mockBuffer, 'test.pdf');
    
    expect(result).toBeDefined();
    expect(result.text).toBeDefined();
    expect(result.biomarkers).toBeDefined();
    expect(result.snps).toBeDefined();
    
    delete process.env.UNSTRUCTURED_API_KEY;
  });
}); 