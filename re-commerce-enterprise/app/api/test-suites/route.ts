
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

    // Use IntegrationTest model for test suites
    const testSuites = await prisma.integrationTest.findMany({
      where: {
        type: 'test_suite'
      },
      take: 50,
      orderBy: { executedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: testSuites
    });
  } catch (error) {
    console.error('Test suites error:', error);
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

    // Create test suite as integration test
    const testSuite = await prisma.integrationTest.create({
      data: {
        name: body.name || 'Test Suite',
        type: 'test_suite',
        status: 'pending',
        config: body.config || {},
        executedBy: session.user.id,
        success: false,
        errors: []
      }
    });

    return NextResponse.json({
      success: true,
      data: testSuite
    });
  } catch (error) {
    console.error('Test suite creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
