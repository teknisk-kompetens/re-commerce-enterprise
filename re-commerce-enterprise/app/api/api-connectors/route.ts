
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

    // Use APIConnector model (correct casing)
    const apiConnectors = await prisma.aPIConnector.findMany({
      where: {
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: apiConnectors
    });
  } catch (error) {
    console.error('API Connectors error:', error);
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

    // Create API connector with correct model name
    const apiConnector = await prisma.aPIConnector.create({
      data: {
        name: body.name,
        type: body.type,
        endpoint: body.endpoint,
        config: body.config || {},
        status: 'active',
        enabled: true,
        syncInterval: body.syncInterval || 300
      }
    });

    return NextResponse.json({
      success: true,
      data: apiConnector
    });
  } catch (error) {
    console.error('API Connector creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
