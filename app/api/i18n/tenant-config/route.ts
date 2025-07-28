
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/i18n/tenant-config - Get tenant language configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const tenantLanguages = await prisma.tenantLanguage.findMany({
      where: { tenantId },
      include: {
        language: {
          select: {
            id: true,
            code: true,
            name: true,
            nativeName: true,
            isRTL: true,
            dateFormat: true,
            timeFormat: true,
            numberFormat: true,
            currencyPosition: true,
            completeness: true
          }
        }
      },
      orderBy: [
        { isDefault: 'desc' },
        { priority: 'desc' },
        { language: { name: 'asc' } }
      ]
    });

    // Get translation statistics for tenant's languages
    const languageIds = tenantLanguages.map(tl => tl.languageId);
    const translationStats = await prisma.translation.groupBy({
      by: ['languageId', 'status'],
      where: {
        languageId: { in: languageIds }
      },
      _count: {
        id: true
      }
    });

    // Group stats by language
    const statsByLanguage = translationStats.reduce((acc, stat) => {
      if (!acc[stat.languageId]) {
        acc[stat.languageId] = { total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      acc[stat.languageId][stat.status] = stat._count.id;
      acc[stat.languageId].total += stat._count.id;
      return acc;
    }, {} as any);

    // Add stats to tenant languages
    const enrichedTenantLanguages = tenantLanguages.map(tl => ({
      ...tl,
      translationStats: statsByLanguage[tl.languageId] || { total: 0, approved: 0, pending: 0, rejected: 0 }
    }));

    return NextResponse.json({
      success: true,
      data: enrichedTenantLanguages,
      summary: {
        totalLanguages: tenantLanguages.length,
        defaultLanguage: tenantLanguages.find(tl => tl.isDefault),
        activeLanguages: tenantLanguages.filter(tl => tl.isActive).length
      }
    });

  } catch (error) {
    console.error('Error fetching tenant language config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenant language configuration' },
      { status: 500 }
    );
  }
}

// POST /api/i18n/tenant-config - Add language to tenant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      languageId,
      isDefault = false,
      isActive = true,
      priority = 0,
      customizations = {},
      dateFormat,
      timeFormat,
      numberFormat,
      currencyFormat
    } = body;

    if (!tenantId || !languageId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID and Language ID are required' },
        { status: 400 }
      );
    }

    // Check if language already exists for tenant
    const existing = await prisma.tenantLanguage.findUnique({
      where: {
        tenantId_languageId: {
          tenantId,
          languageId
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Language already configured for this tenant' },
        { status: 409 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.tenantLanguage.updateMany({
        where: { tenantId },
        data: { isDefault: false }
      });
    }

    const tenantLanguage = await prisma.tenantLanguage.create({
      data: {
        tenantId,
        languageId,
        isDefault,
        isActive,
        priority,
        customizations,
        dateFormat,
        timeFormat,
        numberFormat,
        currencyFormat,
        translationStatus: 'incomplete',
        completeness: 0
      },
      include: {
        language: {
          select: {
            code: true,
            name: true,
            nativeName: true,
            isRTL: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: tenantLanguage,
      message: 'Language added to tenant successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding language to tenant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add language to tenant' },
      { status: 500 }
    );
  }
}

// PUT /api/i18n/tenant-config - Update tenant language configuration
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantLanguageId = searchParams.get('id');
    
    if (!tenantLanguageId) {
      return NextResponse.json(
        { success: false, error: 'Tenant Language ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // If setting as default, unset other defaults for this tenant
    if (body.isDefault) {
      const tenantLanguage = await prisma.tenantLanguage.findUnique({
        where: { id: tenantLanguageId },
        select: { tenantId: true }
      });
      
      if (tenantLanguage) {
        await prisma.tenantLanguage.updateMany({
          where: { 
            tenantId: tenantLanguage.tenantId,
            id: { not: tenantLanguageId }
          },
          data: { isDefault: false }
        });
      }
    }

    const updatedTenantLanguage = await prisma.tenantLanguage.update({
      where: { id: tenantLanguageId },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        language: {
          select: {
            code: true,
            name: true,
            nativeName: true,
            isRTL: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTenantLanguage,
      message: 'Tenant language configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating tenant language config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tenant language configuration' },
      { status: 500 }
    );
  }
}

// DELETE /api/i18n/tenant-config - Remove language from tenant
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantLanguageId = searchParams.get('id');
    
    if (!tenantLanguageId) {
      return NextResponse.json(
        { success: false, error: 'Tenant Language ID is required' },
        { status: 400 }
      );
    }

    // Check if this is the default language
    const tenantLanguage = await prisma.tenantLanguage.findUnique({
      where: { id: tenantLanguageId },
      select: { isDefault: true, tenantId: true }
    });

    if (tenantLanguage?.isDefault) {
      // Check if there are other languages for this tenant
      const otherLanguages = await prisma.tenantLanguage.count({
        where: {
          tenantId: tenantLanguage.tenantId,
          id: { not: tenantLanguageId }
        }
      });

      if (otherLanguages === 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot remove the only language configured for this tenant' },
          { status: 409 }
        );
      }
    }

    await prisma.tenantLanguage.delete({
      where: { id: tenantLanguageId }
    });

    return NextResponse.json({
      success: true,
      message: 'Language removed from tenant successfully'
    });

  } catch (error) {
    console.error('Error removing language from tenant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove language from tenant' },
      { status: 500 }
    );
  }
}
