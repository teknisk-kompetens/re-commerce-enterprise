
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

    // Use ThreatEvent model for threat detection
    const threatDetections = await prisma.threatEvent.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: threatDetections
    });
  } catch (error) {
    console.error('Threat detection error:', error);
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

    // Create threat detection as threat event
    const threatDetection = await prisma.threatEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        type: body.type || 'unknown',
        severity: body.severity || 'medium',
        source: body.source || 'system',
        destination: body.destination || 'unknown',
        description: body.description || 'Threat detected',
        mitigation: body.mitigation || 'none',
        status: 'active'
      }
    });

    return NextResponse.json({
      success: true,
      data: threatDetection
    });
  } catch (error) {
    console.error('Threat detection creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
