
/**
 * AUDIT LOGGER
 * Enterprise-grade audit logging for security and compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export interface AuditEvent {
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  tenantId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  timestamp: Date;
}

export class AuditLogger {
  /**
   * Log an error event
   */
  async logError(requestId: string, error: any, request: NextRequest): Promise<void> {
    try {
      const auditEvent: AuditEvent = {
        action: 'ERROR',
        resource: 'system',
        details: {
          requestId,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          url: request.url,
          method: request.method,
        },
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date(),
      };

      await this.logEvent(auditEvent);
    } catch (logError) {
      console.error('Failed to log error event:', logError);
    }
  }

  /**
   * Log a request event
   */
  async logRequest(
    context: any,
    response: NextResponse,
    metrics: any
  ): Promise<void> {
    try {
      const auditEvent: AuditEvent = {
        action: 'REQUEST',
        resource: 'api',
        resourceId: context.request?.id,
        userId: context.user?.id,
        tenantId: context.tenant?.id,
        ipAddress: context.request?.clientInfo?.ip,
        userAgent: context.request?.clientInfo?.userAgent,
        details: {
          method: context.request?.method,
          url: context.request?.url,
          statusCode: response.status,
          processingTime: metrics.processingTime,
          traceId: context.tracing?.traceId,
        },
        timestamp: new Date(),
      };

      await this.logEvent(auditEvent);
    } catch (error) {
      console.error('Failed to log request event:', error);
    }
  }

  /**
   * Static log method for backwards compatibility
   */
  static async log(event: Partial<AuditEvent>): Promise<void> {
    const logger = new AuditLogger();
    const fullEvent: AuditEvent = {
      action: event.action || 'UNKNOWN',
      resource: event.resource || 'system',
      resourceId: event.resourceId,
      userId: event.userId,
      tenantId: event.tenantId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      details: event.details,
      timestamp: event.timestamp || new Date(),
    };
    await logger.logEvent(fullEvent);
  }

  /**
   * Log a general audit event
   */
  private async logEvent(event: AuditEvent): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: event.action,
          resource: event.resource,
          details: event.details || {},
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          timestamp: event.timestamp,
          userId: event.userId,
        },
      });
    } catch (error) {
      console.error('Failed to persist audit log:', error);
      // Fallback to console logging
      console.log('AUDIT LOG:', JSON.stringify(event, null, 2));
    }
  }
}
