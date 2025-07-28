
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

    // Use ComplianceAudit model instead of non-existent complianceRecord
    const complianceAudits = await prisma.complianceAudit.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: complianceAudits
    });
  } catch (error) {
    console.error('Compliance error:', error);
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

    // Create compliance audit
    const complianceAudit = await prisma.complianceAudit.create({
      data: {
        standardId: body.standardId,
        requirementId: body.requirementId,
        assessorId: session.user.id,
        assessment: body.assessment || {}
      }
    });

    return NextResponse.json({
      success: true,
      data: complianceAudit
    });
  } catch (error) {
    console.error('Compliance creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
