"use client";

// REMOVED: PDFProcessor component no longer needed in frictionless onboarding
// File upload functionality has been replaced with assessment-based approach

export function PDFProcessor({ file, onProcessed }: { file: File; onProcessed: (data: any) => void }) {
  return (
    <div className="p-4 border border-dark-border rounded-lg bg-dark-surface">
      <p className="text-dark-secondary text-sm">
        File upload has been disabled in the new frictionless onboarding experience.
        We now use an advanced questionnaire to predict your biomarker and genetic patterns.
      </p>
    </div>
  );
}

/* ORIGINAL CODE - COMMENTED OUT FOR NEW FRICTIONLESS ONBOARDING
import { useState, useEffect } from 'react';

export function PDFProcessor({ file, onProcessed }: { file: File; onProcessed: (data: any) => void }) {
  const [pdf2json, setPdf2json] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf2json = async () => {
      try {
        // Dynamic import of the pdf2json library
        const pdf2jsonModule = await import("pdf2json");
        setPdf2json(() => pdf2jsonModule.default);
      } catch (error) {
        console.error("Failed to load pdf2json library:", error);
        setError("Failed to load PDF processing library");
      }
    };

    if (typeof window !== "undefined") {
      loadPdf2json();
    }
  }, []);

  const processPDF = async () => {
    if (!pdf2json || !file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const pdfParser = new pdf2json();
      
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF parsing error:", errData.parserError);
        setError("Failed to parse PDF file");
        setIsProcessing(false);
      });

      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          const extractedText = pdfData.Pages
            .map((page: any) => 
              page.Texts
                .map((text: any) => decodeURIComponent(text.R[0].T))
                .join(' ')
            )
            .join('\n');

          onProcessed({
            type: 'pdf',
            text: extractedText,
            rawData: pdfData
          });
          
          setIsProcessing(false);
        } catch (extractError) {
          console.error("Text extraction error:", extractError);
          setError("Failed to extract text from PDF");
          setIsProcessing(false);
        }
      });

      // Convert file to buffer for processing
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      pdfParser.parseBuffer(buffer);
      
    } catch (error) {
      console.error("PDF processing error:", error);
      setError("Failed to process PDF file");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (pdf2json && file) {
      processPDF();
    }
  }, [pdf2json, file]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={processPDF}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
        <p className="text-blue-600 text-sm">Processing PDF...</p>
        <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <p className="text-gray-600 text-sm">Ready to process PDF</p>
    </div>
  );
}
*/ 