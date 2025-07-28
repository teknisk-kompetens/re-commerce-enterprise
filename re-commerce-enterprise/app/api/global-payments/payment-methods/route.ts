
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/global-payments/payment-methods - Get payment methods by region
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId');
    const currencyId = searchParams.get('currencyId');
    const type = searchParams.get('type');
    const active = searchParams.get('active');
    const tenantId = searchParams.get('tenantId');

    const where: any = {};
    if (regionId) where.marketRegionId = regionId;
    if (currencyId) where.currencyId = currencyId;
    if (type) where.type = type;
    if (active === 'true') where.isActive = true;

    const paymentMethods = await prisma.paymentMethod.findMany({
      where,
      include: {
        marketRegion: {
          select: {
            id: true,
            code: true,
            name: true,
            countries: true
          }
        },
        currency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true
          }
        },
        tenantPaymentMethods: tenantId ? {
          where: { tenantId },
          select: {
            id: true,
            isActive: true,
            priority: true,
            customConfig: true,
            dailyLimit: true,
            monthlyLimit: true,
            transactionCount: true,
            totalVolume: true,
            errorCount: true,
            lastUsed: true
          }
        } : false,
        transactions: {
          select: { id: true },
          take: 1
        }
      },
      orderBy: [
        { marketRegion: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    // Group by region for better organization
    const methodsByRegion = paymentMethods.reduce((acc, method) => {
      const regionKey = method.marketRegion.code;
      if (!acc[regionKey]) {
        acc[regionKey] = {
          region: method.marketRegion,
          methods: []
        };
      }
      acc[regionKey].methods.push({
        ...method,
        isConfiguredForTenant: tenantId ? method.tenantPaymentMethods?.length > 0 : undefined,
        hasTransactions: method.transactions.length > 0
      });
      return acc;
    }, {} as any);

    return NextResponse.json({
      success: true,
      data: {
        byRegion: methodsByRegion,
        all: paymentMethods
      },
      summary: {
        totalMethods: paymentMethods.length,
        activeMethodsCount: paymentMethods.filter(m => m.isActive).length,
        regionsCovered: Object.keys(methodsByRegion).length,
        methodTypes: [...new Set(paymentMethods.map(m => m.type))]
      }
    });

  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

// POST /api/global-payments/payment-methods - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      code,
      type,
      marketRegionId,
      countries = [],
      currencyId,
      supportedCurrencies = [],
      configuration = {},
      apiCredentials = {},
      webhookUrl,
      processingFee = 0,
      fixedFee = 0,
      minimumAmount,
      maximumAmount,
      supportRefunds = true,
      supportPartialRefunds = true,
      supportRecurring = false,
      support3DS = false,
      isActive = true,
      testMode = false
    } = body;

    // Validate required fields
    if (!name || !code || !type || !marketRegionId || !currencyId) {
      return NextResponse.json(
        { success: false, error: 'Name, code, type, market region, and currency are required' },
        { status: 400 }
      );
    }

    // Check if payment method code already exists
    const existing = await prisma.paymentMethod.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Payment method with this code already exists' },
        { status: 409 }
      );
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        name,
        code,
        type,
        marketRegionId,
        countries,
        currencyId,
        supportedCurrencies,
        configuration,
        apiCredentials,
        webhookUrl,
        processingFee,
        fixedFee,
        minimumAmount,
        maximumAmount,
        supportRefunds,
        supportPartialRefunds,
        supportRecurring,
        support3DS,
        isActive,
        testMode
      },
      include: {
        marketRegion: {
          select: { code: true, name: true, countries: true }
        },
        currency: {
          select: { code: true, name: true, symbol: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment method' },
      { status: 500 }
    );
  }
}

// PUT /api/global-payments/payment-methods - Update payment method
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get('id');
    
    if (!paymentMethodId) {
      return NextResponse.json(
        { success: false, error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        marketRegion: {
          select: { code: true, name: true, countries: true }
        },
        currency: {
          select: { code: true, name: true, symbol: true }
        },
        tenantPaymentMethods: true
      }
    });

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method updated successfully'
    });

  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
}

// DELETE /api/global-payments/payment-methods - Delete payment method
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get('id');
    
    if (!paymentMethodId) {
      return NextResponse.json(
        { success: false, error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Check if payment method is in use
    const usage = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      include: {
        tenantPaymentMethods: true,
        transactions: true
      }
    });

    if (usage && (usage.tenantPaymentMethods.length > 0 || usage.transactions.length > 0)) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete payment method that is in use' },
        { status: 409 }
      );
    }

    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}
