#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function testPDFExtraction() {
  console.log('🧪 Testing PDF extraction with new @pdf/pdftext implementation...\n');

  // Test with the sample PDFs
  const testFiles = [
    'scripts/labreport.pdf',
    'scripts/sample-report.pdf'
  ];

  for (const filePath of testFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      continue;
    }

    console.log(`📄 Testing: ${filePath}`);
    
    try {
      // Read PDF file as binary
      const pdfBuffer = fs.readFileSync(filePath);
      
      // Convert to base64 for transmission (same as frontend)
      const base64Content = pdfBuffer.toString('base64');
      const fileContent = `PDF_BASE64:${base64Content}`;
      
      console.log(`📊 File size: ${pdfBuffer.length} bytes`);
      console.log(`📊 Base64 size: ${base64Content.length} characters`);
      
      // Call the Edge Function
      const response = await fetch('https://lsdfxmiixmmgawhzyvza.supabase.co/functions/v1/parse-lab-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        },
        body: JSON.stringify({
          fileContent: fileContent,
          reportType: 'lab_report',
          reportId: 'test-pdf-extraction'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.log(`❌ Error: ${result.error}`);
        continue;
      }

      console.log(`✅ Success! Extracted data:`);
      if (result.biomarkers && result.biomarkers.length > 0) {
        console.log(`   📊 Found ${result.biomarkers.length} biomarkers:`);
        result.biomarkers.slice(0, 5).forEach((b, i) => {
          console.log(`     ${i + 1}. ${b.marker_name}: ${b.value} ${b.unit}`);
        });
        if (result.biomarkers.length > 5) {
          console.log(`     ... and ${result.biomarkers.length - 5} more`);
        }
      } else {
        console.log(`   ⚠️ No biomarkers extracted`);
      }
      
      if (result.snps && result.snps.length > 0) {
        console.log(`   🧬 Found ${result.snps.length} SNPs`);
      }

    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Run the test
testPDFExtraction().catch(console.error); 