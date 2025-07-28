
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Skip database operations during build process
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use SystemConfig model for training modules
    const trainingModules = await prisma.systemConfig.findMany({
      where: {
        category: 'training'
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: trainingModules.map(module => ({
        id: module.id,
        key: module.key,
        content: module.value,
        category: module.category,
        updatedAt: module.updatedAt,
        updatedBy: module.updatedBy
      }))
    });
  } catch (error) {
    console.error('Training modules error:', error);
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

    // Create training module as system config
    const trainingModule = await prisma.systemConfig.create({
      data: {
        key: body.key,
        value: body.content || {},
        category: 'training',
        encrypted: false,
        updatedBy: session.user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: trainingModule
    });
  } catch (error) {
    console.error('Training module creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
