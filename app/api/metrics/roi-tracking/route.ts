
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const customerId = searchParams.get("customerId");
    const periodType = searchParams.get("periodType");
    const minROI = searchParams.get("minROI");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(customerId && { customerId }),
      ...(periodType && { periodType }),
      ...(minROI && { roiPercentage: { gte: parseFloat(minROI) } })
    };

    const [roiData, total, summary] = await Promise.all([
      prisma.rOITracking.findMany({
        where: whereClause,
        orderBy: { roiPercentage: "desc" },
        take: limit,
        skip: offset,
        include: {
          customer: {
            select: {
              companyName: true,
              industry: true,
              companySize: true
            }
          },
          metric: {
            select: {
              name: true,
              category: true,
              type: true
            }
          }
        }
      }),
      prisma.rOITracking.count({ where: whereClause }),
      prisma.rOITracking.aggregate({
        where: { tenantId },
        _avg: {
          roiPercentage: true,
          paybackPeriod: true,
          confidenceLevel: true
        },
        _sum: {
          totalBenefits: true,
          totalInvestment: true,
          netBenefit: true
        },
        _count: {
          id: true
        }
      })
    ]);

    // Convert Decimal to number for JSON serialization
    const serializedData = roiData.map(item => ({
      ...item,
      initialInvestment: item.initialInvestment.toNumber(),
      ongoingCosts: item.ongoingCosts.toNumber(),
      implementationCosts: item.implementationCosts.toNumber(),
      trainingCosts: item.trainingCosts.toNumber(),
      totalInvestment: item.totalInvestment.toNumber(),
      directSavings: item.directSavings.toNumber(),
      revenueIncrease: item.revenueIncrease.toNumber(),
      efficiencyGains: item.efficiencyGains.toNumber(),
      riskMitigation: item.riskMitigation.toNumber(),
      totalBenefits: item.totalBenefits.toNumber(),
      netBenefit: item.netBenefit.toNumber(),
      roiPercentage: item.roiPercentage.toNumber(),
      paybackPeriod: item.paybackPeriod?.toNumber() || null,
      npv: item.npv?.toNumber() || null,
      irr: item.irr?.toNumber() || null,
      industryAvgROI: item.industryAvgROI?.toNumber() || null,
      peerAvgROI: item.peerAvgROI?.toNumber() || null,
      expectedROI: item.expectedROI?.toNumber() || null
    }));

    const serializedSummary = {
      ...summary,
      _avg: {
        roiPercentage: summary._avg.roiPercentage?.toNumber() || null,
        paybackPeriod: summary._avg.paybackPeriod?.toNumber() || null,
        confidenceLevel: summary._avg.confidenceLevel || null
      },
      _sum: {
        totalBenefits: summary._sum.totalBenefits?.toNumber() || null,
        totalInvestment: summary._sum.totalInvestment?.toNumber() || null,
        netBenefit: summary._sum.netBenefit?.toNumber() || null
      }
    };

    return NextResponse.json({
      roiData: serializedData,
      summary: serializedSummary,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching ROI tracking data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      customerId,
      metricId,
      periodType,
      startDate,
      endDate,
      initialInvestment,
      ongoingCosts,
      implementationCosts,
      trainingCosts,
      directSavings,
      revenueIncrease,
      efficiencyGains,
      riskMitigation,
      confidenceLevel,
      validatedBy,
      validationNotes,
      benefitBreakdown,
      costBreakdown,
      assumptions,
      industryAvgROI,
      peerAvgROI,
      expectedROI,
      currency
    } = body;

    if (!tenantId || !customerId || !startDate || !endDate || !initialInvestment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate totals
    const totalInvestment = parseFloat(initialInvestment) + 
                           parseFloat(ongoingCosts || 0) + 
                           parseFloat(implementationCosts || 0) + 
                           parseFloat(trainingCosts || 0);

    const totalBenefits = parseFloat(directSavings || 0) + 
                         parseFloat(revenueIncrease || 0) + 
                         parseFloat(efficiencyGains || 0) + 
                         parseFloat(riskMitigation || 0);

    const netBenefit = totalBenefits - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;
    const paybackPeriod = totalBenefits > 0 ? (totalInvestment / totalBenefits) * 12 : null; // in months

    const roiTracking = await prisma.rOITracking.create({
      data: {
        tenantId,
        customerId,
        metricId,
        periodType: periodType || "annual",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        initialInvestment: new Decimal(initialInvestment),
        ongoingCosts: new Decimal(ongoingCosts || 0),
        implementationCosts: new Decimal(implementationCosts || 0),
        trainingCosts: new Decimal(trainingCosts || 0),
        totalInvestment: new Decimal(totalInvestment),
        directSavings: new Decimal(directSavings || 0),
        revenueIncrease: new Decimal(revenueIncrease || 0),
        efficiencyGains: new Decimal(efficiencyGains || 0),
        riskMitigation: new Decimal(riskMitigation || 0),
        totalBenefits: new Decimal(totalBenefits),
        netBenefit: new Decimal(netBenefit),
        roiPercentage: new Decimal(roiPercentage),
        paybackPeriod: paybackPeriod ? new Decimal(paybackPeriod) : null,
        confidenceLevel: confidenceLevel || 80,
        validatedBy,
        validatedAt: validatedBy ? new Date() : null,
        validationNotes,
        benefitBreakdown: benefitBreakdown || [],
        costBreakdown: costBreakdown || [],
        assumptions: assumptions || [],
        industryAvgROI: industryAvgROI ? new Decimal(industryAvgROI) : null,
        peerAvgROI: peerAvgROI ? new Decimal(peerAvgROI) : null,
        expectedROI: expectedROI ? new Decimal(expectedROI) : null,
        currency: currency || "USD"
      },
      include: {
        customer: true,
        metric: true
      }
    });

    // Convert Decimal fields to numbers for response
    const serializedROI = {
      ...roiTracking,
      initialInvestment: roiTracking.initialInvestment.toNumber(),
      ongoingCosts: roiTracking.ongoingCosts.toNumber(),
      implementationCosts: roiTracking.implementationCosts.toNumber(),
      trainingCosts: roiTracking.trainingCosts.toNumber(),
      totalInvestment: roiTracking.totalInvestment.toNumber(),
      directSavings: roiTracking.directSavings.toNumber(),
      revenueIncrease: roiTracking.revenueIncrease.toNumber(),
      efficiencyGains: roiTracking.efficiencyGains.toNumber(),
      riskMitigation: roiTracking.riskMitigation.toNumber(),
      totalBenefits: roiTracking.totalBenefits.toNumber(),
      netBenefit: roiTracking.netBenefit.toNumber(),
      roiPercentage: roiTracking.roiPercentage.toNumber(),
      paybackPeriod: roiTracking.paybackPeriod?.toNumber() || null,
      npv: roiTracking.npv?.toNumber() || null,
      irr: roiTracking.irr?.toNumber() || null,
      industryAvgROI: roiTracking.industryAvgROI?.toNumber() || null,
      peerAvgROI: roiTracking.peerAvgROI?.toNumber() || null,
      expectedROI: roiTracking.expectedROI?.toNumber() || null
    };

    return NextResponse.json(serializedROI, { status: 201 });

  } catch (error) {
    console.error("Error creating ROI tracking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
