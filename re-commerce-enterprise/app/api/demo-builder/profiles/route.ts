
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/demo-builder/profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const role = searchParams.get('role');
    const type = searchParams.get('type');

    const where: any = {
      isActive: true
    };

    if (industry) where.industry = industry;
    if (role) where.targetRole = role;
    if (type) where.type = type;

    const profiles = await prisma.demoProfile.findMany({
      where,
      orderBy: [
        { isTemplate: 'desc' },
        { popularity: 'desc' },
        { lastUsed: 'desc' }
      ]
    });

    // Parse JSON fields
    const formattedProfiles = profiles.map(profile => ({
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
    }));

    return NextResponse.json(formattedProfiles);
  } catch (error) {
    console.error('Error fetching demo profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo profiles' },
      { status: 500 }
    );
  }
}

// POST /api/demo-builder/profiles
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const profile = await prisma.demoProfile.create({
      data: {
        ...data,
        painPoints: JSON.stringify(data.painPoints || []),
        focusAreas: JSON.stringify(data.focusAreas || []),
        personalization: JSON.stringify(data.personalization || {}),
        slides: JSON.stringify(data.slides || []),
        workflows: JSON.stringify(data.workflows || []),
        tenantId: data.tenantId || 'default',
        createdBy: data.createdBy || 'system'
      }
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating demo profile:', error);
    return NextResponse.json(
      { error: 'Failed to create demo profile' },
      { status: 500 }
    );
  }
}
