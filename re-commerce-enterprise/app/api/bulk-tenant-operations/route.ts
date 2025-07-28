
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Bulk Tenant Operations API
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { operation, tenantIds, parameters = {} } = body;

    if (!operation || !tenantIds || !Array.isArray(tenantIds) || tenantIds.length === 0) {
      return NextResponse.json(
        { error: 'operation, and tenantIds array are required' },
        { status: 400 }
      );
    }

    if (tenantIds.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 tenants can be processed in a single bulk operation' },
        { status: 400 }
      );
    }

    // Verify all tenants exist
    const existingTenants = await prisma.tenant.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, name: true, status: true, plan: true }
    });

    const missingTenants = tenantIds.filter(id => 
      !existingTenants.find(tenant => tenant.id === id)
    );

    if (missingTenants.length > 0) {
      return NextResponse.json(
        { error: `Tenants not found: ${missingTenants.join(', ')}` },
        { status: 404 }
      );
    }

    const operationId = `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const results: Array<{ tenantId: string; status: string; action: string; [key: string]: any }> = [];
    const errors: Array<{ tenantId: string; error: string }> = [];

    // Execute bulk operation based on type
    switch (operation) {
      case 'suspend':
        for (const tenantId of tenantIds) {
          try {
            const tenant = await prisma.tenant.update({
              where: { id: tenantId },
              data: {
                status: 'suspended',
                suspendedAt: new Date(),
                updatedAt: new Date()
              }
            });

            // Create suspension notification
            await prisma.tenantNotification.create({
              data: {
                tenantId,
                type: 'email',
                category: 'system',
                title: 'Account Suspended',
                message: `Your account has been suspended. Please contact support for assistance.`,
                recipient: parameters.notificationEmail || 'admin@tenant.com',
                priority: 'high'
              }
            });

            results.push({ tenantId, status: 'success', action: 'suspended' });
          } catch (error) {
            console.error(`Error suspending tenant ${tenantId}:`, error);
            errors.push({ tenantId, error: error.message });
          }
        }
        break;

      case 'activate':
        for (const tenantId of tenantIds) {
          try {
            const tenant = await prisma.tenant.update({
              where: { id: tenantId },
              data: {
                status: 'active',
                suspendedAt: null,
                updatedAt: new Date()
              }
            });

            // Create activation notification
            await prisma.tenantNotification.create({
              data: {
                tenantId,
                type: 'email',
                category: 'system',
                title: 'Account Activated',
                message: `Your account has been activated and is now ready to use.`,
                recipient: parameters.notificationEmail || 'admin@tenant.com',
                priority: 'normal'
              }
            });

            results.push({ tenantId, status: 'success', action: 'activated' });
          } catch (error) {
            console.error(`Error activating tenant ${tenantId}:`, error);
            errors.push({ tenantId, error: error.message });
          }
        }
        break;

      case 'update_plan':
        const { newPlan, newTier } = parameters;
        if (!newPlan) {
          return NextResponse.json(
            { error: 'newPlan is required for update_plan operation' },
            { status: 400 }
          );
        }

        for (const tenantId of tenantIds) {
          try {
            const currentTenant = existingTenants.find(t => t.id === tenantId);
            
            // Calculate new resource limits based on plan
            const newLimits = calculatePlanLimits(newPlan, newTier || 'standard');
            
            const tenant = await prisma.tenant.update({
              where: { id: tenantId },
              data: {
                plan: newPlan,
                tier: newTier || 'standard',
                maxUsers: newLimits.maxUsers,
                storageLimit: BigInt(newLimits.storageLimit),
                bandwidthLimit: BigInt(newLimits.bandwidthLimit),
                apiCallLimit: newLimits.apiCallLimit,
                updatedAt: new Date(),
                resourceQuotas: {
                  storage: newLimits.storageLimit,
                  bandwidth: newLimits.bandwidthLimit,
                  apiCalls: newLimits.apiCallLimit,
                  users: newLimits.maxUsers
                }
              }
            });

            // Update resource allocations
            await prisma.tenantResource.updateMany({
              where: { tenantId, resourceType: 'storage' },
              data: { allocatedAmount: BigInt(newLimits.storageLimit) }
            });

            await prisma.tenantResource.updateMany({
              where: { tenantId, resourceType: 'bandwidth' },
              data: { allocatedAmount: BigInt(newLimits.bandwidthLimit) }
            });

            // Log plan change
            await prisma.tenantAnalytics.create({
              data: {
                tenantId,
                metricCategory: 'billing',
                metricName: 'plan_changed',
                metricValue: 1,
                dimensions: {
                  oldPlan: currentTenant?.plan,
                  newPlan,
                  oldTier: 'standard', // Assuming default
                  newTier: newTier || 'standard',
                  operationId
                }
              }
            });

            results.push({ 
              tenantId, 
              status: 'success', 
              action: 'plan_updated',
              oldPlan: currentTenant?.plan,
              newPlan
            });
          } catch (error) {
            console.error(`Error updating plan for tenant ${tenantId}:`, error);
            errors.push({ tenantId, error: error.message });
          }
        }
        break;

      case 'backup_all':
        const { backupType = 'full', retentionDays = 30 } = parameters;
        
        for (const tenantId of tenantIds) {
          try {
            const backup = await prisma.tenantBackup.create({
              data: {
                tenantId,
                backupType,
                dataTypes: ['database', 'files', 'configurations'],
                compression: true,
                encryption: true,
                retentionDays,
                status: 'scheduled'
              }
            });

            // Schedule backup execution (in production, this would trigger actual backup)
            setTimeout(async () => {
              try {
                await prisma.tenantBackup.update({
                  where: { id: backup.id },
                  data: {
                    status: 'running',
                    startedAt: new Date()
                  }
                });
                
                // Simulate backup completion after 5 seconds
                setTimeout(async () => {
                  await prisma.tenantBackup.update({
                    where: { id: backup.id },
                    data: {
                      status: 'completed',
                      completedAt: new Date(),
                      size: BigInt(Math.floor(Math.random() * 1000000000) + 100000000)
                    }
                  });
                }, 5000);
              } catch (error) {
                console.error(`Backup process error for tenant ${tenantId}:`, error);
              }
            }, 1000);

            results.push({ 
              tenantId, 
              status: 'success', 
              action: 'backup_scheduled',
              backupId: backup.id
            });
          } catch (error) {
            console.error(`Error creating backup for tenant ${tenantId}:`, error);
            errors.push({ tenantId, error: error.message });
          }
        }
        break;

      case 'update_resources':
        const { resourceUpdates } = parameters;
        if (!resourceUpdates || typeof resourceUpdates !== 'object') {
          return NextResponse.json(
            { error: 'resourceUpdates object is required for update_resources operation' },
            { status: 400 }
          );
        }

        for (const tenantId of tenantIds) {
          try {
            // Update tenant limits
            const updateData: any = { updatedAt: new Date() };
            const quotasUpdate: any = {};

            if (resourceUpdates.maxUsers) {
              updateData.maxUsers = resourceUpdates.maxUsers;
              quotasUpdate.users = resourceUpdates.maxUsers;
            }
            if (resourceUpdates.storageLimit) {
              updateData.storageLimit = BigInt(resourceUpdates.storageLimit);
              quotasUpdate.storage = resourceUpdates.storageLimit;
            }
            if (resourceUpdates.bandwidthLimit) {
              updateData.bandwidthLimit = BigInt(resourceUpdates.bandwidthLimit);
              quotasUpdate.bandwidth = resourceUpdates.bandwidthLimit;
            }
            if (resourceUpdates.apiCallLimit) {
              updateData.apiCallLimit = resourceUpdates.apiCallLimit;
              quotasUpdate.apiCalls = resourceUpdates.apiCallLimit;
            }

            if (Object.keys(quotasUpdate).length > 0) {
              // Get current resource quotas
              const currentTenant = await prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { resourceQuotas: true }
              });

              updateData.resourceQuotas = {
                ...(currentTenant?.resourceQuotas || {}),
                ...quotasUpdate
              };
            }

            await prisma.tenant.update({
              where: { id: tenantId },
              data: updateData
            });

            // Update individual resource records
            if (resourceUpdates.storageLimit) {
              await prisma.tenantResource.updateMany({
                where: { tenantId, resourceType: 'storage' },
                data: { allocatedAmount: BigInt(resourceUpdates.storageLimit) }
              });
            }

            if (resourceUpdates.bandwidthLimit) {
              await prisma.tenantResource.updateMany({
                where: { tenantId, resourceType: 'bandwidth' },
                data: { allocatedAmount: BigInt(resourceUpdates.bandwidthLimit) }
              });
            }

            results.push({ 
              tenantId, 
              status: 'success', 
              action: 'resources_updated',
              updates: resourceUpdates
            });
          } catch (error) {
            console.error(`Error updating resources for tenant ${tenantId}:`, error);
            errors.push({ tenantId, error: error.message });
          }
        }
        break;

      case 'send_notification':
        const { notificationType = 'email', title, message, priority = 'normal', category = 'system' } = parameters;
        
        if (!title || !message) {
          return NextResponse.json(
            { error: 'title and message are required for send_notification operation' },
            { status: 400 }
          );
        }

        for (const tenantId of tenantIds) {
          try {
            const notification = await prisma.tenantNotification.create({
              data: {
                tenantId,
                type: notificationType,
                category,
                title,
                message,
                recipient: parameters.recipient || 'admin@tenant.com',
                priority,
                metadata: {
                  operationId,
                  bulkOperation: true
                }
              }
            });

            results.push({ 
              tenantId, 
              status: 'success', 
              action: 'notification_sent',
              notificationId: notification.id
            });
          } catch (error) {
            console.error(`Error sending notification to tenant ${tenantId}:`, error);
            errors.push({ tenantId, error: error.message });
          }
        }
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported operation: ${operation}` },
          { status: 400 }
        );
    }

    // Log bulk operation
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: 'system',
        metricCategory: 'admin',
        metricName: 'bulk_operation',
        metricValue: tenantIds.length,
        dimensions: {
          operation,
          operationId,
          successCount: results.length,
          errorCount: errors.length,
          executedBy: session.user.id
        }
      }
    });

    const response = {
      success: true,
      data: {
        operationId,
        operation,
        totalTenants: tenantIds.length,
        successCount: results.length,
        errorCount: errors.length,
        results,
        errors
      },
      message: `Bulk operation ${operation} completed. ${results.length} successful, ${errors.length} failed.`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Bulk operation error:', error);
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
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get recent bulk operations from analytics
    const recentOperations = await prisma.tenantAnalytics.findMany({
      where: {
        metricCategory: 'admin',
        metricName: 'bulk_operation'
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    const operationHistory = recentOperations.map(op => ({
      operationId: op.dimensions?.operationId,
      operation: op.dimensions?.operation,
      timestamp: op.timestamp,
      totalTenants: op.metricValue,
      successCount: op.dimensions?.successCount || 0,
      errorCount: op.dimensions?.errorCount || 0,
      executedBy: op.dimensions?.executedBy
    }));

    return NextResponse.json({
      success: true,
      data: {
        operations: operationHistory,
        supportedOperations: [
          'suspend',
          'activate', 
          'update_plan',
          'backup_all',
          'update_resources',
          'send_notification'
        ]
      }
    });
  } catch (error) {
    console.error('Bulk operations history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate plan limits
function calculatePlanLimits(plan: string, tier: string = 'standard') {
  const planLimits = {
    basic: {
      standard: {
        maxUsers: 10,
        storageLimit: 5368709120, // 5GB
        bandwidthLimit: 53687091200, // 50GB
        apiCallLimit: 10000
      },
      premium: {
        maxUsers: 25,
        storageLimit: 10737418240, // 10GB
        bandwidthLimit: 107374182400, // 100GB
        apiCallLimit: 25000
      }
    },
    professional: {
      standard: {
        maxUsers: 100,
        storageLimit: 53687091200, // 50GB
        bandwidthLimit: 536870912000, // 500GB
        apiCallLimit: 100000
      },
      premium: {
        maxUsers: 250,
        storageLimit: 107374182400, // 100GB
        bandwidthLimit: 1073741824000, // 1TB
        apiCallLimit: 250000
      }
    },
    enterprise: {
      standard: {
        maxUsers: 1000,
        storageLimit: 536870912000, // 500GB
        bandwidthLimit: 5368709120000, // 5TB
        apiCallLimit: 1000000
      },
      premium: {
        maxUsers: -1, // Unlimited
        storageLimit: -1, // Unlimited
        bandwidthLimit: -1, // Unlimited
        apiCallLimit: -1 // Unlimited
      }
    }
  };

  return planLimits[plan]?.[tier] || planLimits.basic.standard;
}
