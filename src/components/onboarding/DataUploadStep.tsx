"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface DataUploadStepProps {
  onNext: () => void;
}

export function DataUploadStep({ onNext }: DataUploadStepProps) {
  const [labFiles, setLabFiles] = useState<FileList | null>(null);
  const [geneticFiles, setGeneticFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const supabase = createClient();

  // Function to extract text from PDF files
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      console.log(`Extracting text from PDF: ${file.name}`);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let extractedText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine all text items with spaces
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        extractedText += pageText + '\n';
      }
      
      console.log(`Extracted ${extractedText.length} characters from PDF`);
      console.log(`First 500 chars: ${extractedText.substring(0, 500)}`);
      
      return extractedText.trim();
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      throw new Error(`Failed to extract text from PDF: ${error}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'lab' | 'genetic') => {
    if (fileType === 'lab') {
      setLabFiles(e.target.files);
    } else {
      setGeneticFiles(e.target.files);
    }
  };

  const processAndContinue = async () => {
    setIsProcessing(true);
    toast.info('Starting file processing... Please wait.');

    const labFilesToUpload = labFiles ? Array.from(labFiles) : [];
    const geneticFilesToUpload = geneticFiles ? Array.from(geneticFiles) : [];
    const allFiles = [...labFilesToUpload, ...geneticFilesToUpload];

    if (allFiles.length === 0) {
      toast.warning('No files selected. Skipping to next step.');
      setIsProcessing(false);
      onNext();
      return;
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated.");

        const uploadPromises = allFiles.map(async (file, index) => {
            // Determine report type based on which file list it came from
            const isLabFile = labFilesToUpload.includes(file);
            const reportType = isLabFile ? 'lab_report' : 'genetic_report';
            
            // Add timestamp to prevent filename conflicts
            const timestamp = Date.now();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
            const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
            const file_path = `${user.id}/${uniqueFileName}`;
            
            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('lab_reports')
                .upload(file_path, file, { upsert: true });

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
            }

            // Record in database with all available fields
            const { data: reportData, error: dbError } = await supabase.from('user_lab_reports').insert({
                user_id: user.id,
                file_path: file_path,
                file_name: sanitizedFileName,
                report_type: reportType,
                status: 'uploaded',
                mimetype: file.type || 'application/octet-stream'
            }).select().single();

            if (dbError) {
                console.error('Database insert error:', dbError);
                // Clean up uploaded file if database insert fails
                await supabase.storage.from('lab_reports').remove([file_path]);
                throw new Error(`Database record failed for ${file.name}: ${dbError.message}`);
            }
            
            toast.success(`Successfully uploaded ${file.name}.`);
            
            // Parse the file content to extract biomarkers/SNPs
            try {
                toast.info(`Parsing ${file.name}...`);
                
                // Extract text from PDF files
                let fileContent = '';
                if (file.type === 'application/pdf') {
                    fileContent = await extractTextFromPDF(file);
                } else {
                    // For non-PDF files, use the existing file content
                    fileContent = await file.text();
                }

                console.log(`File content length: ${fileContent.length} characters`);
                console.log(`First 500 chars: ${fileContent.substring(0, 500)}`);
                
                // Call the parse-lab-data edge function
                console.log('Calling parse-lab-data function...');
                const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-lab-data', {
                    body: {
                        fileContent: fileContent,
                        reportType: reportType
                    }
                });

                console.log('Parse function response:', { parseData, parseError });

                if (parseError) {
                    console.error('Parsing error:', parseError);
                    toast.error(`Failed to parse ${file.name}: ${parseError.message}`);
                    return; // Continue with other files
                }

                if (!parseData || (!parseData.biomarkers && !parseData.snps)) {
                    console.log('No data extracted from file');
                    toast.warning(`No relevant data found in ${file.name}`);
                    return;
                }

                console.log(`Successfully parsed data:`, parseData);

                // Store extracted biomarkers
                if (parseData.biomarkers && parseData.biomarkers.length > 0) {
                    console.log(`Storing ${parseData.biomarkers.length} biomarkers...`);
                    
                    // Store ALL biomarkers - don't filter them
                    const biomarkerInserts = parseData.biomarkers.map((biomarker: any) => ({
                        user_id: user.id,
                        report_id: reportData.id,
                        marker_name: biomarker.marker_name || biomarker.original_name || 'Unknown Marker',
                        value: biomarker.value,
                        unit: biomarker.unit || 'not specified',
                        reference_range: biomarker.reference_range || null
                    }));

                    const { error: biomarkerError } = await supabase
                        .from('user_biomarkers')
                        .insert(biomarkerInserts);

                    if (biomarkerError) {
                        console.error('Biomarker insert error:', biomarkerError);
                        toast.error(`Failed to store biomarkers from ${file.name}: ${biomarkerError.message}`);
                    } else {
                        console.log(`Successfully stored ${parseData.biomarkers.length} biomarkers`);
                        toast.success(`Extracted ${parseData.biomarkers.length} biomarkers from ${file.name}`);
                    }
                }

                // Store extracted SNPs
                if (parseData.snps && parseData.snps.length > 0) {
                    console.log(`Storing ${parseData.snps.length} SNPs...`);
                    
                    // EXTREMELY FLEXIBLE SNP matching - try to match with supported SNPs
                    const { data: supportedSnps } = await supabase
                        .from('supported_snps')
                        .select('id, rsid, gene');
                    
                    // Create MULTIPLE lookup maps for MAXIMUM flexibility including translated context
                    const rsidLookup = new Map();
                    const geneLookup = new Map();
                    const combinedLookup = new Map();
                    const variantLookup = new Map();
                    
                    supportedSnps?.forEach(snp => {
                        if (snp.rsid) {
                            // Multiple rsID formats
                            const cleanRsid = snp.rsid.toLowerCase().replace(/^rs/, '');
                            rsidLookup.set(snp.rsid.toLowerCase(), snp);
                            rsidLookup.set(`rs${cleanRsid}`, snp);
                            rsidLookup.set(cleanRsid, snp);
                            rsidLookup.set(snp.rsid.toUpperCase(), snp);
                        }
                        if (snp.gene) {
                            // Multiple gene formats
                            geneLookup.set(snp.gene.toLowerCase(), snp);
                            geneLookup.set(snp.gene.toUpperCase(), snp);
                            geneLookup.set(snp.gene, snp);
                        }
                        if (snp.rsid && snp.gene) {
                            // Combined lookups
                            combinedLookup.set(`${snp.rsid.toLowerCase()}_${snp.gene.toLowerCase()}`, snp);
                            combinedLookup.set(`${snp.gene.toLowerCase()}_${snp.rsid.toLowerCase()}`, snp);
                            
                            // Handle common translated variants
                            if (snp.gene.toLowerCase() === 'mthfr') {
                                if (snp.rsid === 'rs1801133') {
                                    variantLookup.set('mthfr_c677t', snp);
                                    variantLookup.set('c677t', snp);
                                }
                                if (snp.rsid === 'rs1801131') {
                                    variantLookup.set('mthfr_a1298c', snp);
                                    variantLookup.set('a1298c', snp);
                                }
                            }
                            if (snp.gene.toLowerCase() === 'comt' && snp.rsid === 'rs4680') {
                                variantLookup.set('val158met', snp);
                                variantLookup.set('v158m', snp);
                            }
                            if (snp.gene.toLowerCase() === 'apoe') {
                                variantLookup.set('apoe_e4', snp);
                                variantLookup.set('apolipoprotein_e', snp);
                            }
                        }
                    });
                    
                    const snpInserts = parseData.snps.map((snp: any) => {
                        let matchedSnp = null;
                        
                        // SUPER FLEXIBLE MATCHING - try multiple strategies
                        const snpId = snp.snp_id || snp.rsid || '';
                        const geneName = snp.gene_name || snp.gene || '';
                        
                        // Strategy 1: Exact rsID match (multiple formats)
                        if (snpId) {
                            const cleanId = snpId.toLowerCase().replace(/^rs/, '').replace(/[^a-z0-9]/g, '');
                            matchedSnp = rsidLookup.get(snpId.toLowerCase()) ||
                                        rsidLookup.get(`rs${cleanId}`) ||
                                        rsidLookup.get(cleanId) ||
                                        rsidLookup.get(snpId.toUpperCase());
                        }
                        
                        // Strategy 2: Gene name match (if no rsID match)
                        if (!matchedSnp && geneName) {
                            const cleanGene = geneName.toLowerCase().replace(/[^a-z0-9]/g, '');
                            matchedSnp = geneLookup.get(geneName.toLowerCase()) ||
                                        geneLookup.get(geneName.toUpperCase()) ||
                                        geneLookup.get(cleanGene);
                            
                            // Try partial gene matching for common variations
                            if (!matchedSnp) {
                                for (const [key, value] of geneLookup.entries()) {
                                    if (key.includes(cleanGene) || cleanGene.includes(key)) {
                                        matchedSnp = value;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        // Strategy 3: Combined matching
                        if (!matchedSnp && snpId && geneName) {
                            const cleanId = snpId.toLowerCase().replace(/^rs/, '');
                            const cleanGene = geneName.toLowerCase();
                            matchedSnp = combinedLookup.get(`${cleanId}_${cleanGene}`) ||
                                        combinedLookup.get(`${cleanGene}_${cleanId}`) ||
                                        combinedLookup.get(`rs${cleanId}_${cleanGene}`);
                        }
                        
                        // Strategy 4: Translated variant matching (for already processed reports)
                        if (!matchedSnp) {
                            const searchTerms = [
                                `${geneName}_${snpId}`.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                                `${snpId}_${geneName}`.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                                geneName.toLowerCase().replace(/[^a-z0-9]/g, ''),
                                snpId.toLowerCase().replace(/[^a-z0-9]/g, '')
                            ];
                            
                            for (const term of searchTerms) {
                                if (variantLookup.has(term)) {
                                    matchedSnp = variantLookup.get(term);
                                    console.log(`🎯 Matched translated variant: ${term} -> ${matchedSnp.rsid}/${matchedSnp.gene}`);
                                    break;
                                }
                            }
                            
                            // Special handling for common variant patterns
                            const fullText = `${snpId} ${geneName}`.toLowerCase();
                            if (fullText.includes('c677t') || fullText.includes('677')) {
                                matchedSnp = variantLookup.get('c677t');
                            } else if (fullText.includes('a1298c') || fullText.includes('1298')) {
                                matchedSnp = variantLookup.get('a1298c');
                            } else if (fullText.includes('val158met') || fullText.includes('158')) {
                                matchedSnp = variantLookup.get('val158met');
                            }
                        }
                        
                        // Safely create SNP data with proper validation
                        const snpData: any = {
                            user_id: user.id,
                            report_id: reportData.id,
                            genotype: (snp.genotype || snp.allele || 'Unknown').toString().substring(0, 10) // Limit length
                        };
                        
                        if (matchedSnp) {
                            snpData.supported_snp_id = matchedSnp.id;
                            console.log(`✅ Matched SNP: ${snpId} / ${geneName} -> ${matchedSnp.rsid} / ${matchedSnp.gene}`);
                        } else {
                            // Store unmatched SNPs with sanitized direct fields
                            snpData.snp_id = snpId ? snpId.substring(0, 50) : null;
                            snpData.gene_name = geneName ? geneName.substring(0, 50) : null;
                            console.log(`📝 Storing unmatched SNP: ${snpId} / ${geneName}`);
                        }
                        
                        return snpData;
                    });

                    // Split into matched (supported_snp_id) and unmatched (snp_id/gene_name) arrays
                    const matchedSnps = snpInserts.filter((s: any) => s.supported_snp_id);
                    const unmatchedSnps = snpInserts.filter((s: any) => !s.supported_snp_id);

                    // Helper to perform upsert and handle errors
                    const upsertSnps = async (records: any[], conflictCols: string) => {
                      if (records.length === 0) return { inserted: 0 };
                      const { error } = await supabase
                        .from('user_snps')
                        .upsert(records, { onConflict: conflictCols });
                      if (error) {
                        console.error('SNP upsert error:', error);
                        console.error('Failed SNP data:', records);
                        toast.warning(`Some SNPs could not be saved due to duplicates.`);
                        return { inserted: 0 };
                      }
                      return { inserted: records.length };
                    };

                    const matchedResult = await upsertSnps(matchedSnps, 'user_id,supported_snp_id');
                    const unmatchedResult = await upsertSnps(unmatchedSnps, 'user_id,snp_id,gene_name');

                    const totalInserted = matchedResult.inserted + unmatchedResult.inserted;
                    if (totalInserted > 0) {
                      console.log(`Successfully stored ${totalInserted} SNPs`);
                      toast.success(`Extracted ${totalInserted} SNPs from ${file.name}`);
                    }
                }

                // Update file status to 'parsed'
                await supabase
                    .from('user_lab_reports')
                    .update({ 
                        status: 'parsed',
                        parsed_data: parseData 
                    })
                    .eq('id', reportData.id);

                console.log(`File ${file.name} parsing completed successfully`);
                toast.success(`Successfully parsed ${file.name}!`);

            } catch (parseError: any) {
                console.error('File parsing failed:', parseError);
                toast.error(`Failed to parse ${file.name}: ${parseError.message || 'Unknown parsing error'}`);
                // Don't throw error - continue with other files
            }
        });

        await Promise.all(uploadPromises);

        toast.success('All files processed successfully!');
        onNext();

    } catch (error: any) {
      console.error("File processing failed:", error);
      toast.error(`File processing failed: ${error.message || 'An unexpected error occurred during file processing.'}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const skipForNow = () => {
    onNext();
  };

  return (
    <div className="space-y-8">
       <Toaster richColors />
      <div>
        <h3 className="text-lg font-medium">Your Health Data</h3>
        <p className="text-sm text-muted-foreground">
          Upload your existing lab and genetic reports. We'll handle the rest.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <label htmlFor="lab-files" className="block text-sm font-medium text-gray-700">
          Lab Reports
        </label>
        <input
          id="lab-files"
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, 'lab')}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          accept=".pdf,.csv,.txt"
        />
        <p className="text-xs text-muted-foreground">Accepts PDF, CSV, and TXT files.</p>
      </div>
      
      <div className="space-y-4 rounded-lg border p-4">
        <label htmlFor="genetic-files" className="block text-sm font-medium text-gray-700">
          Genetic Reports
        </label>
        <input
          id="genetic-files"
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, 'genetic')}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          accept=".pdf,.vcf,.zip,.txt"
        />
        <p className="text-xs text-muted-foreground">Accepts PDF, VCF, ZIP, and TXT files.</p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <Button onClick={processAndContinue} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Process and Continue'}
        </Button>
        <Button onClick={skipForNow} variant="outline" disabled={isProcessing}>
            Skip for now
        </Button>
      </div>
    </div>
  );
} 