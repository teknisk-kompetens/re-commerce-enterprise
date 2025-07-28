
import { NextRequest, NextResponse } from 'next/server';
import { communicationIntegrationService } from '@/lib/enterprise-communication-integration';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const enabled = searchParams.get('enabled') ? searchParams.get('enabled') === 'true' : undefined;
    const action = searchParams.get('action');
    const integrationId = searchParams.get('integrationId');
    const channelId = searchParams.get('channelId');

    switch (action) {
      case 'channels':
        const channels = await communicationIntegrationService.getCommunicationChannels(integrationId || undefined);
        return NextResponse.json(channels);

      case 'messages':
        const messages = await communicationIntegrationService.getMessages(integrationId || undefined, channelId || undefined);
        return NextResponse.json(messages);

      case 'analytics':
        const analytics = await communicationIntegrationService.getCommunicationAnalytics(integrationId || undefined);
        return NextResponse.json(analytics);

      case 'test-connection':
        if (!integrationId) {
          return NextResponse.json({ error: 'Integration ID is required' }, { status: 400 });
        }
        const testResult = await communicationIntegrationService.testCommunicationIntegration(integrationId);
        return NextResponse.json(testResult);

      default:
        const integrations = await communicationIntegrationService.getCommunicationIntegrations({ type, status, enabled });
        return NextResponse.json(integrations);
    }
  } catch (error) {
    console.error('Failed to get communication data:', error);
    return NextResponse.json({ error: 'Failed to get communication data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'create':
        const createData = await request.json();
        const integration = await communicationIntegrationService.createCommunicationIntegration(createData);
        return NextResponse.json(integration);

      case 'create-channel':
        const channelData = await request.json();
        const channel = await communicationIntegrationService.createChannel(channelData);
        return NextResponse.json(channel);

      case 'send-message':
        const messageData = await request.json();
        const message = await communicationIntegrationService.sendMessage(messageData);
        return NextResponse.json(message);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process communication request:', error);
    return NextResponse.json({ error: 'Failed to process communication request' }, { status: 500 });
  }
}
