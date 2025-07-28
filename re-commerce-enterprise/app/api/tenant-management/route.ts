
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { TenantService } from '@/lib/tenant-utils';

export const dynamic = 'force-dynamic';

// Advanced Tenant Management API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');
    const tier = searchParams.get('tier');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};
    if (status) where.status = status;
    if (plan) where.plan = plan;
    if (tier) where.tier = tier;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } },
        { subdomain: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [tenants, totalCount] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
              tenantUsageRecords: true,
              tenantAnalytics: true
            }
          },
          tenantBrandings: {
            select: {
              logoUrl: true,
              primaryColor: true,
              brandName: true
            }
          }
        }
      }),
      prisma.tenant.count({ where })
    ]);

    // Calculate usage statistics for each tenant
    const enrichedTenants = await Promise.all(
      tenants.map(async (tenant) => {
        const [currentUsage, billingMetrics] = await Promise.all([
          prisma.tenantUsageRecord.findMany({
            where: {
              tenantId: tenant.id,
              timestamp: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
              }
            },
            orderBy: { timestamp: 'desc' },
            take: 10
          }),
          prisma.tenantAnalytics.findMany({
            where: {
              tenantId: tenant.id,
              metricCategory: 'billing',
              timestamp: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            },
            orderBy: { timestamp: 'desc' },
            take: 1
          })
        ]);

        return {
          ...tenant,
          currentUsage: currentUsage.reduce((acc, record) => {
            acc[record.resourceType] = (acc[record.resourceType] || 0) + Number(record.value);
            return acc;
          }, {} as Record<string, number>),
          monthlyBilling: billingMetrics[0]?.metricValue || 0,
          lastActiveAt: tenant.lastAccessedAt,
          healthStatus: tenant.status === 'active' ? 'healthy' : 'degraded'
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        tenants: enrichedTenants,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        },
        summary: {
          totalTenants: totalCount,
          activeTenants: tenants.filter(t => t.status === 'active').length,
          suspendedTenants: tenants.filter(t => t.status === 'suspended').length,
          planDistribution: tenants.reduce((acc, t) => {
            acc[t.plan] = (acc[t.plan] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      }
    });
  } catch (error) {
    console.error('Tenant management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      domain,
      subdomain,
      plan = 'basic',
      tier = 'standard',
      maxUsers = 100,
      storageLimit = 10737418240, // 10GB
      bandwidthLimit = 107374182400, // 100GB
      apiCallLimit = 100000,
      isolationLevel = 'shared',
      complianceLevel = 'standard',
      primaryRegion = 'eu-north-1',
      features = {},
      branding = {}
    } = body;

    // Validate required fields
    if (!name || !domain || !subdomain) {
      return NextResponse.json(
        { error: 'Name, domain, and subdomain are required' },
        { status: 400 }
      );
    }

    // Check for existing domain/subdomain
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { domain },
          { subdomain }
        ]
      }
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Domain or subdomain already exists' },
        { status: 409 }
      );
    }

    // Create tenant with comprehensive configuration
    const tenant = await prisma.tenant.create({
      data: {
        name,
        domain,
        subdomain,
        plan,
        tier,
        maxUsers,
        storageLimit,
        bandwidthLimit,
        apiCallLimit,
        isolationLevel,
        complianceLevel,
        primaryRegion,
        features,
        provisionedAt: new Date(),
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        resourceQuotas: {
          storage: storageLimit,
          bandwidth: bandwidthLimit,
          apiCalls: apiCallLimit,
          users: maxUsers
        },
        usageMetrics: {
          storage: 0,
          bandwidth: 0,
          apiCalls: 0,
          users: 0
        }
      }
    });

    // Create default branding configuration
    if (Object.keys(branding).length > 0) {
      await prisma.tenantBranding.create({
        data: {
          tenantId: tenant.id,
          brandName: branding.brandName || name,
          logoUrl: branding.logoUrl,
          primaryColor: branding.primaryColor || '#0066cc',
          secondaryColor: branding.secondaryColor || '#666666',
          ...branding
        }
      });
    }

    // Create default resource allocations
    const defaultResources = [
      {
        resourceType: 'storage',
        resourceName: 'primary_storage',
        allocatedAmount: storageLimit,
        unit: 'bytes'
      },
      {
        resourceType: 'bandwidth',
        resourceName: 'monthly_bandwidth',
        allocatedAmount: bandwidthLimit,
        unit: 'bytes',
        resetPeriod: 'monthly'
      },
      {
        resourceType: 'api_calls',
        resourceName: 'monthly_api_calls',
        allocatedAmount: apiCallLimit,
        unit: 'calls',
        resetPeriod: 'monthly'
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

    // Create initial analytics baseline
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: tenant.id,
        metricCategory: 'usage',
        metricName: 'tenant_created',
        metricValue: 1,
        dimensions: {
          plan,
          tier,
          isolationLevel
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: tenant,
      message: 'Tenant created successfully'
    });
  } catch (error) {
    console.error('Tenant creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
