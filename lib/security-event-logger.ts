
/**
 * SECURITY EVENT LOGGER
 * Centraliserad säkerhetsloggning med GDPR-compliance
 */

import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface SecurityEvent {
  id?: string;
  source?: string;
  type: string;
  category?: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actor?: string;
  target?: string;
  outcome?: 'success' | 'failure' | 'unknown';
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
  tenantId?: string;
  retentionDays?: number;
  encrypted?: boolean;
}

export interface SecurityEventFilter {
  type?: string;
  category?: string;
  severity?: string;
  actor?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tenantId?: string;
  limit?: number;
  offset?: number;
}

export interface SecurityEventStats {
  totalEvents: number;
  severityBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  timeSeriesData: Array<{
    date: string;
    count: number;
    severity: string;
  }>;
}

export class SecurityEventLogger {
  private static readonly ENCRYPTION_KEY = process.env.SECURITY_LOG_ENCRYPTION_KEY || 'default-key';
  private static readonly DEFAULT_RETENTION_DAYS = 2555; // 7 år för compliance

  /**
   * Logga säkerhetshändelse
   */
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Bestäm retention baserat på typ och severity
      const retentionDays = this.calculateRetentionDays(event);
      
      // Kryptera känslig data om nödvändigt
      const encryptedMetadata = event.metadata ? 
        await this.encryptSensitiveData(event.metadata) : {};

      // Skapa säkerhetshändelse i databas
      await prisma.securityEvent.create({
        data: {
          id: event.id || crypto.randomUUID(),
          source: event.source || 'system',
          type: event.type,
          category: event.category || 'general',
          severity: event.severity,
          description: event.description,
          actor: event.actor,
          target: event.target,
          outcome: event.outcome || 'unknown',
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          timestamp: event.timestamp || new Date(),
          metadata: encryptedMetadata,
          tenantId: event.tenantId || 'system',
          retentionUntil: new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000),
          encrypted: !!event.metadata
        }
      });

      // Skicka real-time alerter för kritiska händelser
      if (event.severity === 'critical' || event.severity === 'high') {
        await this.sendSecurityAlert(event);
      }

      // Uppdatera säkerhetsmetriker
      await this.updateSecurityMetrics(event);

    } catch (error) {
      console.error('Failed to log security event:', error);
      // Fallback - logga till fil eller extern service
      await this.fallbackLogging(event, error);
    }
  }

  /**
   * Hämta säkerhetshändelser med filtrering
   */
  static async getSecurityEvents(filter: SecurityEventFilter = {}): Promise<{
    events: any[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const where: any = {};

      if (filter.type) where.type = filter.type;
      if (filter.category) where.category = filter.category;
      if (filter.severity) where.severity = filter.severity;
      if (filter.actor) where.actor = filter.actor;
      if (filter.tenantId) where.tenantId = filter.tenantId;
      
      if (filter.dateFrom || filter.dateTo) {
        where.timestamp = {};
        if (filter.dateFrom) where.timestamp.gte = filter.dateFrom;
        if (filter.dateTo) where.timestamp.lte = filter.dateTo;
      }

      const [events, total] = await Promise.all([
        prisma.securityEvent.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: filter.limit || 50,
          skip: filter.offset || 0,
          select: {
            id: true,
            source: true,
            type: true,
            category: true,
            severity: true,
            description: true,
            actor: true,
            target: true,
            outcome: true,
            ipAddress: true,
            timestamp: true,
            metadata: true,
            encrypted: true
          }
        }),
        prisma.securityEvent.count({ where })
      ]);

      // Dekryptera metadata för tillåtna användare
      const decryptedEvents = await Promise.all(
        events.map(async (event) => ({
          ...event,
          metadata: event.encrypted ? 
            await this.decryptSensitiveData(event.metadata as any) : 
            event.metadata
        }))
      );

      return {
        events: decryptedEvents,
        total,
        hasMore: (filter.offset || 0) + events.length < total
      };

    } catch (error) {
      console.error('Failed to fetch security events:', error);
      return { events: [], total: 0, hasMore: false };
    }
  }

  /**
   * Hämta säkerhetsstatistik
   */
  static async getSecurityStats(
    tenantId?: string,
    days: number = 30
  ): Promise<SecurityEventStats> {
    try {
      const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const where: any = {
        timestamp: { gte: dateFrom }
      };
      
      if (tenantId) where.tenantId = tenantId;

      const [
        totalEvents,
        severityStats,
        typeStats,
        categoryStats,
        timeSeriesData
      ] = await Promise.all([
        prisma.securityEvent.count({ where }),
        prisma.securityEvent.groupBy({
          by: ['severity'],
          where,
          _count: { severity: true }
        }),
        prisma.securityEvent.groupBy({
          by: ['type'],
          where,
          _count: { type: true }
        }),
        prisma.securityEvent.groupBy({
          by: ['category'],
          where,
          _count: { category: true }
        }),
        prisma.$queryRaw`
          SELECT 
            DATE(timestamp) as date,
            severity,
            COUNT(*) as count
          FROM security_events 
          WHERE timestamp >= ${dateFrom}
            ${tenantId ? `AND tenant_id = ${tenantId}` : ''}
          GROUP BY DATE(timestamp), severity
          ORDER BY date DESC
        `
      ]);

      return {
        totalEvents,
        severityBreakdown: Object.fromEntries(
          severityStats.map(s => [s.severity, s._count.severity])
        ),
        typeBreakdown: Object.fromEntries(
          typeStats.map(t => [t.type, t._count.type])
        ),
        categoryBreakdown: Object.fromEntries(
          categoryStats.map(c => [c.category, c._count.category])
        ),
        timeSeriesData: timeSeriesData as any[]
      };

    } catch (error) {
      console.error('Failed to get security stats:', error);
      return {
        totalEvents: 0,
        severityBreakdown: {},
        typeBreakdown: {},
        categoryBreakdown: {},
        timeSeriesData: []
      };
    }
  }

  /**
   * Rensa gamla säkerhetshändelser (GDPR compliance)
   */
  static async cleanupExpiredEvents(): Promise<number> {
    try {
      const result = await prisma.securityEvent.deleteMany({
        where: {
          retentionUntil: {
            lt: new Date()
          }
        }
      });

      if (result.count > 0) {
        await this.logSecurityEvent({
          type: 'security_logs_cleanup',
          severity: 'info',
          description: `Cleaned up ${result.count} expired security events`,
          metadata: { deletedCount: result.count }
        });
      }

      return result.count;
    } catch (error) {
      console.error('Failed to cleanup expired events:', error);
      return 0;
    }
  }

  /**
   * Exportera säkerhetshändelser (GDPR data export)
   */
  static async exportSecurityEvents(
    tenantId: string,
    userId?: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    try {
      const where: any = { tenantId };
      if (userId) where.actor = userId;

      const events = await prisma.securityEvent.findMany({
        where,
        orderBy: { timestamp: 'desc' }
      });

      // Dekryptera för export
      const decryptedEvents = await Promise.all(
        events.map(async (event) => ({
          ...event,
          metadata: event.encrypted ? 
            await this.decryptSensitiveData(event.metadata as any) : 
            event.metadata
        }))
      );

      if (format === 'csv') {
        return this.convertToCSV(decryptedEvents);
      }

      return JSON.stringify(decryptedEvents, null, 2);

    } catch (error) {
      console.error('Failed to export security events:', error);
      throw error;
    }
  }

  /**
   * Beräkna retention baserat på händelsetyp
   */
  private static calculateRetentionDays(event: SecurityEvent): number {
    // Compliance-baserad retention
    const complianceRetention: Record<string, number> = {
      'authentication_success': 1095, // 3 år
      'authentication_failed': 2555, // 7 år
      'bankid_auth_success': 2555, // 7 år
      'bankid_auth_failed': 2555, // 7 år
      'data_access': 2555, // 7 år
      'data_export': 2555, // 7 år
      'data_deletion': 2555, // 7 år
      'admin_action': 2555, // 7 år
      'security_incident': 3650, // 10 år
      'compliance_audit': 3650, // 10 år
    };

    return event.retentionDays || 
           complianceRetention[event.type] || 
           this.DEFAULT_RETENTION_DAYS;
  }

  /**
   * Kryptera känslig data
   */
  private static async encryptSensitiveData(data: Record<string, any>): Promise<Record<string, any>> {
    try {
      const sensitiveFields = ['personalNumber', 'email', 'password', 'token', 'sessionId'];
      const encrypted = { ...data };

      for (const field of sensitiveFields) {
        if (encrypted[field]) {
          encrypted[field] = await this.encrypt(String(encrypted[field]));
        }
      }

      return encrypted;
    } catch (error) {
      console.error('Failed to encrypt sensitive data:', error);
      return data;
    }
  }

  /**
   * Dekryptera känslig data
   */
  private static async decryptSensitiveData(data: Record<string, any>): Promise<Record<string, any>> {
    try {
      const sensitiveFields = ['personalNumber', 'email', 'password', 'token', 'sessionId'];
      const decrypted = { ...data };

      for (const field of sensitiveFields) {
        if (decrypted[field] && typeof decrypted[field] === 'string') {
          try {
            decrypted[field] = await this.decrypt(decrypted[field]);
          } catch {
            // Om dekryptering misslyckas, behåll original
          }
        }
      }

      return decrypted;
    } catch (error) {
      console.error('Failed to decrypt sensitive data:', error);
      return data;
    }
  }

  /**
   * Kryptera sträng
   */
  private static async encrypt(text: string): Promise<string> {
    const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Dekryptera sträng
   */
  private static async decrypt(encryptedText: string): Promise<string> {
    const decipher = crypto.createDecipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Skicka säkerhetsalert
   */
  private static async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    try {
      // I produktion skulle detta integrera med alerting system (Slack, email, etc.)
      console.log(`🚨 SECURITY ALERT [${event.severity.toUpperCase()}]: ${event.description}`);
      
      // Skapa alert i databas för dashboard
      await prisma.securityAlert.create({
        data: {
          id: crypto.randomUUID(),
          eventId: event.id || crypto.randomUUID(),
          type: event.type,
          severity: event.severity,
          title: `Security Alert: ${event.type}`,
          description: event.description,
          status: 'active',
          createdAt: new Date(),
          metadata: event.metadata || {},
          tenantId: event.tenantId || 'system'
        }
      });

    } catch (error) {
      console.error('Failed to send security alert:', error);
    }
  }

  /**
   * Uppdatera säkerhetsmetriker
   */
  private static async updateSecurityMetrics(event: SecurityEvent): Promise<void> {
    try {
      const metricId = `security_events_${event.type}_${event.severity}`;
      
      await prisma.securityMetric.upsert({
        where: { metricId },
        update: {
          value: { increment: 1 },
          timestamp: new Date()
        },
        create: {
          metricId,
          name: `Security Events: ${event.type} (${event.severity})`,
          type: 'counter',
          category: 'security',
          value: 1,
          timestamp: new Date(),
          dimensions: {
            eventType: event.type,
            severity: event.severity,
            category: event.category
          }
        }
      });

    } catch (error) {
      console.error('Failed to update security metrics:', error);
    }
  }

  /**
   * Fallback-loggning vid systemfel
   */
  private static async fallbackLogging(event: SecurityEvent, error: any): Promise<void> {
    try {
      // Logga till fil eller extern service som fallback
      const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        error: error.message
      };
      
      console.error('SECURITY EVENT FALLBACK:', JSON.stringify(logEntry));
      
      // I produktion skulle detta skriva till säker loggfil eller extern service
      
    } catch (fallbackError) {
      console.error('Fallback logging failed:', fallbackError);
    }
  }

  /**
   * Konvertera till CSV format
   */
  private static convertToCSV(events: any[]): string {
    if (events.length === 0) return '';

    const headers = Object.keys(events[0]);
    const csvRows = [headers.join(',')];

    for (const event of events) {
      const values = headers.map(header => {
        const value = event[header];
        return typeof value === 'object' ? JSON.stringify(value) : String(value || '');
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}

// Periodisk rensning av gamla händelser (körs varje dag)
setInterval(async () => {
  try {
    await SecurityEventLogger.cleanupExpiredEvents();
  } catch (error) {
    console.error('Failed to run security event cleanup:', error);
  }
}, 24 * 60 * 60 * 1000); // 24 timmar
