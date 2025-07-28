
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/cultural-customization - Get cultural customizations by region
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId');
    const active = searchParams.get('active');

    const where: any = {};
    if (regionId) where.marketRegionId = regionId;
    if (active === 'true') where.isActive = true;

    const customizations = await prisma.culturalCustomization.findMany({
      where,
      include: {
        marketRegion: {
          select: {
            id: true,
            code: true,
            name: true,
            countries: true,
            language: {
              select: { code: true, name: true, nativeName: true, isRTL: true }
            },
            currency: {
              select: { code: true, name: true, symbol: true }
            }
          }
        }
      },
      orderBy: { marketRegion: { name: 'asc' } }
    });

    // Group customizations by region for easier consumption
    const customizationsByRegion = customizations.reduce((acc, customization) => {
      const regionCode = customization.marketRegion.code;
      acc[regionCode] = customization;
      return acc;
    }, {} as any);

    return NextResponse.json({
      success: true,
      data: {
        byRegion: customizationsByRegion,
        all: customizations
      },
      summary: {
        totalCustomizations: customizations.length,
        activeCustomizations: customizations.filter(c => c.isActive).length,
        regionsCovered: Object.keys(customizationsByRegion).length,
        rtlRegions: customizations.filter(c => c.layoutDirection === 'rtl').length,
        communicationStyles: [...new Set(customizations.map(c => c.communicationStyle))]
      }
    });

  } catch (error) {
    console.error('Error fetching cultural customizations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cultural customizations' },
      { status: 500 }
    );
  }
}

// POST /api/cultural-customization - Create cultural customization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      marketRegionId,
      colorScheme = {},
      typography = {},
      layoutDirection = "ltr",
      iconSet = "default",
      communicationStyle = "direct",
      decisionMaking = "individual",
      timeOrientation = "linear",
      businessEtiquette = {},
      meetingStyle = {},
      negotiationStyle = {},
      contentTone = "professional",
      imagePreferences = {},
      videoPreferences = {},
      userFlow = {},
      featurePriority = {},
      defaultSettings = {},
      isActive = true
    } = body;

    // Validate required fields
    if (!marketRegionId) {
      return NextResponse.json(
        { success: false, error: 'Market region ID is required' },
        { status: 400 }
      );
    }

    // Check if customization already exists for this region
    const existing = await prisma.culturalCustomization.findUnique({
      where: { marketRegionId }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Cultural customization already exists for this region' },
        { status: 409 }
      );
    }

    const customization = await prisma.culturalCustomization.create({
      data: {
        marketRegionId,
        colorScheme,
        typography,
        layoutDirection,
        iconSet,
        communicationStyle,
        decisionMaking,
        timeOrientation,
        businessEtiquette,
        meetingStyle,
        negotiationStyle,
        contentTone,
        imagePreferences,
        videoPreferences,
        userFlow,
        featurePriority,
        defaultSettings,
        isActive
      },
      include: {
        marketRegion: {
          select: {
            code: true,
            name: true,
            countries: true,
            language: { select: { code: true, name: true } },
            currency: { select: { code: true, name: true } }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: customization,
      message: 'Cultural customization created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating cultural customization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create cultural customization' },
      { status: 500 }
    );
  }
}

// PUT /api/cultural-customization - Update cultural customization
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customizationId = searchParams.get('id');
    
    if (!customizationId) {
      return NextResponse.json(
        { success: false, error: 'Customization ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const customization = await prisma.culturalCustomization.update({
      where: { id: customizationId },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        marketRegion: {
          select: {
            code: true,
            name: true,
            countries: true,
            language: { select: { code: true, name: true } },
            currency: { select: { code: true, name: true } }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: customization,
      message: 'Cultural customization updated successfully'
    });

  } catch (error) {
    console.error('Error updating cultural customization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cultural customization' },
      { status: 500 }
    );
  }
}

// DELETE /api/cultural-customization - Delete cultural customization
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customizationId = searchParams.get('id');
    
    if (!customizationId) {
      return NextResponse.json(
        { success: false, error: 'Customization ID is required' },
        { status: 400 }
      );
    }

    await prisma.culturalCustomization.delete({
      where: { id: customizationId }
    });

    return NextResponse.json({
      success: true,
      message: 'Cultural customization deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting cultural customization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete cultural customization' },
      { status: 500 }
    );
  }
}
