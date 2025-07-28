
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// POST /api/tax-management/calculate - Calculate tax for transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      transactionId,
      amount,
      country,
      region,
      city,
      productTypes = [],
      serviceTypes = [],
      customerType,
      isExempt = false
    } = body;

    // Validate required fields
    if (!transactionId || !amount || !country) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID, amount, and country are required' },
        { status: 400 }
      );
    }

    // Find applicable tax rules
    const where: any = {
      country,
      isActive: true,
      effectiveDate: { lte: new Date() },
      OR: [
        { expiryDate: null },
        { expiryDate: { gte: new Date() } }
      ]
    };

    if (region) where.region = region;
    if (city) where.city = city;

    const taxRules = await prisma.taxRule.findMany({
      where,
      orderBy: { rate: 'asc' }
    });

    // Filter rules by product/service types and exemptions
    const applicableRules = taxRules.filter(rule => {
      // Check product type applicability
      if (rule.productTypes.length > 0 && productTypes.length > 0) {
        const hasApplicableProduct = rule.productTypes.some(pt => productTypes.includes(pt));
        if (!hasApplicableProduct) return false;
      }

      // Check service type applicability
      if (rule.serviceTypes.length > 0 && serviceTypes.length > 0) {
        const hasApplicableService = rule.serviceTypes.some(st => serviceTypes.includes(st));
        if (!hasApplicableService) return false;
      }

      // Check customer exemptions
      if (customerType && rule.exemptCustomers.includes(customerType)) {
        return false;
      }

      // Check product exemptions
      if (productTypes.some(pt => rule.exemptProducts.includes(pt))) {
        return false;
      }

      // Check amount thresholds
      if (rule.minimumAmount && amount < rule.minimumAmount) {
        return false;
      }

      if (rule.maximumAmount && amount > rule.maximumAmount) {
        return false;
      }

      return true;
    });

    // If customer is exempt, return zero tax
    if (isExempt) {
      return NextResponse.json({
        success: true,
        data: {
          transactionId,
          baseAmount: amount,
          totalTax: 0,
          totalAmount: amount,
          calculations: [],
          exemptReason: 'Customer exempt from tax'
        }
      });
    }

    // Calculate taxes
    let runningAmount = amount;
    let totalTax = 0;
    const calculations = [];

    for (const rule of applicableRules) {
      const taxableAmount = rule.isCompound ? runningAmount : amount;
      const taxAmount = (taxableAmount * rule.rate) / 100;

      // Create tax calculation record
      const calculation = await prisma.taxCalculation.create({
        data: {
          transactionId,
          taxRuleId: rule.id,
          baseAmount: taxableAmount,
          taxRate: rule.rate,
          taxAmount,
          totalAmount: taxableAmount + taxAmount,
          breakdown: {
            ruleName: rule.name,
            taxType: rule.taxType,
            rate: rule.rate,
            isCompound: rule.isCompound,
            taxableAmount,
            taxAmount
          }
        },
        include: {
          taxRule: {
            select: {
              name: true,
              taxType: true,
              taxAuthority: true
            }
          }
        }
      });

      calculations.push(calculation);
      totalTax += taxAmount;

      // For compound taxes, add tax to running amount
      if (rule.isCompound) {
        runningAmount += taxAmount;
      }
    }

    const result = {
      transactionId,
      baseAmount: amount,
      totalTax: Math.round(totalTax * 100) / 100, // Round to 2 decimal places
      totalAmount: Math.round((amount + totalTax) * 100) / 100,
      calculations,
      breakdown: {
        rulesApplied: applicableRules.length,
        taxTypes: [...new Set(applicableRules.map(r => r.taxType))],
        countries: [country],
        regions: region ? [region] : [],
        calculatedAt: new Date()
      }
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: `Tax calculated using ${applicableRules.length} rules`
    });

  } catch (error) {
    console.error('Error calculating tax:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate tax' },
      { status: 500 }
    );
  }
}

// GET /api/tax-management/calculate - Get tax calculation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const country = searchParams.get('country');
    const days = parseInt(searchParams.get('days') || '30');

    const where: any = {};
    if (transactionId) where.transactionId = transactionId;
    if (country) {
      where.taxRule = { country };
    }

    // Add date filter
    where.calculatedAt = {
      gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    };

    const calculations = await prisma.taxCalculation.findMany({
      where,
      include: {
        taxRule: {
          select: {
            name: true,
            country: true,
            region: true,
            taxType: true,
            taxAuthority: true
          }
        }
      },
      orderBy: { calculatedAt: 'desc' },
      take: 100
    });

    // Aggregate statistics
    const stats = {
      totalCalculations: calculations.length,
      totalTaxAmount: calculations.reduce((sum, calc) => sum + calc.taxAmount, 0),
      totalBaseAmount: calculations.reduce((sum, calc) => sum + calc.baseAmount, 0),
      averageTaxRate: calculations.length > 0 ? 
        calculations.reduce((sum, calc) => sum + calc.taxRate, 0) / calculations.length : 0,
      countriesInvolved: [...new Set(calculations.map(c => c.taxRule.country))],
      taxTypesUsed: [...new Set(calculations.map(c => c.taxRule.taxType))]
    };

    return NextResponse.json({
      success: true,
      data: calculations,
      statistics: stats,
      dateRange: {
        from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        to: new Date()
      }
    });

  } catch (error) {
    console.error('Error fetching tax calculations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tax calculations' },
      { status: 500 }
    );
  }
}
