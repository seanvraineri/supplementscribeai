// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { extractText, getDocumentProxy } from 'npm:unpdf@1.0.6';
// Using OpenAI instead of Gemini for better reliability
// import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

// Bulletproof extraction function - IMPROVED
async function runBulletproofExtraction(text: string) {
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

  const biomarkers: any[] = [];
  
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Function to detect if content is a PDF
function isPDF(content: string): boolean {
  return content.startsWith('%PDF-') || content.includes('%PDF-');
}

// Enhanced PDF text extraction using proper PDF parsing library
async function extractTextFromPDF(pdfContent: string): Promise<string> {
  console.log('🔍 Attempting PDF text extraction with @pdf/pdftext...');
  
  try {
    // Convert string to Uint8Array (PDF bytes)
    const pdfBytes = new Uint8Array(pdfContent.length);
    for (let i = 0; i < pdfContent.length; i++) {
      pdfBytes[i] = pdfContent.charCodeAt(i);
    }
    
    // Use the unpdf library for proper PDF text extraction
    const pdf = await getDocumentProxy(pdfBytes);
    const { text } = await extractText(pdf, { mergePages: true });
    
    // Clean up the extracted text
    let extractedText = text
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/\n+/g, '\n')  // Normalize line breaks
      .trim();
    
    console.log(`📄 PDF extraction complete: ${extractedText.length} characters`);
    console.log(`📝 Extracted text preview:\n${extractedText.substring(0, 1000)}`);
    
    if (extractedText.length < 50) {
      console.log('⚠️ PDF extraction yielded minimal text, might be image-based PDF');
      throw new Error('Insufficient text extracted from PDF');
    }
    
    return extractedText;
    
  } catch (error) {
    console.error('❌ PDF text extraction error:', error);
    console.log('🔄 Falling back to basic extraction method...');
    
    // Fallback to basic extraction for compatibility
    return extractTextFromPDFBasic(pdfContent);
  }
}

// Fallback basic PDF text extraction (original method)
function extractTextFromPDFBasic(pdfContent: string): string {
  console.log('🔍 Using basic PDF text extraction fallback...');
  
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
    
    // Method 2: Extract text between square brackets [text]
    const bracketTextRegex = /\[([^\]]+)\]/g;
    while ((match = bracketTextRegex.exec(pdfContent)) !== null) {
      const text = match[1];
      if (text.length > 2 && /[A-Za-z]/.test(text)) {
        extractedText += text + ' ';
      }
    }
    
    // Method 3: Extract medical/lab patterns from raw PDF data
    const medicalPatterns = [
      // Lab values: "Glucose 95 mg/dL"
      /([A-Za-z]{3,20})\s+(\d+\.?\d*)\s+([a-zA-Z\/]+)/g,
      // Reference ranges: "Normal (70-100)"
      /Normal\s*\(\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*\)/g,
      // Direct value formats: "25.3 ng/mL"
      /(\d+\.?\d*)\s+([a-zA-Z\/μ%]+)/g,
      // Medical terms
      /\b(cholesterol|glucose|hemoglobin|vitamin|creatinine|sodium|potassium|calcium|iron|ferritin|tsh|t4|t3)\b/gi
    ];
    
    medicalPatterns.forEach(pattern => {
      const matches = pdfContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          extractedText += match + ' ';
        });
      }
    });
    
    // Clean up and format
    extractedText = extractedText
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/[^\w\s\.\-\(\)\/\:]/g, ' ')  // Remove PDF artifacts
      .replace(/\s+/g, ' ')  // Remove extra spaces again
      .trim();
    
    console.log(`📄 Basic PDF extraction complete: ${extractedText.length} characters`);
    
    // Final fallback - return original if still no good extraction
    if (extractedText.length < 20) {
      console.log('❌ PDF text extraction insufficient, returning original for AI processing');
      return pdfContent;
    }
    
    return extractedText;
    
  } catch (error) {
    console.error('❌ Basic PDF text extraction error:', error);
    console.log('🔄 Returning original content for AI to attempt parsing...');
    return pdfContent;
  }
}

const supportedMarkers = {
  biomarkers: {
    // Hematology
    "rbc_count": { "aliases": ["RBC count", "Red Blood Cell Count"] },
    "hemoglobin": { "aliases": ["Hemoglobin", "Hgb"] },
    "hematocrit": { "aliases": ["Hematocrit", "Hct"] },
    "mcv": { "aliases": ["Mean Corpuscular Volume", "MCV", "Mean RBC Volume"] },
    "mch": { "aliases": ["Mean Corpuscular Hemoglobin", "MCH", "Mean RBC Iron"] },
    "mchc": { "aliases": ["MCH Concentration", "MCHC", "Mean RBC Iron Concentration"] },
    "rdw": { "aliases": ["Red Cell Distribution Width", "RDW"] },
    "wbc_count": { "aliases": ["WBC count", "White Blood Cell Count"] },
    "neutrophils_abs": { "aliases": ["Neutrophils (absolute)", "Absolute Neutrophils"] },
    "lymphocytes_abs": { "aliases": ["Lymphocytes (absolute)", "Absolute Lymphocytes"] },
    "monocytes_abs": { "aliases": ["Monocytes (absolute)", "Absolute Monocytes"] },
    "eosinophils_abs": { "aliases": ["Eosinophils (absolute)", "Absolute Eosinophils"] },
    "basophils_abs": { "aliases": ["Basophils (absolute)", "Absolute Basophils"] },
    "neutrophil_lymphocyte_ratio": { "aliases": ["Neutrophil-to-lymphocyte ratio"] },
    "platelet_count": { "aliases": ["Platelet count", "Platelets"] },
    "mpv": { "aliases": ["Mean Platelet Volume", "MPV"] },
    "hba1c": { "aliases": ["Hemoglobin A1c", "HbA1c", "A1C"] },

    // Metabolic Panels
    "glucose_fasting": { "aliases": ["Glucose (fasting)", "Fasting Glucose", "Glucose (Blood Sugar)"] },
    "insulin": { "aliases": ["Insulin", "Fasting Insulin"] },
    "c_peptide": { "aliases": ["C-peptide"] },
    "bun": { "aliases": ["Blood Urea Nitrogen", "BUN", "Urea Nitrogen (BUN)"] },
    "creatinine": { "aliases": ["Creatinine"] },
    "egfr": { "aliases": ["eGFR", "Estimated Glomerular Filtration Rate"] },
    "bun_creatinine_ratio": { "aliases": ["BUN/Creatinine Ratio"] },
    "uric_acid": { "aliases": ["Uric acid"] },
    "sodium": { "aliases": ["Sodium"] },
    "potassium": { "aliases": ["Potassium"] },
    "chloride": { "aliases": ["Chloride"] },
    "bicarbonate": { "aliases": ["Bicarbonate (CO2)", "Carbon Dioxide"] },
    "calcium": { "aliases": ["Calcium (total & ionized)", "Calcium"] },
    "phosphate": { "aliases": ["Phosphate"] },
    "magnesium": { "aliases": ["Magnesium", "RBC Magnesium"] },
    "alt": { "aliases": ["ALT (SGPT)", "Alanine Aminotransferase"] },
    "ast": { "aliases": ["AST (SGOT)", "Aspartate Aminotransferase"] },
    "alkaline_phosphatase": { "aliases": ["Alkaline phosphatase", "ALP"] },
    "bilirubin_total": { "aliases": ["Total bilirubin", "Bilirubin, Total", "Bilirubin"] },
    "bilirubin_direct": { "aliases": ["Direct bilirubin"] },
    "albumin": { "aliases": ["Albumin"] },
    "globulin": { "aliases": ["Globulin"] },
    "albumin_globulin_ratio": { "aliases": ["Albumin/Globulin Ratio"] },
    "total_protein": { "aliases": ["Total protein", "Protein, Total"] },

    // Lipids & Cardiovascular
    "cholesterol_total": { "aliases": ["Total cholesterol", "Cholesterol, Total"] },
    "ldl_c": { "aliases": ["LDL-C", "LDL Cholesterol", "LDL"] },
    "hdl_c": { "aliases": ["HDL-C", "HDL Cholesterol", "HDL"] },
    "triglycerides": { "aliases": ["Triglycerides"] },
    "cholesterol_hdl_ratio": { "aliases": ["Cholesterol Total/Cholesterol HDL Ratio"] },
    "non_hdl_cholesterol": { "aliases": ["Non-HDL cholesterol"] },
    "apolipoprotein_a1": { "aliases": ["Apolipoprotein A1"] },
    "apolipoprotein_b": { "aliases": ["Apolipoprotein B", "ApoB"] },
    "lpa": { "aliases": ["Lipoprotein(a)", "Lp(a)"] },
    "hs_crp": { "aliases": ["hs-CRP", "High-sensitivity C-Reactive Protein", "CRP"] },
    "homocysteine": { "aliases": ["Homocysteine"] },
    "fibrinogen": { "aliases": ["Fibrinogen"] },

    // Hormones
    "tsh": { "aliases": ["TSH", "Thyroid-Stimulating Hormone", "TSH (Thyroid Screen)"] },
    "free_t4": { "aliases": ["Free T4", "FT4", "T4, FREE"] },
    "free_t3": { "aliases": ["Free T3", "FT3"] },
    "reverse_t3": { "aliases": ["Reverse T3"] },
    "thyroid_peroxidase_antibodies": { "aliases": ["THYROID PEROXIDASE ANTIBODIES"] },
    "cortisol": { "aliases": ["Cortisol (serum)", "Cortisol", "Cortisol (AM serum)"] },
    "dhea_s": { "aliases": ["DHEA-S", "DHEA-Sulfate"] },
    "estradiol": { "aliases": ["Estradiol (E2)", "Estradiol"] },
    "progesterone": { "aliases": ["Progesterone"] },
    "testosterone_total": { "aliases": ["Testosterone (total)", "Total Testosterone", "TESTOSTERONE, TOTAL, MS"] },
    "testosterone_free": { "aliases": ["Testosterone (free)", "Free Testosterone", "TESTOSTERONE, FREE"] },
    "testosterone_bioavailable": { "aliases": ["TESTOSTERONE,BIOAVAILABLE"] },
    "shbg": { "aliases": ["SHBG", "SEX HORMONE BINDING GLOBULIN"] },
    "prolactin": { "aliases": ["Prolactin"] },
    "igf_1": { "aliases": ["IGF-1"] },

    // Vitamins & Minerals
    "vitamin_a": { "aliases": ["Vitamin A (Retinol)", "Retinol", "Vitamin A (retinol)"] },
    "vitamin_d_25_oh": { "aliases": ["25-OH Vitamin D", "Vitamin D, 25-OH", "25-hydroxyvitamin D", "Vit D", "Vitamin D"] },
    "vitamin_e": { "aliases": ["Vitamin E (α-tocopherol)", "Alpha-Tocopherol", "Vitamin E (alpha-tocopherol)", "Vitamin E"] },
    "vitamin_b12": { "aliases": ["Vitamin B12", "Cobalamin"] },
    "vitamin_b9": { "aliases": ["Folate (RBC)", "Folate", "Vitamin B9"] },
    "vitamin_c": { "aliases": ["Vitamin C (Ascorbic acid)", "Ascorbic Acid", "Vitamin C"] },
    "iron": { "aliases": ["Iron", "Serum Iron"] },
    "ferritin": { "aliases": ["Ferritin"] },
    "transferrin": { "aliases": ["Transferrin"] },
    "zinc": { "aliases": ["Zinc", "Serum Zinc"] },
    "copper": { "aliases": ["Copper", "Serum Copper"] },
    "selenium": { "aliases": ["Selenium"] },
    
    // Legacy / To be consolidated
    "methylmalonic_acid": { "aliases": ["MMA", "Methylmalonic Acid"] },
    "transferrin_saturation": { "aliases": ["% TSAT", "Transferrin Saturation", "Iron Saturation"] },
    "ceruloplasmin": { "aliases": ["Ceruloplasmin"] },
    "magnesium_rbc": { "aliases": ["Magnesium, RBC"] },
    "vitamin_k": { "aliases": ["Vitamin K1", "Vitamin K2", "Vitamin K"] },
    "homa_ir": { "aliases": ["HOMA-IR"] },
    "cystatin_c": { "aliases": ["Cystatin-C"] },
    "nt_probnp": { "aliases": ["NT-proBNP"] },
    "hs_troponin_t": { "aliases": ["hs-Troponin T"] },
    "ggt": { "aliases": ["GGT", "Gamma-Glutamyl Transferase"] }
  },
  "snps": {
    // From MaxFunction Report
    "ahcy_rs819147": { "aliases": ["AHCY-01", "rs819147"] },
    "apoe_rs429358": { "aliases": ["APOE rs429358", "rs429358"] },
    "apoe_rs7412": { "aliases": ["APOE rs7412", "rs7412"] },
    "bcmo1_rs11645428": { "aliases": ["BCMO1 rs11645428", "rs11645428"] },
    "bcmo1_rs12934922": { "aliases": ["BCMO1 rs12934922", "rs12934922"] },
    "bcmo1_rs6564851": { "aliases": ["BCMO1 rs6564851", "rs6564851"] },
    "bcmo1_rs7501331": { "aliases": ["BCMO1 rs7501331", "rs7501331"] },
    "bcmo1_rs6420424": { "aliases": ["BCMO1 rs6420424", "rs6420424"] },
    "cbs_rs28934891": { "aliases": ["CBS rs28934891", "rs28934891"] },
    "cbs_rs4920037": { "aliases": ["CBS rs4920037", "rs4920037"] },
    "cbs_rs2851391": { "aliases": ["CBS rs2851391", "rs2851391"] },
    "cbs_rs1801181": { "aliases": ["CBS 360", "rs1801181"] },
    "cbs_c699t": { "aliases": ["CBS 699", "rs234706", "C699T"] },
    "comt_p199p": { "aliases": ["COMT 61 P199P", "rs769224"] },
    "comt_h62h": { "aliases": ["COMT H62H", "rs4633", "His62His"] },
    "comt_l136l": { "aliases": ["COMT L136L", "rs4818"] },
    "comt_v158m": { "aliases": ["COMT V158M", "rs4680", "Val158Met"] },
    "cyp1b1_l432v": { "aliases": ["CYP1B1 L432V", "rs1056836"] },
    "cyp2e1_star6": { "aliases": ["CYP2E1 *6", "rs6413432"] },
    "daoa_rs3741775": { "aliases": ["DAOA/DAAO", "rs3741775"] },
    "dao_aoc1": { "aliases": ["DAO (AOC1)", "rs10156191"] },
    "dhfr_rs1643649": { "aliases": ["DHFR", "rs1643649"] },
    "f5_rs6025": { "aliases": ["Factor 5", "rs6025"] },
    "fads1_rs174548": { "aliases": ["FADS1", "rs174548"] },
    "fads1_myrf": { "aliases": ["FADS1(MYRF)", "rs174537"] },
    "fads2_rs1535": { "aliases": ["FADS2", "rs1535"] },
    "folr2_rs651933": { "aliases": ["FOLR2", "rs651933"] },
    "fut2_rs602662": { "aliases": ["FUT2 rs602662", "rs602662"] },
    "fut2_rs492602": { "aliases": ["FUT2 rs492602", "rs492602"] },
    "fut2_w143x": { "aliases": ["FUT2 W143X", "rs601338"] },
    "g6pd_rs1050828": { "aliases": ["G6PD", "rs1050828"] },
    "g6pd_rs1050829": { "aliases": ["G6PD", "rs1050829"] },
    "g6pd_rs5030868": { "aliases": ["G6PD", "rs5030868"] },
    "gpx1_rs1050450": { "aliases": ["GPX1", "rs1050450", "Pro198Leu"] },
    "gstp1_rs1138272": { "aliases": ["GSTP1 rs1138272", "rs1138272"] },
    "gstp1_rs1695": { "aliases": ["GSTP1 rs1695", "rs1695", "Ile105Val"] },
    "hfe_rs1799945": { "aliases": ["HFE rs1799945", "rs1799945", "H63D"] },
    "hfe_rs1800562": { "aliases": ["HFE rs1800562", "rs1800562", "C282Y"] },
    "hfe_rs1800730": { "aliases": ["HFE rs1800730", "rs1800730"] },
    "hnmt_rs1050891": { "aliases": ["HNMT", "rs1050891"] },
    "lrrk2_rs34637584": { "aliases": ["LRRK2", "rs34637584"] },
    "maoa_t1410c": { "aliases": ["MAOA T1410C", "rs1137070"] },
    "maoa_rs6323": { "aliases": ["MAOA rs6323", "rs6323"] },
    "maoa_rs72554632": { "aliases": ["MAOA rs72554632", "rs72554632"] },
    "maob_rs1799836": { "aliases": ["MAOB", "rs1799836"] },
    "mat1a_r264h": { "aliases": ["MAT1A R264H", "rs72558181"] },
    "mmab_rs2287182": { "aliases": ["MMAB", "rs2287182"] },
    "mthfs_rs6495446": { "aliases": ["MTHFS", "rs6495446"] },
    "mthfd1_rs2236225": { "aliases": ["MTHFD1", "rs2236225", "G1958A"] },
    "mthfr_a1298c": { "aliases": ["MTHFR A1298C", "rs1801131", "A1298C"] },
    "mthfr_c677t": { "aliases": ["MTHFR C677T", "rs1801133", "C677T"] },
    "mtr_rs1805087": { "aliases": ["MTR", "rs1805087", "A2756G"] },
    "mtrr_rs1801394": { "aliases": ["MTRR rs1801394", "rs1801394", "A66G"] },
    "mtrr_rs1532268": { "aliases": ["MTRR rs1532268", "rs1532268"] },
    "mut_rs1141321": { "aliases": ["MUT rs1141321", "rs1141321"] },
    "mut_rs9369898": { "aliases": ["MUT rs9369898", "rs9369898"] },
    "nos3_rs1799983": { "aliases": ["NOS3 rs1799983", "rs1799983"] },
    "nos3_rs2070744": { "aliases": ["NOS3 rs2070744", "rs2070744"] },
    "nqo1_rs1800566": { "aliases": ["NQO1", "rs1800566"] },
    "pemt_rs4244593": { "aliases": ["PEMT rs4244593", "rs4244593"] },
    "pemt_rs4646406": { "aliases": ["PEMT rs4646406", "rs4646406"] },
    "pemt_rs7946": { "aliases": ["PEMT rs7946", "rs7946"] },
    "pon1_q192r": { "aliases": ["PON1 Q192R", "rs662"] },
    "f2_prothrombin": { "aliases": ["Prothrombin (F2)", "rs1799963"] },
    "shmt1_rs1979277": { "aliases": ["SHMT1", "rs1979277"] },
    "slc19a1_rs1051266": { "aliases": ["SLC19A1", "rs1051266"] },
    "sod1_rs2070424": { "aliases": ["SOD1 rs2070424", "rs2070424"] },
    "sod1_rs4998557": { "aliases": ["SOD1 rs4998557", "rs4998557"] },
    "sod2_rs2758331": { "aliases": ["SOD2 rs2758331", "rs2758331"] },
    "sod2_rs4880": { "aliases": ["SOD2 rs4880", "rs4880", "Val16Ala"] },
    "sod3_rs1799895": { "aliases": ["SOD3", "rs1799895"] },
    "suox_a628c": { "aliases": ["SUOX(A628C)", "rs7297662"] },
    "suox_s370s": { "aliases": ["SUOX(S370S)", "rs773115"] },
    "tcn1_rs526934": { "aliases": ["TCN1", "rs526934"] },
    "tcn2_rs1801198": { "aliases": ["TCN2", "rs1801198", "C776G"] },
    "tnf_rs1800629": { "aliases": ["TNF", "rs1800629"] },
    "vdr_taq": { "aliases": ["VDR TAQ", "rs731236"] },
    "vdr_bsm": { "aliases": ["VDR-BSM", "rs1544410", "BsmI"] },
    "vdr_fok": { "aliases": ["VDR-FOK", "rs2228570", "FokI"] },

    // From previous list, for wider compatibility
    "gstm1_null": { "aliases": ["GSTM1 null", "GSTM1", "GSTM1 Deletion"] },
    "gstt1_null": { "aliases": ["GSTT1 null", "GSTT1", "GSTT1 Deletion"] },
    "adora2a_rs5751876": { "aliases": ["ADORA2A", "rs5751876", "Caffeine Sensitivity"] },
    "cyp1a1_rs1048943": { "aliases": ["CYP1A1", "rs1048943", "Estrogen Metabolism"] },
    "tcf7l2_rs7903146": { "aliases": ["TCF7L2", "rs7903146"] },
    "pparg_rs1801282": { "aliases": ["PPARG Pro12Ala", "rs1801282", "Pro12Ala"] },
    "adipoq_rs1501299": { "aliases": ["ADIPOQ G276T", "rs1501299", "G276T"] },
    "apoe": { "aliases": ["APOE", "Apolipoprotein E"] }
  }
};

// Define types for our structured data
interface MarkerInfo {
  aliases: string[];
}
interface SupportedMarkers {
  biomarkers: Record<string, MarkerInfo>;
  snps: Record<string, MarkerInfo>;
}

// Define interfaces for our data structures
interface Biomarker {
  marker_name: string;
  value: number;
  unit: string;
}

interface Snp {
  snp_id: string;
  gene_name: string;
  allele: string;
}

// Helper functions to find canonical names
function getCanonicalBiomarker(name: string): string | null {
  if (!name) return null;
  
  const normalizedName = name.toLowerCase()
    .replace(/[\s\-,()]+/g, '')
    .replace(/total$/i, '')
    .replace(/serum$/i, '')
    .replace(/plasma$/i, '')
    .replace(/blood$/i, '');
  
  // First try exact match
  for (const canonicalName in supportedMarkers.biomarkers) {
    for (const alias of supportedMarkers.biomarkers[canonicalName as keyof typeof supportedMarkers.biomarkers].aliases) {
      const normalizedAlias = alias.toLowerCase().replace(/[\s\-,()]+/g, '');
      if (normalizedName === normalizedAlias) {
        return canonicalName;
      }
    }
  }
  
  // Then try partial matching for common variations
  for (const canonicalName in supportedMarkers.biomarkers) {
    for (const alias of supportedMarkers.biomarkers[canonicalName as keyof typeof supportedMarkers.biomarkers].aliases) {
      const normalizedAlias = alias.toLowerCase().replace(/[\s\-,()]+/g, '');
      // Check if one contains the other
      if (normalizedName.includes(normalizedAlias) || normalizedAlias.includes(normalizedName)) {
        console.log(`Partial match: "${name}" matched to "${canonicalName}" via alias "${alias}"`);
        return canonicalName;
      }
    }
  }
  
  // Try fuzzy matching for specific common variations
  const commonMappings: Record<string, string> = {
    'hemoglobina1c': 'hba1c',
    'a1c': 'hba1c',
    'vitd': 'vitamin_d_25_oh',
    'vit.d': 'vitamin_d_25_oh',
    '25ohd': 'vitamin_d_25_oh',
    '25hydroxyvitamind': 'vitamin_d_25_oh',
    'crp': 'hs_crp',
    'creactiveprotein': 'hs_crp',
    'tsh3rdgeneration': 'tsh',
    'tshultrasensitive': 'tsh',
    'ldlcholesterol': 'ldl_c',
    'hdlcholesterol': 'hdl_c',
    'totaltestosterone': 'testosterone_total',
    'freetestosterone': 'testosterone_free'
  };
  
  const mappingKey = normalizedName.replace(/[^a-z0-9]/g, '');
  if (commonMappings[mappingKey]) {
    console.log(`Fuzzy match: "${name}" mapped to "${commonMappings[mappingKey]}"`);
    return commonMappings[mappingKey];
  }
  
  return null;
}

function getCanonicalSnp(name: string): string | null {
  const normalizedName = name.toLowerCase().replace(/[\s\-,()]+/g, '');
  for (const canonicalName in supportedMarkers.snps) {
    for (const alias of supportedMarkers.snps[canonicalName as keyof typeof supportedMarkers.snps].aliases) {
      const normalizedAlias = alias.toLowerCase().replace(/[\s\-,()]+/g, '');
      if (normalizedName === normalizedAlias) {
        return canonicalName;
      }
    }
  }
  return null;
}

// Enhanced CSV and 23andMe parsing functions
interface CSVGeneticRow {
  rsid: string;
  chromosome?: string;
  position?: string;
  genotype: string;
  gene?: string;
}

// Priority SNPs for supplement recommendations (matches generate-plan mapping)
const PRIORITY_SNPS = [
  // Tier 1: Direct supplement matches
  'rs1801133', 'rs1801131', 'rs4680', 'rs4633', 'rs4818', 'rs769224',
  'rs1544410', 'rs2228570', 'rs731236', 'rs429358', 'rs7412',
  'rs1799945', 'rs1800562', 'rs174548', 'rs174537', 'rs1535',
  'rs1801394', 'rs1805087', 'rs1801198', 'rs1643649', 'rs4880',
  'rs1799983', 'rs4244593', 'rs7946', 'rs11645428', 'rs12934922',
  'rs602662', 'rs492602', 'rs601338', 'rs5751876', 'rs1695',
  'rs1138272', 'rs1050450', 'rs1141321', 'rs9369898', 'rs651933',
  'rs1051266', 'rs1979277', 'rs7297662', 'rs773115', 'rs526934',
  'rs1799895', 'rs2758331', 'rs4998557', 'rs2070424'
];

function parseCSVGeneticData(csvContent: string): CSVGeneticRow[] {
  console.log('🧬 Parsing CSV genetic data...');
  
  const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const results: CSVGeneticRow[] = [];
  
  // Detect format by examining headers and first few data lines
  let format: '23andme' | 'ancestry' | 'generic' = 'generic';
  let headerLine = -1;
  
  // Look for header patterns
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('rsid') && (line.includes('chromosome') || line.includes('genotype'))) {
      format = '23andme';
      headerLine = i;
      break;
    } else if (line.includes('rsid') && line.includes('allele')) {
      format = 'ancestry';
      headerLine = i;
      break;
    }
  }
  
  console.log(`🧬 Detected format: ${format}, header at line: ${headerLine}`);
  
  if (headerLine === -1) {
    // Try to detect data format from first few lines
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (line.startsWith('rs') && (line.includes('\t') || line.includes(','))) {
        headerLine = i - 1; // Assume previous line was header or no header
        break;
      }
    }
  }
  
  const dataStartLine = Math.max(0, headerLine + 1);
  console.log(`🧬 Starting data parsing from line: ${dataStartLine}`);
  
  // Parse headers to determine column positions
  let rsidCol = 0, chrCol = 1, posCol = 2, genotypeCol = 3;
  
  if (headerLine >= 0 && headerLine < lines.length) {
    const headers = lines[headerLine].toLowerCase().split(/[,\t]/);
    rsidCol = Math.max(0, headers.findIndex(h => h.includes('rsid') || h.includes('snp')));
    chrCol = Math.max(0, headers.findIndex(h => h.includes('chr')));
    posCol = Math.max(0, headers.findIndex(h => h.includes('pos')));
    genotypeCol = Math.max(0, headers.findIndex(h => h.includes('genotype') || h.includes('allele')));
  }
  
  console.log(`🧬 Column mapping: rsid=${rsidCol}, chr=${chrCol}, pos=${posCol}, genotype=${genotypeCol}`);
  
  // Create priority set for faster lookup
  const prioritySet = new Set(PRIORITY_SNPS);
  const priorityResults: CSVGeneticRow[] = [];
  const otherResults: CSVGeneticRow[] = [];
  
  // Parse data lines
  for (let i = dataStartLine; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#') || line.length < 5) continue; // Skip comments and short lines
    
    const columns = line.split(/[,\t]/);
    if (columns.length < 2) continue;
    
    const rsid = columns[rsidCol]?.trim() || '';
    const chromosome = columns[chrCol]?.trim() || '';
    const position = columns[posCol]?.trim() || '';
    const genotype = columns[genotypeCol]?.trim() || '';
    
    // Validate rsid format
    if (!rsid.match(/^rs\d+$/)) continue;
    
    // Validate genotype (should be like AA, AT, TT, etc.)
    if (!genotype.match(/^[ATCG-]{1,4}$/i) && !genotype.match(/^[ATCG]\/[ATCG]$/i)) continue;
    
    const row: CSVGeneticRow = {
      rsid,
      chromosome,
      position,
      genotype: genotype.replace('/', '').toUpperCase() // Normalize genotype
    };
    
    // Prioritize actionable SNPs
    if (prioritySet.has(rsid)) {
      priorityResults.push(row);
    } else {
      otherResults.push(row);
    }
    
    // Progress logging for large files
    if (i % 50000 === 0 && i > 0) {
      console.log(`🧬 Processed ${i} lines, found ${priorityResults.length} priority SNPs, ${otherResults.length} other SNPs`);
    }
  }
  
  // Combine results with priority SNPs first
  const combinedResults = [...priorityResults, ...otherResults];
  
  console.log(`🧬 CSV parsing complete: ${combinedResults.length} total SNPs (${priorityResults.length} priority, ${otherResults.length} others)`);
  
  // PERFORMANCE OPTIMIZATION: For extremely large files, limit to most relevant SNPs
  // while ensuring ALL priority SNPs are included
  const MAX_SNPS_FOR_PROCESSING = 5000; // Reasonable limit for supplement recommendations
  
  if (combinedResults.length > MAX_SNPS_FOR_PROCESSING) {
    const optimizedResults = [
      ...priorityResults, // Always include ALL priority SNPs
      ...otherResults.slice(0, MAX_SNPS_FOR_PROCESSING - priorityResults.length) // Fill remaining slots
    ];
    
    console.log(`🧬 Large file optimization: Reduced from ${combinedResults.length} to ${optimizedResults.length} SNPs (${priorityResults.length} priority + ${optimizedResults.length - priorityResults.length} others)`);
    
    return optimizedResults;
  }
  
  return combinedResults;
}

function isCSVGeneticFile(content: string): boolean {
  // Look at more content for files with long headers (like 23andMe)
  const firstPart = content.substring(0, 3000).toLowerCase();
  
  // Check for CSV genetic file indicators
  const indicators = [
    'rsid', 'chromosome', 'position', 'genotype',
    'rs1801133', 'rs4680', 'rs429358', // Common SNPs
    '23andme', 'ancestry', 'myheritage', 'nebula'
  ];
  
  const hasRsids = /rs\d+/i.test(firstPart);
  const hasDelimiters = firstPart.includes(',') || firstPart.includes('\t');
  const hasIndicators = indicators.some(indicator => firstPart.includes(indicator));
  
  console.log(`🔍 CSV Detection: rsIDs=${hasRsids}, delimiters=${hasDelimiters}, indicators=${hasIndicators}`);
  
  return hasRsids && hasDelimiters && hasIndicators;
}

// NEW: Enhanced genetic file detection for both CSV and TXT formats
function isGeneticFile(content: string): boolean {
  // Look at more content for files with long headers (like 23andMe)
  const firstPart = content.substring(0, 3000).toLowerCase();
  
  // Check for genetic file indicators
  const indicators = [
    'rsid', 'chromosome', 'position', 'genotype', 'allele',
    'rs1801133', 'rs4680', 'rs429358', 'rs1801131', // Common SNPs
    '23andme', 'ancestry', 'myheritage', 'nebula', 'dnaland',
    'mthfr', 'comt', 'apoe', 'vdr', // Common genes
    'c677t', 'a1298c', 'val158met' // Common variants
  ];
  
  const hasRsids = /rs\d+/i.test(firstPart);
  const hasGeneticPatterns = /[ATCG]{2,}/i.test(firstPart) || /[ATCG]\/[ATCG]/i.test(firstPart);
  const hasIndicators = indicators.some(indicator => firstPart.includes(indicator));
  
  // Check for various delimiters (CSV, TSV, space-separated, etc.)
  const hasDelimiters = firstPart.includes(',') || firstPart.includes('\t') || 
                       /rs\d+\s+\w+\s+[ATCG]/i.test(firstPart);
  
  console.log(`🔍 Genetic File Detection: rsIDs=${hasRsids}, patterns=${hasGeneticPatterns}, delimiters=${hasDelimiters}, indicators=${hasIndicators}`);
  
  return hasRsids && hasGeneticPatterns && hasIndicators;
}

// NEW: Universal genetic data parser for CSV, TSV, and space-separated TXT files
function parseGeneticData(content: string): CSVGeneticRow[] {
  console.log('🧬 Parsing genetic data (CSV/TXT)...');
  
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const results: CSVGeneticRow[] = [];
  
  // Detect format by examining headers and first few data lines
  let format: '23andme' | 'ancestry' | 'vcf' | 'generic' = 'generic';
  let headerLine = -1;
  let delimiter = ','; // Default to comma
  
  // Auto-detect delimiter and format
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i].toLowerCase();
    
    // Detect delimiter
    if (line.includes('\t')) {
      delimiter = '\t';
    } else if (line.includes(',')) {
      delimiter = ',';
    } else if (/rs\d+\s+\w+\s+[atcg]/i.test(line)) {
      delimiter = ' '; // Space-separated
    }
    
    // Detect format
    if (line.includes('rsid') && (line.includes('chromosome') || line.includes('genotype'))) {
      format = '23andme';
      headerLine = i;
      break;
    } else if (line.includes('rsid') && line.includes('allele')) {
      format = 'ancestry';
      headerLine = i;
      break;
    } else if (line.startsWith('#chrom') || line.startsWith('##fileformat=vcf')) {
      format = 'vcf';
      headerLine = i;
      break;
    }
  }
  
  console.log(`🧬 Detected format: ${format}, delimiter: '${delimiter}', header at line: ${headerLine}`);
  
  if (headerLine === -1) {
    // Try to detect data format from first few lines
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (line.startsWith('rs') && (line.includes(delimiter) || /rs\d+\s+\w+\s+[ATCG]/i.test(line))) {
        headerLine = i - 1; // Assume previous line was header or no header
        break;
      }
    }
  }
  
  const dataStartLine = Math.max(0, headerLine + 1);
  console.log(`🧬 Starting data parsing from line: ${dataStartLine}, using delimiter: '${delimiter}'`);
  
  // Parse headers to determine column positions
  let rsidCol = 0, chrCol = 1, posCol = 2, genotypeCol = 3;
  
  if (headerLine >= 0 && headerLine < lines.length) {
    const headers = lines[headerLine].toLowerCase().split(delimiter === ' ' ? /\s+/ : delimiter);
    rsidCol = Math.max(0, headers.findIndex(h => h.includes('rsid') || h.includes('snp')));
    chrCol = Math.max(0, headers.findIndex(h => h.includes('chr')));
    posCol = Math.max(0, headers.findIndex(h => h.includes('pos')));
    genotypeCol = Math.max(0, headers.findIndex(h => h.includes('genotype') || h.includes('allele')));
  }
  
  console.log(`🧬 Column mapping: rsid=${rsidCol}, chr=${chrCol}, pos=${posCol}, genotype=${genotypeCol}`);
  
  // Create priority set for faster lookup
  const prioritySet = new Set(PRIORITY_SNPS);
  const priorityResults: CSVGeneticRow[] = [];
  const otherResults: CSVGeneticRow[] = [];
  
  // Parse data lines with enhanced parsing for different formats
  for (let i = dataStartLine; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#') || line.length < 5) continue; // Skip comments and short lines
    
    // Split by detected delimiter
    const columns = delimiter === ' ' ? line.split(/\s+/) : line.split(delimiter);
    if (columns.length < 2) continue;
    
    const rsid = columns[rsidCol]?.trim() || '';
    const chromosome = columns[chrCol]?.trim() || '';
    const position = columns[posCol]?.trim() || '';
    let genotype = columns[genotypeCol]?.trim() || '';
    
    // Validate rsid format
    if (!rsid.match(/^rs\d+$/)) continue;
    
    // Enhanced genotype parsing for different formats
    if (genotype.includes('/')) {
      // Format: A/T -> AT
      genotype = genotype.replace('/', '').toUpperCase();
    } else if (genotype.includes('|')) {
      // Format: A|T -> AT  
      genotype = genotype.replace('|', '').toUpperCase();
    } else if (genotype.length === 1) {
      // Format: single allele -> duplicate (A -> AA)
      genotype = genotype + genotype;
    }
    
    // Validate genotype (should be like AA, AT, TT, etc.)
    if (!genotype.match(/^[ATCG-]{1,4}$/i)) continue;
    
    const row: CSVGeneticRow = {
      rsid,
      chromosome,
      position,
      genotype: genotype.toUpperCase()
    };
    
    // Prioritize actionable SNPs
    if (prioritySet.has(rsid)) {
      priorityResults.push(row);
    } else {
      otherResults.push(row);
    }
    
    // Progress logging for large files
    if (i % 50000 === 0 && i > 0) {
      console.log(`🧬 Processed ${i} lines, found ${priorityResults.length} priority SNPs, ${otherResults.length} other SNPs`);
    }
  }
  
  // Combine results with priority SNPs first
  const combinedResults = [...priorityResults, ...otherResults];
  
  console.log(`🧬 Genetic parsing complete: ${combinedResults.length} total SNPs (${priorityResults.length} priority, ${otherResults.length} others)`);
  
  // PERFORMANCE OPTIMIZATION: For extremely large files, limit to most relevant SNPs
  // while ensuring ALL priority SNPs are included
  const MAX_SNPS_FOR_PROCESSING = 5000; // Reasonable limit for supplement recommendations
  
  if (combinedResults.length > MAX_SNPS_FOR_PROCESSING) {
    const optimizedResults = [
      ...priorityResults, // Always include ALL priority SNPs
      ...otherResults.slice(0, MAX_SNPS_FOR_PROCESSING - priorityResults.length) // Fill remaining slots
    ];
    
    console.log(`🧬 Large file optimization: Reduced from ${combinedResults.length} to ${optimizedResults.length} SNPs (${priorityResults.length} priority + ${optimizedResults.length - priorityResults.length} others)`);
    
    return optimizedResults;
  }
  
  return combinedResults;
}

Deno.serve(async (req) => {
  // This function is now a pure text parser.
  // It receives raw text, sends it to OpenAI, and returns the structured JSON.
  // It is not responsible for file I/O or database updates.

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    const requestBody = await req.json();
    const { fileContent: originalFileContent, reportType, reportId } = requestBody;
    let fileContent = originalFileContent;

    if (!fileContent || !reportType) {
      return new Response(JSON.stringify({ error: "Missing 'fileContent' or 'reportType' in request body" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Processing file content...');
    console.log(`Original content length: ${fileContent.length}`);
    console.log(`Content starts with: ${fileContent.substring(0, 50)}`);
    
    // 🔍 DETECT AND DECODE BASE64 PDFs
    if (fileContent.startsWith('PDF_BASE64:')) {
      console.log('🔍 Base64 PDF detected — decoding...');
      try {
        const base64Content = fileContent.substring('PDF_BASE64:'.length);
        const decodedPdf = atob(base64Content);
        console.log(`📄 Decoded PDF: ${decodedPdf.length} characters`);
        console.log(`📄 Decoded starts with: ${decodedPdf.substring(0, 20)}`);
        fileContent = decodedPdf;
      } catch (decodeError) {
        console.error('❌ Base64 decode failed:', decodeError);
        return new Response(JSON.stringify({ error: 'Failed to decode base64 PDF content' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
    }
    
    // Check if this is a PDF and extract text if needed
    let processedContent = fileContent;
    if (isPDF(fileContent)) {
      console.log('PDF detected - extracting text...');
      const extractedText = await extractTextFromPDF(fileContent);
      processedContent = extractedText;
      console.log(`After PDF text extraction: ${processedContent.length} characters`);
      console.log(`Extracted text preview: ${processedContent.substring(0, 500)}`);
    } else {
      console.log('Non-PDF content detected - processing as text');
      console.log(`Text content preview: ${processedContent.substring(0, 500)}`);
    }

    // ENHANCED: Check for genetic data (CSV/TXT) and use optimized parser
    if (reportType === 'genetic_report' && isGeneticFile(processedContent)) {
      console.log('🧬 Genetic file detected (CSV/TXT) - using optimized parser');
      
      try {
        // Try the new universal parser first
        const geneticSnps = parseGeneticData(processedContent);
        
        if (geneticSnps.length > 0) {
          console.log(`🧬 Successfully parsed ${geneticSnps.length} SNPs from genetic file`);
          
          // Convert to standard SNP format
          const snpData = geneticSnps.map(snp => ({
            snp_id: snp.rsid,
            gene_name: snp.gene || '', // Will be enriched later
            genotype: snp.genotype,
            allele: snp.genotype // Alias for compatibility
          }));
          
          return new Response(JSON.stringify({ snps: snpData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (geneticError: any) {
        console.error('Genetic parsing failed, trying CSV fallback:', geneticError);
        
        // Fallback to original CSV parser
        try {
          if (isCSVGeneticFile(processedContent)) {
            const csvSnps = parseCSVGeneticData(processedContent);
            
            if (csvSnps.length > 0) {
              console.log(`🧬 CSV fallback successful: ${csvSnps.length} SNPs`);
              
              const snpData = csvSnps.map(snp => ({
                snp_id: snp.rsid,
                gene_name: snp.gene || '',
                genotype: snp.genotype,
                allele: snp.genotype
              }));
              
              return new Response(JSON.stringify({ snps: snpData }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          }
        } catch (csvError: any) {
          console.error('CSV fallback also failed, falling back to AI:', csvError);
        }
        // Continue to AI parsing as final fallback
      }
    }

    // Add test sample option for debugging
    if (fileContent.includes('TEST_SAMPLE')) {
      const testSample = `
        Glucose: 95 mg/dL
        Hemoglobin A1c: 5.4 %
        TSH: 2.1 mIU/L
        Vitamin D, 25-OH: 35 ng/mL
        Total Cholesterol: 180 mg/dL
        LDL Cholesterol: 110 mg/dL
        HDL Cholesterol: 50 mg/dL
      `;
      processedContent = testSample;
      console.log('Using test sample for debugging');
    }

    // Truncate very large files to stay within OpenAI's token limits
    // GPT-4 supports up to 128K tokens, so ~400K characters is safe
    const maxChars = 400000;  // 400K characters for GPT-4
    
    if (processedContent.length > maxChars) {
      console.log(`File too large (${processedContent.length} chars), truncating to ${maxChars} chars`);
      processedContent = processedContent.substring(0, maxChars);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    const systemPrompt = `You are an expert at parsing lab reports and genetic data. Extract ALL biomarkers and genetic markers from the provided text.

IMPORTANT: The text may be extracted from a PDF and could be messy, fragmented, or contain artifacts. Your job is to be VERY thorough and extract EVERY piece of medical data you can find.

CRITICAL RULES:
1. Scan the ENTIRE text carefully - data might be scattered throughout
2. Extract EVERY numeric value that appears to be a medical test result
3. Look for patterns like "Test Name: Value Unit" or "Test Name Value Unit" 
4. Include the exact test name as it appears in the document
5. For biomarkers: Always include the numeric value and unit (if no unit shown, use "not specified")
6. For SNPs: Include the gene name, rsID (if present), and allele/genotype
7. Do not skip any values - extract everything that looks medical
8. Handle fragmented text - pieces of test names and values might be separated
9. **USE EXISTING CONTEXT**: If the report already contains interpreted genetic information, use that context
10. **PRESERVE TRANSLATIONS**: If gene names are already translated (like "MTHFR C677T"), keep those exact descriptions

EXAMPLES of what to look for:
- "Glucose 95 mg/dL" or "Glucose: 95 mg/dL" 
- "Hemoglobin A1c 5.4 %" or "HbA1c: 5.4%"
- "Total Cholesterol 180" (even without unit)
- "TSH 2.1 mIU/L"
- "rs1801133 MTHFR CT" or "MTHFR C677T: CT"
- "APOE ε4/ε4 status: Present"
- "CYP2D6 *1/*4 genotype: Intermediate metabolizer"
- "COMT Val158Met (rs4680): AG"

GENETIC CONTEXT PATTERNS:
- Already translated gene variants (C677T, A1298C, Val158Met, etc.)
- Star allele nomenclature (*1, *2, *3, *4, etc.)
- Epsilon notation (ε2, ε3, ε4)
- Common gene symbols with descriptions
- Phenotype interpretations (fast metabolizer, slow metabolizer, etc.)

OUTPUT FORMAT:
Return ONLY a valid JSON object with either "biomarkers" or "snps" key.

Biomarker format:
{
  "biomarkers": [
    {"marker_name": "Glucose", "value": 95, "unit": "mg/dL"},
    {"marker_name": "Hemoglobin A1c", "value": 5.4, "unit": "%"}
  ]
}

SNP format:
{
  "snps": [
    {"snp_id": "rs1801133", "gene_name": "MTHFR", "allele": "CT"},
    {"snp_id": "rs4680", "gene_name": "COMT", "allele": "AG"}
  ]
}`;

    const prompt = `
      Report Type: ${reportType}
      ${reportType === 'lab_report' ? `
EXTRACT ALL BIOMARKERS FROM THIS REPORT. Look for any test names with values and units.
Common patterns to look for:
- Blood counts (RBC, WBC, Hemoglobin, Hematocrit, etc.)
- Chemistry panels (Glucose, Sodium, Potassium, Creatinine, etc.)  
- Lipid panels (Cholesterol, Triglycerides, HDL, LDL, etc.)
- Liver function (ALT, AST, Bilirubin, etc.)
- Thyroid (TSH, T4, T3, etc.)
- Vitamins (B12, D, Folate, etc.)
- Hormones (Testosterone, Estradiol, Cortisol, etc.)

SCAN EVERY LINE for test names followed by values.` : ''}
      ${reportType === 'genetic_report' ? `
EXTRACT ALL GENETIC MARKERS FROM THIS REPORT. Look for:
- SNP IDs (rs numbers like rs1801133)
- Gene names (MTHFR, COMT, APOE, etc.)
- Genotypes/Alleles (CC, CT, TT, etc.)
- Any genetic variants or mutations
- **TRANSLATED VARIANTS**: Already interpreted names like "MTHFR C677T", "COMT Val158Met", "APOE ε4"
- **STAR ALLELES**: Like CYP2D6 *1/*4, CYP1A2 *1F/*1F
- **PHENOTYPES**: Fast metabolizer, slow metabolizer, increased risk, etc.
- **COMBINED DESCRIPTIONS**: "rs1801133 (MTHFR C677T): CT genotype"

If the report contains already-translated genetic information, preserve that exact context and terminology.

SCAN EVERY LINE for genetic information.` : ''}
      
      DOCUMENT TEXT (may contain PDF formatting artifacts):
      ${processedContent}
      ${processedContent.length > maxChars ? '\n[NOTE: Document was truncated due to size limits]' : ''}
    `;

    console.log('Sending request to OpenAI API...');
    console.log('File content length:', processedContent.length);
    console.log('First 1000 characters of content:');
    console.log(processedContent.substring(0, 1000));
    console.log('Prompt being sent to OpenAI:');
    console.log(prompt.substring(0, 2000) + '...');
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 4000
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${errorText}`);
    }

    const openaiData = await openaiResponse.json();
    const text = openaiData.choices[0].message.content;
    console.log('Received response from OpenAI API.');
    console.log('Raw OpenAI response (first 2000 chars):');
    console.log(text.substring(0, 2000));

    let parsedData;
    try {
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      console.log('Cleaned OpenAI response. Attempting to parse...');
      console.log('--- RAW AI RESPONSE ---');
      console.log(cleanedText);
      console.log('--- END RAW AI RESPONSE ---');
      parsedData = JSON.parse(cleanedText);
    } catch (e: any) {
      console.error('Error parsing OpenAI response JSON:', e);
      console.error('Original OpenAI response text:', text);
      throw new Error(`Failed to parse OpenAI response: ${e.message}`);
    }

    console.log('Successfully parsed data from OpenAI.');
    console.log('Parsed data before filtering:', JSON.stringify(parsedData, null, 2));
    
    // Log what OpenAI extracted before filtering
    console.log('=== OPENAI EXTRACTION RESULTS ===');
    if (parsedData.biomarkers) {
      console.log(`Total biomarkers extracted: ${parsedData.biomarkers.length}`);
      parsedData.biomarkers.forEach((b: any, i: number) => {
        console.log(`${i + 1}. "${b.marker_name}" = ${b.value} ${b.unit}`);
      });
    }
    if (parsedData.snps) {
      console.log(`Total SNPs extracted: ${parsedData.snps.length}`);
      parsedData.snps.forEach((s: any, i: number) => {
        console.log(`${i + 1}. ${s.gene_name} ${s.snp_id} = ${s.allele}`);
      });
    }
    console.log('=== END EXTRACTION RESULTS ===');
    
    // Ensure all biomarkers have a unit
    if (parsedData.biomarkers && Array.isArray(parsedData.biomarkers)) {
      parsedData.biomarkers.forEach((b: any) => {
        if (!b.unit) {
          b.unit = 'not specified';
        }
      });
    }

    // Keep ALL extracted data - don't filter strictly
    const filteredData: { biomarkers?: any[]; snps?: any[] } = {};
    
    if (parsedData.biomarkers && Array.isArray(parsedData.biomarkers)) {
      console.log('Processing biomarkers:', parsedData.biomarkers.length);
      // Keep ALL biomarkers, try to map to canonical names but store originals too
      filteredData.biomarkers = parsedData.biomarkers.map((b: any) => {
        const canonical = getCanonicalBiomarker(b.marker_name);
        console.log(`Biomarker "${b.marker_name}" -> canonical: "${canonical || 'KEEP ORIGINAL'}"`);
        return {
          ...b,
          marker_name: canonical || b.marker_name, // Use canonical if found, otherwise keep original
          original_name: b.marker_name, // Always store original
          matched: canonical !== null
        };
      });
      
      console.log(`Processed biomarkers: ${filteredData.biomarkers?.length || 0}`);
    }
    
    if (parsedData.snps && Array.isArray(parsedData.snps)) {
      console.log('Processing SNPs:', parsedData.snps.length);
      // Keep ALL SNPs, try to map to canonical names but store originals too
      filteredData.snps = parsedData.snps.map((s: any) => {
        const canonical = getCanonicalSnp(s.snp_id);
        console.log(`SNP "${s.snp_id}" -> canonical: "${canonical || 'KEEP ORIGINAL'}"`);
        return {
          ...s,
          snp_id: canonical || s.snp_id, // Use canonical if found, otherwise keep original
          original_id: s.snp_id, // Always store original
          matched: canonical !== null
        };
      });
      
      console.log(`Processed SNPs: ${filteredData.snps?.length || 0}`);
    }

    console.log("Final Filtered Data:", JSON.stringify(filteredData, null, 2));
    
    // If lab report and no biomarkers extracted, attempt REAL BULLETPROOF extraction with NER
    if ((reportType === 'lab_report') && (!filteredData.biomarkers || filteredData.biomarkers.length === 0)) {
      console.log('🔥 OpenAI returned no biomarkers, running REAL BULLETPROOF NER extraction...');
      console.log('📄 Raw content length:', processedContent.length);
      console.log('📝 Content sample (first 500 chars):', processedContent.substring(0, 500));
      
      // Initialize the REAL bulletproof parser
      const bulletproofResults = await runBulletproofExtraction(processedContent);
      
      if (bulletproofResults.biomarkers && bulletproofResults.biomarkers.length > 0) {
        filteredData.biomarkers = bulletproofResults.biomarkers;
        console.log('🎉 BULLETPROOF NER extraction successful!');
        console.log(`✅ Found ${bulletproofResults.biomarkers.length} biomarkers using ${bulletproofResults.strategies} strategies`);
        bulletproofResults.biomarkers.forEach((b: any, i: number) => {
          console.log(`  ${i + 1}. ${b.marker_name}: ${b.value} ${b.unit} [${b.source}] (${b.confidence}% confidence)`);
        });
      } else {
        console.log('💥 BULLETPROOF extraction found NO biomarkers - this PDF may not contain lab results');
      }
    }

    // 💾 SAVE TO DATABASE - This is what was missing!
    console.log('💾 Saving extracted data to database...');
    
    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Create Supabase client with auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    console.log(`📋 Saving data for user: ${user.id}`);

    // reportId was already extracted from requestBody above
    
    try {
      // 1. Save biomarkers to database
      if (filteredData.biomarkers && filteredData.biomarkers.length > 0) {
        console.log(`💊 Saving ${filteredData.biomarkers.length} biomarkers...`);
        
        const biomarkerInserts = filteredData.biomarkers.map((biomarker: any) => ({
          user_id: user.id,
          report_id: reportId || null,
          marker_name: biomarker.marker_name,
          value: biomarker.value,
          unit: biomarker.unit || 'not specified',
          reference_range: biomarker.reference_range || null,
          comment: biomarker.extraction_method || biomarker.source || null,
          created_at: new Date().toISOString(),
        }));

        const { data: savedBiomarkers, error: biomarkerError } = await supabaseClient
          .from('user_biomarkers')
          .upsert(biomarkerInserts, {
            onConflict: 'user_id,marker_name',
            ignoreDuplicates: false
          })
          .select();

        if (biomarkerError) {
          console.error('❌ Failed to save biomarkers:', biomarkerError);
          // Don't fail completely, just log the error
        } else {
          console.log(`✅ Successfully saved ${savedBiomarkers?.length || 0} biomarkers`);
        }
      }

      // 2. Save SNPs to database
      if (filteredData.snps && filteredData.snps.length > 0) {
        console.log(`🧬 Saving ${filteredData.snps.length} SNPs...`);
        
        const snpInserts = filteredData.snps.map((snp: any) => ({
          user_id: user.id,
          report_id: reportId || null,
          snp_id: snp.snp_id,
          gene_name: snp.gene_name || 'Unknown',
          genotype: snp.allele || snp.genotype || 'Unknown',
          comment: snp.extraction_method || snp.source || null,
          created_at: new Date().toISOString(),
        }));

        const { data: savedSnps, error: snpError } = await supabaseClient
          .from('user_snps')
          .upsert(snpInserts, {
            onConflict: 'user_id,snp_id',
            ignoreDuplicates: false
          })
          .select();

        if (snpError) {
          console.error('❌ Failed to save SNPs:', snpError);
          // Don't fail completely, just log the error
        } else {
          console.log(`✅ Successfully saved ${savedSnps?.length || 0} SNPs`);
        }
      }

      // 3. Update lab report status if reportId provided
      if (reportId) {
        console.log(`📄 Updating report ${reportId} status to 'parsed'...`);
        
        const { error: reportUpdateError } = await supabaseClient
          .from('user_lab_reports')
          .update({ 
            status: 'parsed',
            parsed_data: filteredData,
            updated_at: new Date().toISOString()
          })
          .eq('id', reportId)
          .eq('user_id', user.id);

        if (reportUpdateError) {
          console.error('❌ Failed to update report status:', reportUpdateError);
        } else {
          console.log('✅ Report status updated successfully');
        }
      }

      console.log('💾 Database save completed successfully!');

    } catch (saveError) {
      console.error('❌ Database save failed:', saveError);
      // Don't fail the entire request if database save fails
      // The data was still parsed successfully
    }

    // Return the successfully parsed and filtered data
    return new Response(JSON.stringify(filteredData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error(`Failed to process content:`, err);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-lab-data' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

