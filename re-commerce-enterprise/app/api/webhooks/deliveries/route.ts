
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get webhook deliveries with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpointId = searchParams.get('endpointId');
    const status = searchParams.get('status');
    const eventType = searchParams.get('eventType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    const whereClause = {
      ...(endpointId && { endpointId }),
      ...(status && { status }),
      ...(startDate || endDate) && {
        firstAttempt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) })
        }
      },
      ...(eventType && {
        event: {
          eventType
        }
      })
    };

    const [deliveries, total] = await Promise.all([
      prisma.webhookDelivery.findMany({
        where: whereClause,
        include: {
          endpoint: {
            select: {
              id: true,
              name: true,
              url: true
            }
          },
          event: {
            select: {
              eventType: true,
              category: true,
              priority: true
            }
          },
          attemptLogs: {
            orderBy: { timestamp: 'desc' },
            take: 5
          }
        },
        orderBy: { firstAttempt: 'desc' },
        skip,
        take: limit
      }),
      prisma.webhookDelivery.count({ where: whereClause })
    ]);

    // Calculate delivery statistics
    const stats = await prisma.webhookDelivery.groupBy({
      by: ['status'],
      where: whereClause,
      _count: true
    });

    const deliveryStats = {
      total,
      success: stats.find(s => s.status === 'success')?._count || 0,
      failed: stats.find(s => s.status === 'failed')?._count || 0,
      pending: stats.find(s => s.status === 'pending')?._count || 0,
      retrying: stats.find(s => s.status === 'retrying')?._count || 0
    };

    return NextResponse.json({
      deliveries,
      stats: deliveryStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching webhook deliveries:', error);
    return NextResponse.json({ error: 'Failed to fetch webhook deliveries' }, { status: 500 });
  }
}

// Trigger manual webhook delivery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpointId, eventType, payload, priority } = body;

    if (!endpointId || !eventType || !payload) {
      return NextResponse.json({ 
        error: 'Missing required fields: endpointId, eventType, payload' 
      }, { status: 400 });
    }

    // Get webhook endpoint
    const endpoint = await prisma.webhookEndpoint.findUnique({
      where: { id: endpointId }
    });

    if (!endpoint) {
      return NextResponse.json({ error: 'Webhook endpoint not found' }, { status: 404 });
    }

    // Get or create event type
    let event = await prisma.webhookEvent.findUnique({
      where: { eventType }
    });

    if (!event) {
      event = await prisma.webhookEvent.create({
        data: {
          eventType,
          category: 'manual',
          description: 'Manually triggered event',
          priority: priority || 'normal'
        }
      });
    }

    // Create delivery
    const delivery = await prisma.webhookDelivery.create({
      data: {
        endpointId,
        eventId: event.id,
        payload,
        maxAttempts: (endpoint.retryPolicy as any)?.maxRetries || 3,
        signature: endpoint.secret ? generateHMACSignature(JSON.stringify(payload), endpoint.secret) : undefined
      },
      include: {
        endpoint: {
          select: {
            name: true,
            url: true
          }
        },
        event: {
          select: {
            eventType: true,
            category: true
          }
        }
      }
    });

    // Queue delivery for processing (in a real implementation, this would be handled by a background job)
    // For now, we'll mark it as pending
    await processWebhookDelivery(delivery.id);

    return NextResponse.json({ delivery }, { status: 201 });

  } catch (error) {
    console.error('Error creating webhook delivery:', error);
    return NextResponse.json({ error: 'Failed to create webhook delivery' }, { status: 500 });
  }
}

// Retry failed webhook delivery
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { deliveryId } = body;

    if (!deliveryId) {
      return NextResponse.json({ error: 'Delivery ID required' }, { status: 400 });
    }

    const delivery = await prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
      include: { endpoint: true }
    });

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    if (delivery.status === 'success') {
      return NextResponse.json({ error: 'Cannot retry successful delivery' }, { status: 400 });
    }

    if (delivery.attempts >= delivery.maxAttempts) {
      return NextResponse.json({ error: 'Maximum retry attempts reached' }, { status: 400 });
    }

    // Reset delivery for retry
    const updatedDelivery = await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: 'pending',
        nextAttempt: new Date()
      }
    });

    // Process retry
    await processWebhookDelivery(deliveryId);

    return NextResponse.json({ delivery: updatedDelivery });

  } catch (error) {
    console.error('Error retrying webhook delivery:', error);
    return NextResponse.json({ error: 'Failed to retry webhook delivery' }, { status: 500 });
  }
}

// Helper functions
function generateHMACSignature(payload: string, secret: string): string {
  const crypto = require('crypto');
  return `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
}

async function processWebhookDelivery(deliveryId: string): Promise<void> {
  try {
    const delivery = await prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
      include: { endpoint: true, event: true }
    });

    if (!delivery) return;

    // Create attempt record
    const attempt = await prisma.webhookAttempt.create({
      data: {
        deliveryId,
        endpointId: delivery.endpointId,
        attemptNumber: delivery.attempts + 1,
        status: 'pending',
        requestHeaders: {
          'Content-Type': 'application/json',
          'User-Agent': 'RE-Commerce-Webhook/1.0',
          ...(delivery.signature && { 'X-Signature': delivery.signature }),
          ...(delivery.endpoint.headers as any || {})
        },
        requestBody: JSON.stringify(delivery.payload)
      }
    });

    // Simulate webhook call (in production, this would be a real HTTP request)
    const startTime = Date.now();
    let success = false;
    let responseCode = 500;
    let responseBody = '';
    let errorMessage = '';

    try {
      // Simulate HTTP request to endpoint URL
      const response = await fetch(delivery.endpoint.url, {
        method: delivery.endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RE-Commerce-Webhook/1.0',
          ...(delivery.signature && { 'X-Signature': delivery.signature }),
          ...(delivery.endpoint.headers as any || {})
        },
        body: JSON.stringify(delivery.payload),
        signal: AbortSignal.timeout((delivery.endpoint.timeout || 30) * 1000)
      });

      responseCode = response.status;
      responseBody = await response.text();
      success = response.ok;

    } catch (error: any) {
      errorMessage = error.message;
      responseCode = 0;
    }

    const responseTime = Date.now() - startTime;

    // Update attempt with results
    await prisma.webhookAttempt.update({
      where: { id: attempt.id },
      data: {
        status: success ? 'success' : 'failed',
        responseCode,
        responseBody: responseBody.substring(0, 1000), // Limit response body size
        responseTime,
        errorMessage: errorMessage || undefined
      }
    });

    // Update delivery
    const newAttempts = delivery.attempts + 1;
    const updateData: any = {
      attempts: newAttempts,
      lastAttempt: new Date(),
      responseCode,
      responseBody: responseBody.substring(0, 1000),
      responseTime
    };

    if (success) {
      updateData.status = 'success';
      // Update endpoint success count
      await prisma.webhookEndpoint.update({
        where: { id: delivery.endpointId },
        data: {
          successCount: { increment: 1 },
          lastTriggeredAt: new Date(),
          avgResponseTime: delivery.endpoint.avgResponseTime 
            ? (delivery.endpoint.avgResponseTime + responseTime) / 2 
            : responseTime
        }
      });
    } else {
      if (newAttempts >= delivery.maxAttempts) {
        updateData.status = 'failed';
        updateData.errorMessage = errorMessage;
        // Update endpoint failure count
        await prisma.webhookEndpoint.update({
          where: { id: delivery.endpointId },
          data: { failureCount: { increment: 1 } }
        });
      } else {
        updateData.status = 'retrying';
        // Calculate next attempt time with exponential backoff
        const backoffMultiplier = (delivery.endpoint.retryPolicy as any)?.backoffMultiplier || 2;
        const baseDelay = 60; // 1 minute base delay
        const delay = baseDelay * Math.pow(backoffMultiplier, newAttempts - 1);
        updateData.nextAttempt = new Date(Date.now() + delay * 1000);
      }
    }

    await prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: updateData
    });

  } catch (error) {
    console.error('Error processing webhook delivery:', error);
  }
}
