
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const metricId = searchParams.get("metricId");
    const benchmarkType = searchParams.get("benchmarkType");
    const performance = searchParams.get("performance");
    const industry = searchParams.get("industry");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(metricId && { metricId }),
      ...(benchmarkType && { benchmarkType }),
      ...(performance && { performance }),
      ...(industry && { industry })
    };

    const [benchmarks, total, performanceDistribution] = await Promise.all([
      prisma.benchmarkComparison.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          metric: {
            select: {
              name: true,
              category: true,
              type: true,
              unit: true,
              customer: {
                select: {
                  companyName: true,
                  industry: true,
                  companySize: true
                }
              }
            }
          }
        }
      }),
      prisma.benchmarkComparison.count({ where: whereClause }),
      prisma.benchmarkComparison.groupBy({
        by: ["performance"],
        where: { tenantId },
        _count: {
          performance: true
        }
      })
    ]);

    // Convert Decimal fields to numbers for JSON serialization
    const serializedBenchmarks = benchmarks.map(benchmark => ({
      ...benchmark,
      benchmarkValue: benchmark.benchmarkValue.toNumber(),
      customerValue: benchmark.customerValue.toNumber(),
      variance: benchmark.variance.toNumber(),
      variancePercentage: benchmark.variancePercentage.toNumber(),
      previousComparison: benchmark.previousComparison?.toNumber() || null
    }));

    return NextResponse.json({
      benchmarks: serializedBenchmarks,
      performanceDistribution,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching benchmark comparisons:", error);
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
      metricId,
      benchmarkType,
      benchmarkName,
      benchmarkDescription,
      benchmarkValue,
      customerValue,
      dataSource,
      sampleSize,
      industry,
      companySize,
      geography,
      previousComparison,
      trendPeriod,
      chartData
    } = body;

    if (!tenantId || !metricId || !benchmarkType || !benchmarkName || 
        benchmarkValue === undefined || customerValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate variance and performance
    const variance = parseFloat(customerValue) - parseFloat(benchmarkValue);
    const variancePercentage = parseFloat(benchmarkValue) !== 0 
      ? (variance / parseFloat(benchmarkValue)) * 100 
      : 0;

    // Determine performance level
    let performance = "at";
    let percentile = 50;

    if (variancePercentage > 20) {
      performance = "significantly-above";
      percentile = 90;
    } else if (variancePercentage > 5) {
      performance = "above";
      percentile = 75;
    } else if (variancePercentage < -20) {
      performance = "significantly-below";
      percentile = 10;
    } else if (variancePercentage < -5) {
      performance = "below";
      percentile = 25;
    }

    // Determine trend if previous comparison exists
    let trend = null;
    if (previousComparison !== undefined && previousComparison !== null) {
      const previousVariance = parseFloat(customerValue) - parseFloat(previousComparison);
      if (previousVariance > parseFloat(customerValue) * 0.05) {
        trend = "improving";
      } else if (previousVariance < parseFloat(customerValue) * -0.05) {
        trend = "declining";
      } else {
        trend = "stable";
      }
    }

    const benchmark = await prisma.benchmarkComparison.create({
      data: {
        tenantId,
        metricId,
        benchmarkType,
        benchmarkName,
        benchmarkDescription,
        benchmarkValue: new Decimal(benchmarkValue),
        customerValue: new Decimal(customerValue),
        variance: new Decimal(variance),
        variancePercentage: new Decimal(variancePercentage),
        dataSource,
        sampleSize,
        lastUpdated: new Date(),
        performance,
        percentile,
        industry,
        companySize,
        geography,
        trend,
        previousComparison: previousComparison ? new Decimal(previousComparison) : null,
        trendPeriod,
        chartData: chartData || {}
      },
      include: {
        metric: {
          include: {
            customer: true
          }
        }
      }
    });

    // Convert Decimal fields to numbers for response
    const serializedBenchmark = {
      ...benchmark,
      benchmarkValue: benchmark.benchmarkValue.toNumber(),
      customerValue: benchmark.customerValue.toNumber(),
      variance: benchmark.variance.toNumber(),
      variancePercentage: benchmark.variancePercentage.toNumber(),
      previousComparison: benchmark.previousComparison?.toNumber() || null
    };

    return NextResponse.json(serializedBenchmark, { status: 201 });

  } catch (error) {
    console.error("Error creating benchmark comparison:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
