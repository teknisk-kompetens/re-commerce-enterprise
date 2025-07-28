
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/i18n/languages - Get all languages with translation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const tenantId = searchParams.get('tenantId');

    const languages = await prisma.language.findMany({
      where: {
        ...(active === 'true' && { isActive: true }),
      },
      include: {
        translations: {
          select: { id: true, status: true },
        },
        tenantLanguages: tenantId ? {
          where: { tenantId }
        } : false,
        marketRegions: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]
    });

    // Calculate translation completeness
    const languagesWithStats = languages.map(language => {
      const totalTranslations = language.translations.length;
      const approvedTranslations = language.translations.filter(t => t.status === 'approved').length;
      const completeness = totalTranslations > 0 ? (approvedTranslations / totalTranslations) * 100 : 0;

      return {
        ...language,
        translationStats: {
          total: totalTranslations,
          approved: approvedTranslations,
          completeness: Math.round(completeness * 100) / 100
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: languagesWithStats,
      count: languagesWithStats.length
    });

  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

// POST /api/i18n/languages - Create new language
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      code,
      name,
      nativeName,
      isRTL = false,
      isActive = true,
      priority = 0,
      region,
      country,
      dateFormat = "MM/dd/yyyy",
      timeFormat = "HH:mm",
      numberFormat = {},
      currencyPosition = "before"
    } = body;

    // Validate required fields
    if (!code || !name || !nativeName) {
      return NextResponse.json(
        { success: false, error: 'Code, name, and native name are required' },
        { status: 400 }
      );
    }

    // Check if language already exists
    const existing = await prisma.language.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Language with this code already exists' },
        { status: 409 }
      );
    }

    const language = await prisma.language.create({
      data: {
        code,
        name,
        nativeName,
        isRTL,
        isActive,
        priority,
        region,
        country,
        dateFormat,
        timeFormat,
        numberFormat,
        currencyPosition,
        completeness: 0,
        lastUpdated: new Date()
      },
      include: {
        translations: true,
        tenantLanguages: true,
        marketRegions: true
      }
    });

    return NextResponse.json({
      success: true,
      data: language,
      message: 'Language created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create language' },
      { status: 500 }
    );
  }
}

// PUT /api/i18n/languages - Update language
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('id');
    
    if (!languageId) {
      return NextResponse.json(
        { success: false, error: 'Language ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const language = await prisma.language.update({
      where: { id: languageId },
      data: {
        ...body,
        lastUpdated: new Date()
      },
      include: {
        translations: true,
        tenantLanguages: true,
        marketRegions: true
      }
    });

    return NextResponse.json({
      success: true,
      data: language,
      message: 'Language updated successfully'
    });

  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update language' },
      { status: 500 }
    );
  }
}

// DELETE /api/i18n/languages - Delete language
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const languageId = searchParams.get('id');
    
    if (!languageId) {
      return NextResponse.json(
        { success: false, error: 'Language ID is required' },
        { status: 400 }
      );
    }

    // Check if language is in use
    const usage = await prisma.language.findUnique({
      where: { id: languageId },
      include: {
        translations: true,
        tenantLanguages: true,
        userPreferences: true
      }
    });

    if (usage && (usage.translations.length > 0 || usage.tenantLanguages.length > 0 || usage.userPreferences.length > 0)) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete language that is in use' },
        { status: 409 }
      );
    }

    await prisma.language.delete({
      where: { id: languageId }
    });

    return NextResponse.json({
      success: true,
      message: 'Language deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting language:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete language' },
      { status: 500 }
    );
  }
}
