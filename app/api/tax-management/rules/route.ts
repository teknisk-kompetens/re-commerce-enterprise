
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/tax-management/rules - Get tax rules by country/region
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const taxType = searchParams.get('taxType');
    const active = searchParams.get('active');
    const productType = searchParams.get('productType');

    const where: any = {};
    if (country) where.country = country;
    if (region) where.region = region;
    if (taxType) where.taxType = taxType;
    if (active === 'true') where.isActive = true;
    if (productType) where.productTypes = { has: productType };

    const taxRules = await prisma.taxRule.findMany({
      where,
      include: {
        taxCalculations: {
          select: { id: true, totalAmount: true, calculatedAt: true },
          take: 5,
          orderBy: { calculatedAt: 'desc' }
        }
      },
      orderBy: [
        { country: 'asc' },
        { region: 'asc' },
        { taxType: 'asc' }
      ]
    });

    // Group by country for better organization
    const rulesByCountry = taxRules.reduce((acc, rule) => {
      if (!acc[rule.country]) {
        acc[rule.country] = {
          country: rule.country,
          rules: []
        };
      }
      acc[rule.country].rules.push({
        ...rule,
        calculationsCount: rule.taxCalculations.length
      });
      return acc;
    }, {} as any);

    return NextResponse.json({
      success: true,
      data: {
        byCountry: rulesByCountry,
        all: taxRules
      },
      summary: {
        totalRules: taxRules.length,
        countriesCovered: Object.keys(rulesByCountry).length,
        taxTypes: [...new Set(taxRules.map(r => r.taxType))],
        averageRate: taxRules.reduce((sum, r) => sum + r.rate, 0) / taxRules.length
      }
    });

  } catch (error) {
    console.error('Error fetching tax rules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tax rules' },
      { status: 500 }
    );
  }
}

// POST /api/tax-management/rules - Create new tax rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      country,
      region,
      city,
      taxType,
      rate,
      isCompound = false,
      productTypes = [],
      serviceTypes = [],
      minimumAmount,
      maximumAmount,
      exemptCustomers = [],
      exemptProducts = [],
      effectiveDate = new Date(),
      expiryDate,
      isActive = true,
      taxAuthority,
      registrationId
    } = body;

    // Validate required fields
    if (!name || !country || !taxType || rate === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, country, tax type, and rate are required' },
        { status: 400 }
      );
    }

    const taxRule = await prisma.taxRule.create({
      data: {
        name,
        description,
        country,
        region,
        city,
        taxType,
        rate,
        isCompound,
        productTypes,
        serviceTypes,
        minimumAmount,
        maximumAmount,
        exemptCustomers,
        exemptProducts,
        effectiveDate: new Date(effectiveDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive,
        taxAuthority,
        registrationId
      }
    });

    return NextResponse.json({
      success: true,
      data: taxRule,
      message: 'Tax rule created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tax rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tax rule' },
      { status: 500 }
    );
  }
}

// PUT /api/tax-management/rules - Update tax rule
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('id');
    
    if (!ruleId) {
      return NextResponse.json(
        { success: false, error: 'Tax rule ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Convert date strings to Date objects if present
    if (body.effectiveDate) body.effectiveDate = new Date(body.effectiveDate);
    if (body.expiryDate) body.expiryDate = new Date(body.expiryDate);

    const taxRule = await prisma.taxRule.update({
      where: { id: ruleId },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        taxCalculations: {
          take: 5,
          orderBy: { calculatedAt: 'desc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: taxRule,
      message: 'Tax rule updated successfully'
    });

  } catch (error) {
    console.error('Error updating tax rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tax rule' },
      { status: 500 }
    );
  }
}

// DELETE /api/tax-management/rules - Delete tax rule
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('id');
    
    if (!ruleId) {
      return NextResponse.json(
        { success: false, error: 'Tax rule ID is required' },
        { status: 400 }
      );
    }

    // Check if rule is in use
    const calculations = await prisma.taxCalculation.count({
      where: { taxRuleId: ruleId }
    });

    if (calculations > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete tax rule that has been used in calculations' },
        { status: 409 }
      );
    }

    await prisma.taxRule.delete({
      where: { id: ruleId }
    });

    return NextResponse.json({
      success: true,
      message: 'Tax rule deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tax rule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tax rule' },
      { status: 500 }
    );
  }
}
