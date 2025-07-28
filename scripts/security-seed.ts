
/**
 * SECURITY SEED SCRIPT
 * Seeding script för säkerhetsrelaterade data
 */

import { prisma } from '../lib/db';
import { SecurityEventLogger } from '../lib/security-event-logger';
import { GDPRComplianceSystem } from '../lib/gdpr-compliance-system';
import crypto from 'crypto';

async function seedSecurityData() {
  console.log('🔐 Starting security data seeding...');

  try {
    // 1. Seed Security Events
    console.log('📊 Seeding security events...');
    
    const securityEvents = [
      {
        type: 'authentication_success',
        severity: 'info' as const,
        description: 'Successful user login',
        actor: 'user-1',
        outcome: 'success' as const,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { loginMethod: 'bankid' }
      },
      {
        type: 'authentication_failed',
        severity: 'medium' as const,
        description: 'Failed login attempt',
        actor: 'unknown',
        outcome: 'failure' as const,
        ipAddress: '203.0.113.42',
        userAgent: 'curl/7.68.0',
        metadata: { reason: 'invalid_credentials' }
      },
      {
        type: 'bankid_auth_success',
        severity: 'info' as const,
        description: 'Successful BankID authentication',
        actor: 'user-2',
        outcome: 'success' as const,
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        metadata: { personalNumber: '****1234', securityLevel: 'high' }
      },
      {
        type: 'threat_detected',
        severity: 'high' as const,
        description: 'SQL injection attempt detected',
        actor: 'unknown',
        outcome: 'failure' as const,
        ipAddress: '198.51.100.23',
        userAgent: 'sqlmap/1.5.2',
        metadata: { pattern: 'union select', blocked: true }
      },
      {
        type: 'gdpr_request_submitted',
        severity: 'info' as const,
        description: 'GDPR data access request submitted',
        actor: 'user-3',
        outcome: 'success' as const,
        ipAddress: '192.168.1.102',
        metadata: { requestType: 'access', requestId: crypto.randomUUID() }
      }
    ];

    for (const event of securityEvents) {
      await SecurityEventLogger.logSecurityEvent({
        ...event,
        tenantId: 'default'
      });
    }

    // 2. Seed GDPR Consent Records
    console.log('📋 Seeding GDPR consent records...');
    
    const consentRecords = [
      {
        userId: 'user-1',
        tenantId: 'default',
        consentType: 'cookie_consent',
        purpose: 'Website functionality and analytics',
        legalBasis: 'consent',
        status: 'given' as const,
        consentText: 'User consented to: necessary, functional, analytics',
        version: '2.0',
        givenAt: new Date(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        userId: 'user-2',
        tenantId: 'default',
        consentType: 'data_processing',
        purpose: 'Customer service and support',
        legalBasis: 'legitimate_interest',
        status: 'given' as const,
        consentText: 'User consented to data processing for customer service',
        version: '1.0',
        givenAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
      }
    ];

    for (const consent of consentRecords) {
      await GDPRComplianceSystem.recordConsent(consent);
    }

    // 3. Seed Data Subject Requests
    console.log('📝 Seeding data subject requests...');
    
    const dataRequests = [
      {
        type: 'access' as const,
        requesterId: 'user-1',
        requesterEmail: 'user1@example.com',
        subject: 'self' as const,
        description: 'Request for all personal data held by the company',
        tenantId: 'default'
      },
      {
        type: 'erasure' as const,
        requesterId: 'user-2',
        requesterEmail: 'user2@example.com',
        subject: 'self' as const,
        description: 'Request to delete all personal data',
        reason: 'No longer using the service',
        tenantId: 'default'
      }
    ];

    for (const request of dataRequests) {
      await GDPRComplianceSystem.submitDataSubjectRequest(request);
    }

    // 4. Seed Security Metrics
    console.log('📈 Seeding security metrics...');
    
    const securityMetrics = [
      {
        metricId: 'security_score_daily',
        name: 'Daily Security Score',
        type: 'gauge',
        category: 'security',
        value: 87.5,
        dimensions: { period: 'daily', tenant: 'default' }
      },
      {
        metricId: 'threats_blocked_daily',
        name: 'Daily Threats Blocked',
        type: 'counter',
        category: 'security',
        value: 23,
        dimensions: { period: 'daily', tenant: 'default' }
      },
      {
        metricId: 'failed_logins_hourly',
        name: 'Failed Logins per Hour',
        type: 'counter',
        category: 'authentication',
        value: 5,
        dimensions: { period: 'hourly', tenant: 'default' }
      }
    ];

    for (const metric of securityMetrics) {
      await prisma.securityMetric.create({
        data: {
          ...metric,
          timestamp: new Date(),
          dimensions: metric.dimensions,
          metadata: {}
        }
      });
    }

    // 5. Seed Security Alerts
    console.log('🚨 Seeding security alerts...');
    
    const securityAlerts = [
      {
        eventId: crypto.randomUUID(),
        type: 'threat_detected',
        severity: 'high' as const,
        title: 'Multiple Failed Login Attempts',
        description: 'Detected 10 failed login attempts from IP 203.0.113.42 in the last 5 minutes',
        status: 'active' as const,
        metadata: {
          ipAddress: '203.0.113.42',
          attemptCount: 10,
          timeWindow: '5 minutes'
        },
        tenantId: 'default'
      },
      {
        eventId: crypto.randomUUID(),
        type: 'suspicious_activity',
        severity: 'medium' as const,
        title: 'Unusual Access Pattern',
        description: 'User accessing system from new geographic location',
        status: 'investigating' as const,
        metadata: {
          userId: 'user-1',
          newLocation: 'Germany',
          previousLocation: 'Sweden'
        },
        tenantId: 'default'
      }
    ];

    for (const alert of securityAlerts) {
      await prisma.securityAlert.create({
        data: {
          id: crypto.randomUUID(),
          ...alert,
          createdAt: new Date()
        }
      });
    }

    // 6. Seed Rate Limit Records (for testing)
    console.log('⏱️ Seeding rate limit records...');
    
    const rateLimitRecords = [
      {
        identifier: '192.168.1.100',
        type: 'ip',
        endpoint: '/api/auth/login',
        requests: 3,
        windowStart: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        windowEnd: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        tenantId: 'default'
      },
      {
        identifier: '203.0.113.42',
        type: 'ip',
        endpoint: '/api/auth/login',
        requests: 15, // High request count
        windowStart: new Date(Date.now() - 10 * 60 * 1000),
        windowEnd: new Date(Date.now() + 10 * 60 * 1000),
        tenantId: 'default'
      }
    ];

    for (const record of rateLimitRecords) {
      await prisma.rateLimit.create({
        data: {
          id: crypto.randomUUID(),
          ...record
        }
      });
    }

    console.log('✅ Security data seeding completed successfully!');
    
    // Log completion
    await SecurityEventLogger.logSecurityEvent({
      type: 'system_maintenance',
      severity: 'info',
      description: 'Security data seeding completed',
      metadata: {
        seedingScript: 'security-seed.ts',
        timestamp: new Date().toISOString()
      },
      tenantId: 'default'
    });

  } catch (error) {
    console.error('❌ Security data seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedSecurityData()
    .then(() => {
      console.log('🎉 Security seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Security seeding failed:', error);
      process.exit(1);
    });
}

export { seedSecurityData };
