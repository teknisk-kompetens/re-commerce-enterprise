
/**
 * CHUNK 1: ERROR HANDLING & LOGGING SYSTEM
 * Comprehensive logging and error tracking
 */

import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface LogContext {
  userId?: string;
  tenantId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // Initialize Sentry in production
    if (!this.isDevelopment && process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        beforeSend(event) {
          // Filter out sensitive data
          if (event.request?.data) {
            delete event.request.data.password;
            delete event.request.data.token;
          }
          return event;
        },
      });
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${contextStr}`;
  }

  public debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  public info(message: string, context?: LogContext): void {
    const formatted = this.formatMessage(LogLevel.INFO, message, context);
    console.info(formatted);
    
    if (!this.isDevelopment) {
      Sentry.addBreadcrumb({
        message,
        level: 'info',
        data: context,
      });
    }
  }

  public warn(message: string, context?: LogContext): void {
    const formatted = this.formatMessage(LogLevel.WARN, message, context);
    console.warn(formatted);
    
    if (!this.isDevelopment) {
      Sentry.captureMessage(message, 'warning');
    }
  }

  public error(message: string, error?: Error, context?: LogContext): void {
    const formatted = this.formatMessage(LogLevel.ERROR, message, context);
    console.error(formatted, error);
    
    if (!this.isDevelopment) {
      Sentry.withScope((scope) => {
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        
        if (error) {
          Sentry.captureException(error);
        } else {
          Sentry.captureMessage(message, 'error');
        }
      });
    }
  }

  public fatal(message: string, error?: Error, context?: LogContext): void {
    const formatted = this.formatMessage(LogLevel.FATAL, message, context);
    console.error(formatted, error);
    
    if (!this.isDevelopment) {
      Sentry.withScope((scope) => {
        scope.setLevel('fatal');
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        
        if (error) {
          Sentry.captureException(error);
        } else {
          Sentry.captureMessage(message, 'fatal');
        }
      });
    }
  }

  // Performance monitoring (removed Sentry transaction - not available in @sentry/nextjs)
  public startTransaction(name: string, operation: string) {
    // Transactions not available in current Sentry version
    // Using addBreadcrumb for performance tracking instead
    if (!this.isDevelopment) {
      Sentry.addBreadcrumb({
        message: `Performance: ${name}`,
        category: 'performance',
        level: 'info',
        data: { operation }
      });
    }
    return null;
  }

  // Widget Factory specific logging
  public logWidgetAction(action: string, widgetId: string, context?: LogContext): void {
    this.info(`Widget ${action}`, {
      ...context,
      component: 'widget-factory',
      action,
      widgetId,
    });
  }

  public logPerformanceMetric(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance metric: ${metric} = ${value}ms`, {
      ...context,
      metric,
      value,
      type: 'performance',
    });
  }
}

export const logger = Logger.getInstance();

// Performance monitoring decorator
export function withPerformanceLogging<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        logger.logPerformanceMetric(name, duration);
      });
    } else {
      const duration = performance.now() - start;
      logger.logPerformanceMetric(name, duration);
      return result;
    }
  }) as T;
}
