
import { NextRequest, NextResponse } from 'next/server';
import { financialIntegrationService } from '@/lib/enterprise-financial-integration';

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
        const analytics = await financialIntegrationService.getFinancialAnalytics(integrationId || undefined);
        return NextResponse.json(analytics);

      default:
        const integrations = await financialIntegrationService.getFinancialIntegrations({ type, status, enabled });
        return NextResponse.json(integrations);
    }
  } catch (error) {
    console.error('Failed to get financial integrations:', error);
    return NextResponse.json({ error: 'Failed to get financial integrations' }, { status: 500 });
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
        const integration = await financialIntegrationService.createFinancialIntegration(createData);
        return NextResponse.json(integration);

      case 'sync':
        if (!integrationId) {
          return NextResponse.json({ error: 'Integration ID is required' }, { status: 400 });
        }
        const syncData = await request.json();
        const syncResult = await financialIntegrationService.startFinancialSync(
          integrationId,
          syncData.operation,
          syncData.options
        );
        return NextResponse.json(syncResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process financial integration request:', error);
    return NextResponse.json({ error: 'Failed to process financial integration request' }, { status: 500 });
  }
}
