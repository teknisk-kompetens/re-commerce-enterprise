
/**
 * GLOBAL DATABASE API
 * API endpoints for global database replication and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { globalDatabaseReplication } from '@/lib/global-database-replication';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const clusterId = searchParams.get('clusterId');
    const migrationId = searchParams.get('migrationId');

    switch (action) {
      case 'clusters':
        const clusters = await globalDatabaseReplication.listDatabaseClusters();
        return NextResponse.json({ success: true, data: clusters });

      case 'cluster':
        if (!clusterId) {
          return NextResponse.json({ success: false, error: 'Cluster ID required' }, { status: 400 });
        }
        const cluster = await globalDatabaseReplication.getDatabaseCluster(clusterId);
        return NextResponse.json({ success: true, data: cluster });

      case 'sync-status':
        if (!clusterId) {
          return NextResponse.json({ success: false, error: 'Cluster ID required' }, { status: 400 });
        }
        const syncStatus = await globalDatabaseReplication.getSyncStatus(clusterId);
        return NextResponse.json({ success: true, data: syncStatus });

      case 'migrations':
        const migrations = await globalDatabaseReplication.listMigrations(clusterId ?? undefined);
        return NextResponse.json({ success: true, data: migrations });

      case 'migration-status':
        if (!migrationId) {
          return NextResponse.json({ success: false, error: 'Migration ID required' }, { status: 400 });
        }
        const migrationStatus = await globalDatabaseReplication.getMigrationStatus(migrationId);
        return NextResponse.json({ success: true, data: migrationStatus });

      case 'global-metrics':
        const globalMetrics = await globalDatabaseReplication.getGlobalDatabaseMetrics();
        return NextResponse.json({ success: true, data: globalMetrics });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global database API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create-cluster':
        const clusterId = await globalDatabaseReplication.createDatabaseCluster(data);
        return NextResponse.json({ success: true, data: { clusterId } });

      case 'migrate-cluster':
        const { clusterId: migClusterId, migration } = data;
        if (!migClusterId || !migration) {
          return NextResponse.json({ success: false, error: 'Cluster ID and migration config required' }, { status: 400 });
        }
        const migrationId = await globalDatabaseReplication.migrateDatabaseCluster(migClusterId, migration);
        return NextResponse.json({ success: true, data: { migrationId } });

      case 'resolve-conflict':
        const { clusterId: confClusterId, regionId, conflictId, resolution } = data;
        if (!confClusterId || !regionId || !conflictId || !resolution) {
          return NextResponse.json({ success: false, error: 'Cluster ID, region ID, conflict ID and resolution required' }, { status: 400 });
        }
        await globalDatabaseReplication.resolveConflict(confClusterId, regionId, conflictId, resolution);
        return NextResponse.json({ success: true, data: { message: 'Conflict resolved' } });

      case 'rebalance-shards':
        const { clusterId: rebalClusterId } = data;
        if (!rebalClusterId) {
          return NextResponse.json({ success: false, error: 'Cluster ID required' }, { status: 400 });
        }
        await globalDatabaseReplication.rebalanceShards(rebalClusterId);
        return NextResponse.json({ success: true, data: { message: 'Shards rebalanced' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global database API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'update-cluster':
        const { clusterId, updates } = data;
        if (!clusterId || !updates) {
          return NextResponse.json({ success: false, error: 'Cluster ID and updates required' }, { status: 400 });
        }
        await globalDatabaseReplication.updateClusterConfig(clusterId, updates);
        return NextResponse.json({ success: true, data: { message: 'Cluster updated' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global database API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clusterId = searchParams.get('clusterId');

    if (!clusterId) {
      return NextResponse.json({ success: false, error: 'Cluster ID required' }, { status: 400 });
    }

    await globalDatabaseReplication.deleteCluster(clusterId);
    return NextResponse.json({ success: true, data: { message: 'Cluster deleted' } });
  } catch (error) {
    console.error('Global database API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

