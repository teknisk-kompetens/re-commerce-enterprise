
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Automated Tenant Provisioning API
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      tenantData,
      provisioningOptions = {
        createDatabase: true,
        setupBranding: true,
        configureResources: true,
        setupIntegrations: false,
        sendWelcomeEmail: true
      }
    } = body;

    if (!tenantData?.name || !tenantData?.domain || !tenantData?.subdomain) {
      return NextResponse.json(
        { error: 'Tenant name, domain, and subdomain are required' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { domain: tenantData.domain },
          { subdomain: tenantData.subdomain }
        ]
      }
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Domain or subdomain already exists' },
        { status: 409 }
      );
    }

    // Start provisioning process
    const provisioningId = `prov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Step 1: Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantData.name,
        domain: tenantData.domain,
        subdomain: tenantData.subdomain,
        plan: tenantData.plan || 'basic',
        tier: tenantData.tier || 'standard',
        maxUsers: tenantData.maxUsers || 100,
        storageLimit: BigInt(tenantData.storageLimit || 10737418240),
        bandwidthLimit: BigInt(tenantData.bandwidthLimit || 107374182400),
        apiCallLimit: tenantData.apiCallLimit || 100000,
        isolationLevel: tenantData.isolationLevel || 'shared',
        complianceLevel: tenantData.complianceLevel || 'standard',
        primaryRegion: tenantData.primaryRegion || 'eu-north-1',
        features: tenantData.features || {},
        status: 'migrating', // Set to migrating during provisioning
        provisionedAt: new Date(),
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        resourceQuotas: {
          storage: tenantData.storageLimit || 10737418240,
          bandwidth: tenantData.bandwidthLimit || 107374182400,
          apiCalls: tenantData.apiCallLimit || 100000,
          users: tenantData.maxUsers || 100
        },
        usageMetrics: {
          storage: 0,
          bandwidth: 0,
          apiCalls: 0,
          users: 0
        }
      }
    });

    const provisioningSteps: string[] = [];

    // Step 2: Setup database isolation if required
    if (provisioningOptions.createDatabase && tenant.isolationLevel !== 'shared') {
      provisioningSteps.push('database_setup');
      
      if (tenant.isolationLevel === 'dedicated') {
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: {
            databaseName: `tenant_${tenant.id}`,
            schemaName: `schema_${tenant.id}`
          }
        });
      }
    }

    // Step 3: Setup default branding
    if (provisioningOptions.setupBranding) {
      provisioningSteps.push('branding_setup');
      
      await prisma.tenantBranding.create({
        data: {
          tenantId: tenant.id,
          brandName: tenant.name,
          logoUrl: tenantData.branding?.logoUrl,
          primaryColor: tenantData.branding?.primaryColor || '#0066cc',
          secondaryColor: tenantData.branding?.secondaryColor || '#666666',
          accentColor: tenantData.branding?.accentColor || '#0099ff',
          backgroundColor: tenantData.branding?.backgroundColor || '#ffffff',
          textColor: tenantData.branding?.textColor || '#333333',
          fontFamily: tenantData.branding?.fontFamily || 'Inter',
          loginTheme: tenantData.branding?.loginTheme || 'default',
          dashboardTheme: tenantData.branding?.dashboardTheme || 'light'
        }
      });
    }

    // Step 4: Configure resources
    if (provisioningOptions.configureResources) {
      provisioningSteps.push('resource_configuration');
      
      const defaultResources = [
        {
          resourceType: 'storage',
          resourceName: 'primary_storage',
          allocatedAmount: tenant.storageLimit,
          unit: 'bytes',
          costPerUnit: 0.00001 // $0.00001 per byte
        },
        {
          resourceType: 'bandwidth',
          resourceName: 'monthly_bandwidth',
          allocatedAmount: tenant.bandwidthLimit,
          unit: 'bytes',
          resetPeriod: 'monthly',
          costPerUnit: 0.000001 // $0.000001 per byte
        },
        {
          resourceType: 'api_calls',
          resourceName: 'monthly_api_calls',
          allocatedAmount: BigInt(tenant.apiCallLimit),
          unit: 'calls',
          resetPeriod: 'monthly',
          costPerUnit: 0.001 // $0.001 per call
        },
        {
          resourceType: 'users',
          resourceName: 'active_users',
          allocatedAmount: BigInt(tenant.maxUsers),
          unit: 'users',
          costPerUnit: 5.0 // $5 per user per month
        }
      ];

      await Promise.all(
        defaultResources.map(resource =>
          prisma.tenantResource.create({
            data: {
              tenantId: tenant.id,
              ...resource
            }
          })
        )
      );
    }

    // Step 5: Setup default integrations if required
    if (provisioningOptions.setupIntegrations && tenantData.integrations) {
      provisioningSteps.push('integration_setup');
      
      for (const integration of tenantData.integrations) {
        await prisma.tenantIntegrationConfig.create({
          data: {
            tenantId: tenant.id,
            integrationType: integration.type,
            integrationName: integration.name,
            configuration: integration.configuration || {},
            credentials: integration.credentials || {},
            syncFrequency: integration.syncFrequency || 'daily',
            createdBy: session.user.id
          }
        });
      }
    }

    // Step 6: Create initial analytics baseline
    provisioningSteps.push('analytics_initialization');
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: tenant.id,
        metricCategory: 'provisioning',
        metricName: 'tenant_provisioned',
        metricValue: 1,
        dimensions: {
          plan: tenant.plan,
          tier: tenant.tier,
          isolationLevel: tenant.isolationLevel,
          provisioningId,
          stepsCompleted: provisioningSteps.length
        }
      }
    });

    // Step 7: Create default configurations
    provisioningSteps.push('default_configurations');
    const defaultConfigs = [
      {
        category: 'features',
        key: 'user_management',
        value: true,
        type: 'boolean',
        description: 'Enable user management features'
      },
      {
        category: 'features', 
        key: 'basic_analytics',
        value: true,
        type: 'boolean',
        description: 'Enable basic analytics'
      },
      {
        category: 'security',
        key: 'password_policy',
        value: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false
        },
        type: 'json',
        description: 'Password policy configuration'
      },
      {
        category: 'limits',
        key: 'session_timeout',
        value: 3600,
        type: 'number',
        description: 'Session timeout in seconds'
      }
    ];

    await Promise.all(
      defaultConfigs.map(config =>
        prisma.tenantConfiguration.create({
          data: {
            tenantId: tenant.id,
            category: config.category,
            key: config.key,
            value: config.value,
            type: config.type,
            description: config.description,
            isSystem: true,
            createdBy: session.user.id
          }
        })
      )
    );

    // Step 8: Final provisioning completion
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        status: 'active',
        updatedAt: new Date()
      }
    });

    // Step 9: Send welcome notification if requested
    if (provisioningOptions.sendWelcomeEmail && tenantData.contactEmail) {
      await prisma.tenantNotification.create({
        data: {
          tenantId: tenant.id,
          type: 'email',
          category: 'system',
          title: 'Welcome to the Platform',
          message: `Your tenant "${tenant.name}" has been successfully provisioned and is ready to use.`,
          recipient: tenantData.contactEmail,
          priority: 'normal',
          metadata: {
            provisioningId,
            tenantDomain: tenant.domain,
            tenantSubdomain: tenant.subdomain
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        tenant: {
          ...tenant,
          storageLimit: Number(tenant.storageLimit),
          bandwidthLimit: Number(tenant.bandwidthLimit)
        },
        provisioning: {
          id: provisioningId,
          stepsCompleted: provisioningSteps,
          completedAt: new Date(),
          duration: Date.now() - Date.now() // Will be calculated properly in real implementation
        }
      },
      message: 'Tenant provisioned successfully'
    });
  } catch (error) {
    console.error('Tenant provisioning error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get provisioning history from analytics
    const where: any = {
      metricCategory: 'provisioning'
    };

    if (status === 'recent') {
      where.timestamp = {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      };
    }

    const provisioningHistory = await prisma.tenantAnalytics.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            domain: true,
            subdomain: true,
            plan: true,
            tier: true,
            status: true,
            provisionedAt: true
          }
        }
      }
    });

    const summary = {
      totalProvisioned: provisioningHistory.length,
      recentProvisioning: provisioningHistory.filter(p => 
        p.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      planDistribution: provisioningHistory.reduce((acc, p) => {
        const plan = p.tenant?.plan || 'unknown';
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: {
        provisioningHistory: provisioningHistory.map(p => ({
          id: p.id,
          tenantId: p.tenantId,
          tenant: p.tenant,
          provisionedAt: p.timestamp,
          stepsCompleted: p.dimensions?.stepsCompleted || 0,
          provisioningId: p.dimensions?.provisioningId
        })),
        summary
      }
    });
  } catch (error) {
    console.error('Provisioning history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
