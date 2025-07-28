
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const customerId = searchParams.get("customerId");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const featured = searchParams.get("featured") === "true";
    const visibility = searchParams.get("visibility");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(customerId && { customerId }),
      ...(category && { category }),
      ...(type && { type }),
      ...(featured && { featured: true }),
      ...(visibility && { visibility })
    };

    const [metrics, total, categories] = await Promise.all([
      prisma.successMetric.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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
          _count: {
            select: {
              roiTracking: true,
              benchmarks: true
            }
          }
        }
      }),
      prisma.successMetric.count({ where: whereClause }),
      prisma.successMetric.groupBy({
        by: ["category"],
        where: { tenantId },
        _count: {
          category: true
        }
      })
    ]);

    return NextResponse.json({
      metrics,
      categories,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching success metrics:", error);
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
      name,
      description,
      category,
      type,
      unit,
      currentValue,
      previousValue,
      targetValue,
      baselineValue,
      measurementPeriod,
      periodStart,
      periodEnd,
      formula,
      dataSource,
      calculationMethod,
      industryBenchmark,
      peerBenchmark,
      internalBenchmark,
      trend,
      trendConfidence,
      alertEnabled,
      alertThreshold,
      alertDirection,
      chartType,
      displayFormat,
      visibility,
      featured
    } = body;

    if (!tenantId || !name || !category || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const metric = await prisma.successMetric.create({
      data: {
        tenantId,
        customerId,
        name,
        description,
        category,
        type,
        unit,
        currentValue,
        previousValue,
        targetValue,
        baselineValue,
        measurementPeriod,
        periodStart: periodStart ? new Date(periodStart) : null,
        periodEnd: periodEnd ? new Date(periodEnd) : null,
        formula,
        dataSource,
        calculationMethod,
        industryBenchmark,
        peerBenchmark,
        internalBenchmark,
        trend,
        trendConfidence,
        alertEnabled: alertEnabled || false,
        alertThreshold,
        alertDirection,
        chartType: chartType || "line",
        displayFormat: displayFormat || "number",
        visibility: visibility || "internal",
        featured: featured || false
      },
      include: {
        customer: true
      }
    });

    return NextResponse.json(metric, { status: 201 });

  } catch (error) {
    console.error("Error creating success metric:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Metric ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.periodStart) {
      updateData.periodStart = new Date(updateData.periodStart);
    }
    if (updateData.periodEnd) {
      updateData.periodEnd = new Date(updateData.periodEnd);
    }

    const metric = await prisma.successMetric.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        customer: true
      }
    });

    return NextResponse.json(metric);

  } catch (error) {
    console.error("Error updating success metric:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
