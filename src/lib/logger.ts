/**
 * Production-Safe Logging System for SupplementScribe AI
 * 
 * This replaces console.log/warn/error with a proper logging system that:
 * - Only logs in development mode
 * - Sanitizes sensitive data in production
 * - Provides structured logging for better debugging
 * - Works in both client and server environments
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private isClient: boolean;

  constructor() {
    // Safely check environment in both client and server
    this.isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    this.isClient = typeof window !== 'undefined';
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // In production, sanitize sensitive data
    if (!this.isDevelopment && typeof data === 'object') {
      const sanitized = { ...data };
      
      // Remove sensitive fields
      const sensitiveFields = [
        'password', 'token', 'access_token', 'refresh_token', 
        'email', 'phone', 'ssn', 'credit_card', 'health_data',
        'biomarkers', 'genetic_data', 'medical_history'
      ];
      
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      });
      
      return sanitized;
    }
    
    return data;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.isClient ? '[CLIENT]' : '[SERVER]';
    const levelPrefix = `[${level.toUpperCase()}]`;
    
    return `${timestamp} ${prefix} ${levelPrefix} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: LogData): void {
    if (!this.isDevelopment) {
      // In production, only log errors and warnings
      if (level !== 'error' && level !== 'warn') {
        return;
      }
    }

    const formattedMessage = this.formatMessage(level, message);
    const sanitizedData = this.sanitizeData(data);

    // Use try-catch to handle any console access issues
    try {
      switch (level) {
        case 'error':
          console.error(formattedMessage, sanitizedData || '');
          break;
        case 'warn':
          console.warn(formattedMessage, sanitizedData || '');
          break;
        case 'info':
          console.log(formattedMessage, sanitizedData || '');
          break;
        case 'debug':
          console.debug(formattedMessage, sanitizedData || '');
          break;
      }
    } catch (e) {
      // Fallback if console is not available
      // This shouldn't happen in normal Node.js/browser environments
    }
  }

  /**
   * Log informational messages (development only)
   */
  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }

  /**
   * Log warning messages (development + production)
   */
  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }

  /**
   * Log error messages (development + production)
   */
  error(message: string, error?: Error | LogData): void {
    let errorData: LogData = {};
    
    if (error instanceof Error) {
      errorData = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : '[REDACTED]'
      };
    } else if (error) {
      errorData = error;
    }
    
    this.log('error', message, errorData);
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, data?: LogData): void {
    this.log('debug', message, data);
  }

  /**
   * Log success messages (development only)
   */
  success(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      try {
        console.log(`✅ ${this.formatMessage('info', message)}`, this.sanitizeData(data) || '');
      } catch (e) {
        // Fallback if console is not available
      }
    }
  }

  /**
   * Log process steps (development only)
   */
  step(message: string, data?: LogData): void {
    if (this.isDevelopment) {
      try {
        console.log(`🔄 ${this.formatMessage('info', message)}`, this.sanitizeData(data) || '');
      } catch (e) {
        // Fallback if console is not available
      }
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for backward compatibility
export default logger; 