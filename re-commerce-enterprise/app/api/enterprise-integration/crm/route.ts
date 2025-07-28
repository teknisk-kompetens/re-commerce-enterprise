
import { NextRequest, NextResponse } from 'next/server';
import { crmIntegrationService } from '@/lib/enterprise-crm-integration';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const enabled = searchParams.get('enabled') ? searchParams.get('enabled') === 'true' : undefined;
    const action = searchParams.get('action');
    const integrationId = searchParams.get('integrationId');

    switch (action) {
      case 'analytics':
        const analytics = await crmIntegrationService.getCRMAnalytics(integrationId || undefined);
        return NextResponse.json(analytics);

      case 'customer-insights':
        const insights = await crmIntegrationService.getCRMCustomerInsights(integrationId || undefined);
        return NextResponse.json(insights);

      default:
        const integrations = await crmIntegrationService.getCRMIntegrations({ type, status, enabled });
        return NextResponse.json(integrations);
    }
  } catch (error) {
    console.error('Failed to get CRM integrations:', error);
    return NextResponse.json({ error: 'Failed to get CRM integrations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const integrationId = searchParams.get('integrationId');

    switch (action) {
      case 'create':
        const createData = await request.json();
        const integration = await crmIntegrationService.createCRMIntegration(createData);
        return NextResponse.json(integration);

      case 'sync':
        if (!integrationId) {
          return NextResponse.json({ error: 'Integration ID is required' }, { status: 400 });
        }
        const syncData = await request.json();
        const syncResult = await crmIntegrationService.startCRMSync(
          integrationId,
          syncData.operation,
          syncData.options
        );
        return NextResponse.json(syncResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process CRM integration request:', error);
    return NextResponse.json({ error: 'Failed to process CRM integration request' }, { status: 500 });
  }
}
