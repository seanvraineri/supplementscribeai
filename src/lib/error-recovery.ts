/**
 * Error Recovery Utilities for SupplementScribe AI
 * 
 * These utilities provide defensive programming patterns that:
 * 1. Prevent user-facing errors through graceful fallbacks
 * 2. Log issues for developers to fix root causes
 * 3. Maintain user confidence with positive messaging
 */

import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Types for recovery results
interface RecoveryResult<T> {
  success: boolean;
  data: T | null;
  recovered: boolean;
  message?: string;
}

interface FileProcessingResult {
  biomarkers: number;
  snps: number;
  recovered: boolean;
  issues: string[];
}

/**
 * Safely execute an async operation with multiple retry strategies
 */
export async function withRetryRecovery<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    backoffMs?: number;
    fallback?: () => Promise<T>;
    context?: string;
  } = {}
): Promise<RecoveryResult<T>> {
  const { maxRetries = 3, backoffMs = 1000, fallback, context = 'operation' } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return {
        success: true,
        data: result,
        recovered: attempt > 1,
        message: attempt > 1 ? `${context} succeeded after ${attempt} attempts` : undefined
      };
    } catch (error) {
      console.warn(`${context} attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) {
        // Try fallback if available
        if (fallback) {
          try {
            const fallbackResult = await fallback();
            console.info(`${context} fallback successful`);
            return {
              success: true,
              data: fallbackResult,
              recovered: true,
              message: `${context} completed using fallback method`
            };
          } catch (fallbackError) {
            console.error(`${context} fallback also failed:`, fallbackError);
          }
        }
        
        return {
          success: false,
          data: null,
          recovered: false,
          message: `${context} failed after all retry attempts`
        };
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, backoffMs * attempt));
    }
  }
  
  return {
    success: false,
    data: null,
    recovered: false,
    message: `${context} failed unexpectedly`
  };
}

/**
 * Safely insert data with conflict resolution
 */
export async function safeInsertWithRecovery<T>(
  supabase: any,
  table: string,
  data: T[],
  options: {
    conflictColumns?: string;
    batchSize?: number;
    context?: string;
  } = {}
): Promise<RecoveryResult<T[]>> {
  const { conflictColumns, batchSize = 50, context = 'insert' } = options;
  
  if (!Array.isArray(data) || data.length === 0) {
    return {
      success: true,
      data: [],
      recovered: false,
      message: 'No data to insert'
    };
  }

  // Strategy 1: Try batch insert
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (!error) {
      return {
        success: true,
        data: result,
        recovered: false
      };
    }
    
    console.warn(`Batch ${context} failed, trying upsert:`, error);
  } catch (error) {
    console.warn(`Batch ${context} threw exception:`, error);
  }

  // Strategy 2: Try upsert if conflict columns provided
  if (conflictColumns) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .upsert(data, { onConflict: conflictColumns })
        .select();
      
      if (!error) {
        console.info(`${context} succeeded with upsert recovery`);
        return {
          success: true,
          data: result,
          recovered: true,
          message: `${context} resolved conflicts automatically`
        };
      }
      
      console.warn(`Upsert ${context} failed, trying individual inserts:`, error);
    } catch (error) {
      console.warn(`Upsert ${context} threw exception:`, error);
    }
  }

  // Strategy 3: Individual inserts with error collection
  const successfulInserts: T[] = [];
  const failedInserts: T[] = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    for (const item of batch) {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .insert([item])
          .select()
          .single();
        
        if (!error && result) {
          successfulInserts.push(result);
        } else {
          failedInserts.push(item);
          console.warn(`Individual ${context} failed for item:`, error, item);
        }
      } catch (error) {
        failedInserts.push(item);
        console.warn(`Individual ${context} threw exception for item:`, error, item);
      }
    }
  }

  const successRate = successfulInserts.length / data.length;
  
  if (successfulInserts.length > 0) {
    console.info(`${context} partial success: ${successfulInserts.length}/${data.length} items (${Math.round(successRate * 100)}%)`);
    
    return {
      success: true,
      data: successfulInserts,
      recovered: true,
      message: failedInserts.length > 0 
        ? `${context} completed with ${failedInserts.length} items needing review`
        : `${context} completed successfully`
    };
  }

  return {
    success: false,
    data: [],
    recovered: false,
    message: `${context} failed completely`
  };
}

/**
 * Safely process file content with multiple parsing strategies
 */
export async function safeFileProcessing(
  supabase: any,
  file: File,
  reportData: any,
  extractTextFromFile: (file: File) => Promise<string>
): Promise<FileProcessingResult> {
  const result: FileProcessingResult = {
    biomarkers: 0,
    snps: 0,
    recovered: false,
    issues: []
  };

  try {
    // Extract content with fallback strategies
    let fileContent = '';
    
    // Use the extractTextFromFile function which now handles PDFs properly
    const extractResult = await withRetryRecovery(
      () => extractTextFromFile(file),
      {
        context: 'File content extraction',
        fallback: async () => {
          // Fallback: try reading as text if extraction fails
          console.info('File extraction failed, trying text fallback');
          return await file.text();
        }
      }
    );
    
    if (extractResult.success && extractResult.data) {
      fileContent = extractResult.data;
      if (extractResult.recovered) {
        result.issues.push('File extraction required fallback method');
      }
    } else {
      result.issues.push('Could not extract content from file');
      return result;
    }

    if (!fileContent || fileContent.length < 10) {
      result.issues.push('File appears to be empty or corrupted');
      return result;
    }

    // Parse with recovery
    const parseResult = await withRetryRecovery(
      () => supabase.functions.invoke('parse-lab-data', {
        body: {
          fileContent: fileContent,
          reportType: reportData.report_type
        }
      }),
      {
        context: 'Data parsing',
        maxRetries: 2
      }
    );

    if (!parseResult.success || !parseResult.data) {
      result.issues.push('Could not parse file data');
      return result;
    }

    const parseData = (parseResult.data as any)?.data;
    
    if (parseResult.recovered) {
      result.recovered = true;
      result.issues.push('Parsing required retry');
    }

    // Process biomarkers with recovery
    if (parseData.biomarkers && parseData.biomarkers.length > 0) {
      const biomarkerInserts = parseData.biomarkers.map((biomarker: any) => ({
        user_id: reportData.user_id,
        report_id: reportData.id,
        marker_name: biomarker.marker_name || biomarker.original_name || 'Unknown Marker',
        value: biomarker.value,
        unit: biomarker.unit || 'not specified',
        reference_range: biomarker.reference_range || null
      }));

      const biomarkerResult = await safeInsertWithRecovery(
        supabase,
        'user_biomarkers',
        biomarkerInserts,
        {
          conflictColumns: 'user_id,report_id,marker_name',
          context: 'biomarker storage'
        }
      );

      if (biomarkerResult.success && biomarkerResult.data) {
        result.biomarkers = biomarkerResult.data.length;
        if (biomarkerResult.recovered) {
          result.recovered = true;
          result.issues.push('Some biomarkers required conflict resolution');
        }
      } else {
        result.issues.push('Could not store biomarkers');
      }
    }

    // Process SNPs with recovery (simplified for safety)
    if (parseData.snps && parseData.snps.length > 0) {
      // Get supported SNPs for matching
      const { data: supportedSnps } = await supabase
        .from('supported_snps')
        .select('id, rsid, gene');

      if (supportedSnps) {
        const snpInserts = parseData.snps.map((snp: any) => {
          // Find matching supported SNP
          const matchedSnp = supportedSnps.find((supported: any) => 
            supported.rsid?.toLowerCase() === (snp.snp_id || snp.rsid || '').toLowerCase() ||
            supported.gene?.toLowerCase() === (snp.gene_name || snp.gene || '').toLowerCase()
          );

          const snpData: any = {
            user_id: reportData.user_id,
            report_id: reportData.id,
            genotype: (snp.genotype || snp.allele || 'Unknown').toString().substring(0, 10)
          };

          if (matchedSnp) {
            snpData.supported_snp_id = matchedSnp.id;
          } else {
            snpData.snp_id = (snp.snp_id || snp.rsid || '').substring(0, 50) || null;
            snpData.gene_name = (snp.gene_name || snp.gene || '').substring(0, 50) || null;
          }

          return snpData;
        });

        const snpResult = await safeInsertWithRecovery(
          supabase,
          'user_snps',
          snpInserts,
          {
            conflictColumns: 'user_id,supported_snp_id,snp_id,gene_name',
            context: 'SNP storage'
          }
        );

        if (snpResult.success && snpResult.data) {
          result.snps = snpResult.data.length;
          if (snpResult.recovered) {
            result.recovered = true;
            result.issues.push('Some SNPs required conflict resolution');
          }
        } else {
          result.issues.push('Could not store SNPs');
        }
      }
    }

    // Update file status
    try {
      await supabase
        .from('user_lab_reports')
        .update({ 
          status: 'parsed',
          parsed_data: parseData 
        })
        .eq('id', reportData.id);
    } catch (error) {
      console.warn('Could not update file status:', error);
      result.issues.push('File status update failed');
    }

  } catch (error) {
    console.error('File processing failed completely:', error);
    result.issues.push('Unexpected processing error');
  }

  return result;
}

/**
 * Generate user-friendly success messages
 */
export function generateSuccessMessage(
  fileName: string,
  result: FileProcessingResult
): string {
  const total = result.biomarkers + result.snps;
  
  if (total === 0) {
    return `${fileName} uploaded successfully. We'll review it manually to extract your data.`;
  }
  
  if (result.biomarkers > 0 && result.snps > 0) {
    return `Successfully processed ${fileName}! Found ${result.biomarkers} biomarkers and ${result.snps} genetic variants.`;
  }
  
  if (result.biomarkers > 0) {
    return `Successfully processed ${fileName}! Extracted ${result.biomarkers} biomarkers.`;
  }
  
  if (result.snps > 0) {
    return `Successfully processed ${fileName}! Found ${result.snps} genetic variants.`;
  }
  
  return `${fileName} processed successfully!`;
} 