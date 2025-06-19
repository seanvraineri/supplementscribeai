#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function testAdaptiveParser(filePath) {
  console.log('\n🧠 TESTING ADAPTIVE PARSER (FIND ALL ENTITIES)');
  console.log('=' .repeat(60));
  
  try {
    // Import the adaptive parser
    const { AdaptivePDFParser } = require('./src/lib/pdf-parser-adaptive.js');
    const pdfParse = require('pdf-parse');
    
    // First extract text with basic pdf-parse
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`📄 Processing: ${path.basename(filePath)}`);
    console.log(`📝 Text length: ${pdfData.text.length} characters`);
    
    // Now use adaptive parser
    const parser = new AdaptivePDFParser();
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
      console.log('\n📊 ALL BIOMARKERS FOUND:');
      console.log('-'.repeat(30));
      if (result.biomarkers.length === 0) {
        console.log('❌ No biomarkers found');
      } else {
        result.biomarkers.forEach((biomarker, index) => {
          console.log(`${index + 1}. ${biomarker.name}: ${biomarker.value} ${biomarker.unit}`);
          if (biomarker.status) console.log(`   Status: ${biomarker.status}`);
          if (biomarker.reference_range) console.log(`   Range: ${biomarker.reference_range}`);
          console.log(`   Confidence: ${(biomarker.confidence * 100).toFixed(1)}%`);
          console.log(`   Context: "${biomarker.context.substring(0, 60)}..."`);
          console.log('');
        });
      }
    } else if (result.documentType === 'genetic') {
      console.log('\n🧬 ALL SNPs FOUND:');
      console.log('-'.repeat(30));
      if (result.snps.length === 0) {
        console.log('❌ No SNPs found');
      } else {
        result.snps.forEach((snp, index) => {
          console.log(`${index + 1}. ${snp.snp_id || 'Unknown ID'}: ${snp.genotype}`);
          if (snp.gene_name) console.log(`   Gene: ${snp.gene_name}`);
          if (snp.mutation) console.log(`   Mutation: ${snp.mutation}`);
          console.log(`   Confidence: ${(snp.confidence * 100).toFixed(1)}%`);
          console.log(`   Context: "${snp.context.substring(0, 60)}..."`);
          console.log('');
        });
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Adaptive parser failed:', error.message);
    console.error(error.stack);
    return null;
  }
}

async function testAllParsers() {
  const pdfFiles = [
    './scripts/labreport.pdf',
    './scripts/1749483251564_MG30338_MaxFunction (3).pdf'
  ];
  
  console.log('🔬 TESTING ADAPTIVE PARSER - FIND ALL ENTITIES');
  console.log('='.repeat(70));
  console.log('Goal: Find ALL 63+ biomarkers and 79+ SNPs in the documents');
  
  for (const filePath of pdfFiles) {
    if (fs.existsSync(filePath)) {
      const result = await testAdaptiveParser(filePath);
      
      // Show summary
      if (result && !result.error) {
        console.log('\n📈 SUMMARY:');
        console.log(`Document Type: ${result.documentType}`);
        console.log(`Biomarkers: ${result.biomarkers.length}`);
        console.log(`SNPs: ${result.snps.length}`);
        console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`Method: ${result.method}`);
        
        // Expected vs actual
        if (result.documentType === 'blood') {
          console.log(`Expected: ~63 biomarkers, Got: ${result.biomarkers.length}`);
          if (result.biomarkers.length >= 50) {
            console.log('✅ GOOD - Found substantial number of biomarkers');
          } else if (result.biomarkers.length >= 20) {
            console.log('⚠️  OKAY - Found decent number, but could be more');
          } else {
            console.log('❌ POOR - Missing many biomarkers');
          }
        } else if (result.documentType === 'genetic') {
          console.log(`Expected: ~79 SNPs, Got: ${result.snps.length}`);
          if (result.snps.length >= 60) {
            console.log('✅ EXCELLENT - Found most SNPs');
          } else if (result.snps.length >= 30) {
            console.log('✅ GOOD - Found substantial number of SNPs');
          } else if (result.snps.length >= 10) {
            console.log('⚠️  OKAY - Found some SNPs, but missing many');
          } else {
            console.log('❌ POOR - Missing most SNPs');
          }
        }
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  }
}

// Run tests
testAllParsers().catch(console.error); 