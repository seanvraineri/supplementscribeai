const fs = require('fs');

// Simulate the bulletproof extraction logic locally
function runBulletproofExtraction(text) {
  console.log('🔥 Running IMPROVED bulletproof NER extraction...');
  
  // Known biomarker names for validation
  const knownBiomarkers = [
    'glucose', 'cholesterol', 'hemoglobin', 'hematocrit', 'vitamin d', 'vitamin b12',
    'tsh', 'free t4', 'free t3', 'cortisol', 'testosterone', 'estradiol', 'progesterone',
    'creatinine', 'bun', 'alt', 'ast', 'alkaline phosphatase', 'bilirubin', 'albumin',
    'sodium', 'potassium', 'chloride', 'calcium', 'magnesium', 'phosphorus',
    'triglycerides', 'hdl', 'ldl', 'total cholesterol', 'c-reactive protein', 'crp',
    'ferritin', 'iron', 'folate', 'b12', 'rbc', 'wbc', 'platelets', 'mcv', 'mch', 'mchc'
  ];
  
  // Medical units - comprehensive list
  const medicalUnits = [
    'mg/dl', 'mg/dL', 'mmol/l', 'mmol/L', 'ng/ml', 'ng/mL', 
    'μg/dl', 'μg/dL', 'iu/l', 'IU/L', 'u/l', 'U/L', 
    'g/dl', 'g/dL', '%', 'pg/ml', 'pg/mL', 'miu/l', 'mIU/L',
    'copies/ml', 'cells/ul', 'cells/uL', 'k/ul', 'k/uL', 'fl', 'fL', 'pg'
  ];

  const biomarkers = [];
  
  // Strategy 1: Direct biomarker name + value patterns
  const directPatterns = [
    // "Glucose 95 mg/dL" or "Glucose: 95 mg/dL"
    /\b(glucose|cholesterol|hemoglobin|hematocrit|creatinine|sodium|potassium|calcium)\s*:?\s*([0-9.,]+)\s*(mg\/d[lL]|g\/d[lL]|mmol\/[lL]|mEq\/[lL])/gi,
    // "TSH 2.5 mIU/L"
    /\b(tsh|free\s*t[34]|cortisol|testosterone|estradiol)\s*:?\s*([0-9.,]+)\s*(miu\/l|mIU\/L|ng\/ml|ng\/mL|pg\/ml|pg\/mL)/gi,
    // "Vitamin D 32 ng/mL"
    /\b(vitamin\s*[db]?12?|folate|ferritin|iron)\s*:?\s*([0-9.,]+)\s*(ng\/ml|ng\/mL|μg\/dl|μg\/dL|pg\/ml|pg\/mL)/gi,
    // "HDL 65 mg/dL"
    /\b(hdl|ldl|triglycerides|total\s*cholesterol)\s*:?\s*([0-9.,]+)\s*(mg\/d[lL])/gi
  ];
  
  for (const pattern of directPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1].trim().replace(/\s+/g, ' ');
      const value = parseFloat(match[2].replace(',', ''));
      const unit = match[3].trim();
      
      if (!isNaN(value) && value > 0 && value < 10000) { // Reasonable range
        biomarkers.push({
          marker_name: name,
          value: value,
          unit: unit,
          source: 'direct-pattern',
          confidence: 95
        });
      }
    }
  }
  
  // Strategy 2: Table row parsing (common lab format)
  const lines = text.split('\n');
  for (const line of lines) {
    // Skip obviously non-data lines
    if (line.length < 10 || line.includes('Patient') || line.includes('Date') || line.includes('Page')) {
      continue;
    }
    
    // Look for: "Test Name    Value    Unit    Reference"
    const parts = line.trim().split(/\s{2,}/); // Split on 2+ spaces
    if (parts.length >= 3) {
      const testName = parts[0].trim().toLowerCase();
      const valueStr = parts[1].trim();
      const unitStr = parts[2].trim();
      
      // Check if test name is a known biomarker
      const isKnownBiomarker = knownBiomarkers.some(known => 
        testName.includes(known) || known.includes(testName)
      );
      
      if (isKnownBiomarker) {
        const value = parseFloat(valueStr.replace(',', ''));
        if (!isNaN(value) && value > 0 && medicalUnits.some(unit => 
          unitStr.toLowerCase().includes(unit.toLowerCase())
        )) {
          const exists = biomarkers.some(b => 
            b.marker_name.toLowerCase() === testName && 
            Math.abs(b.value - value) < 0.01
          );
          
          if (!exists) {
            biomarkers.push({
              marker_name: testName,
              value: value,
              unit: unitStr,
              source: 'table-row',
              confidence: 90
            });
          }
        }
      }
    }
  }
  
  // Filter out obviously bad extractions
  const filteredBiomarkers = biomarkers.filter(b => {
    // Must have reasonable name length
    if (b.marker_name.length < 3 || b.marker_name.length > 50) return false;
    
    // Must not be mostly random characters
    const alphaRatio = (b.marker_name.match(/[a-zA-Z]/g) || []).length / b.marker_name.length;
    if (alphaRatio < 0.5) return false;
    
    // Must not be single letters or random combinations
    if (b.marker_name.match(/^[a-zA-Z]\s*[a-zA-Z]?$/)) return false;
    
    return true;
  });
  
  console.log(`🎯 IMPROVED extraction found ${filteredBiomarkers.length} valid biomarkers`);
  
  return {
    biomarkers: filteredBiomarkers.slice(0, 20), // Limit to top 20 quality results
    snps: [],
    strategies: 'improved-medical-NER'
  };
}

// Simple PDF text extraction
function extractTextFromPDF(pdfContent) {
  console.log('🔍 Attempting enhanced PDF text extraction...');
  
  try {
    let extractedText = '';
    
    // Method 1: Extract text between parentheses (PDF text encoding)
    const parenTextRegex = /\(([^)]+)\)/g;
    let match;
    while ((match = parenTextRegex.exec(pdfContent)) !== null) {
      const text = match[1];
      // Decode common PDF escape sequences
      const decodedText = text
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\');
      extractedText += decodedText + ' ';
    }
    
    // Clean up and format
    extractedText = extractedText
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/[^\w\s\.\-\(\)\/\:]/g, ' ')  // Remove PDF artifacts
      .replace(/\s+/g, ' ')  // Remove extra spaces again
      .trim();
    
    console.log(`📄 PDF extraction complete: ${extractedText.length} characters`);
    console.log(`📄 PDF Extraction Preview (first 500 chars):`, extractedText.substring(0, 500));
    
    return extractedText;
    
  } catch (error) {
    console.error('❌ PDF text extraction error:', error);
    return pdfContent;
  }
}

async function testBulletproofOnly() {
  console.log('🧪 Testing bulletproof extraction only (no OpenAI needed)...');

  // Test with dummy text first
  console.log('📝 Testing with dummy blood report...');
  const textContent = fs.readFileSync('scripts/dummy_blood_report.txt', 'utf8');
  console.log('Text content:', textContent);
  
  const textResults = runBulletproofExtraction(textContent);
  console.log('✅ Text extraction results:');
  if (textResults.biomarkers.length > 0) {
    textResults.biomarkers.forEach((b, i) => {
      console.log(`  ${i + 1}. ${b.marker_name}: ${b.value} ${b.unit} [${b.source}] (${b.confidence}% confidence)`);
    });
  } else {
    console.log('  No biomarkers found');
  }

  // Test with PDFs
  const pdfFiles = ['scripts/labreport.pdf', 'scripts/sample-report.pdf'];
  
  for (const pdfPath of pdfFiles) {
    console.log(`\n📄 Testing: ${pdfPath}`);
    
    try {
      const pdfBuffer = fs.readFileSync(pdfPath);
      const base64String = pdfBuffer.toString('base64');
      
      // Decode base64 back to binary
      const decodedPdf = Buffer.from(base64String, 'base64').toString('binary');
      
      console.log(`📊 PDF size: ${pdfBuffer.length} bytes`);
      console.log(`🔍 PDF starts with: ${decodedPdf.substring(0, 20)}`);
      
      // Extract text from PDF
      const extractedText = extractTextFromPDF(decodedPdf);
      
      if (extractedText.length > 50) {
        // Run bulletproof extraction
        const results = runBulletproofExtraction(extractedText);
        
        console.log(`✅ ${pdfPath} extraction completed!`);
        if (results.biomarkers.length > 0) {
          console.log(`📊 Found ${results.biomarkers.length} biomarkers:`);
          results.biomarkers.forEach((b, i) => {
            console.log(`  ${i + 1}. ${b.marker_name}: ${b.value} ${b.unit} [${b.source}] (${b.confidence}% confidence)`);
          });
        } else {
          console.log('📊 No biomarkers extracted');
        }
      } else {
        console.log('❌ PDF text extraction failed - too little text extracted');
      }

    } catch (error) {
      console.error(`💥 Error testing ${pdfPath}:`, error.message);
    }
  }
  
  console.log('\n🎉 Bulletproof extraction testing completed!');
}

testBulletproofOnly(); 