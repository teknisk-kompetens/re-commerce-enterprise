
import { NextRequest, NextResponse } from 'next/server';
import { biIntegrationService } from '@/lib/enterprise-bi-integration';

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
      case 'dashboards':
        const dashboards = await biIntegrationService.getBIDashboards(integrationId || undefined);
        return NextResponse.json(dashboards);

      case 'reports':
        const reports = await biIntegrationService.getBIReports(integrationId || undefined);
        return NextResponse.json(reports);

      case 'analytics':
        const analytics = await biIntegrationService.getBIAnalytics(integrationId || undefined);
        return NextResponse.json(analytics);

      default:
        const integrations = await biIntegrationService.getBIIntegrations({ type, status, enabled });
        return NextResponse.json(integrations);
    }
  } catch (error) {
    console.error('Failed to get BI data:', error);
    return NextResponse.json({ error: 'Failed to get BI data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const reportId = searchParams.get('reportId');
    const dashboardId = searchParams.get('dashboardId');

    switch (action) {
      case 'create':
        const createData = await request.json();
        const integration = await biIntegrationService.createBIIntegration(createData);
        return NextResponse.json(integration);

      case 'create-dashboard':
        const dashboardData = await request.json();
        const dashboard = await biIntegrationService.createBIDashboard(dashboardData);
        return NextResponse.json(dashboard);

      case 'create-report':
        const reportData = await request.json();
        const report = await biIntegrationService.createBIReport(reportData);
        return NextResponse.json(report);

      case 'execute-report':
        if (!reportId) {
          return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
        }
        const executeResult = await biIntegrationService.executeBIReport(reportId);
        return NextResponse.json(executeResult);

      case 'refresh-dashboard':
        if (!dashboardId) {
          return NextResponse.json({ error: 'Dashboard ID is required' }, { status: 400 });
        }
        const refreshResult = await biIntegrationService.refreshBIDashboard(dashboardId);
        return NextResponse.json(refreshResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process BI request:', error);
    return NextResponse.json({ error: 'Failed to process BI request' }, { status: 500 });
  }
}
