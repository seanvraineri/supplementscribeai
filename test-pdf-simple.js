#!/usr/bin/env node

const fs = require('fs');

async function testSimplePDF() {
  console.log('🧪 Testing PDF extraction with error details...\n');

  // First, let's test with a simple text file to make sure the function works
  console.log('1️⃣ Testing with simple text first...');
  
  try {
    const response = await fetch('https://lsdfxmiixmmgawhzyvza.supabase.co/functions/v1/parse-lab-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      },
      body: JSON.stringify({
        fileContent: 'Glucose: 95 mg/dL\nCholesterol: 180 mg/dL\nHemoglobin: 14.2 g/dL',
        reportType: 'lab_report',
        reportId: 'test-simple'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.biomarkers) {
      console.log('✅ Text processing works!');
    } else {
      console.log('❌ Text processing failed');
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
    
    const response = await fetch('https://lsdfxmiixmmgawhzyvza.supabase.co/functions/v1/parse-lab-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      },
      body: JSON.stringify({
        fileContent: fileContent,
        reportType: 'lab_report',
        reportId: 'test-pdf'
      })
    });

    console.log('PDF Response status:', response.status);
    console.log('PDF Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('PDF Raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message);
      return;
    }
    
    if (response.ok) {
      console.log('✅ PDF processing successful!');
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ PDF processing failed');
      console.log('Error:', result);
    }

  } catch (error) {
    console.log('❌ PDF test error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testSimplePDF().catch(console.error); 