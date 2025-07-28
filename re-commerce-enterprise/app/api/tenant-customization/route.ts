
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Tenant Customization API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const type = searchParams.get('type'); // branding, features, workflows, etc.

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    if (type === 'branding') {
      const branding = await prisma.tenantBranding.findUnique({
        where: { tenantId }
      });

      return NextResponse.json({
        success: true,
        data: branding || {
          tenantId,
          primaryColor: '#0066cc',
          secondaryColor: '#666666',
          accentColor: '#0099ff',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          fontFamily: 'Inter',
          loginTheme: 'default',
          dashboardTheme: 'light',
          isActive: true
        }
      });
    }

    if (type === 'features') {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { features: true, plan: true, tier: true }
      });

      // Get available features based on plan/tier
      const availableFeatures = await getAvailableFeatures(tenant?.plan || 'basic', tenant?.tier || 'standard');

      return NextResponse.json({
        success: true,
        data: {
          currentFeatures: tenant?.features || {},
          availableFeatures,
          plan: tenant?.plan,
          tier: tenant?.tier
        }
      });
    }

    if (type === 'workflows') {
      const workflows = await prisma.tenantWorkflow.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: workflows
      });
    }

    if (type === 'integrations') {
      const integrations = await prisma.tenantIntegrationConfig.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: integrations.map(integration => ({
          ...integration,
          credentials: undefined // Remove sensitive data
        }))
      });
    }

    // Get all customizations
    const [branding, customizations, workflows, integrations] = await Promise.all([
      prisma.tenantBranding.findUnique({
        where: { tenantId }
      }),
      prisma.tenantCustomization.findMany({
        where: { tenantId, isActive: true },
        orderBy: { priority: 'desc' }
      }),
      prisma.tenantWorkflow.findMany({
        where: { tenantId, isActive: true },
        orderBy: { priority: 'desc' }
      }),
      prisma.tenantIntegrationConfig.findMany({
        where: { tenantId, isActive: true },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        branding,
        customizations,
        workflows,
        integrations: integrations.map(i => ({
          ...i,
          credentials: undefined
        }))
      }
    });
  } catch (error) {
    console.error('Tenant customization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tenantId, type, data } = body;

    if (!tenantId || !type || !data) {
      return NextResponse.json(
        { error: 'tenantId, type, and data are required' },
        { status: 400 }
      );
    }

    if (type === 'branding') {
      const branding = await prisma.tenantBranding.upsert({
        where: { tenantId },
        update: {
          ...data,
          updatedAt: new Date()
        },
        create: {
          tenantId,
          ...data
        }
      });

      return NextResponse.json({
        success: true,
        data: branding,
        message: 'Branding updated successfully'
      });
    }

    if (type === 'features') {
      const tenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          features: data.features,
          updatedAt: new Date()
        }
      });

      // Log feature changes
      await prisma.tenantAnalytics.create({
        data: {
          tenantId,
          metricCategory: 'customization',
          metricName: 'features_updated',
          metricValue: Object.keys(data.features).length,
          dimensions: {
            updatedFeatures: Object.keys(data.features),
            userId: session.user.id
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: { features: tenant.features },
        message: 'Features updated successfully'
      });
    }

    if (type === 'workflow') {
      const workflow = await prisma.tenantWorkflow.create({
        data: {
          tenantId,
          name: data.name,
          description: data.description,
          trigger: data.trigger,
          conditions: data.conditions || [],
          actions: data.actions || [],
          category: data.category || 'general',
          priority: data.priority || 0,
          timeout: data.timeout || 300,
          retryPolicy: data.retryPolicy || {},
          createdBy: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        data: workflow,
        message: 'Workflow created successfully'
      });
    }

    if (type === 'integration') {
      const integration = await prisma.tenantIntegrationConfig.create({
        data: {
          tenantId,
          integrationType: data.integrationType,
          integrationName: data.integrationName,
          configuration: data.configuration,
          credentials: data.credentials || {},
          syncFrequency: data.syncFrequency,
          rateLimits: data.rateLimits || {},
          monitoring: data.monitoring || {},
          createdBy: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          ...integration,
          credentials: undefined // Remove sensitive data from response
        },
        message: 'Integration created successfully'
      });
    }

    if (type === 'customization') {
      const customization = await prisma.tenantCustomization.create({
        data: {
          tenantId,
          customizationType: data.customizationType,
          name: data.name,
          description: data.description,
          configuration: data.configuration,
          priority: data.priority || 0,
          conditions: data.conditions || {},
          effects: data.effects || {},
          createdBy: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        data: customization,
        message: 'Customization created successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid customization type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Customization creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tenantId, type, id, data } = body;

    if (!tenantId || !type || !id || !data) {
      return NextResponse.json(
        { error: 'tenantId, type, id, and data are required' },
        { status: 400 }
      );
    }

    if (type === 'workflow') {
      const workflow = await prisma.tenantWorkflow.update({
        where: { id, tenantId },
        data: {
          ...data,
          updatedAt: new Date(),
          updatedBy: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        data: workflow,
        message: 'Workflow updated successfully'
      });
    }

    if (type === 'integration') {
      const integration = await prisma.tenantIntegrationConfig.update({
        where: { id, tenantId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          ...integration,
          credentials: undefined
        },
        message: 'Integration updated successfully'
      });
    }

    if (type === 'customization') {
      const customization = await prisma.tenantCustomization.update({
        where: { id, tenantId },
        data: {
          ...data,
          updatedAt: new Date(),
          updatedBy: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        data: customization,
        message: 'Customization updated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid customization type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Customization update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get available features based on plan/tier
async function getAvailableFeatures(plan: string, tier: string) {
  const featureMatrix = {
    basic: {
      standard: [
        'user_management', 'basic_analytics', 'email_notifications', 
        'basic_integrations', 'standard_storage'
      ],
      premium: [
        'user_management', 'basic_analytics', 'email_notifications',
        'basic_integrations', 'standard_storage', 'advanced_reporting',
        'custom_branding', 'priority_support'
      ]
    },
    professional: {
      standard: [
        'user_management', 'advanced_analytics', 'multi_notifications',
        'advanced_integrations', 'expanded_storage', 'custom_workflows',
        'api_access', 'audit_logs'
      ],
      premium: [
        'user_management', 'advanced_analytics', 'multi_notifications',
        'advanced_integrations', 'expanded_storage', 'custom_workflows',
        'api_access', 'audit_logs', 'white_labeling', 'dedicated_support',
        'advanced_security', 'compliance_tools'
      ]
    },
    enterprise: {
      standard: [
        'user_management', 'enterprise_analytics', 'omni_notifications',
        'enterprise_integrations', 'unlimited_storage', 'advanced_workflows',
        'full_api_access', 'comprehensive_audit', 'multi_region',
        'advanced_security', 'compliance_suite', 'dedicated_resources'
      ],
      premium: [
        'user_management', 'enterprise_analytics', 'omni_notifications',
        'enterprise_integrations', 'unlimited_storage', 'advanced_workflows',
        'full_api_access', 'comprehensive_audit', 'multi_region',
        'advanced_security', 'compliance_suite', 'dedicated_resources',
        'custom_development', 'premium_support', 'sla_guarantees',
        'advanced_customization'
      ]
    }
  };

  return featureMatrix[plan]?.[tier] || featureMatrix.basic.standard;
}
