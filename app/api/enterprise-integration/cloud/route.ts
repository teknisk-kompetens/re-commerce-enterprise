
import { NextRequest, NextResponse } from 'next/server';
import { cloudIntegrationService } from '@/lib/enterprise-cloud-integration';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const region = searchParams.get('region') || undefined;
    const status = searchParams.get('status') || undefined;
    const action = searchParams.get('action');
    const integrationId = searchParams.get('integrationId');
    const resourceId = searchParams.get('resourceId');

    switch (action) {
      case 'analytics':
        const analytics = await cloudIntegrationService.getCloudAnalytics(integrationId || undefined);
        return NextResponse.json(analytics);

      case 'resources':
        const resources = await cloudIntegrationService.getCloudResources(integrationId || undefined);
        return NextResponse.json(resources);

      case 'deployments':
        const deployments = await cloudIntegrationService.getCloudDeployments(integrationId || undefined);
        return NextResponse.json(deployments);

      case 'resource-metrics':
        if (!resourceId) {
          return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
        }
        const metrics = await cloudIntegrationService.getCloudResourceMetrics(resourceId);
        return NextResponse.json(metrics);

      default:
        const integrations = await cloudIntegrationService.getCloudIntegrations({ type, region, status });
        return NextResponse.json(integrations);
    }
  } catch (error) {
    console.error('Failed to get cloud integrations:', error);
    return NextResponse.json({ error: 'Failed to get cloud integrations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'create':
        const createData = await request.json();
        const integration = await cloudIntegrationService.createCloudIntegration(createData);
        return NextResponse.json(integration);

      case 'deploy':
        const deployData = await request.json();
        const deployment = await cloudIntegrationService.createCloudDeployment(deployData);
        return NextResponse.json(deployment);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process cloud integration request:', error);
    return NextResponse.json({ error: 'Failed to process cloud integration request' }, { status: 500 });
  }
}
