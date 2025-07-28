
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

    // Use IntegrationTest model for integration executions
    const integrationExecutions = await prisma.integrationTest.findMany({
      where: {
        type: 'integration_execution'
      },
      take: 50,
      orderBy: { executedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: integrationExecutions
    });
  } catch (error) {
    console.error('Integration executions error:', error);
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

    // Create integration execution as integration test
    const integrationExecution = await prisma.integrationTest.create({
      data: {
        name: body.name || 'Integration Execution',
        type: 'integration_execution',
        status: 'pending',
        config: body.config || {},
        executedBy: session.user.id,
        success: false,
        errors: []
      }
    });

    return NextResponse.json({
      success: true,
      data: integrationExecution
    });
  } catch (error) {
    console.error('Integration execution creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
