
/**
 * GDPR DATA REQUEST API
 * API för datasubjektsbegäranden enligt GDPR
 */

import { NextRequest, NextResponse } from 'next/server';
import { GDPRComplianceSystem } from '@/lib/gdpr-compliance-system';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

/**
 * POST - Skicka in datasubjektsbegäran
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      description,
      reason,
      legalBasis,
      requestedData,
      subject,
      subjectId,
      subjectEmail
    } = body;

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: type, description' },
        { status: 400 }
      );
    }

    const validTypes = ['access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

    const result = await GDPRComplianceSystem.submitDataSubjectRequest({
      type,
      requesterId: session.user.id,
      requesterEmail: session.user.email,
      subject: subject || 'self',
      subjectId: subjectId || session.user.id,
      subjectEmail: subjectEmail || session.user.email,
      description,
      reason,
      legalBasis,
      requestedData,
      tenantId: session.user.tenantId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      requestId: result.requestId,
      estimatedCompletion: result.estimatedCompletion,
      message: 'Data subject request submitted successfully'
    });

  } catch (error) {
    console.error('GDPR data request API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit data request' },
      { status: 500 }
    );
  }
}

/**
 * GET - Hämta användarens datasubjektsbegäranden
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    // Hämta användarens begäranden från databas
    const requests = await prisma?.dataSubjectRequest.findMany({
      where: {
        requesterId: session.user.id,
        tenantId: session.user.tenantId,
        ...(status && { status }),
        ...(type && { type })
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        status: true,
        description: true,
        createdAt: true,
        estimatedCompletion: true,
        completedAt: true,
        rejectionReason: true
      }
    }) || [];

    return NextResponse.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('GDPR data request fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data requests' },
      { status: 500 }
    );
  }
}
