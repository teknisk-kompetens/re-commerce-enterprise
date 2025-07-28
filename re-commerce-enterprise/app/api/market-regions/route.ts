
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/market-regions - Get all market regions with configurations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const tenantId = searchParams.get('tenantId');
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';

    const marketRegions = await prisma.marketRegion.findMany({
      where: {
        ...(active === 'true' && { isActive: true }),
      },
      include: {
        language: {
          select: {
            id: true,
            code: true,
            name: true,
            nativeName: true,
            isRTL: true
          }
        },
        currency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
            exchangeRate: true
          }
        },
        tenantRegions: tenantId ? {
          where: { tenantId }
        } : false,
        paymentMethods: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            code: true,
            type: true,
            supportedCurrencies: true
          }
        },
        culturalCustomizations: {
          select: {
            id: true,
            colorScheme: true,
            layoutDirection: true,
            communicationStyle: true,
            contentTone: true
          }
        },
        ...(includeAnalytics && {
          marketAnalytics: {
            where: {
              timestamp: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            },
            orderBy: { timestamp: 'desc' },
            take: 100
          }
        })
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]
    });

    // Add region statistics
    const regionsWithStats = await Promise.all(
      marketRegions.map(async (region) => {
        const stats = await prisma.marketAnalytics.aggregate({
          where: {
            marketRegionId: region.id,
            timestamp: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          _avg: { value: true },
          _sum: { value: true },
          _count: { id: true }
        });

        return {
          ...region,
          statistics: {
            averageValue: stats._avg.value || 0,
            totalValue: stats._sum.value || 0,
            dataPoints: stats._count.id,
            isConfiguredForTenant: tenantId ? region.tenantRegions?.length > 0 : undefined,
            paymentMethodsCount: region.paymentMethods.length,
            hasCustomizations: region.culturalCustomizations.length > 0
          }
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: regionsWithStats,
      summary: {
        totalRegions: regionsWithStats.length,
        activeRegions: regionsWithStats.filter(r => r.isActive).length,
        languagesCovered: [...new Set(regionsWithStats.map(r => r.language.code))],
        currenciesCovered: [...new Set(regionsWithStats.map(r => r.currency.code))],
        countriesCovered: regionsWithStats.reduce((acc, r) => acc + r.countries.length, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching market regions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market regions' },
      { status: 500 }
    );
  }
}

// POST /api/market-regions - Create new market region
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      code,
      name,
      description,
      countries = [],
      timezones = [],
      languageId,
      currencyId,
      businessHours = {},
      holidays = [],
      workingDays = ["monday", "tuesday", "wednesday", "thursday", "friday"],
      culturalNorms = {},
      colorScheme = {},
      isActive = true,
      priority = 0
    } = body;

    // Validate required fields
    if (!code || !name || !languageId || !currencyId) {
      return NextResponse.json(
        { success: false, error: 'Code, name, language, and currency are required' },
        { status: 400 }
      );
    }

    // Check if region code already exists
    const existing = await prisma.marketRegion.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Market region with this code already exists' },
        { status: 409 }
      );
    }

    const marketRegion = await prisma.marketRegion.create({
      data: {
        code,
        name,
        description,
        countries,
        timezones,
        languageId,
        currencyId,
        businessHours,
        holidays,
        workingDays,
        culturalNorms,
        colorScheme,
        isActive,
        priority
      },
      include: {
        language: {
          select: { code: true, name: true, nativeName: true }
        },
        currency: {
          select: { code: true, name: true, symbol: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: marketRegion,
      message: 'Market region created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating market region:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create market region' },
      { status: 500 }
    );
  }
}

// PUT /api/market-regions - Update market region
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('id');
    
    if (!regionId) {
      return NextResponse.json(
        { success: false, error: 'Region ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const marketRegion = await prisma.marketRegion.update({
      where: { id: regionId },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        language: {
          select: { code: true, name: true, nativeName: true }
        },
        currency: {
          select: { code: true, name: true, symbol: true }
        },
        paymentMethods: true,
        culturalCustomizations: true
      }
    });

    return NextResponse.json({
      success: true,
      data: marketRegion,
      message: 'Market region updated successfully'
    });

  } catch (error) {
    console.error('Error updating market region:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update market region' },
      { status: 500 }
    );
  }
}

// DELETE /api/market-regions - Delete market region
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('id');
    
    if (!regionId) {
      return NextResponse.json(
        { success: false, error: 'Region ID is required' },
        { status: 400 }
      );
    }

    // Check if region is in use
    const usage = await prisma.marketRegion.findUnique({
      where: { id: regionId },
      include: {
        tenantRegions: true,
        paymentMethods: true,
        marketAnalytics: true,
        culturalCustomizations: true
      }
    });

    if (usage && (
      usage.tenantRegions.length > 0 || 
      usage.paymentMethods.length > 0 || 
      usage.marketAnalytics.length > 0 ||
      usage.culturalCustomizations.length > 0
    )) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete market region that is in use' },
        { status: 409 }
      );
    }

    await prisma.marketRegion.delete({
      where: { id: regionId }
    });

    return NextResponse.json({
      success: true,
      message: 'Market region deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting market region:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete market region' },
      { status: 500 }
    );
  }
}
