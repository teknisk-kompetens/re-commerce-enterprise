
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Tenant Migration Management API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const migrationType = searchParams.get('migrationType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (migrationType) where.migrationType = migrationType;
    if (status) where.status = status;

    const [migrations, stats] = await Promise.all([
      prisma.tenantMigration.findMany({
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
      prisma.tenantMigration.groupBy({
        by: ['status', 'migrationType'],
        where: tenantId ? { tenantId } : {},
        _count: true,
        _avg: {
          progress: true,
          actualDuration: true
        }
      })
    ]);

    const enrichedMigrations = migrations.map(migration => {
      const duration = migration.startedAt && migration.completedAt
        ? migration.completedAt.getTime() - migration.startedAt.getTime()
        : null;
      
      const estimatedCompletion = migration.startedAt && migration.estimatedDuration && migration.status === 'running'
        ? new Date(migration.startedAt.getTime() + migration.estimatedDuration * 60 * 1000)
        : null;

      return {
        ...migration,
        dataTransferred: Number(migration.dataTransferred),
        totalDataSize: migration.totalDataSize ? Number(migration.totalDataSize) : null,
        actualDuration: duration ? Math.round(duration / 1000 / 60) : migration.actualDuration, // in minutes
        estimatedCompletion,
        transferProgress: migration.totalDataSize 
          ? (Number(migration.dataTransferred) / Number(migration.totalDataSize)) * 100
          : 0
      };
    });

    const summary = {
      totalMigrations: migrations.length,
      activeMigrations: migrations.filter(m => ['running', 'planned'].includes(m.status)).length,
      completedMigrations: migrations.filter(m => m.status === 'completed').length,
      failedMigrations: migrations.filter(m => ['failed', 'cancelled'].includes(m.status)).length,
      averageProgress: stats.reduce((sum, stat) => sum + (stat._avg.progress || 0), 0) / Math.max(stats.length, 1),
      averageDuration: stats.reduce((sum, stat) => sum + (stat._avg.actualDuration || 0), 0) / Math.max(stats.length, 1),
      typeDistribution: stats.reduce((acc, stat) => {
        acc[stat.migrationType] = (acc[stat.migrationType] || 0) + stat._count;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: {
        migrations: enrichedMigrations,
        summary
      }
    });
  } catch (error) {
    console.error('Migration retrieval error:', error);
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
      migrationType,
      sourceConfiguration,
      targetConfiguration,
      scheduledAt = null,
      estimatedDuration = null
    } = body;

    if (!tenantId || !migrationType || !sourceConfiguration || !targetConfiguration) {
      return NextResponse.json(
        { error: 'tenantId, migrationType, sourceConfiguration, and targetConfiguration are required' },
        { status: 400 }
      );
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Check for active migrations
    const activeMigration = await prisma.tenantMigration.findFirst({
      where: {
        tenantId,
        status: { in: ['running', 'planned'] }
      }
    });

    if (activeMigration) {
      return NextResponse.json(
        { error: 'Tenant already has an active migration' },
        { status: 409 }
      );
    }

    // Create migration plan
    const migrationSteps = generateMigrationSteps(migrationType, sourceConfiguration, targetConfiguration);
    const totalDataSize = estimateDataSize(tenant, migrationType);

    const migration = await prisma.tenantMigration.create({
      data: {
        tenantId,
        migrationType,
        sourceConfiguration,
        targetConfiguration,
        status: scheduledAt ? 'planned' : 'running',
        totalSteps: migrationSteps.length,
        estimatedDuration: estimatedDuration || estimateMigrationDuration(migrationType, totalDataSize),
        totalDataSize: BigInt(totalDataSize),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        startedAt: scheduledAt ? null : new Date(),
        rollbackPlan: generateRollbackPlan(migrationType, sourceConfiguration),
        logs: migrationSteps.map(step => ({
          step: step.name,
          status: 'pending',
          timestamp: new Date().toISOString()
        })),
        createdBy: session.user.id
      }
    });

    // Update tenant status if migration starts immediately
    if (!scheduledAt) {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { status: 'migrating' }
      });

      // Start migration process
      setTimeout(async () => {
        try {
          await simulateMigrationProcess(migration.id, migrationSteps);
        } catch (error) {
          console.error('Migration process error:', error);
        }
      }, 1000);
    }

    // Log migration initiation
    await prisma.tenantAnalytics.create({
      data: {
        tenantId,
        metricCategory: 'migration',
        metricName: 'migration_initiated',
        metricValue: 1,
        dimensions: {
          migrationType,
          scheduled: !!scheduledAt,
          migrationId: migration.id,
          estimatedDuration: migration.estimatedDuration
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...migration,
        dataTransferred: Number(migration.dataTransferred),
        totalDataSize: Number(migration.totalDataSize)
      },
      message: scheduledAt ? 'Migration scheduled successfully' : 'Migration initiated successfully'
    });
  } catch (error) {
    console.error('Migration creation error:', error);
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
    const { migrationId, action } = body;

    if (!migrationId || !action) {
      return NextResponse.json(
        { error: 'migrationId and action are required' },
        { status: 400 }
      );
    }

    const migration = await prisma.tenantMigration.findUnique({
      where: { id: migrationId },
      include: { tenant: true }
    });

    if (!migration) {
      return NextResponse.json({ error: 'Migration not found' }, { status: 404 });
    }

    let updatedMigration;

    switch (action) {
      case 'pause':
        if (migration.status !== 'running') {
          return NextResponse.json(
            { error: 'Migration must be running to pause' },
            { status: 400 }
          );
        }
        
        updatedMigration = await prisma.tenantMigration.update({
          where: { id: migrationId },
          data: { status: 'paused' }
        });
        break;

      case 'resume':
        if (migration.status !== 'paused') {
          return NextResponse.json(
            { error: 'Migration must be paused to resume' },
            { status: 400 }
          );
        }
        
        updatedMigration = await prisma.tenantMigration.update({
          where: { id: migrationId },
          data: { status: 'running' }
        });

        // Resume migration process
        const remainingSteps = generateMigrationSteps(
          migration.migrationType,
          migration.sourceConfiguration,
          migration.targetConfiguration
        ).slice(migration.completedSteps);

        setTimeout(async () => {
          try {
            await simulateMigrationProcess(migrationId, remainingSteps, migration.completedSteps);
          } catch (error) {
            console.error('Migration resume error:', error);
          }
        }, 1000);
        break;

      case 'cancel':
        if (!['running', 'paused', 'planned'].includes(migration.status)) {
          return NextResponse.json(
            { error: 'Migration cannot be cancelled in current status' },
            { status: 400 }
          );
        }
        
        updatedMigration = await prisma.tenantMigration.update({
          where: { id: migrationId },
          data: {
            status: 'cancelled',
            cancelledAt: new Date(),
            errorMessage: 'Migration cancelled by user'
          }
        });

        // Restore tenant status
        await prisma.tenant.update({
          where: { id: migration.tenantId },
          data: { status: 'active' }
        });
        break;

      case 'rollback':
        if (migration.status !== 'failed' && migration.progress < 100) {
          return NextResponse.json(
            { error: 'Can only rollback failed or completed migrations' },
            { status: 400 }
          );
        }
        
        // Execute rollback plan
        updatedMigration = await prisma.tenantMigration.update({
          where: { id: migrationId },
          data: {
            status: 'running',
            currentStep: 'rollback_in_progress',
            progress: 0
          }
        });

        setTimeout(async () => {
          try {
            await simulateRollbackProcess(migrationId);
          } catch (error) {
            console.error('Rollback process error:', error);
          }
        }, 1000);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log migration action
    await prisma.tenantAnalytics.create({
      data: {
        tenantId: migration.tenantId,
        metricCategory: 'migration',
        metricName: 'migration_action',
        metricValue: 1,
        dimensions: {
          action,
          migrationId,
          migrationType: migration.migrationType,
          previousStatus: migration.status,
          progress: migration.progress
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedMigration,
        dataTransferred: updatedMigration ? Number(updatedMigration.dataTransferred) : Number(migration.dataTransferred),
        totalDataSize: updatedMigration 
          ? (updatedMigration.totalDataSize ? Number(updatedMigration.totalDataSize) : null)
          : (migration.totalDataSize ? Number(migration.totalDataSize) : null)
      },
      message: `Migration ${action} executed successfully`
    });
  } catch (error) {
    console.error('Migration action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function generateMigrationSteps(migrationType: string, source: any, target: any): any[] {
  const baseSteps = [
    { name: 'validation', description: 'Validate migration requirements' },
    { name: 'backup_creation', description: 'Create backup of current state' },
    { name: 'data_export', description: 'Export tenant data' }
  ];

  switch (migrationType) {
    case 'region':
      return [
        ...baseSteps,
        { name: 'region_setup', description: 'Setup target region infrastructure' },
        { name: 'data_transfer', description: 'Transfer data to target region' },
        { name: 'dns_update', description: 'Update DNS configuration' },
        { name: 'validation_tests', description: 'Run validation tests' },
        { name: 'cutover', description: 'Complete migration cutover' }
      ];
    
    case 'plan':
      return [
        ...baseSteps,
        { name: 'plan_validation', description: 'Validate target plan compatibility' },
        { name: 'resource_adjustment', description: 'Adjust resource allocations' },
        { name: 'feature_migration', description: 'Migrate feature configurations' },
        { name: 'billing_update', description: 'Update billing configuration' }
      ];
    
    case 'infrastructure':
      return [
        ...baseSteps,
        { name: 'infrastructure_setup', description: 'Setup target infrastructure' },
        { name: 'database_migration', description: 'Migrate database' },
        { name: 'application_deployment', description: 'Deploy applications' },
        { name: 'configuration_update', description: 'Update configurations' },
        { name: 'testing', description: 'Run comprehensive tests' }
      ];
    
    default:
      return [
        ...baseSteps,
        { name: 'data_migration', description: 'Migrate all data' },
        { name: 'configuration_update', description: 'Update configurations' },
        { name: 'validation', description: 'Validate migration completion' }
      ];
  }
}

function estimateDataSize(tenant: any, migrationType: string): number {
  const baseSize = 1000000; // 1MB base
  const userMultiplier = 100000; // 100KB per user
  const planMultiplier = tenant.plan === 'enterprise' ? 5 : tenant.plan === 'professional' ? 3 : 1;
  
  return baseSize + (tenant.maxUsers * userMultiplier * planMultiplier);
}

function estimateMigrationDuration(migrationType: string, dataSize: number): number {
  const baseTime = 30; // 30 minutes base
  const dataFactor = Math.floor(dataSize / 1000000); // 1 minute per MB
  
  const typeMultiplier = {
    'region': 2,
    'plan': 0.5,
    'infrastructure': 3,
    'data': 1.5,
    'full': 4
  };
  
  return Math.round(baseTime + (dataFactor * (typeMultiplier[migrationType as keyof typeof typeMultiplier] || 1)));
}

function generateRollbackPlan(migrationType: string, sourceConfiguration: any): any {
  return {
    steps: [
      'Stop new traffic routing',
      'Restore from backup',
      'Revert DNS changes',
      'Validate rollback completion'
    ],
    sourceConfiguration,
    estimatedRollbackTime: 15, // minutes
    autoRollbackEnabled: false
  };
}

async function simulateMigrationProcess(migrationId: string, steps: any[], startStep: number = 0) {
  try {
    const stepDuration = 30000; // 30 seconds per step
    
    for (let i = startStep; i < steps.length; i++) {
      const step = steps[i];
      const progress = ((i + 1) / steps.length) * 100;
      
      await prisma.tenantMigration.update({
        where: { id: migrationId },
        data: {
          currentStep: step.name,
          completedSteps: i + 1,
          progress: Math.round(progress),
          dataTransferred: BigInt(Math.floor(Math.random() * 1000000) + (i * 200000)) // Simulate data transfer
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      
      // Random chance of failure (3%)
      if (Math.random() < 0.03) {
        await prisma.tenantMigration.update({
          where: { id: migrationId },
          data: {
            status: 'failed',
            failedAt: new Date(),
            errorMessage: `Migration failed at step: ${step.name}`
          }
        });
        return;
      }
    }
    
    // Complete migration
    const migration = await prisma.tenantMigration.update({
      where: { id: migrationId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        progress: 100,
        actualDuration: Math.floor((Date.now() - Date.now()) / 1000 / 60) // Will be calculated properly
      }
    });
    
    // Update tenant status
    await prisma.tenant.update({
      where: { id: migration.tenantId },
      data: { status: 'active' }
    });
    
  } catch (error) {
    console.error('Migration simulation error:', error);
    
    await prisma.tenantMigration.update({
      where: { id: migrationId },
      data: {
        status: 'failed',
        failedAt: new Date(),
        errorMessage: 'Internal migration process error'
      }
    });
  }
}

async function simulateRollbackProcess(migrationId: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds
    
    const migration = await prisma.tenantMigration.update({
      where: { id: migrationId },
      data: {
        status: 'cancelled',
        progress: 0,
        currentStep: 'rollback_completed'
      }
    });
    
    // Restore tenant status
    await prisma.tenant.update({
      where: { id: migration.tenantId },
      data: { status: 'active' }
    });
    
  } catch (error) {
    console.error('Rollback simulation error:', error);
  }
}
