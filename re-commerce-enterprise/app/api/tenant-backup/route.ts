
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Tenant Backup Management API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const backupType = searchParams.get('backupType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (backupType) where.backupType = backupType;
    if (status) where.status = status;

    const [backups, stats] = await Promise.all([
      prisma.tenantBackup.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              domain: true,
              plan: true
            }
          }
        }
      }),
      prisma.tenantBackup.groupBy({
        by: ['status', 'backupType'],
        where: tenantId ? { tenantId } : {},
        _count: true,
        _sum: {
          size: true
        }
      })
    ]);

    const enrichedBackups = backups.map(backup => ({
      ...backup,
      size: backup.size ? Number(backup.size) : null,
      duration: backup.startedAt && backup.completedAt 
        ? backup.completedAt.getTime() - backup.startedAt.getTime()
        : null,
      formattedSize: backup.size ? formatBytes(Number(backup.size)) : 'Unknown'
    }));

    const summary = {
      totalBackups: backups.length,
      completedBackups: backups.filter(b => b.status === 'completed').length,
      failedBackups: backups.filter(b => b.status === 'failed').length,
      runningBackups: backups.filter(b => b.status === 'running').length,
      totalSize: stats.reduce((sum, stat) => sum + (Number(stat._sum.size) || 0), 0),
      typeDistribution: stats.reduce((acc, stat) => {
        acc[stat.backupType] = (acc[stat.backupType] || 0) + stat._count;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: {
        backups: enrichedBackups,
        summary
      }
    });
  } catch (error) {
    console.error('Backup retrieval error:', error);
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
      backupType = 'full',
      dataTypes = ['database', 'files', 'configurations'],
      compression = true,
      encryption = true,
      retentionDays = 30,
      scheduledAt = null
    } = body;

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Create backup record
    const backup = await prisma.tenantBackup.create({
      data: {
        tenantId,
        backupType,
        dataTypes,
        compression,
        encryption,
        retentionDays,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'scheduled' : 'running',
        startedAt: scheduledAt ? null : new Date()
      }
    });

    // If not scheduled, start backup process immediately
    if (!scheduledAt) {
      // Simulate backup process (in production, this would trigger actual backup)
      setTimeout(async () => {
        try {
          await simulateBackupProcess(backup.id);
        } catch (error) {
          console.error('Backup process error:', error);
        }
      }, 1000);
    }

    // Log backup initiation
    await prisma.tenantAnalytics.create({
      data: {
        tenantId,
        metricCategory: 'backup',
        metricName: 'backup_initiated',
        metricValue: 1,
        dimensions: {
          backupType,
          dataTypes,
          scheduled: !!scheduledAt,
          backupId: backup.id
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: backup,
      message: scheduledAt ? 'Backup scheduled successfully' : 'Backup initiated successfully'
    });
  } catch (error) {
    console.error('Backup creation error:', error);
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
    const { backupId, action } = body;

    if (!backupId || !action) {
      return NextResponse.json(
        { error: 'backupId and action are required' },
        { status: 400 }
      );
    }

    const backup = await prisma.tenantBackup.findUnique({
      where: { id: backupId }
    });

    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    let updatedBackup;

    switch (action) {
      case 'cancel':
        if (backup.status !== 'running' && backup.status !== 'scheduled') {
          return NextResponse.json(
            { error: 'Backup cannot be cancelled in current status' },
            { status: 400 }
          );
        }
        
        updatedBackup = await prisma.tenantBackup.update({
          where: { id: backupId },
          data: {
            status: 'failed',
            failedAt: new Date(),
            errorMessage: 'Backup cancelled by user'
          }
        });
        break;

      case 'retry':
        if (backup.status !== 'failed') {
          return NextResponse.json(
            { error: 'Only failed backups can be retried' },
            { status: 400 }
          );
        }
        
        updatedBackup = await prisma.tenantBackup.update({
          where: { id: backupId },
          data: {
            status: 'running',
            startedAt: new Date(),
            failedAt: null,
            errorMessage: null
          }
        });

        // Restart backup process
        setTimeout(async () => {
          try {
            await simulateBackupProcess(backupId);
          } catch (error) {
            console.error('Backup retry error:', error);
          }
        }, 1000);
        break;

      case 'delete':
        if (backup.status === 'running') {
          return NextResponse.json(
            { error: 'Cannot delete running backup' },
            { status: 400 }
          );
        }
        
        await prisma.tenantBackup.delete({
          where: { id: backupId }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Backup deleted successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log backup action
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: backup.tenantId,
        metricCategory: 'backup',
        metricName: 'backup_action',
        metricValue: 1,
        dimensions: {
          action,
          backupId,
          backupType: backup.backupType,
          previousStatus: backup.status
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBackup,
      message: `Backup ${action} executed successfully`
    });
  } catch (error) {
    console.error('Backup action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to simulate backup process
async function simulateBackupProcess(backupId: string) {
  try {
    const backup = await prisma.tenantBackup.findUnique({
      where: { id: backupId }
    });

    if (!backup || backup.status !== 'running') {
      return;
    }

    // Simulate backup progress
    const totalSteps = 5;
    const stepDuration = 2000; // 2 seconds per step
    
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      
      // Random chance of failure (5%)
      if (Math.random() < 0.05) {
        await prisma.tenantBackup.update({
          where: { id: backupId },
          data: {
            status: 'failed',
            failedAt: new Date(),
            errorMessage: 'Backup failed due to network error'
          }
        });
        return;
      }
    }

    // Calculate simulated backup size
    const simulatedSize = Math.floor(Math.random() * 1000000000) + 100000000; // 100MB to 1GB
    const checksum = `sha256:${Math.random().toString(36).substr(2, 64)}`;
    const location = `s3://backups/tenant-${backup.tenantId}/${backupId}.tar.gz`;

    // Complete backup
    await prisma.tenantBackup.update({
      where: { id: backupId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        size: BigInt(simulatedSize),
        location,
        checksum
      }
    });

    // Log backup completion
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: backup.tenantId,
        metricCategory: 'backup',
        metricName: 'backup_completed',
        metricValue: simulatedSize,
        metricUnit: 'bytes',
        dimensions: {
          backupId,
          backupType: backup.backupType,
          dataTypes: backup.dataTypes,
          duration: Date.now() - (backup.startedAt?.getTime() || Date.now())
        }
      }
    });
  } catch (error) {
    console.error('Backup simulation error:', error);
    
    // Mark backup as failed
    await prisma.tenantBackup.update({
      where: { id: backupId },
      data: {
        status: 'failed',
        failedAt: new Date(),
        errorMessage: 'Internal backup process error'
      }
    });
  }
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
