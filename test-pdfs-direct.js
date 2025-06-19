const fs = require('fs');

async function testPDFsDirect() {
  console.log('🧪 Testing PDFs directly with local function server...');

  // List of PDFs to test
  const pdfFiles = [
    'scripts/labreport.pdf',
    'scripts/sample-report.pdf', 
    'scripts/DRPwS_sample_report.pdf'
  ];

  // First test with the dummy text file
  console.log('📝 Testing with dummy blood report text...');
  const textContent = fs.readFileSync('scripts/dummy_blood_report.txt', 'utf8');
  
  try {
    const response = await fetch('http://127.0.0.1:54321/functions/v1/parse-lab-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dummy-token'
      },
      body: JSON.stringify({
        fileContent: textContent,
        reportType: 'lab_report',
        reportId: 'test-text-123'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Text parsing succeeded!');
      console.log('📊 Result:', JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ Text parsing failed:', error);
    }
  } catch (error) {
    console.error('💥 Text test error:', error.message);
  }

  // Now test each PDF
  for (const pdfPath of pdfFiles) {
    console.log(`\n📄 Testing: ${pdfPath}`);
    
    try {
      // Read PDF file
      const pdfBuffer = fs.readFileSync(pdfPath);
      
      // Convert to base64 (simple method)
      const base64String = pdfBuffer.toString('base64');
      
      const fileContent = `PDF_BASE64:${base64String}`;
      console.log(`📊 PDF size: ${pdfBuffer.length} bytes, Base64: ${base64String.length} chars`);

      // Call local function
      const response = await fetch('http://127.0.0.1:54321/functions/v1/parse-lab-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token'
        },
        body: JSON.stringify({
          fileContent: fileContent,
          reportType: 'lab_report',
          reportId: `test-pdf-${Date.now()}`
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${pdfPath} parsing succeeded!`);
        
        if (result.biomarkers && result.biomarkers.length > 0) {
          console.log(`📊 Found ${result.biomarkers.length} biomarkers:`);
          result.biomarkers.slice(0, 10).forEach((b, i) => {
            console.log(`  ${i + 1}. ${b.marker_name}: ${b.value} ${b.unit} [${b.source || 'AI'}]`);
          });
          if (result.biomarkers.length > 10) {
            console.log(`  ... and ${result.biomarkers.length - 10} more`);
          }
        } else {
          console.log('📊 No biomarkers extracted');
        }

        if (result.snps && result.snps.length > 0) {
          console.log(`🧬 Found ${result.snps.length} SNPs`);
        }
      } else {
        const error = await response.text();
        console.log(`❌ ${pdfPath} parsing failed:`, error);
      }

    } catch (error) {
      console.error(`💥 Error testing ${pdfPath}:`, error.message);
    }
  }
  
  console.log('\n🎉 PDF testing completed!');
}

testPDFsDirect(); 