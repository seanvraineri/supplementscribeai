import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // For now, we'll use a simple approach - just read the file as text
    // In a production environment, you might want to use a proper PDF parsing library
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);
    
    // If it's actually a PDF, we'll need to handle it differently
    if (file.type === 'application/pdf') {
      // For PDF files, we'll return an error message suggesting text format
      return NextResponse.json({ 
        error: 'PDF parsing not yet implemented. Please convert your genetic report to a text file (.txt or .csv) and try again.' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error converting file:', error);
    return NextResponse.json({ 
      error: 'Failed to process file. Please ensure it\'s a valid text file.' 
    }, { status: 500 });
  }
} 