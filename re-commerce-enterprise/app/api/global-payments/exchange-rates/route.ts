
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/global-payments/exchange-rates - Get exchange rate history and current rates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currencyId = searchParams.get('currencyId');
    const days = parseInt(searchParams.get('days') || '30');
    const provider = searchParams.get('provider');

    const where: any = {};
    if (currencyId) where.currencyId = currencyId;
    if (provider) where.provider = provider;

    // Get historical rates
    const historicalRates = await prisma.exchangeRateHistory.findMany({
      where: {
        ...where,
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        currency: {
          select: { code: true, name: true, symbol: true }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Get current rates (latest for each currency)
    const currentRates = await prisma.exchangeRateHistory.findMany({
      where: where,
      include: {
        currency: {
          select: { code: true, name: true, symbol: true, isBaseCurrency: true }
        }
      },
      orderBy: { timestamp: 'desc' },
      distinct: ['currencyId']
    });

    // Calculate rate changes
    const ratesWithChanges = await Promise.all(
      currentRates.map(async (current) => {
        const previous = await prisma.exchangeRateHistory.findFirst({
          where: {
            currencyId: current.currencyId,
            timestamp: {
              lt: current.timestamp,
              gte: new Date(current.timestamp.getTime() - 24 * 60 * 60 * 1000)
            }
          },
          orderBy: { timestamp: 'desc' }
        });

        const change = previous ? current.rate - previous.rate : 0;
        const changePercent = previous ? ((change / previous.rate) * 100) : 0;

        return {
          ...current,
          previousRate: previous?.rate,
          change,
          changePercent,
          trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        current: ratesWithChanges,
        historical: historicalRates,
        summary: {
          totalCurrencies: currentRates.length,
          lastUpdated: currentRates[0]?.timestamp,
          baseCurrency: currentRates.find(r => r.currency.isBaseCurrency)?.currency.code || 'USD'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}

// POST /api/global-payments/exchange-rates - Update exchange rates (manual or from provider)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rates, provider = 'manual', baseCurrency = 'USD' } = body;

    if (!rates || !Array.isArray(rates)) {
      return NextResponse.json(
        { success: false, error: 'Rates array is required' },
        { status: 400 }
      );
    }

    const timestamp = new Date();
    const createdRates = [];

    for (const rateData of rates) {
      const { currencyCode, rate } = rateData;
      
      if (!currencyCode || !rate) {
        continue;
      }

      // Find currency by code
      const currency = await prisma.currency.findUnique({
        where: { code: currencyCode }
      });

      if (!currency) {
        console.warn(`Currency ${currencyCode} not found, skipping`);
        continue;
      }

      // Create exchange rate history entry
      const exchangeRate = await prisma.exchangeRateHistory.create({
        data: {
          currencyId: currency.id,
          rate,
          baseCurrency,
          provider,
          timestamp
        }
      });

      // Update currency with latest rate
      await prisma.currency.update({
        where: { id: currency.id },
        data: {
          exchangeRate: rate,
          lastUpdated: timestamp
        }
      });

      createdRates.push({
        ...exchangeRate,
        currency: { code: currency.code, name: currency.name }
      });
    }

    return NextResponse.json({
      success: true,
      data: createdRates,
      message: `Updated ${createdRates.length} exchange rates`
    }, { status: 201 });

  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update exchange rates' },
      { status: 500 }
    );
  }
}

// PUT /api/global-payments/exchange-rates - Fetch rates from external provider
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider = 'fixer', apiKey, baseCurrency = 'USD' } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required for external provider' },
        { status: 400 }
      );
    }

    // Simulate external API call (in real implementation, call actual service)
    // This would integrate with services like Fixer.io, CurrencyLayer, etc.
    const mockRates = {
      'EUR': 0.85,
      'GBP': 0.73,
      'SEK': 10.45,
      'NOK': 10.89,
      'DKK': 6.36,
      'JPY': 110.25,
      'CNY': 6.45,
      'CAD': 1.25,
      'AUD': 1.35,
      'CHF': 0.92,
      'BRL': 5.20,
      'INR': 74.50
    };

    const timestamp = new Date();
    const updatedRates = [];

    for (const [currencyCode, rate] of Object.entries(mockRates)) {
      const currency = await prisma.currency.findUnique({
        where: { code: currencyCode }
      });

      if (currency) {
        // Create exchange rate history entry
        const exchangeRate = await prisma.exchangeRateHistory.create({
          data: {
            currencyId: currency.id,
            rate: rate as number,
            baseCurrency,
            provider,
            timestamp
          }
        });

        // Update currency with latest rate
        await prisma.currency.update({
          where: { id: currency.id },
          data: {
            exchangeRate: rate as number,
            lastUpdated: timestamp
          }
        });

        updatedRates.push({
          ...exchangeRate,
          currency: { code: currency.code, name: currency.name }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedRates,
      message: `Fetched and updated ${updatedRates.length} exchange rates from ${provider}`,
      metadata: {
        provider,
        baseCurrency,
        timestamp,
        source: 'external_api'
      }
    });

  } catch (error) {
    console.error('Error fetching external exchange rates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch external exchange rates' },
      { status: 500 }
    );
  }
}
