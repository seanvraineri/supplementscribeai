#!/usr/bin/env node

const fs = require('fs');

async function testLocalPDF() {
  console.log('🧪 Testing PDF extraction locally...\n');

  // Use local Supabase instance
  const LOCAL_URL = 'http://127.0.0.1:54321/functions/v1/parse-lab-data';
  const LOCAL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

  // First, test with simple text
  console.log('1️⃣ Testing with simple text...');
  
  try {
    const response = await fetch(LOCAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_ANON_KEY}`
      },
      body: JSON.stringify({
        fileContent: 'Glucose: 95 mg/dL\nCholesterol: 180 mg/dL\nHemoglobin: 14.2 g/dL',
        reportType: 'lab_report',
        reportId: 'test-simple'
      })
    });

    const result = await response.json();
    console.log('Text Response status:', response.status);
    
    if (response.ok && result.biomarkers) {
      console.log(`✅ Text processing works! Found ${result.biomarkers.length} biomarkers`);
      result.biomarkers.forEach((b, i) => {
        console.log(`   ${i + 1}. ${b.marker_name}: ${b.value} ${b.unit}`);
      });
    } else {
      console.log('❌ Text processing failed:', JSON.stringify(result, null, 2));
      return;
    }
  } catch (error) {
    console.log('❌ Text test error:', error.message);
    return;
  }

  console.log('\n2️⃣ Now testing with PDF...');
  
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
    
    const response = await fetch(LOCAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_ANON_KEY}`
      },
      body: JSON.stringify({
        fileContent: fileContent,
        reportType: 'lab_report',
        reportId: 'test-pdf'
      })
    });

    console.log('PDF Response status:', response.status);
    
    const responseText = await response.text();
    console.log('PDF Raw response length:', responseText.length);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message);
      console.log('Raw response:', responseText.substring(0, 1000));
      return;
    }
    
    if (response.ok) {
      console.log('✅ PDF processing successful!');
      if (result.biomarkers && result.biomarkers.length > 0) {
        console.log(`📊 Found ${result.biomarkers.length} biomarkers:`);
        result.biomarkers.slice(0, 10).forEach((b, i) => {
          console.log(`   ${i + 1}. ${b.marker_name}: ${b.value} ${b.unit}`);
        });
        if (result.biomarkers.length > 10) {
          console.log(`   ... and ${result.biomarkers.length - 10} more`);
        }
      } else {
        console.log('⚠️ No biomarkers found in PDF');
      }
    } else {
      console.log('❌ PDF processing failed');
      console.log('Error:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.log('❌ PDF test error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testLocalPDF().catch(console.error); 