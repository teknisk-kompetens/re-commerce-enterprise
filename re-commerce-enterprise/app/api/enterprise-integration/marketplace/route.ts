
import { NextRequest, NextResponse } from 'next/server';
import { enterpriseMarketplaceService } from '@/lib/enterprise-marketplace';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const publisher = searchParams.get('publisher') || undefined;
    const search = searchParams.get('search') || undefined;
    const action = searchParams.get('action');
    const tenantId = searchParams.get('tenantId');

    switch (action) {
      case 'installations':
        const installations = await enterpriseMarketplaceService.getMarketplaceInstallations(tenantId || undefined);
        return NextResponse.json(installations);

      case 'analytics':
        const analytics = await enterpriseMarketplaceService.getMarketplaceAnalytics();
        return NextResponse.json(analytics);

      default:
        const apps = await enterpriseMarketplaceService.getMarketplaceApps({ category, status, publisher, search });
        return NextResponse.json(apps);
    }
  } catch (error) {
    console.error('Failed to get marketplace data:', error);
    return NextResponse.json({ error: 'Failed to get marketplace data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const installationId = searchParams.get('installationId');
    const appId = searchParams.get('appId');

    switch (action) {
      case 'create-app':
        const appData = await request.json();
        const app = await enterpriseMarketplaceService.createMarketplaceApp(appData);
        return NextResponse.json(app);

      case 'install':
        const installData = await request.json();
        const installation = await enterpriseMarketplaceService.installMarketplaceApp(installData);
        return NextResponse.json(installation);

      case 'uninstall':
        if (!installationId) {
          return NextResponse.json({ error: 'Installation ID is required' }, { status: 400 });
        }
        const uninstallResult = await enterpriseMarketplaceService.uninstallMarketplaceApp(installationId);
        return NextResponse.json(uninstallResult);

      case 'rate':
        if (!appId) {
          return NextResponse.json({ error: 'App ID is required' }, { status: 400 });
        }
        const ratingData = await request.json();
        const ratingResult = await enterpriseMarketplaceService.updateAppRating(appId, ratingData.rating);
        return NextResponse.json(ratingResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process marketplace request:', error);
    return NextResponse.json({ error: 'Failed to process marketplace request' }, { status: 500 });
  }
}
