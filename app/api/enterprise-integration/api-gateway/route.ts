
import { NextRequest, NextResponse } from 'next/server';
import { apiGatewayService } from '@/lib/enterprise-api-gateway';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const gatewayId = searchParams.get('gatewayId');
    const endpointId = searchParams.get('endpointId');
    const key = searchParams.get('key');

    switch (action) {
      case 'endpoints':
        const endpoints = await apiGatewayService.getAPIEndpoints(gatewayId || undefined);
        return NextResponse.json(endpoints);

      case 'keys':
        const keys = await apiGatewayService.getAPIKeys(gatewayId || undefined);
        return NextResponse.json(keys);

      case 'analytics':
        const analytics = await apiGatewayService.getAPIAnalytics(gatewayId || undefined, endpointId || undefined);
        return NextResponse.json(analytics);

      case 'validate-key':
        if (!key) {
          return NextResponse.json({ error: 'API key is required' }, { status: 400 });
        }
        const validation = await apiGatewayService.validateAPIKey(key, gatewayId || undefined);
        return NextResponse.json(validation);

      default:
        const gateways = await apiGatewayService.getAPIGateways({
          status: searchParams.get('status') || undefined,
          version: searchParams.get('version') || undefined
        });
        return NextResponse.json(gateways);
    }
  } catch (error) {
    console.error('Failed to get API gateway data:', error);
    return NextResponse.json({ error: 'Failed to get API gateway data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'create-gateway':
        const gatewayData = await request.json();
        const gateway = await apiGatewayService.createAPIGateway(gatewayData);
        return NextResponse.json(gateway);

      case 'create-endpoint':
        const endpointData = await request.json();
        const endpoint = await apiGatewayService.createAPIEndpoint(endpointData);
        return NextResponse.json(endpoint);

      case 'create-key':
        const keyData = await request.json();
        const apiKey = await apiGatewayService.createAPIKey(keyData);
        return NextResponse.json(apiKey);

      case 'log-analytics':
        const analyticsData = await request.json();
        await apiGatewayService.logAPIAnalytics(analyticsData);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process API gateway request:', error);
    return NextResponse.json({ error: 'Failed to process API gateway request' }, { status: 500 });
  }
}
