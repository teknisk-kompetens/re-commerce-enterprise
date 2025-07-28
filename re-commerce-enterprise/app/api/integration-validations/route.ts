
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

    // Use IntegrationTest model for integration validations
    const integrationValidations = await prisma.integrationTest.findMany({
      where: {
        type: 'integration_validation'
      },
      take: 50,
      orderBy: { executedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: integrationValidations
    });
  } catch (error) {
    console.error('Integration validations error:', error);
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

    // Create integration validation as integration test
    const integrationValidation = await prisma.integrationTest.create({
      data: {
        name: body.name || 'Integration Validation',
        type: 'integration_validation',
        status: 'pending',
        config: body.config || {},
        executedBy: session.user.id,
        success: false,
        errors: []
      }
    });

    return NextResponse.json({
      success: true,
      data: integrationValidation
    });
  } catch (error) {
    console.error('Integration validation creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
