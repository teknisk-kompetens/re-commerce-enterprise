
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get all e-commerce integrations for a tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const whereClause = {
      tenantId,
      ...(platform && { platform }),
      ...(status && { status })
    };

    const [integrations, total] = await Promise.all([
      prisma.ecommerceIntegration.findMany({
        where: whereClause,
        include: {
          syncLogs: {
            orderBy: { startTime: 'desc' },
            take: 5
          },
          mappings: {
            where: { active: true },
            take: 10
          },
          _count: {
            select: {
              syncLogs: true,
              mappings: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.ecommerceIntegration.count({ where: whereClause })
    ]);

    // Calculate integration statistics
    const stats = await Promise.all(
      integrations.map(async (integration) => {
        const recentSyncs = await prisma.ecommerceSyncLog.findMany({
          where: {
            integrationId: integration.id,
            startTime: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        });

        const successfulSyncs = recentSyncs.filter(sync => sync.status === 'completed').length;
        const successRate = recentSyncs.length > 0 ? (successfulSyncs / recentSyncs.length) * 100 : 0;

        return {
          ...integration,
          stats: {
            successRate: Math.round(successRate * 100) / 100,
            recentSyncs: recentSyncs.length,
            totalRecordsProcessed: recentSyncs.reduce((sum, sync) => sum + sync.recordsProcessed, 0)
          }
        };
      })
    );

    return NextResponse.json({
      integrations: stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching e-commerce integrations:', error);
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
  }
}

// Create new e-commerce integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      tenantId, 
      name, 
      platform, 
      version, 
      storeUrl, 
      apiEndpoint, 
      credentials, 
      configuration,
      syncSettings,
      features
    } = body;

    if (!tenantId || !name || !platform || !storeUrl || !apiEndpoint) {
      return NextResponse.json({ 
        error: 'Missing required fields: tenantId, name, platform, storeUrl, apiEndpoint' 
      }, { status: 400 });
    }

    // Validate store URL and API endpoint
    try {
      new URL(storeUrl);
      new URL(apiEndpoint);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format for storeUrl or apiEndpoint' }, { status: 400 });
    }

    // Create integration
    const integration = await prisma.ecommerceIntegration.create({
      data: {
        tenantId,
        name,
        platform,
        version: version || '1.0',
        storeUrl,
        apiEndpoint,
        credentials: credentials || {},
        configuration: configuration || {},
        syncSettings: syncSettings || {
          autoSync: true,
          syncInterval: 3600,
          syncTypes: ['products', 'orders', 'customers']
        },
        features: features || ['products', 'orders', 'customers'],
        rateLimits: {
          requestsPerMinute: getPlatformRateLimit(platform),
          burstLimit: getPlatformRateLimit(platform) * 2
        },
        monitoring: {
          healthCheckEnabled: true,
          alertsEnabled: true,
          metricsCollection: true
        }
      },
      include: {
        _count: {
          select: {
            syncLogs: true,
            mappings: true
          }
        }
      }
    });

    // Create default data mappings for the platform
    await createDefaultMappings(integration.id, platform);

    return NextResponse.json({ integration }, { status: 201 });

  } catch (error) {
    console.error('Error creating e-commerce integration:', error);
    return NextResponse.json({ error: 'Failed to create integration' }, { status: 500 });
  }
}

// Update e-commerce integration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      name, 
      storeUrl, 
      apiEndpoint, 
      credentials, 
      configuration, 
      syncSettings, 
      status,
      features
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    // Validate URLs if provided
    if (storeUrl) {
      try {
        new URL(storeUrl);
      } catch {
        return NextResponse.json({ error: 'Invalid storeUrl format' }, { status: 400 });
      }
    }

    if (apiEndpoint) {
      try {
        new URL(apiEndpoint);
      } catch {
        return NextResponse.json({ error: 'Invalid apiEndpoint format' }, { status: 400 });
      }
    }

    const integration = await prisma.ecommerceIntegration.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(storeUrl && { storeUrl }),
        ...(apiEndpoint && { apiEndpoint }),
        ...(credentials && { credentials }),
        ...(configuration && { configuration }),
        ...(syncSettings && { syncSettings }),
        ...(status && { status }),
        ...(features && { features })
      },
      include: {
        syncLogs: {
          orderBy: { startTime: 'desc' },
          take: 5
        },
        _count: {
          select: {
            syncLogs: true,
            mappings: true
          }
        }
      }
    });

    return NextResponse.json({ integration });

  } catch (error) {
    console.error('Error updating e-commerce integration:', error);
    return NextResponse.json({ error: 'Failed to update integration' }, { status: 500 });
  }
}

// Delete e-commerce integration
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    await prisma.ecommerceIntegration.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting e-commerce integration:', error);
    return NextResponse.json({ error: 'Failed to delete integration' }, { status: 500 });
  }
}

// Helper functions
function getPlatformRateLimit(platform: string): number {
  const rateLimits: Record<string, number> = {
    'shopify': 40,
    'woocommerce': 100,
    'magento': 120,
    'bigcommerce': 450,
    'prestashop': 200,
    'opencart': 100
  };
  
  return rateLimits[platform.toLowerCase()] || 60;
}

async function createDefaultMappings(integrationId: string, platform: string): Promise<void> {
  const mappings = getDefaultMappings(platform);
  
  for (const mapping of mappings) {
    await prisma.ecommerceDataMapping.create({
      data: {
        integrationId,
        ...mapping
      }
    });
  }
}

function getDefaultMappings(platform: string) {
  const baseMappings = [
    // Product mappings
    { dataType: 'product', sourceField: 'id', targetField: 'externalId', required: true },
    { dataType: 'product', sourceField: 'title', targetField: 'name', required: true },
    { dataType: 'product', sourceField: 'body_html', targetField: 'description', required: false },
    { dataType: 'product', sourceField: 'vendor', targetField: 'brand', required: false },
    { dataType: 'product', sourceField: 'product_type', targetField: 'category', required: false },
    { dataType: 'product', sourceField: 'handle', targetField: 'slug', required: false },
    
    // Order mappings
    { dataType: 'order', sourceField: 'id', targetField: 'externalId', required: true },
    { dataType: 'order', sourceField: 'order_number', targetField: 'orderNumber', required: true },
    { dataType: 'order', sourceField: 'email', targetField: 'customerEmail', required: false },
    { dataType: 'order', sourceField: 'total_price', targetField: 'totalAmount', required: true },
    { dataType: 'order', sourceField: 'currency', targetField: 'currency', required: true },
    { dataType: 'order', sourceField: 'financial_status', targetField: 'paymentStatus', required: false },
    { dataType: 'order', sourceField: 'fulfillment_status', targetField: 'fulfillmentStatus', required: false },
    
    // Customer mappings
    { dataType: 'customer', sourceField: 'id', targetField: 'externalId', required: true },
    { dataType: 'customer', sourceField: 'email', targetField: 'email', required: true },
    { dataType: 'customer', sourceField: 'first_name', targetField: 'firstName', required: false },
    { dataType: 'customer', sourceField: 'last_name', targetField: 'lastName', required: false },
    { dataType: 'customer', sourceField: 'phone', targetField: 'phone', required: false },
    { dataType: 'customer', sourceField: 'created_at', targetField: 'createdAt', required: false }
  ];

  // Platform-specific adjustments
  if (platform === 'woocommerce') {
    return baseMappings.map(mapping => {
      if (mapping.sourceField === 'body_html') return { ...mapping, sourceField: 'description' };
      if (mapping.sourceField === 'vendor') return { ...mapping, sourceField: 'brand' };
      if (mapping.sourceField === 'product_type') return { ...mapping, sourceField: 'categories' };
      return mapping;
    });
  }

  if (platform === 'magento') {
    return baseMappings.map(mapping => {
      if (mapping.sourceField === 'title') return { ...mapping, sourceField: 'name' };
      if (mapping.sourceField === 'body_html') return { ...mapping, sourceField: 'description' };
      if (mapping.sourceField === 'handle') return { ...mapping, sourceField: 'url_key' };
      return mapping;
    });
  }

  return baseMappings;
}
