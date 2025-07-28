
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive seed process...');

  // Create or update test tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'test-tenant-1' },
    update: {
      name: 'Re:Commerce Enterprise Demo',
      domain: 'recommerce-demo.com',
      plan: 'enterprise',
      isActive: true,
      settings: {
        features: ['analytics', 'security', 'integrations', 'ai', 'ml'],
        limits: {
          users: 10000,
          storage: '1TB',
          apiCalls: 1000000
        }
      }
    },
    create: {
      id: 'test-tenant-1',
      name: 'Re:Commerce Enterprise Demo',
      domain: 'recommerce-demo.com',
      plan: 'enterprise',
      isActive: true,
      settings: {
        features: ['analytics', 'security', 'integrations', 'ai', 'ml'],
        limits: {
          users: 10000,
          storage: '1TB',
          apiCalls: 1000000
        }
      }
    }
  });

  console.log('Created tenant:', tenant.name);

  // Create or update test users with proper roles
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {
      name: 'John Doe',
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant.id
    },
    create: {
      id: 'admin-user-1',
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant.id
    }
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'jane@doe.com' },
    update: {
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'user',
      tenantId: tenant.id
    },
    create: {
      id: 'regular-user-1',
      email: 'jane@doe.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'user',
      tenantId: tenant.id
    }
  });

  const analystUser = await prisma.user.upsert({
    where: { email: 'mike@doe.com' },
    update: {
      name: 'Mike Johnson',
      password: hashedPassword,
      role: 'analyst',
      tenantId: tenant.id
    },
    create: {
      id: 'analyst-user-1',
      email: 'mike@doe.com',
      name: 'Mike Johnson',
      password: hashedPassword,
      role: 'analyst',
      tenantId: tenant.id
    }
  });

  console.log('Created users:', adminUser.email, regularUser.email, analystUser.email);

  // Create test projects
  const projects = [
    {
      id: 'project-analytics-1',
      name: 'Analytics Platform',
      description: 'Advanced analytics and business intelligence platform',
      status: 'active',
      ownerId: adminUser.id,
      tenantId: tenant.id
    },
    {
      id: 'project-security-1',
      name: 'Security Framework',
      description: 'Enterprise security monitoring and compliance system',
      status: 'active',
      ownerId: adminUser.id,
      tenantId: tenant.id
    },
    {
      id: 'project-integrations-1',
      name: 'Integration Hub',
      description: 'Centralized integration management system',
      status: 'active',
      ownerId: regularUser.id,
      tenantId: tenant.id
    }
  ];

  for (const projectData of projects) {
    await prisma.project.create({ data: projectData });
  }

  console.log('Created', projects.length, 'projects');

  // Create comprehensive analytics events
  const analyticsEvents = [
    {
      eventType: 'user_login',
      properties: { source: 'web', browser: 'chrome', location: 'US' },
      userId: adminUser.id,
      tenantId: tenant.id,
      sessionId: 'session-001'
    },
    {
      eventType: 'dashboard_view',
      properties: { dashboard: 'analytics', duration: 300 },
      userId: adminUser.id,
      tenantId: tenant.id,
      sessionId: 'session-001'
    },
    {
      eventType: 'api_call',
      properties: { endpoint: '/api/analytics', method: 'GET', status: 200 },
      userId: analystUser.id,
      tenantId: tenant.id,
      sessionId: 'session-002'
    },
    {
      eventType: 'widget_created',
      properties: { type: 'chart', category: 'analytics' },
      userId: regularUser.id,
      tenantId: tenant.id,
      sessionId: 'session-003'
    },
    {
      eventType: 'integration_test',
      properties: { integration: 'salesforce', result: 'success' },
      userId: regularUser.id,
      tenantId: tenant.id,
      sessionId: 'session-004'
    }
  ];

  for (const eventData of analyticsEvents) {
    await prisma.analyticsEvent.create({ data: eventData });
  }

  console.log('Created', analyticsEvents.length, 'analytics events');

  // Create metric snapshots
  const metricSnapshots = [
    {
      category: 'system_performance',
      metrics: {
        cpu_usage: 45.2,
        memory_usage: 68.7,
        disk_usage: 32.1,
        network_io: 1024
      },
      metadata: { server: 'web-01', region: 'us-east-1' },
      userId: adminUser.id,
      tenantId: tenant.id
    },
    {
      category: 'user_engagement',
      metrics: {
        active_users: 1247,
        session_duration: 1834,
        page_views: 5629,
        bounce_rate: 23.4
      },
      metadata: { period: 'last_hour' },
      userId: analystUser.id,
      tenantId: tenant.id
    },
    {
      category: 'business_metrics',
      metrics: {
        revenue: 45780.50,
        conversion_rate: 3.2,
        customer_count: 892,
        avg_order_value: 125.60
      },
      metadata: { currency: 'USD', period: 'daily' },
      userId: adminUser.id,
      tenantId: tenant.id
    }
  ];

  for (const metricData of metricSnapshots) {
    await prisma.metricSnapshot.create({ data: metricData });
  }

  console.log('Created', metricSnapshots.length, 'metric snapshots');

  // Create security events
  const securityEvents = [
    {
      source: 'authentication',
      type: 'login_success',
      category: 'user_activity',
      severity: 'low',
      description: 'User successfully logged in',
      actor: adminUser.email,
      target: 'system',
      outcome: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
      tenantId: tenant.id
    },
    {
      source: 'api',
      type: 'rate_limit_exceeded',
      category: 'security',
      severity: 'medium',
      description: 'API rate limit exceeded for user',
      actor: regularUser.email,
      target: '/api/analytics',
      outcome: 'blocked',
      ipAddress: '192.168.1.101',
      userAgent: 'curl/7.68.0',
      location: 'California, US',
      tenantId: tenant.id
    },
    {
      source: 'system',
      type: 'suspicious_activity',
      category: 'threat_detection',
      severity: 'high',
      description: 'Multiple failed login attempts detected',
      actor: 'unknown',
      target: 'login_system',
      outcome: 'investigating',
      ipAddress: '203.0.113.42',
      userAgent: 'Python/3.8 requests/2.25.1',
      location: 'Unknown',
      tenantId: tenant.id
    }
  ];

  for (const securityEventData of securityEvents) {
    await prisma.securityEvent.create({ data: securityEventData });
  }

  console.log('Created', securityEvents.length, 'security events');

  // Create widget blueprints
  const widgetBlueprints = [
    {
      name: 'Analytics Chart',
      description: 'Interactive chart widget for displaying analytics data',
      category: 'Analytics',
      config: {
        type: 'object',
        properties: {
          chartType: { type: 'string', enum: ['line', 'bar', 'pie'] },
          dataSource: { type: 'string' },
          title: { type: 'string' }
        }
      },
      template: '<div class="chart-widget">{{chartType}} chart</div>',
      version: '1.0.0',
      published: true,
      createdBy: adminUser.id,
      tenantId: tenant.id
    },
    {
      name: 'KPI Display',
      description: 'Key Performance Indicator display widget',
      category: 'Business Intelligence',
      config: {
        type: 'object',
        properties: {
          metric: { type: 'string' },
          value: { type: 'number' },
          trend: { type: 'string', enum: ['up', 'down', 'stable'] }
        }
      },
      template: '<div class="kpi-widget">{{metric}}: {{value}}</div>',
      version: '1.0.0',
      published: true,
      createdBy: regularUser.id,
      tenantId: tenant.id
    },
    {
      name: 'Security Alert',
      description: 'Real-time security alert widget',
      category: 'Security',
      config: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          message: { type: 'string' },
          timestamp: { type: 'string' }
        }
      },
      template: '<div class="security-alert">{{severity}}: {{message}}</div>',
      version: '1.0.0',
      published: true,
      createdBy: adminUser.id,
      tenantId: tenant.id
    }
  ];

  for (const widgetData of widgetBlueprints) {
    await prisma.widgetBlueprint.create({ data: widgetData });
  }

  console.log('Created', widgetBlueprints.length, 'widget blueprints');

  // Create API connectors
  const apiConnectors = [
    {
      name: 'Salesforce Integration',
      type: 'crm',
      endpoint: 'https://api.salesforce.com/v1',
      config: {
        auth: 'oauth2',
        scopes: ['read', 'write'],
        version: 'v1'
      },
      status: 'active',
      enabled: true,
      syncInterval: 3600,
      createdBy: adminUser.id,
      tenantId: tenant.id
    },
    {
      name: 'Google Analytics',
      type: 'analytics',
      endpoint: 'https://analyticsreporting.googleapis.com/v4',
      config: {
        auth: 'service_account',
        propertyId: 'UA-123456789-1'
      },
      status: 'active',
      enabled: true,
      syncInterval: 1800,
      createdBy: analystUser.id,
      tenantId: tenant.id
    },
    {
      name: 'Slack Notifications',
      type: 'communication',
      endpoint: 'https://hooks.slack.com/services',
      config: {
        webhook_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        channel: '#alerts'
      },
      status: 'active',
      enabled: true,
      syncInterval: 300,
      createdBy: adminUser.id,
      tenantId: tenant.id
    }
  ];

  for (const connectorData of apiConnectors) {
    await prisma.aPIConnector.create({ data: connectorData });
  }

  console.log('Created', apiConnectors.length, 'API connectors');

  // Create integration tests
  const integrationTests = [
    {
      name: 'Salesforce Connection Test',
      type: 'connectivity',
      config: {
        endpoint: 'https://api.salesforce.com/v1/health',
        timeout: 30000,
        expectedStatus: 200
      },
      results: {
        success: true,
        responseTime: 245,
        statusCode: 200
      },
      success: true,
      executedBy: adminUser.id,
      tenantId: tenant.id
    },
    {
      name: 'Analytics Data Pipeline Test',
      type: 'data_pipeline',
      config: {
        pipeline: 'analytics_etl',
        testData: 'sample_events.json'
      },
      results: {
        success: true,
        recordsProcessed: 1000,
        errorCount: 0
      },
      success: true,
      executedBy: analystUser.id,
      tenantId: tenant.id
    },
    {
      name: 'Security Monitoring Test',
      type: 'security',
      config: {
        component: 'threat_detection',
        testType: 'simulation'
      },
      results: {
        success: true,
        alertsGenerated: 5,
        responseTime: 150
      },
      success: true,
      executedBy: adminUser.id,
      tenantId: tenant.id
    }
  ];

  for (const testData of integrationTests) {
    await prisma.integrationTest.create({ data: testData });
  }

  console.log('Created', integrationTests.length, 'integration tests');

  // Create audit logs
  const auditLogs = [
    {
      action: 'user_created',
      resource: `user:${regularUser.id}`,
      details: {
        email: regularUser.email,
        role: regularUser.role,
        tenantId: tenant.id
      },
      userId: adminUser.id,
      tenantId: tenant.id
    },
    {
      action: 'widget_deployed',
      resource: 'widget:analytics-chart',
      details: {
        widgetType: 'chart',
        category: 'analytics',
        version: '1.0.0'
      },
      userId: regularUser.id,
      tenantId: tenant.id
    },
    {
      action: 'integration_configured',
      resource: 'integration:salesforce',
      details: {
        type: 'crm',
        status: 'active',
        syncInterval: 3600
      },
      userId: adminUser.id,
      tenantId: tenant.id
    }
  ];

  for (const auditData of auditLogs) {
    await prisma.auditLog.create({ data: auditData });
  }

  console.log('Created', auditLogs.length, 'audit logs');

  // Create comprehensive system configuration
  const systemConfigs = [
    {
      key: 'analytics_retention_days',
      value: 365,
      type: 'number',
      category: 'analytics',
      updatedBy: adminUser.id
    },
    {
      key: 'security_alert_threshold',
      value: 'medium',
      type: 'string',
      category: 'security',
      updatedBy: adminUser.id
    },
    {
      key: 'integration_timeout',
      value: 30000,
      type: 'number',
      category: 'integrations',
      updatedBy: adminUser.id
    },
    {
      key: 'widget_auto_refresh',
      value: true,
      type: 'boolean',
      category: 'widgets',
      updatedBy: regularUser.id
    }
  ];

  for (const configData of systemConfigs) {
    await prisma.systemConfig.create({ data: configData });
  }

  console.log('Created', systemConfigs.length, 'system configurations');

  console.log('✅ Comprehensive seed completed successfully!');
  console.log('🎯 Demo user credentials:');
  console.log('   Admin: john@doe.com / johndoe123');
  console.log('   User: jane@doe.com / johndoe123');
  console.log('   Analyst: mike@doe.com / johndoe123');
  console.log('📊 Created data for all 15 chunks:');
  console.log('   • Analytics & BI');
  console.log('   • Security & Compliance');
  console.log('   • Integration Hub');
  console.log('   • Widget Factory');
  console.log('   • Performance Monitoring');
  console.log('   • And much more!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
