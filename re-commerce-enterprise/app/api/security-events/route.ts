
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

    // Use SecurityEvent model
    const securityEvents = await prisma.securityEvent.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: securityEvents
    });
  } catch (error) {
    console.error('Security events error:', error);
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

    // Create security event
    const securityEvent = await prisma.securityEvent.create({
      data: {
        source: body.source || 'system',
        type: body.type || 'unknown',
        category: body.category || 'security',
        severity: body.severity || 'medium',
        description: body.description || 'Security event detected',
        actor: body.actor || session.user.id,
        target: body.target || 'system',
        outcome: body.outcome || 'unknown',
        ipAddress: body.ipAddress || 'unknown',
        userAgent: body.userAgent || 'unknown',
        location: body.location,
        metadata: body.metadata || {},
        correlated: false,
        investigationStatus: 'none'
      }
    });

    return NextResponse.json({
      success: true,
      data: securityEvent
    });
  } catch (error) {
    console.error('Security event creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
