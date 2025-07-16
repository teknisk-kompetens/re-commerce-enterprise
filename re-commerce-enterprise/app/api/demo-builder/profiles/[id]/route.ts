
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/demo-builder/profiles/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.demoProfile.findUnique({
      where: { id: params.id },
      include: {
        executions: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        analytics: {
          take: 5,
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Demo profile not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const formattedProfile = {
      ...profile,
      painPoints: typeof profile.painPoints === 'string' 
        ? JSON.parse(profile.painPoints) 
        : profile.painPoints,
      focusAreas: typeof profile.focusAreas === 'string' 
        ? JSON.parse(profile.focusAreas) 
        : profile.focusAreas,
      personalization: typeof profile.personalization === 'string' 
        ? JSON.parse(profile.personalization) 
        : profile.personalization,
      slides: typeof profile.slides === 'string' 
        ? JSON.parse(profile.slides) 
        : profile.slides,
      workflows: typeof profile.workflows === 'string' 
        ? JSON.parse(profile.workflows) 
        : profile.workflows
    };

    return NextResponse.json(formattedProfile);
  } catch (error) {
    console.error('Error fetching demo profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo profile' },
      { status: 500 }
    );
  }
}

// PUT /api/demo-builder/profiles/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const profile = await prisma.demoProfile.update({
      where: { id: params.id },
      data: {
        ...data,
        painPoints: JSON.stringify(data.painPoints || []),
        focusAreas: JSON.stringify(data.focusAreas || []),
        personalization: JSON.stringify(data.personalization || {}),
        slides: JSON.stringify(data.slides || []),
        workflows: JSON.stringify(data.workflows || []),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating demo profile:', error);
    return NextResponse.json(
      { error: 'Failed to update demo profile' },
      { status: 500 }
    );
  }
}

// DELETE /api/demo-builder/profiles/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.demoProfile.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting demo profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete demo profile' },
      { status: 500 }
    );
  }
}
