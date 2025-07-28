
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface PlatformStatus {
  overall: {
    status: 'operational' | 'degraded' | 'partial-outage' | 'major-outage';
    uptime: number;
    lastIncident: Date | null;
    responseTime: number;
    errorRate: number;
  };
  services: {
    id: string;
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    uptime: number;
    responseTime: number;
    description: string;
    lastChecked: Date;
    incidents: number;
  }[];
  metrics: {
    requests: {
      total: number;
      successful: number;
      failed: number;
      rate: number;
    };
    performance: {
      averageResponseTime: number;
      p95ResponseTime: number;
      p99ResponseTime: number;
      throughput: number;
    };
    errors: {
      total: number;
      rate: number;
      types: Record<string, number>;
    };
    security: {
      threats: number;
      blocked: number;
      vulnerabilities: number;
      score: number;
    };
  };
  incidents: {
    id: string;
    title: string;
    description: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    severity: 'low' | 'medium' | 'high' | 'critical';
    startTime: Date;
    endTime?: Date;
    affectedServices: string[];
    updates: Array<{
      timestamp: Date;
      message: string;
      status: string;
    }>;
  }[];
  announcements: {
    id: string;
    title: string;
    message: string;
    type: 'maintenance' | 'feature' | 'security' | 'outage';
    severity: 'info' | 'warning' | 'critical';
    startTime: Date;
    endTime?: Date;
    affectedServices: string[];
  }[];
}

const generatePlatformStatus = (): PlatformStatus => {
  const now = new Date();
  
  return {
    overall: {
      status: 'operational',
      uptime: 99.97,
      lastIncident: new Date(now.getTime() - 86400000 * 7), // 7 days ago
      responseTime: 145,
      errorRate: 0.12
    },
    services: [
      {
        id: 'web-app',
        name: 'Web Application',
        status: 'operational',
        uptime: 99.98,
        responseTime: 120,
        description: 'Main web application and user interface',
        lastChecked: new Date(now.getTime() - 60000), // 1 minute ago
        incidents: 0
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        status: 'operational',
        uptime: 99.95,
        responseTime: 85,
        description: 'REST API and GraphQL endpoints',
        lastChecked: new Date(now.getTime() - 30000), // 30 seconds ago
        incidents: 0
      },
      {
        id: 'database',
        name: 'Database',
        status: 'operational',
        uptime: 99.99,
        responseTime: 25,
        description: 'Primary database and read replicas',
        lastChecked: new Date(now.getTime() - 45000), // 45 seconds ago
        incidents: 0
      },
      {
        id: 'ai-analytics',
        name: 'AI Analytics',
        status: 'operational',
        uptime: 99.92,
        responseTime: 340,
        description: 'Machine learning and AI processing',
        lastChecked: new Date(now.getTime() - 120000), // 2 minutes ago
        incidents: 0
      },
      {
        id: 'security-services',
        name: 'Security Services',
        status: 'operational',
        uptime: 99.96,
        responseTime: 95,
        description: 'Authentication, authorization, and security',
        lastChecked: new Date(now.getTime() - 90000), // 1.5 minutes ago
        incidents: 0
      },
      {
        id: 'integrations',
        name: 'Integrations',
        status: 'operational',
        uptime: 99.87,
        responseTime: 180,
        description: 'Third-party integrations and webhooks',
        lastChecked: new Date(now.getTime() - 75000), // 1.25 minutes ago
        incidents: 0
      },
      {
        id: 'cdn',
        name: 'CDN & Edge',
        status: 'operational',
        uptime: 99.94,
        responseTime: 45,
        description: 'Content delivery network and edge computing',
        lastChecked: new Date(now.getTime() - 30000), // 30 seconds ago
        incidents: 0
      },
      {
        id: 'monitoring',
        name: 'Monitoring & Observability',
        status: 'degraded',
        uptime: 99.82,
        responseTime: 220,
        description: 'System monitoring and alerting',
        lastChecked: new Date(now.getTime() - 180000), // 3 minutes ago
        incidents: 1
      }
    ],
    metrics: {
      requests: {
        total: 1547892,
        successful: 1539234,
        failed: 8658,
        rate: 257.5
      },
      performance: {
        averageResponseTime: 145,
        p95ResponseTime: 340,
        p99ResponseTime: 890,
        throughput: 15.4
      },
      errors: {
        total: 8658,
        rate: 0.56,
        types: {
          '4xx': 6234,
          '5xx': 2424
        }
      },
      security: {
        threats: 234,
        blocked: 231,
        vulnerabilities: 8,
        score: 96.5
      }
    },
    incidents: [
      {
        id: 'inc-001',
        title: 'Monitoring Dashboard Intermittent Issues',
        description: 'Some users experiencing intermittent loading issues with monitoring dashboards',
        status: 'monitoring',
        severity: 'low',
        startTime: new Date(now.getTime() - 3600000), // 1 hour ago
        affectedServices: ['monitoring'],
        updates: [
          {
            timestamp: new Date(now.getTime() - 3600000),
            message: 'We are investigating reports of intermittent loading issues with monitoring dashboards.',
            status: 'investigating'
          },
          {
            timestamp: new Date(now.getTime() - 2700000), // 45 minutes ago
            message: 'We have identified the root cause as a database connection pool issue and are implementing a fix.',
            status: 'identified'
          },
          {
            timestamp: new Date(now.getTime() - 1800000), // 30 minutes ago
            message: 'Fix has been deployed and we are monitoring for improvements.',
            status: 'monitoring'
          }
        ]
      }
    ],
    announcements: [
      {
        id: 'ann-001',
        title: 'Scheduled Maintenance - Database Upgrade',
        message: 'We will be performing a database upgrade on Sunday, January 21st from 2:00 AM to 4:00 AM UTC. Brief service interruptions may occur.',
        type: 'maintenance',
        severity: 'warning',
        startTime: new Date(now.getTime() + 432000000), // 5 days from now
        endTime: new Date(now.getTime() + 439200000), // 5 days + 2 hours from now
        affectedServices: ['database', 'web-app', 'api-gateway']
      },
      {
        id: 'ann-002',
        title: 'New Feature: Advanced AI Analytics',
        message: 'We have released advanced AI analytics capabilities including predictive modeling and automated insights generation.',
        type: 'feature',
        severity: 'info',
        startTime: new Date(now.getTime() - 86400000), // 1 day ago
        affectedServices: ['ai-analytics']
      },
      {
        id: 'ann-003',
        title: 'Security Enhancement: Multi-Factor Authentication',
        message: 'Enhanced multi-factor authentication is now available for all enterprise accounts. Please update your security settings.',
        type: 'security',
        severity: 'info',
        startTime: new Date(now.getTime() - 172800000), // 2 days ago
        affectedServices: ['security-services']
      }
    ]
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'status';
    
    const platformStatus = generatePlatformStatus();
    
    if (type === 'status') {
      return NextResponse.json(platformStatus);
    }
    
    if (type === 'health') {
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: platformStatus.overall.uptime,
        services: platformStatus.services.filter(s => s.status === 'operational').length,
        totalServices: platformStatus.services.length
      });
    }
    
    if (type === 'metrics') {
      return NextResponse.json({
        metrics: platformStatus.metrics,
        timestamp: new Date()
      });
    }
    
    if (type === 'incidents') {
      return NextResponse.json({
        incidents: platformStatus.incidents,
        total: platformStatus.incidents.length,
        active: platformStatus.incidents.filter(i => i.status !== 'resolved').length
      });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Platform status API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform status' },
      { status: 500 }
    );
  }
}
