
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

    // Use IntegrationTest model for deployment validations
    const deploymentValidations = await prisma.integrationTest.findMany({
      where: {
        type: 'deployment_validation'
      },
      take: 50,
      orderBy: { executedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: deploymentValidations
    });
  } catch (error) {
    console.error('Deployment validations error:', error);
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

    // Create deployment validation as integration test
    const deploymentValidation = await prisma.integrationTest.create({
      data: {
        name: body.name || 'Deployment Validation',
        type: 'deployment_validation',
        status: 'pending',
        config: body.config || {},
        executedBy: session.user.id,
        success: false,
        errors: []
      }
    });

    return NextResponse.json({
      success: true,
      data: deploymentValidation
    });
  } catch (error) {
    console.error('Deployment validation creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
