
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

    // Use IntegrationTest model for production readiness checklist
    const productionReadinessChecklist = await prisma.integrationTest.findMany({
      where: {
        type: 'production_readiness'
      },
      take: 50,
      orderBy: { executedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: productionReadinessChecklist
    });
  } catch (error) {
    console.error('Production readiness error:', error);
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

    // Create production readiness checklist as integration test
    const productionReadinessChecklist = await prisma.integrationTest.create({
      data: {
        name: body.name || 'Production Readiness Check',
        type: 'production_readiness',
        status: 'pending',
        config: body.config || {},
        executedBy: session.user.id,
        success: false,
        errors: []
      }
    });

    return NextResponse.json({
      success: true,
      data: productionReadinessChecklist
    });
  } catch (error) {
    console.error('Production readiness creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
