
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tenantId } = await request.json();

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Check if user has access to this tenant
    const user = await prisma.user.findUnique({
      where: { 
        id: session.user.id
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's tenant
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        tenantId: tenantId,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: updatedUser.id,
        tenantId: updatedUser.tenantId,
        tenantName: tenant.name,
        tenantDomain: tenant.domain
      }
    });
  } catch (error) {
    console.error('Tenant switch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
