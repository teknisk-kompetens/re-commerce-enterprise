
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/global-payments/currencies - Get all currencies with exchange rates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const tenantId = searchParams.get('tenantId');
    const includeRates = searchParams.get('includeRates') === 'true';

    const currencies = await prisma.currency.findMany({
      where: {
        ...(active === 'true' && { isActive: true }),
      },
      include: {
        tenantCurrencies: tenantId ? {
          where: { tenantId }
        } : false,
        paymentMethods: {
          select: { id: true, name: true, code: true, type: true }
        },
        priceLocalizations: {
          select: { id: true, productType: true, localizedPrice: true }
        },
        ...(includeRates && {
          exchangeRateHistory: {
            orderBy: { timestamp: 'desc' },
            take: 1
          }
        }),
        marketRegions: {
          select: { id: true, name: true, code: true }
        }
      },
      orderBy: [
        { isBaseCurrency: 'desc' },
        { code: 'asc' }
      ]
    });

    // Add real-time exchange rates if requested
    const currenciesWithRates = currencies.map(currency => {
      const latestRate = currency.exchangeRateHistory?.[0];
      return {
        ...currency,
        currentExchangeRate: latestRate?.rate || currency.exchangeRate,
        lastRateUpdate: latestRate?.timestamp || currency.lastUpdated,
        isConfiguredForTenant: tenantId ? currency.tenantCurrencies?.length > 0 : undefined
      };
    });

    return NextResponse.json({
      success: true,
      data: currenciesWithRates,
      baseCurrency: currenciesWithRates.find(c => c.isBaseCurrency),
      count: currenciesWithRates.length
    });

  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch currencies' },
      { status: 500 }
    );
  }
}

// POST /api/global-payments/currencies - Create new currency
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      code,
      name,
      symbol,
      symbolPosition = "before",
      decimalPlaces = 2,
      decimalSeparator = ".",
      thousandsSeparator = ",",
      exchangeRate,
      isBaseCurrency = false,
      isActive = true,
      isCrypto = false
    } = body;

    // Validate required fields
    if (!code || !name || !symbol) {
      return NextResponse.json(
        { success: false, error: 'Code, name, and symbol are required' },
        { status: 400 }
      );
    }

    // Check if currency already exists
    const existing = await prisma.currency.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Currency with this code already exists' },
        { status: 409 }
      );
    }

    // If this is set as base currency, unset others
    if (isBaseCurrency) {
      await prisma.currency.updateMany({
        where: { isBaseCurrency: true },
        data: { isBaseCurrency: false }
      });
    }

    const currency = await prisma.currency.create({
      data: {
        code,
        name,
        symbol,
        symbolPosition,
        decimalPlaces,
        decimalSeparator,
        thousandsSeparator,
        exchangeRate,
        isBaseCurrency,
        isActive,
        isCrypto,
        lastUpdated: exchangeRate ? new Date() : null
      },
      include: {
        paymentMethods: true,
        priceLocalizations: true,
        marketRegions: true
      }
    });

    // Create initial exchange rate history entry if rate provided
    if (exchangeRate) {
      await prisma.exchangeRateHistory.create({
        data: {
          currencyId: currency.id,
          rate: exchangeRate,
          baseCurrency: "USD",
          provider: "manual",
          timestamp: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: currency,
      message: 'Currency created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating currency:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create currency' },
      { status: 500 }
    );
  }
}

// PUT /api/global-payments/currencies - Update currency
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currencyId = searchParams.get('id');
    
    if (!currencyId) {
      return NextResponse.json(
        { success: false, error: 'Currency ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // If setting as base currency, unset others
    if (body.isBaseCurrency) {
      await prisma.currency.updateMany({
        where: { 
          isBaseCurrency: true,
          id: { not: currencyId }
        },
        data: { isBaseCurrency: false }
      });
    }

    // Handle exchange rate update
    let updateData = { ...body };
    if (body.exchangeRate) {
      updateData.lastUpdated = new Date();
      
      // Create new exchange rate history entry
      await prisma.exchangeRateHistory.create({
        data: {
          currencyId,
          rate: body.exchangeRate,
          baseCurrency: "USD",
          provider: "manual",
          timestamp: new Date()
        }
      });
    }

    const currency = await prisma.currency.update({
      where: { id: currencyId },
      data: updateData,
      include: {
        paymentMethods: true,
        priceLocalizations: true,
        marketRegions: true,
        exchangeRateHistory: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: currency,
      message: 'Currency updated successfully'
    });

  } catch (error) {
    console.error('Error updating currency:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update currency' },
      { status: 500 }
    );
  }
}

// DELETE /api/global-payments/currencies - Delete currency
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currencyId = searchParams.get('id');
    
    if (!currencyId) {
      return NextResponse.json(
        { success: false, error: 'Currency ID is required' },
        { status: 400 }
      );
    }

    // Check if currency is in use
    const usage = await prisma.currency.findUnique({
      where: { id: currencyId },
      include: {
        tenantCurrencies: true,
        paymentMethods: true,
        priceLocalizations: true,
        marketRegions: true
      }
    });

    if (usage && (
      usage.tenantCurrencies.length > 0 || 
      usage.paymentMethods.length > 0 || 
      usage.priceLocalizations.length > 0 ||
      usage.marketRegions.length > 0
    )) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete currency that is in use' },
        { status: 409 }
      );
    }

    // Check if this is the base currency
    if (usage?.isBaseCurrency) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete base currency' },
        { status: 409 }
      );
    }

    await prisma.currency.delete({
      where: { id: currencyId }
    });

    return NextResponse.json({
      success: true,
      message: 'Currency deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting currency:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete currency' },
      { status: 500 }
    );
  }
}
