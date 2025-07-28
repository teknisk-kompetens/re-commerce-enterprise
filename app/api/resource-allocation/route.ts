
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Resource Allocation API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const resourceType = searchParams.get('resourceType');
    const includeUsage = searchParams.get('includeUsage') === 'true';

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    // Build filter conditions
    const where: any = { tenantId };
    if (resourceType) {
      where.resourceType = resourceType;
    }

    const resources = await prisma.tenantResource.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    let enrichedResources = resources;

    if (includeUsage) {
      // Get recent usage data for each resource
      enrichedResources = await Promise.all(
        resources.map(async (resource) => {
          const recentUsage = await prisma.tenantUsageRecord.findMany({
            where: {
              tenantId,
              resourceType: resource.resourceType,
              timestamp: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
              }
            },
            orderBy: { timestamp: 'desc' },
            take: 100
          });

          // Calculate usage statistics
          const usageValues = recentUsage.map(u => Number(u.value));
          const totalUsage = usageValues.reduce((sum, val) => sum + val, 0);
          const avgUsage = usageValues.length > 0 ? totalUsage / usageValues.length : 0;
          const maxUsage = usageValues.length > 0 ? Math.max(...usageValues) : 0;
          const minUsage = usageValues.length > 0 ? Math.min(...usageValues) : 0;

          // Calculate utilization metrics
          const utilization = Number(resource.usedAmount) / Number(resource.allocatedAmount);
          const utilizationPercentage = Math.round(utilization * 100);

          // Determine status based on utilization
          let status = resource.status;
          if (utilization >= 0.95) {
            status = 'critical';
          } else if (utilization >= resource.alertThreshold) {
            status = 'warning';
          } else if (utilization >= 0.5) {
            status = 'moderate';
          } else {
            status = 'low';
          }

          // Calculate cost
          const cost = Number(resource.usedAmount) * resource.costPerUnit;

          return {
            ...resource,
            allocatedAmount: Number(resource.allocatedAmount),
            usedAmount: Number(resource.usedAmount),
            utilization: utilizationPercentage,
            utilizationStatus: status,
            cost,
            usageStats: {
              total: totalUsage,
              average: avgUsage,
              maximum: maxUsage,
              minimum: minUsage,
              dataPoints: usageValues.length
            },
            recentUsage: recentUsage.slice(0, 20).map(u => ({
              timestamp: u.timestamp,
              value: Number(u.value),
              unit: u.unit,
              period: u.period
            }))
          };
        })
      );
    }

    // Calculate summary statistics
    const summary = {
      totalResources: resources.length,
      resourceTypes: [...new Set(resources.map(r => r.resourceType))],
      totalAllocated: resources.reduce((sum, r) => sum + Number(r.allocatedAmount), 0),
      totalUsed: resources.reduce((sum, r) => sum + Number(r.usedAmount), 0),
      totalCost: resources.reduce((sum, r) => sum + (Number(r.usedAmount) * r.costPerUnit), 0),
      overallUtilization: resources.length > 0 
        ? resources.reduce((sum, r) => sum + (Number(r.usedAmount) / Number(r.allocatedAmount)), 0) / resources.length
        : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        resources: enrichedResources,
        summary,
        tenantId
      }
    });
  } catch (error) {
    console.error('Resource allocation error:', error);
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
      tenantId,
      resourceType,
      resourceName,
      allocatedAmount,
      maxAmount,
      unit,
      costPerUnit = 0.0,
      region,
      provider,
      configuration = {},
      alertThreshold = 0.8,
      resetPeriod = 'monthly'
    } = body;

    if (!tenantId || !resourceType || !resourceName || !allocatedAmount || !unit) {
      return NextResponse.json(
        { error: 'tenantId, resourceType, resourceName, allocatedAmount, and unit are required' },
        { status: 400 }
      );
    }

    // Check if resource already exists
    const existingResource = await prisma.tenantResource.findUnique({
      where: {
        tenantId_resourceType_resourceName: {
          tenantId,
          resourceType,
          resourceName
        }
      }
    });

    if (existingResource) {
      return NextResponse.json(
        { error: 'Resource with this name and type already exists for this tenant' },
        { status: 409 }
      );
    }

    const resource = await prisma.tenantResource.create({
      data: {
        tenantId,
        resourceType,
        resourceName,
        allocatedAmount: BigInt(allocatedAmount),
        maxAmount: maxAmount ? BigInt(maxAmount) : null,
        unit,
        costPerUnit,
        region,
        provider,
        configuration,
        alertThreshold,
        resetPeriod
      }
    });

    // Log resource allocation event
    await prisma.tenantAnalytics.create({
      data: {
        tenantId,
        metricCategory: 'resource_allocation',
        metricName: 'resource_allocated',
        metricValue: Number(allocatedAmount),
        metricUnit: unit,
        dimensions: {
          resourceType,
          resourceName,
          provider: provider || 'internal',
          region: region || 'default'
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...resource,
        allocatedAmount: Number(resource.allocatedAmount),
        usedAmount: Number(resource.usedAmount),
        maxAmount: resource.maxAmount ? Number(resource.maxAmount) : null
      },
      message: 'Resource allocated successfully'
    });
  } catch (error) {
    console.error('Resource allocation creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resourceId, updates } = body;

    if (!resourceId || !updates) {
      return NextResponse.json(
        { error: 'resourceId and updates are required' },
        { status: 400 }
      );
    }

    // Convert numeric fields to BigInt if provided
    const updateData: any = { ...updates };
    if (updates.allocatedAmount) {
      updateData.allocatedAmount = BigInt(updates.allocatedAmount);
    }
    if (updates.usedAmount) {
      updateData.usedAmount = BigInt(updates.usedAmount);
    }
    if (updates.maxAmount) {
      updateData.maxAmount = BigInt(updates.maxAmount);
    }

    const resource = await prisma.tenantResource.update({
      where: { id: resourceId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    // Log resource update event
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: resource.tenantId,
        metricCategory: 'resource_allocation',
        metricName: 'resource_updated',
        metricValue: Number(resource.allocatedAmount),
        metricUnit: resource.unit,
        dimensions: {
          resourceType: resource.resourceType,
          resourceName: resource.resourceName,
          updateType: Object.keys(updates).join(',')
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...resource,
        allocatedAmount: Number(resource.allocatedAmount),
        usedAmount: Number(resource.usedAmount),
        maxAmount: resource.maxAmount ? Number(resource.maxAmount) : null
      },
      message: 'Resource updated successfully'
    });
  } catch (error) {
    console.error('Resource update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json({ error: 'resourceId is required' }, { status: 400 });
    }

    const resource = await prisma.tenantResource.findUnique({
      where: { id: resourceId }
    });

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    await prisma.tenantResource.delete({
      where: { id: resourceId }
    });

    // Log resource deallocation event
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: resource.tenantId,
        metricCategory: 'resource_allocation',
        metricName: 'resource_deallocated',
        metricValue: Number(resource.allocatedAmount),
        metricUnit: resource.unit,
        dimensions: {
          resourceType: resource.resourceType,
          resourceName: resource.resourceName,
          wasUsed: Number(resource.usedAmount) > 0
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Resource deallocated successfully'
    });
  } catch (error) {
    console.error('Resource deallocation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
