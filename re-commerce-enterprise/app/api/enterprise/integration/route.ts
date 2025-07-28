
/**
 * ENTERPRISE INTEGRATION API
 * Handles SSO, API integrations, webhooks, and data transformation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { enterpriseIntegrationFramework } from '@/lib/enterprise-integration-framework';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    switch (action) {
      case 'health':
        const health = await enterpriseIntegrationFramework.getIntegrationHealth(tenantId);
        return NextResponse.json(health);

      case 'sso_config':
        // Return SSO configuration status
        return NextResponse.json({
          configured: true, // This would check actual configuration
          provider: 'saml'
        });

      case 'api_integrations':
        // Return API integrations list
        return NextResponse.json({
          integrations: [
            {
              id: 'api_1',
              name: 'External API',
              type: 'rest',
              status: 'active'
            }
          ]
        });

      case 'webhooks':
        // Return webhook configurations
        return NextResponse.json({
          webhooks: [
            {
              id: 'webhook_1',
              name: 'External Webhook',
              url: 'https://example.com/webhook',
              events: ['user.created', 'user.updated'],
              active: true
            }
          ]
        });

      case 'transformations':
        // Return transformation pipelines
        return NextResponse.json({
          pipelines: [
            {
              id: 'pipeline_1',
              name: 'User Data Transform',
              inputFormat: 'json',
              outputFormat: 'csv'
            }
          ]
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Enterprise integration error:', error);
    return NextResponse.json(
      { error: 'Integration request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'configure_sso':
        await enterpriseIntegrationFramework.configureSSOProvider(data.tenantId, data.config);
        return NextResponse.json({ success: true });

      case 'authenticate_sso':
        const authResult = await enterpriseIntegrationFramework.authenticateSSO(
          data.tenantId,
          data.assertion
        );
        return NextResponse.json(authResult);

      case 'configure_api':
        await enterpriseIntegrationFramework.configureAPIIntegration(data.tenantId, data.config);
        return NextResponse.json({ success: true });

      case 'call_api':
        const apiResult = await enterpriseIntegrationFramework.callAPI(
          data.integrationId,
          data.endpoint,
          data.method,
          data.data,
          data.options
        );
        return NextResponse.json({ result: apiResult });

      case 'configure_webhook':
        await enterpriseIntegrationFramework.configureWebhook(data.tenantId, data.config);
        return NextResponse.json({ success: true });

      case 'trigger_webhook':
        await enterpriseIntegrationFramework.triggerWebhook(data.tenantId, data.event);
        return NextResponse.json({ success: true });

      case 'configure_transformation':
        await enterpriseIntegrationFramework.configureTransformationPipeline(data.tenantId, data.pipeline);
        return NextResponse.json({ success: true });

      case 'transform_data':
        const transformResult = await enterpriseIntegrationFramework.transformData(
          data.data,
          data.pipelineId
        );
        return NextResponse.json({ result: transformResult });

      case 'import_data':
        const importResult = await enterpriseIntegrationFramework.importData(
          data.tenantId,
          data.data,
          data.format,
          data.options
        );
        return NextResponse.json(importResult);

      case 'export_data':
        const exportResult = await enterpriseIntegrationFramework.exportData(
          data.tenantId,
          data.query,
          data.format,
          data.options
        );
        return NextResponse.json({ result: exportResult });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Enterprise integration error:', error);
    return NextResponse.json(
      { error: 'Integration request failed' },
      { status: 500 }
    );
  }
}
