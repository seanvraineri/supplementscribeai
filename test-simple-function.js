#!/usr/bin/env node

async function testSimpleFunction() {
  console.log('🧪 Testing basic function availability...\n');

  const LOCAL_URL = 'http://127.0.0.1:54321/functions/v1/parse-lab-data';
  const LOCAL_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

  try {
    console.log('Making request to:', LOCAL_URL);
    
    const response = await fetch(LOCAL_URL, {
      method: 'OPTIONS',
      headers: {
        'Authorization': `Bearer ${LOCAL_ANON_KEY}`
      }
    });

    console.log('OPTIONS Response status:', response.status);
    console.log('OPTIONS Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Function is responding to OPTIONS requests');
    } else {
      console.log('❌ Function not responding properly to OPTIONS');
      return;
    }

    // Now try a simple POST
    const postResponse = await fetch(LOCAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_ANON_KEY}`
      },
      body: JSON.stringify({
        fileContent: 'TEST_SAMPLE',
        reportType: 'lab_report',
        reportId: 'test-basic'
      })
    });

    console.log('POST Response status:', postResponse.status);
    
    const responseText = await postResponse.text();
    console.log('POST Response text length:', responseText.length);
    console.log('POST Response text:', responseText.substring(0, 500));

  } catch (error) {
    console.log('❌ Test error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testSimpleFunction().catch(console.error); 