
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get all webhook endpoints for a tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const [webhooks, total] = await Promise.all([
      prisma.webhookEndpoint.findMany({
        where: {
          tenantId,
          OR: search ? [
            { name: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ] : undefined
        },
        include: {
          _count: {
            select: {
              deliveries: true,
              attempts: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.webhookEndpoint.count({
        where: {
          tenantId,
          OR: search ? [
            { name: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } }
          ] : undefined
        }
      })
    ]);

    // Calculate success rates for each webhook
    const webhooksWithStats = await Promise.all(
      webhooks.map(async (webhook) => {
        const totalDeliveries = webhook.successCount + webhook.failureCount;
        const successRate = totalDeliveries > 0 ? (webhook.successCount / totalDeliveries) * 100 : 0;

        return {
          ...webhook,
          successRate: Math.round(successRate * 100) / 100,
          totalDeliveries
        };
      })
    );

    return NextResponse.json({
      webhooks: webhooksWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}

// Create new webhook endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, name, description, url, method, events, headers, secret, retryPolicy, timeout } = body;

    if (!tenantId || !name || !url || !events?.length) {
      return NextResponse.json({ 
        error: 'Missing required fields: tenantId, name, url, events' 
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Create webhook endpoint
    const webhook = await prisma.webhookEndpoint.create({
      data: {
        tenantId,
        name,
        description,
        url,
        method: method || 'POST',
        events,
        headers: headers || {},
        secret,
        retryPolicy: retryPolicy || { maxRetries: 3, backoffMultiplier: 2 },
        timeout: timeout || 30,
        securityConfig: {
          signatureVerification: !!secret,
          httpsRequired: url.startsWith('https://'),
          allowedIPs: []
        }
      },
      include: {
        _count: {
          select: {
            deliveries: true,
            attempts: true
          }
        }
      }
    });

    return NextResponse.json({ webhook }, { status: 201 });

  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}

// Update webhook endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, url, method, events, headers, secret, retryPolicy, timeout, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 });
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }
    }

    const webhook = await prisma.webhookEndpoint.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(url && { url }),
        ...(method && { method }),
        ...(events && { events }),
        ...(headers && { headers }),
        ...(secret !== undefined && { secret }),
        ...(retryPolicy && { retryPolicy }),
        ...(timeout && { timeout }),
        ...(isActive !== undefined && { isActive }),
        ...(url && {
          securityConfig: {
            signatureVerification: !!secret,
            httpsRequired: url.startsWith('https://'),
            allowedIPs: []
          }
        })
      },
      include: {
        _count: {
          select: {
            deliveries: true,
            attempts: true
          }
        }
      }
    });

    return NextResponse.json({ webhook });

  } catch (error) {
    console.error('Error updating webhook:', error);
    return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 });
  }
}

// Delete webhook endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 });
    }

    await prisma.webhookEndpoint.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}
