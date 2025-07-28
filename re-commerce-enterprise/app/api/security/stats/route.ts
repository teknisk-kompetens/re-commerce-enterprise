
/**
 * SECURITY STATISTICS API
 * API för säkerhetsstatistik och metriker
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import { EnhancedSecurityMiddleware } from '@/lib/enhanced-security-middleware';
import { GDPRComplianceSystem } from '@/lib/gdpr-compliance-system';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = "force-dynamic";

/**
 * GET - Hämta säkerhetsstatistik
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const tenantId = session.user.tenantId;

    // Hämta säkerhetsstatistik
    const [
      securityStats,
      gdprStats,
      blockedIPs,
      suspiciousIPs
    ] = await Promise.all([
      SecurityEventLogger.getSecurityStats(tenantId, days),
      GDPRComplianceSystem.getGDPRStats(tenantId),
      EnhancedSecurityMiddleware.getBlockedIPs(),
      EnhancedSecurityMiddleware.getSuspiciousIPs()
    ]);

    // Beräkna ytterligare metriker
    const currentTime = new Date();
    const totalThreats = securityStats.severityBreakdown.high || 0 + 
                        securityStats.severityBreakdown.critical || 0;
    
    const securityScore = Math.max(0, 100 - (
      (securityStats.severityBreakdown.critical || 0) * 10 +
      (securityStats.severityBreakdown.high || 0) * 5 +
      (securityStats.severityBreakdown.medium || 0) * 2 +
      (securityStats.severityBreakdown.low || 0) * 1
    ));

    const response = {
      success: true,
      data: {
        overview: {
          totalEvents: securityStats.totalEvents,
          securityScore: Math.round(securityScore),
          threatsBlocked: totalThreats,
          activeAlerts: securityStats.severityBreakdown.critical || 0,
          lastUpdated: currentTime
        },
        threats: {
          breakdown: securityStats.severityBreakdown,
          typeBreakdown: securityStats.typeBreakdown,
          categoryBreakdown: securityStats.categoryBreakdown,
          timeline: securityStats.timeSeriesData
        },
        network: {
          blockedIPs: blockedIPs.length,
          suspiciousIPs: suspiciousIPs.length,
          blockedIPsList: blockedIPs.slice(0, 10), // Top 10
          suspiciousIPsList: suspiciousIPs
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        },
        compliance: {
          gdpr: {
            activeRequests: gdprStats.activeRequests,
            completedRequests: gdprStats.completedRequests,
            averageProcessingTime: gdprStats.averageProcessingTime,
            consentGiven: gdprStats.consentGiven,
            consentWithdrawn: gdprStats.consentWithdrawn,
            dataRetentionCompliance: gdprStats.dataRetentionCompliance
          }
        },
        authentication: {
          successfulLogins: securityStats.typeBreakdown.authentication_success || 0,
          failedLogins: securityStats.typeBreakdown.authentication_failed || 0,
          bankidAuth: (securityStats.typeBreakdown.bankid_auth_success || 0) +
                     (securityStats.typeBreakdown.bankid_auth_failed || 0),
          mfaVerifications: securityStats.typeBreakdown.mfa_success || 0
        },
        realTimeMetrics: {
          requestsPerMinute: 0, // Mock - skulle beräknas från real-time data
          averageResponseTime: 150, // Mock
          systemLoad: 0.3, // Mock
          memoryUsage: 0.45 // Mock
        }
      },
      period: {
        days,
        from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        to: currentTime
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Security stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security statistics' },
      { status: 500 }
    );
  }
}
