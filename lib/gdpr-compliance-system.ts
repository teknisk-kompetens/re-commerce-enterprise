
/**
 * GDPR COMPLIANCE SYSTEM
 * Komplett GDPR-efterlevnadssystem med dataskydd och användarrättigheter
 */

import { prisma } from '@/lib/db';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import crypto from 'crypto';

export interface DataSubjectRequest {
  id?: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requesterId: string;
  requesterEmail: string;
  subject: 'self' | 'other';
  subjectId?: string;
  subjectEmail?: string;
  reason?: string;
  legalBasis?: string;
  description: string;
  requestedData?: string[];
  processedBy?: string;
  processedAt?: Date;
  completedAt?: Date;
  responseData?: any;
  rejectionReason?: string;
  tenantId: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConsentRecord {
  id?: string;
  userId: string;
  tenantId: string;
  consentType: string;
  purpose: string;
  legalBasis: string;
  status: 'given' | 'withdrawn' | 'expired';
  consentText: string;
  version: string;
  givenAt: Date;
  withdrawnAt?: Date;
  expiresAt?: Date;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

export interface DataProcessingActivity {
  id?: string;
  name: string;
  description: string;
  controller: string;
  processor?: string;
  dataCategories: string[];
  legalBasis: string;
  purposes: string[];
  recipients?: string[];
  retentionPeriod: number;
  technicalMeasures: string[];
  organisationalMeasures: string[];
  riskLevel: 'low' | 'medium' | 'high';
  lastReviewed: Date;
  tenantId: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface PrivacyNotice {
  id?: string;
  title: string;
  content: string;
  version: string;
  language: string;
  effectiveDate: Date;
  expiryDate?: Date;
  audience: string[];
  mandatory: boolean;
  consentRequired: boolean;
  tenantId: string;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export class GDPRComplianceSystem {
  private static readonly DATA_RETENTION_LIMITS: Record<string, number> = {
    'user_data': 2555, // 7 år
    'transaction_data': 2555, // 7 år
    'security_logs': 2555, // 7 år
    'communication_data': 1095, // 3 år
    'marketing_data': 1095, // 3 år
    'analytics_data': 1095, // 3 år
    'session_data': 30, // 30 dagar
    'temporary_data': 7, // 7 dagar
  };

  /**
   * Skicka in datasubjektsbegäran
   */
  static async submitDataSubjectRequest(request: DataSubjectRequest): Promise<{
    success: boolean;
    requestId?: string;
    estimatedCompletion?: Date;
    error?: string;
  }> {
    try {
      // Validera begäran
      const validation = await this.validateDataSubjectRequest(request);
      if (!validation.valid) {
        return { success: false, error: validation.reason };
      }

      // Skapa begäran i databas
      const requestId = crypto.randomUUID();
      const estimatedCompletion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dagar

      await prisma.dataSubjectRequest.create({
        data: {
          id: requestId,
          type: request.type,
          status: 'pending',
          requesterId: request.requesterId,
          requesterEmail: request.requesterEmail,
          subject: request.subject,
          subjectId: request.subjectId,
          subjectEmail: request.subjectEmail,
          reason: request.reason,
          legalBasis: request.legalBasis,
          description: request.description,
          requestedData: request.requestedData || [],
          tenantId: request.tenantId,
          estimatedCompletion,
          metadata: request.metadata || {},
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Logga säkerhetshändelse
      await SecurityEventLogger.logSecurityEvent({
        type: 'gdpr_request_submitted',
        severity: 'info',
        description: `GDPR ${request.type} request submitted`,
        actor: request.requesterId,
        metadata: {
          requestId,
          requestType: request.type,
          subject: request.subject,
          tenantId: request.tenantId
        },
        tenantId: request.tenantId
      });

      // Starta automatisk behandling för vissa typer
      if (request.type === 'access' || request.type === 'portability') {
        await this.processDataAccessRequest(requestId);
      }

      return {
        success: true,
        requestId,
        estimatedCompletion
      };

    } catch (error) {
      console.error('Failed to submit data subject request:', error);
      return { success: false, error: 'System error' };
    }
  }

  /**
   * Behandla dataåtkomstbegäran
   */
  static async processDataAccessRequest(requestId: string): Promise<void> {
    try {
      const request = await prisma.dataSubjectRequest.findUnique({
        where: { id: requestId }
      });

      if (!request || request.type !== 'access') {
        throw new Error('Invalid access request');
      }

      // Uppdatera status
      await prisma.dataSubjectRequest.update({
        where: { id: requestId },
        data: {
          status: 'in_progress',
          processedAt: new Date()
        }
      });

      // Samla all användardata
      const userData = await this.collectUserData(
        request.subjectId || request.requesterId,
        request.tenantId
      );

      // Anonymisera känslig data
      const anonymizedData = await this.anonymizePersonalData(userData);

      // Spara resultat
      await prisma.dataSubjectRequest.update({
        where: { id: requestId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          responseData: anonymizedData
        }
      });

      // Logga slutförande
      await SecurityEventLogger.logSecurityEvent({
        type: 'gdpr_access_completed',
        severity: 'info',
        description: 'GDPR access request completed',
        actor: request.requesterId,
        metadata: {
          requestId,
          dataSize: JSON.stringify(anonymizedData).length,
          tenantId: request.tenantId
        },
        tenantId: request.tenantId
      });

    } catch (error) {
      console.error('Failed to process access request:', error);
      
      // Uppdatera status till fel
      await prisma.dataSubjectRequest.update({
        where: { id: requestId },
        data: {
          status: 'rejected',
          rejectionReason: 'Processing error',
          completedAt: new Date()
        }
      });
    }
  }

  /**
   * Behandla dataraderingsbegäran
   */
  static async processDataErasureRequest(requestId: string): Promise<{
    success: boolean;
    deletedRecords?: number;
    retainedRecords?: number;
    error?: string;
  }> {
    try {
      const request = await prisma.dataSubjectRequest.findUnique({
        where: { id: requestId }
      });

      if (!request || request.type !== 'erasure') {
        return { success: false, error: 'Invalid erasure request' };
      }

      const userId = request.subjectId || request.requesterId;
      const tenantId = request.tenantId;

      // Kontrollera rättslig grund för radering
      const canDelete = await this.canDeleteUserData(userId, tenantId);
      if (!canDelete.allowed) {
        await prisma.dataSubjectRequest.update({
          where: { id: requestId },
          data: {
            status: 'rejected',
            rejectionReason: canDelete.reason,
            completedAt: new Date()
          }
        });

        return { success: false, error: canDelete.reason };
      }

      // Uppdatera status
      await prisma.dataSubjectRequest.update({
        where: { id: requestId },
        data: {
          status: 'in_progress',
          processedAt: new Date()
        }
      });

      // Utför radering
      const deletionResult = await this.deleteUserData(userId, tenantId);

      // Uppdatera begäran med resultat
      await prisma.dataSubjectRequest.update({
        where: { id: requestId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          responseData: {
            deletedRecords: deletionResult.deleted,
            retainedRecords: deletionResult.retained,
            retentionReasons: deletionResult.retentionReasons
          }
        }
      });

      // Logga radering
      await SecurityEventLogger.logSecurityEvent({
        type: 'gdpr_erasure_completed',
        severity: 'high',
        description: 'GDPR erasure request completed',
        actor: request.requesterId,
        target: userId,
        metadata: {
          requestId,
          deletedRecords: deletionResult.deleted,
          retainedRecords: deletionResult.retained,
          tenantId
        },
        tenantId
      });

      return {
        success: true,
        deletedRecords: deletionResult.deleted,
        retainedRecords: deletionResult.retained
      };

    } catch (error) {
      console.error('Failed to process erasure request:', error);
      return { success: false, error: 'Processing error' };
    }
  }

  /**
   * Registrera användarmedgivande
   */
  static async recordConsent(consent: ConsentRecord): Promise<{
    success: boolean;
    consentId?: string;
    error?: string;
  }> {
    try {
      const consentId = crypto.randomUUID();

      // Dra tillbaka tidigare medgivanden av samma typ
      await prisma.consentRecord.updateMany({
        where: {
          userId: consent.userId,
          tenantId: consent.tenantId,
          consentType: consent.consentType,
          status: 'given'
        },
        data: {
          status: 'withdrawn',
          withdrawnAt: new Date()
        }
      });

      // Skapa nytt medgivande
      await prisma.consentRecord.create({
        data: {
          id: consentId,
          userId: consent.userId,
          tenantId: consent.tenantId,
          consentType: consent.consentType,
          purpose: consent.purpose,
          legalBasis: consent.legalBasis,
          status: consent.status,
          consentText: consent.consentText,
          version: consent.version,
          givenAt: consent.givenAt,
          expiresAt: consent.expiresAt,
          ipAddress: consent.ipAddress,
          userAgent: consent.userAgent,
          metadata: consent.metadata || {}
        }
      });

      // Logga medgivande
      await SecurityEventLogger.logSecurityEvent({
        type: 'consent_recorded',
        severity: 'info',
        description: `User consent recorded for ${consent.consentType}`,
        actor: consent.userId,
        metadata: {
          consentId,
          consentType: consent.consentType,
          purpose: consent.purpose,
          legalBasis: consent.legalBasis,
          tenantId: consent.tenantId
        },
        tenantId: consent.tenantId
      });

      return { success: true, consentId };

    } catch (error) {
      console.error('Failed to record consent:', error);
      return { success: false, error: 'System error' };
    }
  }

  /**
   * Dra tillbaka medgivande
   */
  static async withdrawConsent(
    userId: string,
    tenantId: string,
    consentType: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Uppdatera alla aktiva medgivanden av denna typ
      const result = await prisma.consentRecord.updateMany({
        where: {
          userId,
          tenantId,
          consentType,
          status: 'given'
        },
        data: {
          status: 'withdrawn',
          withdrawnAt: new Date(),
          metadata: {
            withdrawalReason: reason
          }
        }
      });

      // Logga återkallelse
      await SecurityEventLogger.logSecurityEvent({
        type: 'consent_withdrawn',
        severity: 'info',
        description: `User consent withdrawn for ${consentType}`,
        actor: userId,
        metadata: {
          consentType,
          reason,
          affectedRecords: result.count,
          tenantId
        },
        tenantId
      });

      return { success: true };

    } catch (error) {
      console.error('Failed to withdraw consent:', error);
      return { success: false, error: 'System error' };
    }
  }

  /**
   * Kontrollera medgivandestatus
   */
  static async checkConsentStatus(
    userId: string,
    tenantId: string,
    consentType?: string
  ): Promise<ConsentRecord[]> {
    try {
      const where: any = {
        userId,
        tenantId,
        status: 'given'
      };

      if (consentType) {
        where.consentType = consentType;
      }

      const consents = await prisma.consentRecord.findMany({
        where,
        orderBy: { givenAt: 'desc' }
      });

      return consents;

    } catch (error) {
      console.error('Failed to check consent status:', error);
      return [];
    }
  }

  /**
   * Samla användardata för export
   */
  private static async collectUserData(
    userId: string,
    tenantId: string
  ): Promise<Record<string, any>> {
    try {
      const [
        user,
        tasks,
        projects,
        analytics,
        notifications,
        comments,
        attachments,
        consents,
        securityEvents
      ] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          include: { tenant: true }
        }),
        prisma.task.findMany({
          where: { assignedTo: userId, tenantId }
        }),
        prisma.project.findMany({
          where: { ownerId: userId, tenantId }
        }),
        prisma.analytics.findMany({
          where: { userId, tenantId }
        }),
        prisma.notification.findMany({
          where: { userId, tenantId }
        }),
        prisma.comment.findMany({
          where: { authorId: userId, tenantId }
        }),
        prisma.attachment.findMany({
          where: { uploadedBy: userId, tenantId }
        }),
        prisma.consentRecord.findMany({
          where: { userId, tenantId }
        }),
        prisma.securityEvent.findMany({
          where: { actor: userId, tenantId }
        })
      ]);

      return {
        user,
        tasks,
        projects,
        analytics,
        notifications,
        comments,
        attachments,
        consents,
        securityEvents,
        exportedAt: new Date(),
        dataVersion: '1.0'
      };

    } catch (error) {
      console.error('Failed to collect user data:', error);
      throw error;
    }
  }

  /**
   * Anonymisera personuppgifter
   */
  private static async anonymizePersonalData(data: Record<string, any>): Promise<Record<string, any>> {
    const anonymized = JSON.parse(JSON.stringify(data));

    // Definiera fält som ska anonymiseras
    const personalDataFields = ['email', 'name', 'personalNumber', 'address', 'phone'];
    
    function anonymizeObject(obj: any): void {
      if (typeof obj !== 'object' || obj === null) return;

      for (const key in obj) {
        if (personalDataFields.includes(key)) {
          if (typeof obj[key] === 'string') {
            obj[key] = this.anonymizeString(obj[key]);
          }
        } else if (typeof obj[key] === 'object') {
          anonymizeObject(obj[key]);
        }
      }
    }

    anonymizeObject(anonymized);
    return anonymized;
  }

  /**
   * Anonymisera sträng
   */
  private static anonymizeString(str: string): string {
    if (!str) return str;
    
    if (str.includes('@')) {
      // Email - behåll domain
      const [local, domain] = str.split('@');
      return `***@${domain}`;
    }
    
    // Andra strängar - visa bara första och sista tecken
    if (str.length <= 2) return '***';
    return str[0] + '*'.repeat(str.length - 2) + str[str.length - 1];
  }

  /**
   * Kontrollera om användardata kan raderas
   */
  private static async canDeleteUserData(
    userId: string,
    tenantId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Kontrollera aktiva juridiska förpliktelser
      const activeContracts = await prisma.user.findFirst({
        where: {
          id: userId,
          tenantId,
          // In production, check for active contracts, pending legal matters, etc.
        }
      });

      // Kontrollera regulatoriska krav
      const regulatoryRetention = await this.checkRegulatoryRetention(userId, tenantId);
      if (!regulatoryRetention.canDelete) {
        return {
          allowed: false,
          reason: `Data must be retained for regulatory compliance: ${regulatoryRetention.reason}`
        };
      }

      return { allowed: true };

    } catch (error) {
      console.error('Failed to check deletion eligibility:', error);
      return { allowed: false, reason: 'System error during validation' };
    }
  }

  /**
   * Kontrollera regulatoriska retentionskrav
   */
  private static async checkRegulatoryRetention(
    userId: string,
    tenantId: string
  ): Promise<{ canDelete: boolean; reason?: string }> {
    // Mock implementation - i produktion kontrollera mot olika regulatoriska krav
    return { canDelete: true };
  }

  /**
   * Radera användardata
   */
  private static async deleteUserData(
    userId: string,
    tenantId: string
  ): Promise<{ deleted: number; retained: number; retentionReasons: string[] }> {
    let deleted = 0;
    let retained = 0;
    const retentionReasons: string[] = [];

    try {
      // Radera i säker ordning för att respektera foreign key constraints
      
      // Soft delete för audit trail
      const updateData = {
        email: `deleted_${userId}@deleted.local`,
        name: '[DELETED]',
        password: null,
        isActive: false,
        deletedAt: new Date()
      };

      await prisma.user.update({
        where: { id: userId },
        data: updateData
      });
      deleted++;

      // Radera associerad data
      const deletionTasks = [
        { model: 'notification', field: 'userId' },
        { model: 'comment', field: 'authorId' },
        { model: 'attachment', field: 'uploadedBy' },
        { model: 'task', field: 'assignedTo' }
      ];

      for (const task of deletionTasks) {
        try {
          const result = await (prisma as any)[task.model].deleteMany({
            where: { [task.field]: userId, tenantId }
          });
          deleted += result.count;
        } catch (error) {
          console.error(`Failed to delete ${task.model}:`, error);
          retained++;
          retentionReasons.push(`${task.model} deletion failed`);
        }
      }

      // Behåll vissa data för compliance
      const securityEventCount = await prisma.securityEvent.count({
        where: { actor: userId, tenantId }
      });
      retained += securityEventCount;
      retentionReasons.push('Security events retained for compliance');

      return { deleted, retained, retentionReasons };

    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw error;
    }
  }

  /**
   * Validera datasubjektsbegäran
   */
  private static async validateDataSubjectRequest(
    request: DataSubjectRequest
  ): Promise<{ valid: boolean; reason?: string }> {
    // Kontrollera att begäran är giltig
    if (!request.requesterId || !request.requesterEmail) {
      return { valid: false, reason: 'Missing requester information' };
    }

    if (!request.type || !['access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'].includes(request.type)) {
      return { valid: false, reason: 'Invalid request type' };
    }

    if (!request.description) {
      return { valid: false, reason: 'Missing description' };
    }

    // Kontrollera dubbletter (samma begäran inom 30 dagar)
    const recentRequest = await prisma.dataSubjectRequest.findFirst({
      where: {
        requesterId: request.requesterId,
        type: request.type,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (recentRequest) {
      return { valid: false, reason: 'Duplicate request within 30 days' };
    }

    return { valid: true };
  }

  /**
   * Hämta GDPR-statistik
   */
  static async getGDPRStats(tenantId?: string): Promise<{
    activeRequests: number;
    completedRequests: number;
    averageProcessingTime: number;
    consentGiven: number;
    consentWithdrawn: number;
    dataRetentionCompliance: number;
  }> {
    try {
      const where = tenantId ? { tenantId } : {};

      const [
        activeRequests,
        completedRequests,
        allRequests,
        consentStats
      ] = await Promise.all([
        prisma.dataSubjectRequest.count({
          where: { ...where, status: { in: ['pending', 'in_progress'] } }
        }),
        prisma.dataSubjectRequest.count({
          where: { ...where, status: 'completed' }
        }),
        prisma.dataSubjectRequest.findMany({
          where: { ...where, status: 'completed', processedAt: { not: null }, completedAt: { not: null } },
          select: { processedAt: true, completedAt: true }
        }),
        prisma.consentRecord.groupBy({
          by: ['status'],
          where,
          _count: { status: true }
        })
      ]);

      // Beräkna genomsnittlig handläggningstid
      const avgProcessingTime = allRequests.length > 0 
        ? allRequests.reduce((sum, req) => {
            if (req.processedAt && req.completedAt) {
              return sum + (req.completedAt.getTime() - req.processedAt.getTime());
            }
            return sum;
          }, 0) / allRequests.length / (24 * 60 * 60 * 1000) // Dagar
        : 0;

      const consentGiven = consentStats.find(s => s.status === 'given')?._count.status || 0;
      const consentWithdrawn = consentStats.find(s => s.status === 'withdrawn')?._count.status || 0;

      return {
        activeRequests,
        completedRequests,
        averageProcessingTime: Math.round(avgProcessingTime),
        consentGiven,
        consentWithdrawn,
        dataRetentionCompliance: 95 // Mock compliance percentage
      };

    } catch (error) {
      console.error('Failed to get GDPR stats:', error);
      return {
        activeRequests: 0,
        completedRequests: 0,
        averageProcessingTime: 0,
        consentGiven: 0,
        consentWithdrawn: 0,
        dataRetentionCompliance: 0
      };
    }
  }
}
