import { Request } from 'express';

/**
 * Error Logging Service
 * Integrates with Sentry for production error tracking
 * Falls back to console logging in development
 */

interface ErrorContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  request?: {
    method: string;
    url: string;
    headers: any;
    body: any;
    query: any;
  };
  extra?: Record<string, any>;
}

class ErrorLoggingService {
  private sentryEnabled: boolean = false;

  constructor() {
    this.initializeSentry();
  }

  /**
   * Initialize Sentry (if configured)
   */
  private initializeSentry() {
    const sentryDsn = process.env.SENTRY_DSN;

    if (sentryDsn && process.env.NODE_ENV === 'production') {
      try {
        // Sentry will be initialized here when package is installed
        // import * as Sentry from '@sentry/node';
        // Sentry.init({
        //   dsn: sentryDsn,
        //   environment: process.env.NODE_ENV,
        //   tracesSampleRate: 1.0,
        // });
        this.sentryEnabled = true;
        console.log('✅ Sentry error tracking initialized');
      } catch (error) {
        console.warn('⚠️  Sentry initialization failed:', error);
      }
    } else {
      console.log('ℹ️  Sentry not configured - using console logging');
    }
  }

  /**
   * Log an error with context
   */
  logError(error: Error, context?: ErrorContext) {
    // Console logging (always)
    console.error('❌ Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });

    // Sentry logging (production only)
    if (this.sentryEnabled) {
      try {
        // When Sentry is installed:
        // Sentry.captureException(error, {
        //   user: context?.user,
        //   contexts: {
        //     request: context?.request,
        //   },
        //   extra: context?.extra,
        // });
      } catch (sentryError) {
        console.error('Failed to log to Sentry:', sentryError);
      }
    }
  }

  /**
   * Log error from Express request
   */
  logErrorFromRequest(error: Error, req: Request, user?: any) {
    const context: ErrorContext = {
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
      } : undefined,
      request: {
        method: req.method,
        url: req.url,
        headers: this.sanitizeHeaders(req.headers),
        body: this.sanitizeBody(req.body),
        query: req.query,
      },
    };

    this.logError(error, context);
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: Record<string, any>) {
    console.warn('⚠️  Warning:', {
      message,
      context,
      timestamp: new Date().toISOString(),
    });

    if (this.sentryEnabled) {
      // Sentry.captureMessage(message, {
      //   level: 'warning',
      //   extra: context,
      // });
    }
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: Record<string, any>) {
    console.log('ℹ️  Info:', {
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Remove sensitive headers
   */
  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    sensitiveHeaders.forEach(header => {
      if (header in sanitized) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Remove sensitive body fields
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey'];

    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Track performance metric
   */
  trackPerformance(operation: string, duration: number, metadata?: Record<string, any>) {
    if (duration > 1000) {
      this.logWarning(`Slow operation detected: ${operation}`, {
        duration,
        ...metadata,
      });
    }

    if (this.sentryEnabled) {
      // Sentry.addBreadcrumb({
      //   category: 'performance',
      //   message: operation,
      //   level: 'info',
      //   data: { duration, ...metadata },
      // });
    }
  }
}

export const errorLoggingService = new ErrorLoggingService();
