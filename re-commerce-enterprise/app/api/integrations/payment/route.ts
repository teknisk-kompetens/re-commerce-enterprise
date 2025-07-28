
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get payment integrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const provider = searchParams.get('provider');
    const status = searchParams.get('status');
    const isLive = searchParams.get('isLive') === 'true';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const whereClause = {
      tenantId,
      ...(provider && { provider }),
      ...(status && { status }),
      ...(isLive !== undefined && { isLive })
    };

    const integrations = await prisma.paymentIntegration.findMany({
      where: whereClause,
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            transactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate payment metrics
    const integrationsWithMetrics = await Promise.all(
      integrations.map(async (integration) => {
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const recentTransactions = await prisma.paymentTransaction.findMany({
          where: {
            integrationId: integration.id,
            createdAt: { gte: last30Days }
          }
        });

        const totalVolume = recentTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const successfulTransactions = recentTransactions.filter(t => t.status === 'succeeded').length;
        const successRate = recentTransactions.length > 0 ? (successfulTransactions / recentTransactions.length) * 100 : 0;

        return {
          ...integration,
          metrics: {
            last30Days: {
              totalVolume: totalVolume / 100, // Convert from cents
              transactionCount: recentTransactions.length,
              successRate: Math.round(successRate * 100) / 100,
              averageTransaction: recentTransactions.length > 0 ? (totalVolume / recentTransactions.length) / 100 : 0
            },
            allTime: {
              totalVolume: Number(integration.totalVolume) / 100,
              transactionCount: integration.transactionCount
            }
          }
        };
      })
    );

    return NextResponse.json({ integrations: integrationsWithMetrics });

  } catch (error) {
    console.error('Error fetching payment integrations:', error);
    return NextResponse.json({ error: 'Failed to fetch payment integrations' }, { status: 500 });
  }
}

// Create payment integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      tenantId, 
      name, 
      provider, 
      version, 
      apiEndpoint, 
      credentials, 
      configuration,
      isLive,
      supportedMethods,
      currencies,
      features
    } = body;

    if (!tenantId || !name || !provider || !apiEndpoint || !credentials) {
      return NextResponse.json({ 
        error: 'Missing required fields: tenantId, name, provider, apiEndpoint, credentials' 
      }, { status: 400 });
    }

    const integration = await prisma.paymentIntegration.create({
      data: {
        tenantId,
        name,
        provider,
        version: version || '1.0',
        apiEndpoint,
        credentials,
        configuration: configuration || {},
        isLive: isLive || false,
        supportedMethods: supportedMethods || ['card'],
        currencies: currencies || ['USD', 'EUR'],
        features: features || ['payments', 'refunds'],
        webhookConfig: {
          enabled: true,
          events: ['payment.succeeded', 'payment.failed', 'refund.created']
        },
        fees: getProviderFees(provider),
        rateLimits: getPaymentRateLimits(provider),
        monitoring: {
          transactionAlerts: true,
          volumeAlerts: true,
          failureRateAlerts: true
        }
      }
    });

    return NextResponse.json({ integration }, { status: 201 });

  } catch (error) {
    console.error('Error creating payment integration:', error);
    return NextResponse.json({ error: 'Failed to create payment integration' }, { status: 500 });
  }
}

// Update payment integration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, credentials, configuration, isLive, status, supportedMethods, currencies } = body;

    if (!id) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    const integration = await prisma.paymentIntegration.update({
      where: { id },
      data: {
        ...(credentials && { credentials }),
        ...(configuration && { configuration }),
        ...(isLive !== undefined && { isLive }),
        ...(status && { status }),
        ...(supportedMethods && { supportedMethods }),
        ...(currencies && { currencies })
      }
    });

    return NextResponse.json({ integration });

  } catch (error) {
    console.error('Error updating payment integration:', error);
    return NextResponse.json({ error: 'Failed to update payment integration' }, { status: 500 });
  }
}

function getProviderFees(provider: string) {
  const fees: Record<string, any> = {
    'stripe': { cardFee: 2.9, fixedFee: 30, currency: 'USD' },
    'paypal': { cardFee: 2.9, fixedFee: 30, currency: 'USD' },
    'klarna': { transactionFee: 3.29, currency: 'USD' },
    'square': { cardFee: 2.6, fixedFee: 10, currency: 'USD' },
    'braintree': { cardFee: 2.9, fixedFee: 30, currency: 'USD' }
  };
  
  return fees[provider.toLowerCase()] || { cardFee: 2.9, fixedFee: 30, currency: 'USD' };
}

function getPaymentRateLimits(provider: string) {
  const limits: Record<string, any> = {
    'stripe': { requestsPerSecond: 25, burstLimit: 100 },
    'paypal': { requestsPerSecond: 10, burstLimit: 50 },
    'klarna': { requestsPerSecond: 20, burstLimit: 100 },
    'square': { requestsPerSecond: 10, burstLimit: 40 },
    'braintree': { requestsPerSecond: 20, burstLimit: 100 }
  };
  
  return limits[provider.toLowerCase()] || { requestsPerSecond: 10, burstLimit: 50 };
}
