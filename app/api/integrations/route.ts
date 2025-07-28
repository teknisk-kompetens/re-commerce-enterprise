
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use APIConnector model for integrations
    const integrations = await prisma.aPIConnector.findMany({
      where: {
        enabled: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: integrations
    });
  } catch (error) {
    console.error('Integrations error:', error);
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

    // Create integration as API connector
    const integration = await prisma.aPIConnector.create({
      data: {
        name: body.name,
        type: body.type || 'integration',
        endpoint: body.endpoint,
        config: body.config || {},
        status: 'active',
        enabled: true,
        syncInterval: body.syncInterval || 300
      }
    });

    return NextResponse.json({
      success: true,
      data: integration
    });
  } catch (error) {
    console.error('Integration creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
