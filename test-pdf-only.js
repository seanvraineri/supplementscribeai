#!/usr/bin/env node

const fs = require('fs');

async function testPDFOnly() {
  console.log('🧪 Testing PDF extraction only (no OpenAI)...\n');

  const LOCAL_URL = 'http://127.0.0.1:54321/functions/v1/parse-lab-data';
  const LOCAL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

  // Test with PDF
  const pdfPath = 'scripts/labreport.pdf';
  if (!fs.existsSync(pdfPath)) {
    console.log(`⚠️ PDF file not found: ${pdfPath}`);
    return;
  }

  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64Content = pdfBuffer.toString('base64');
    const fileContent = `PDF_BASE64:${base64Content}`;
    
    console.log(`📊 PDF size: ${pdfBuffer.length} bytes`);
    
    // We'll test with a simple text content to avoid OpenAI API requirement
    // But first let's see if the PDF processing part works by checking the logs
    
    const response = await fetch(LOCAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_ANON_KEY}`
      },
      body: JSON.stringify({
        fileContent: fileContent,
        reportType: 'lab_report',
        reportId: 'test-pdf-extraction'
      })
    });

    console.log('PDF Response status:', response.status);
    
    const responseText = await response.text();
    console.log('PDF Response:', responseText);
    
    // The function will fail at OpenAI step, but we should see PDF extraction logs
    // Let's also test if the bulletproof extraction works
    console.log('\n🔥 Testing bulletproof extraction...');
    
    // Create a content that should trigger bulletproof extraction
    const testContent = `
      Patient Lab Report
      
      Glucose: 95 mg/dL
      Cholesterol: 180 mg/dL  
      Hemoglobin: 14.2 g/dL
      TSH: 2.1 mIU/L
      Vitamin D: 32 ng/mL
    `;
    
    const bulletproofResponse = await fetch(LOCAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_ANON_KEY}`
      },
      body: JSON.stringify({
        fileContent: testContent,
        reportType: 'lab_report',
        reportId: 'test-bulletproof'
      })
    });

    console.log('Bulletproof Response status:', bulletproofResponse.status);
    const bulletproofResult = await bulletproofResponse.text();
    console.log('Bulletproof Response:', bulletproofResult);

  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

testPDFOnly().catch(console.error); 