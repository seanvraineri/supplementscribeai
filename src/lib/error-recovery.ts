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

// REMOVED: FileProcessingResult interface (legacy file processing)

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

// REMOVED: safeFileProcessing and generateSuccessMessage functions
// These were used for file upload processing which is no longer supported
// in the frictionless onboarding experience 