
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDay4Features() {
  console.log('🚀 Starting DAG 4 seed...');

  const tenantId = 'default-tenant';
  const userId = 'default-user';

  try {
    // Ensure tenant exists
    await prisma.tenant.upsert({
      where: { id: tenantId },
      update: {},
      create: {
        id: tenantId,
        name: 'Re-Commerce Enterprise',
        domain: 're-commerce.se',
        subdomain: 're-commerce',
        plan: 'enterprise',
        maxUsers: 1000,
        settings: {
          features: ['ai-analytics', 'security-center', 'performance-optimization', 'integrations']
        }
      }
    });

    // Ensure user exists
    await prisma.user.upsert({
      where: { email_tenantId: { email: 'john@doe.com', tenantId } },
      update: {},
      create: {
        id: userId,
        email: 'john@doe.com',
        name: 'John Doe',
        password: '$2a$10$YourHashedPasswordHere',
        role: 'admin',
        tenantId
      }
    });

    // 1. AI Insights
    console.log('📊 Seeding AI Insights...');
    const aiInsights = [
      {
        type: 'predictive',
        category: 'business',
        title: 'Revenue Growth Opportunity',
        description: 'AI detects 15% revenue increase potential through user engagement optimization during peak hours (2-4 PM)',
        confidence: 0.89,
        impact: 'high',
        data: {
          currentRevenue: 45000,
          projectedIncrease: 6750,
          timeframe: '30 days',
          keyFactors: ['user engagement', 'peak hours', 'conversion rate']
        },
        tenantId,
        userId
      },
      {
        type: 'optimization',
        category: 'performance',
        title: 'Database Query Optimization',
        description: 'Reduce response time by 40ms with index optimization on user analytics table',
        confidence: 0.92,
        impact: 'medium',
        data: {
          currentResponseTime: 180,
          optimizedResponseTime: 140,
          affectedEndpoints: ['/api/analytics', '/api/dashboard'],
          estimatedEffort: 'medium'
        },
        tenantId,
        userId
      },
      {
        type: 'alert',
        category: 'security',
        title: 'Anomalous Login Pattern',
        description: 'Unusual login spikes from new geographic regions detected - 300% increase from Asia-Pacific',
        confidence: 0.76,
        impact: 'high',
        data: {
          normalLogins: 150,
          detectedLogins: 450,
          regions: ['Singapore', 'Tokyo', 'Sydney'],
          timeWindow: '2 hours'
        },
        tenantId,
        userId
      },
      {
        type: 'recommendation',
        category: 'user_behavior',
        title: 'User Engagement Optimization',
        description: 'Implement push notifications for inactive users to increase retention by 23%',
        confidence: 0.84,
        impact: 'medium',
        data: {
          inactiveUsers: 1250,
          potentialRetention: 287,
          suggestedActions: ['push notifications', 'email campaigns', 'in-app messages']
        },
        tenantId
      }
    ];

    for (const insight of aiInsights) {
      await prisma.aiInsight.create({ data: insight });
    }

    // 2. Predictive Analytics
    console.log('🔮 Seeding Predictive Analytics...');
    const predictions = [
      {
        metric: 'revenue',
        prediction: {
          next30Days: 75000,
          next90Days: 230000,
          confidence: 0.87,
          factors: ['seasonal trends', 'user growth', 'market conditions']
        },
        timeframe: 'monthly',
        accuracy: 0.91,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        tenantId
      },
      {
        metric: 'user_growth',
        prediction: {
          next30Days: 1850,
          next90Days: 5200,
          confidence: 0.82,
          churnRisk: 12.5
        },
        timeframe: 'monthly',
        accuracy: 0.88,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        tenantId
      }
    ];

    for (const prediction of predictions) {
      await prisma.predictiveAnalytics.create({ data: prediction });
    }

    // 3. Security Events
    console.log('🔒 Seeding Security Events...');
    const securityEvents = [
      {
        type: 'login_attempt',
        severity: 'high',
        source: 'user_action',
        title: 'Multiple Failed Login Attempts',
        description: 'Detected 15 failed login attempts from IP 192.168.1.100 in 5 minutes',
        metadata: {
          ip: '192.168.1.100',
          attempts: 15,
          timeWindow: '5 minutes',
          userAgent: 'Mozilla/5.0...'
        },
        tenantId,
        userId
      },
      {
        type: 'threat_detected',
        severity: 'critical',
        source: 'ai_detection',
        title: 'Malware Detection',
        description: 'Suspicious file upload blocked - potential malware detected via AI scanning',
        metadata: {
          fileName: 'document.pdf.exe',
          fileSize: '2.5MB',
          threat: 'trojan',
          confidence: 0.94
        },
        tenantId
      },
      {
        type: 'data_access',
        severity: 'medium',
        source: 'system',
        title: 'Unusual Data Access Pattern',
        description: 'User accessed 500+ customer records in 10 minutes - above normal threshold',
        metadata: {
          recordsAccessed: 523,
          timeWindow: '10 minutes',
          normalThreshold: 50
        },
        tenantId,
        userId
      }
    ];

    for (const event of securityEvents) {
      await prisma.securityEvent.create({ data: event });
    }

    // 4. Compliance Records
    console.log('📋 Seeding Compliance Records...');
    const complianceRecords = [
      {
        framework: 'GDPR',
        requirement: 'Data Protection Impact Assessment',
        status: 'compliant',
        evidence: {
          documents: ['DPIA_2024.pdf', 'privacy_policy.pdf'],
          lastAudit: '2024-01-15',
          nextReview: '2024-07-15'
        },
        nextCheck: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        assignedTo: userId,
        notes: 'All GDPR requirements met. Regular reviews scheduled.',
        tenantId
      },
      {
        framework: 'SOX',
        requirement: 'Internal Controls Assessment',
        status: 'compliant',
        evidence: {
          controls: ['access_control', 'data_integrity', 'audit_trail'],
          lastAudit: '2024-01-10'
        },
        nextCheck: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        assignedTo: userId,
        tenantId
      },
      {
        framework: 'ISO27001',
        requirement: 'Information Security Management',
        status: 'partial',
        evidence: {
          implemented: ['encryption', 'access_control'],
          pending: ['incident_response_plan']
        },
        nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        assignedTo: userId,
        notes: 'Incident response plan needs updating.',
        tenantId
      }
    ];

    for (const record of complianceRecords) {
      await prisma.complianceRecord.create({ data: record });
    }

    // 5. Threat Detections
    console.log('🚨 Seeding Threat Detections...');
    const threats = [
      {
        type: 'brute_force',
        severity: 'high',
        source: 'ip_address',
        sourceValue: '192.168.1.100',
        confidence: 0.95,
        details: {
          attempts: 25,
          timespan: '10 minutes',
          targetAccounts: ['admin', 'user1', 'user2'],
          blocked: true
        },
        tenantId
      },
      {
        type: 'anomaly',
        severity: 'medium',
        source: 'user_id',
        sourceValue: userId,
        confidence: 0.78,
        details: {
          unusualActivity: 'High data download volume',
          normalPattern: '10MB/day',
          detectedPattern: '150MB/hour'
        },
        tenantId
      }
    ];

    for (const threat of threats) {
      await prisma.threatDetection.create({ data: threat });
    }

    // 6. Performance Metrics
    console.log('⚡ Seeding Performance Metrics...');
    const performanceMetrics = [];
    const metrics = ['response_time', 'cpu_usage', 'memory_usage', 'network_io'];
    const sources = ['server', 'database', 'api', 'frontend'];

    for (let i = 0; i < 100; i++) {
      const metric = metrics[i % metrics.length];
      const source = sources[i % sources.length];
      
      performanceMetrics.push({
        metric,
        value: Math.random() * 100,
        unit: metric === 'response_time' ? 'ms' : '%',
        source,
        endpoint: source === 'api' ? `/api/${['users', 'analytics', 'dashboard'][i % 3]}` : null,
        timestamp: new Date(Date.now() - (i * 60 * 1000)), // Every minute going back
        metadata: {
          server: 'prod-server-01',
          region: 'us-east-1'
        },
        tenantId
      });
    }

    for (const metric of performanceMetrics) {
      await prisma.performanceMetric.create({ data: metric });
    }

    // 7. Optimization Recommendations
    console.log('🎯 Seeding Optimization Recommendations...');
    const optimizations = [
      {
        category: 'performance',
        title: 'Database Query Optimization',
        description: 'Optimize slow queries on user analytics table - potential 40% improvement',
        impact: 'high',
        effort: 'medium',
        priority: 9,
        estimatedImprovement: {
          responseTime: '40%',
          throughput: '25%',
          costReduction: '15%'
        },
        implementation: {
          steps: ['Add database indexes', 'Optimize query structure', 'Implement query caching'],
          timeEstimate: '2-3 days',
          resources: ['Database Administrator', 'Backend Developer']
        },
        tenantId
      },
      {
        category: 'security',
        title: 'Enhanced Authentication',
        description: 'Implement advanced multi-factor authentication for admin users',
        impact: 'high',
        effort: 'high',
        priority: 8,
        estimatedImprovement: {
          securityScore: '25%',
          riskReduction: '60%'
        },
        implementation: {
          steps: ['Deploy MFA system', 'User training', 'Policy updates'],
          timeEstimate: '1-2 weeks'
        },
        tenantId
      }
    ];

    for (const optimization of optimizations) {
      await prisma.optimizationRecommendation.create({ data: optimization });
    }

    // 8. Integrations
    console.log('🔗 Seeding Integrations...');
    const integrations = [
      {
        name: 'Salesforce CRM',
        type: 'api',
        category: 'crm',
        provider: 'Salesforce',
        status: 'active',
        config: {
          apiVersion: 'v54.0',
          syncFrequency: '15 minutes',
          objects: ['Account', 'Contact', 'Opportunity']
        },
        endpoints: {
          baseUrl: 'https://api.salesforce.com',
          auth: '/oauth2/token',
          data: '/services/data/v54.0'
        },
        rateLimits: {
          requestsPerHour: 5000,
          concurrentConnections: 10
        },
        lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        tenantId,
        configuredBy: userId
      },
      {
        name: 'Stripe Payments',
        type: 'webhook',
        category: 'payment',
        provider: 'Stripe',
        status: 'active',
        config: {
          webhookEndpoint: 'https://api.re-commerce.se/webhooks/stripe',
          events: ['payment_intent.succeeded', 'customer.created']
        },
        credentials: {
          publicKey: 'pk_test_...',
          webhookSecret: 'whsec_...'
        },
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        tenantId,
        configuredBy: userId
      }
    ];

    for (const integration of integrations) {
      await prisma.integration.create({ data: integration });
    }

    // 9. Integration Executions
    console.log('🔄 Seeding Integration Executions...');
    const integrationIds = await prisma.integration.findMany({
      where: { tenantId },
      select: { id: true }
    });

    for (const integration of integrationIds) {
      for (let i = 0; i < 5; i++) {
        await prisma.integrationExecution.create({
          data: {
            integrationId: integration.id,
            status: i === 0 ? 'success' : ['success', 'error'][Math.floor(Math.random() * 2)],
            startTime: new Date(Date.now() - (i + 1) * 60 * 60 * 1000),
            endTime: new Date(Date.now() - (i + 1) * 60 * 60 * 1000 + 30000),
            duration: 30000,
            recordsProcessed: Math.floor(Math.random() * 1000) + 100,
            logs: [
              { level: 'info', message: 'Execution started', timestamp: new Date().toISOString() },
              { level: 'info', message: 'Data sync completed', timestamp: new Date().toISOString() }
            ],
            metadata: {
              version: '1.0',
              triggeredBy: 'scheduler'
            },
            tenantId
          }
        });
      }
    }

    // 10. API Connectors
    console.log('🔌 Seeding API Connectors...');
    const apiConnectors = [
      {
        name: 'Google Analytics API',
        type: 'rest',
        baseUrl: 'https://analyticsreporting.googleapis.com',
        auth: {
          type: 'oauth2',
          scopes: ['https://www.googleapis.com/auth/analytics.readonly']
        },
        rateLimits: {
          requestsPerSecond: 10,
          requestsPerDay: 50000
        },
        timeout: 30000,
        healthCheck: {
          endpoint: '/health',
          interval: '5 minutes'
        },
        lastHealthCheck: new Date(),
        tenantId,
        createdBy: userId
      },
      {
        name: 'AWS S3 API',
        type: 'rest',
        baseUrl: 'https://s3.amazonaws.com',
        auth: {
          type: 'aws_signature',
          region: 'us-east-1'
        },
        rateLimits: {
          requestsPerSecond: 100
        },
        timeout: 60000,
        tenantId,
        createdBy: userId
      }
    ];

    for (const connector of apiConnectors) {
      await prisma.apiConnector.create({ data: connector });
    }

    console.log('✅ DAG 4 seed completed successfully!');
    console.log('📊 Created sample data for:');
    console.log('   - AI Insights & Predictive Analytics');
    console.log('   - Security Events & Compliance Records');
    console.log('   - Performance Metrics & Optimizations');
    console.log('   - Integrations & API Connectors');

  } catch (error) {
    console.error('❌ Error seeding DAG 4 data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
if (require.main === module) {
  seedDay4Features()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default seedDay4Features;
