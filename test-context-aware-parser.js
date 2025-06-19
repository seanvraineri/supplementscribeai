#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function testContextAwareParser(filePath) {
  console.log('\n🧠 TESTING CONTEXT-AWARE TWO-PHASE PARSER');
  console.log('=' .repeat(60));
  
  try {
    // Import the context-aware parser
    const { ContextAwarePDFParser } = require('./src/lib/pdf-parser-context-aware.js');
    const pdfParse = require('pdf-parse');
    
    // First extract text with basic pdf-parse
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`📄 Processing: ${path.basename(filePath)}`);
    console.log(`📝 Text length: ${pdfData.text.length} characters`);
    
    // Now use context-aware parser
    const parser = new ContextAwarePDFParser();
    const startTime = Date.now();
    const result = await parser.parseText(pdfData.text);
    const endTime = Date.now();
    
    console.log(`⏱️  Processing time: ${endTime - startTime}ms`);
    console.log(`📋 Document type: ${result.documentType}`);
    console.log(`🎯 Overall confidence: ${(result.confidence * 100).toFixed(1)}%`);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      return result;
    }
    
    // Show results based on document type
    if (result.documentType === 'blood') {
      console.log('\n📊 BIOMARKERS FOUND:');
      console.log('-'.repeat(30));
      if (result.biomarkers.length === 0) {
        console.log('❌ No biomarkers found');
      } else {
        result.biomarkers.forEach((biomarker, index) => {
          console.log(`${index + 1}. ${biomarker.name}: ${biomarker.value} ${biomarker.unit}`);
          if (biomarker.status) console.log(`   Status: ${biomarker.status}`);
          if (biomarker.reference_range) console.log(`   Range: ${biomarker.reference_range}`);
          console.log(`   Confidence: ${(biomarker.confidence * 100).toFixed(1)}%`);
          console.log(`   Context: "${biomarker.context.substring(0, 80)}..."`);
          console.log('');
        });
      }
    } else if (result.documentType === 'genetic') {
      console.log('\n🧬 SNPs FOUND:');
      console.log('-'.repeat(30));
      if (result.snps.length === 0) {
        console.log('❌ No SNPs found');
      } else {
        result.snps.forEach((snp, index) => {
          console.log(`${index + 1}. ${snp.snp_id || 'Unknown ID'}: ${snp.genotype}`);
          if (snp.gene_name) console.log(`   Gene: ${snp.gene_name}`);
          if (snp.mutation) console.log(`   Mutation: ${snp.mutation}`);
          console.log(`   Confidence: ${(snp.confidence * 100).toFixed(1)}%`);
          console.log(`   Context: "${snp.context.substring(0, 80)}..."`);
          console.log('');
        });
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Context-aware parser failed:', error.message);
    return null;
  }
}

async function testAllParsers() {
  const pdfFiles = [
    './scripts/labreport.pdf',
    './scripts/1749483251564_MG30338_MaxFunction (3).pdf'
  ];
  
  console.log('🔬 TESTING CONTEXT-AWARE PARSER ON REAL MEDICAL PDFs');
  console.log('='.repeat(70));
  
  for (const filePath of pdfFiles) {
    if (fs.existsSync(filePath)) {
      const result = await testContextAwareParser(filePath);
      
      // Show summary
      if (result && !result.error) {
        console.log('\n📈 SUMMARY:');
        console.log(`Document Type: ${result.documentType}`);
        console.log(`Biomarkers: ${result.biomarkers.length}`);
        console.log(`SNPs: ${result.snps.length}`);
        console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`Method: ${result.method}`);
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  }
}

// Run tests
testAllParsers().catch(console.error); 