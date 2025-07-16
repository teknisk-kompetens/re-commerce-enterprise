
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// POST /api/demo-builder/personalization-profiles
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const profile = await prisma.userPersonalizationProfile.create({
      data: {
        ...data,
        painPoints: JSON.stringify(data.painPoints || []),
        focusAreas: JSON.stringify(data.focusAreas || []),
        interests: JSON.stringify(data.interests || []),
        previousDemos: JSON.stringify(data.previousDemos || []),
        preferences: JSON.stringify(data.preferences || {}),
        aiProfile: JSON.stringify(data.aiProfile || {})
      }
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating personalization profile:', error);
    return NextResponse.json(
      { error: 'Failed to create personalization profile' },
      { status: 500 }
    );
  }
}

// GET /api/demo-builder/personalization-profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    if (userId) where.userId = userId;

    const profiles = await prisma.userPersonalizationProfile.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
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
      interests: typeof profile.interests === 'string' 
        ? JSON.parse(profile.interests) 
        : profile.interests,
      previousDemos: typeof profile.previousDemos === 'string' 
        ? JSON.parse(profile.previousDemos) 
        : profile.previousDemos,
      preferences: typeof profile.preferences === 'string' 
        ? JSON.parse(profile.preferences) 
        : profile.preferences,
      aiProfile: typeof profile.aiProfile === 'string' 
        ? JSON.parse(profile.aiProfile) 
        : profile.aiProfile
    }));

    return NextResponse.json(formattedProfiles);
  } catch (error) {
    console.error('Error fetching personalization profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personalization profiles' },
      { status: 500 }
    );
  }
}
