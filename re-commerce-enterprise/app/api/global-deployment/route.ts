
/**
 * GLOBAL DEPLOYMENT API
 * API endpoints for global deployment orchestration and multi-region management
 */

import { NextRequest, NextResponse } from 'next/server';
import { globalDeploymentOrchestrator } from '@/lib/global-deployment-orchestrator';
import { globalCDNManager } from '@/lib/global-cdn-manager';
import { multiTenantGlobalArchitecture } from '@/lib/multi-tenant-global-architecture';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const deploymentId = searchParams.get('deploymentId');
    const regionId = searchParams.get('regionId');

    switch (action) {
      case 'deployments':
        const deployments = await globalDeploymentOrchestrator.listDeployments();
        return NextResponse.json({ success: true, data: deployments });

      case 'regions':
        const regions = await globalDeploymentOrchestrator.getAvailableRegions();
        return NextResponse.json({ success: true, data: regions });

      case 'status':
        if (!deploymentId) {
          return NextResponse.json({ success: false, error: 'Deployment ID required' }, { status: 400 });
        }
        const status = await globalDeploymentOrchestrator.getDeploymentStatus(deploymentId);
        return NextResponse.json({ success: true, data: status });

      case 'latency':
        const fromRegion = searchParams.get('fromRegion');
        const toRegion = searchParams.get('toRegion');
        if (!fromRegion || !toRegion) {
          return NextResponse.json({ success: false, error: 'From and to regions required' }, { status: 400 });
        }
        const latency = await globalDeploymentOrchestrator.getRegionLatency(fromRegion, toRegion);
        return NextResponse.json({ success: true, data: { latency } });

      case 'cdn-configurations':
        const cdnConfigs = await globalCDNManager.getCDNConfigurations();
        return NextResponse.json({ success: true, data: cdnConfigs });

      case 'cdn-metrics':
        const configId = searchParams.get('configId');
        if (!configId) {
          return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
        }
        const metrics = await globalCDNManager.getCDNMetrics(configId);
        return NextResponse.json({ success: true, data: metrics });

      case 'tenants':
        const tenants = await multiTenantGlobalArchitecture.listTenants();
        return NextResponse.json({ success: true, data: tenants });

      case 'tenant-usage':
        const tenantId = searchParams.get('tenantId');
        if (!tenantId) {
          return NextResponse.json({ success: false, error: 'Tenant ID required' }, { status: 400 });
        }
        const usage = await multiTenantGlobalArchitecture.getTenantUsage(tenantId);
        return NextResponse.json({ success: true, data: usage });

      case 'global-metrics':
        const globalMetrics = {
          deployment: await globalDeploymentOrchestrator.getAvailableRegions(),
          cdn: await globalCDNManager.getGlobalCDNStatus(),
          tenants: await multiTenantGlobalArchitecture.getGlobalTenantMetrics()
        };
        return NextResponse.json({ success: true, data: globalMetrics });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global deployment API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create-deployment':
        const deploymentId = await globalDeploymentOrchestrator.createGlobalDeployment(data);
        return NextResponse.json({ success: true, data: { deploymentId } });

      case 'terminate-deployment':
        const { deploymentId: termDeploymentId } = data;
        if (!termDeploymentId) {
          return NextResponse.json({ success: false, error: 'Deployment ID required' }, { status: 400 });
        }
        await globalDeploymentOrchestrator.terminateDeployment(termDeploymentId);
        return NextResponse.json({ success: true, data: { message: 'Deployment terminated' } });

      case 'create-cdn-config':
        const cdnConfigId = await globalCDNManager.createCDNConfiguration(data);
        return NextResponse.json({ success: true, data: { configId: cdnConfigId } });

      case 'deploy-cdn':
        const { configId } = data;
        if (!configId) {
          return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
        }
        const deploymentResult = await globalCDNManager.deployCDNConfiguration(configId);
        return NextResponse.json({ success: true, data: deploymentResult });

      case 'purge-cdn-cache':
        const { configId: purgeConfigId, purgeType, targets } = data;
        if (!purgeConfigId || !purgeType) {
          return NextResponse.json({ success: false, error: 'Config ID and purge type required' }, { status: 400 });
        }
        await globalCDNManager.purgeCDNCache(purgeConfigId, purgeType, targets);
        return NextResponse.json({ success: true, data: { message: 'Cache purged successfully' } });

      case 'create-tenant':
        const tenantId = await multiTenantGlobalArchitecture.createTenant(data);
        return NextResponse.json({ success: true, data: { tenantId } });

      case 'migrate-tenant':
        const { tenantId: migTenantId, migration } = data;
        if (!migTenantId || !migration) {
          return NextResponse.json({ success: false, error: 'Tenant ID and migration config required' }, { status: 400 });
        }
        const migrationId = await multiTenantGlobalArchitecture.migrateTenant(migTenantId, migration);
        return NextResponse.json({ success: true, data: { migrationId } });

      case 'suspend-tenant':
        const { tenantId: suspendTenantId, reason } = data;
        if (!suspendTenantId || !reason) {
          return NextResponse.json({ success: false, error: 'Tenant ID and reason required' }, { status: 400 });
        }
        await multiTenantGlobalArchitecture.suspendTenant(suspendTenantId, reason);
        return NextResponse.json({ success: true, data: { message: 'Tenant suspended' } });

      case 'optimize-image':
        const { configId: imgConfigId, imagePath, options } = data;
        if (!imgConfigId || !imagePath) {
          return NextResponse.json({ success: false, error: 'Config ID and image path required' }, { status: 400 });
        }
        const optimizedUrl = await globalCDNManager.optimizeImageDelivery(imgConfigId, imagePath, options);
        return NextResponse.json({ success: true, data: { optimizedUrl } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global deployment API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'update-cdn-config':
        const { configId, updates } = data;
        if (!configId || !updates) {
          return NextResponse.json({ success: false, error: 'Config ID and updates required' }, { status: 400 });
        }
        await globalCDNManager.updateCDNConfiguration(configId, updates);
        return NextResponse.json({ success: true, data: { message: 'Configuration updated' } });

      case 'update-tenant':
        const { tenantId, updates: tenantUpdates } = data;
        if (!tenantId || !tenantUpdates) {
          return NextResponse.json({ success: false, error: 'Tenant ID and updates required' }, { status: 400 });
        }
        await multiTenantGlobalArchitecture.updateTenant(tenantId, tenantUpdates);
        return NextResponse.json({ success: true, data: { message: 'Tenant updated' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global deployment API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    switch (action) {
      case 'delete-cdn-config':
        await globalCDNManager.deleteCDNConfiguration(id);
        return NextResponse.json({ success: true, data: { message: 'Configuration deleted' } });

      case 'terminate-tenant':
        await multiTenantGlobalArchitecture.terminateTenant(id);
        return NextResponse.json({ success: true, data: { message: 'Tenant terminated' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global deployment API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

