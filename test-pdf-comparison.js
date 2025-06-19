#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function testBasicPdfParse(filePath) {
  console.log('\n🔬 TESTING BASIC PDF-PARSE');
  console.log('=' .repeat(50));
  
  try {
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    
    const startTime = Date.now();
    const data = await pdfParse(dataBuffer);
    const endTime = Date.now();
    
    console.log(`⏱️  Processing time: ${endTime - startTime}ms`);
    console.log(`📄 Total pages: ${data.numpages}`);
    console.log(`📝 Text length: ${data.text.length} characters`);
    console.log('\n📋 EXTRACTED TEXT (first 1000 chars):');
    console.log('-'.repeat(50));
    console.log(data.text.substring(0, 1000));
    console.log('-'.repeat(50));
    
    // Try to find biomarker-like patterns in basic text
    const biomarkerPatterns = [
      /([A-Za-z\s]+):\s*(\d+\.?\d*)\s*([a-zA-Z\/]+)/g,
      /([A-Za-z\s]+)\s+(\d+\.?\d*)\s+([a-zA-Z\/]+)/g
    ];
    
    const foundBiomarkers = [];
    for (const pattern of biomarkerPatterns) {
      let match;
      while ((match = pattern.exec(data.text)) !== null) {
        foundBiomarkers.push({
          name: match[1].trim(),
          value: match[2],
          unit: match[3]
        });
      }
    }
    
    console.log(`\n🧪 Basic biomarker detection: ${foundBiomarkers.length} potential matches`);
    foundBiomarkers.slice(0, 5).forEach((b, i) => {
      console.log(`   ${i+1}. ${b.name}: ${b.value} ${b.unit}`);
    });
    
    return {
      text: data.text,
      biomarkers: foundBiomarkers,
      processingTime: endTime - startTime,
      pages: data.numpages
    };
    
  } catch (error) {
    console.error('❌ Basic PDF parsing failed:', error.message);
    return null;
  }
}

async function testEnhancedParser(filePath) {
  console.log('\n🚀 TESTING ENHANCED PARSER');
  console.log('='.repeat(50));
  
  try {
    // We need to use dynamic import for ES modules
    const { parseEnhancedMedicalPDF } = await import('./src/lib/pdf-parser-enhanced.ts');
    
    const startTime = Date.now();
    
    // Create a File-like object from the buffer
    const buffer = fs.readFileSync(filePath);
    const file = new File([buffer], path.basename(filePath), { type: 'application/pdf' });
    
    const result = await parseEnhancedMedicalPDF(file);
    const endTime = Date.now();
    
    console.log(`⏱️  Processing time: ${endTime - startTime}ms`);
    console.log(`🎯 Confidence score: ${result.confidence}%`);
    console.log(`📝 Text length: ${result.text.length} characters`);
    console.log(`📊 Sections detected: ${result.sections.length}`);
    console.log(`📋 Tables detected: ${result.tables.length}`);
    console.log(`🧪 Biomarkers found: ${result.biomarkers.length}`);
    console.log(`🧬 SNPs found: ${result.snps.length}`);
    
    console.log('\n📋 EXTRACTED TEXT (first 1000 chars):');
    console.log('-'.repeat(50));
    console.log(result.text.substring(0, 1000));
    console.log('-'.repeat(50));
    
    if (result.biomarkers.length > 0) {
      console.log('\n🧪 DETECTED BIOMARKERS:');
      result.biomarkers.slice(0, 10).forEach((b, i) => {
        console.log(`   ${i+1}. ${b.marker_name}: ${b.value} ${b.unit} (confidence: ${b.confidence})`);
        if (b.reference_range) console.log(`      Reference: ${b.reference_range}`);
      });
    }
    
    if (result.snps.length > 0) {
      console.log('\n🧬 DETECTED SNPs:');
      result.snps.slice(0, 10).forEach((s, i) => {
        console.log(`   ${i+1}. ${s.gene_name}: ${s.genotype} (confidence: ${s.confidence})`);
        if (s.snp_id) console.log(`      SNP ID: ${s.snp_id}`);
      });
    }
    
    if (result.tables.length > 0) {
      console.log('\n📋 DETECTED TABLES:');
      result.tables.forEach((t, i) => {
        console.log(`   Table ${i+1}: ${t.type} (confidence: ${t.confidence})`);
        console.log(`   Headers: ${t.headers.join(', ')}`);
        console.log(`   Rows: ${t.rows.length}`);
      });
    }
    
    return {
      ...result,
      processingTime: endTime - startTime
    };
    
  } catch (error) {
    console.error('❌ Enhanced parsing failed:', error.message);
    console.error('Full error:', error);
    return null;
  }
}

async function compareResults(basicResult, enhancedResult) {
  console.log('\n📊 COMPARISON RESULTS');
  console.log('='.repeat(50));
  
  if (!basicResult || !enhancedResult) {
    console.log('❌ Cannot compare - one or both parsers failed');
    return;
  }
  
  console.log('⏱️  PERFORMANCE:');
  console.log(`   Basic parser: ${basicResult.processingTime}ms`);
  console.log(`   Enhanced parser: ${enhancedResult.processingTime}ms`);
  console.log(`   Speed difference: ${enhancedResult.processingTime - basicResult.processingTime}ms`);
  
  console.log('\n🧪 BIOMARKER EXTRACTION:');
  console.log(`   Basic parser: ${basicResult.biomarkers?.length || 0} potential biomarkers`);
  console.log(`   Enhanced parser: ${enhancedResult.biomarkers?.length || 0} biomarkers`);
  
  const improvement = enhancedResult.biomarkers?.length > 0 ? 
    ((enhancedResult.biomarkers.length / Math.max(basicResult.biomarkers?.length || 1, 1)) * 100).toFixed(1) : 0;
  console.log(`   Improvement: ${improvement}% more biomarkers detected`);
  
  console.log('\n📝 TEXT EXTRACTION:');
  console.log(`   Basic parser: ${basicResult.text?.length || 0} characters`);
  console.log(`   Enhanced parser: ${enhancedResult.text?.length || 0} characters`);
  
  console.log('\n🎯 ENHANCED FEATURES:');
  console.log(`   Confidence scoring: ${enhancedResult.confidence}%`);
  console.log(`   Structured sections: ${enhancedResult.sections?.length || 0}`);
  console.log(`   Table detection: ${enhancedResult.tables?.length || 0}`);
  console.log(`   SNP detection: ${enhancedResult.snps?.length || 0}`);
}

async function main() {
  const testFiles = [
    './scripts/labreport.pdf',
    './scripts/1749483251564_MG30338_MaxFunction (3).pdf'
  ];
  
  for (const filePath of testFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📁 TESTING FILE: ${path.basename(filePath)}`);
    console.log(`📏 File size: ${(fs.statSync(filePath).size / 1024).toFixed(1)} KB`);
    console.log(`${'='.repeat(80)}`);
    
    const basicResult = await testBasicPdfParse(filePath);
    const enhancedResult = await testEnhancedParser(filePath);
    
    await compareResults(basicResult, enhancedResult);
    
    console.log('\n' + '='.repeat(80));
  }
}

// Run the comparison
main().catch(console.error); 