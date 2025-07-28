
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
    const year = searchParams.get("year");
    const recognitionLevel = searchParams.get("recognitionLevel");
    const featured = searchParams.get("featured") === "true";
    const verified = searchParams.get("verified") === "true";
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(customerId && { customerId }),
      ...(year && { year: parseInt(year) }),
      ...(recognitionLevel && { recognitionLevel }),
      ...(featured && { featured: true }),
      ...(verified && { verified: true }),
      ...(category && { category })
    };

    const [awards, total, yearStats, levelStats] = await Promise.all([
      prisma.industryAward.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { year: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
        include: {
          customer: {
            select: {
              companyName: true,
              industry: true,
              companySize: true,
              logoUrl: true
            }
          }
        }
      }),
      prisma.industryAward.count({ where: whereClause }),
      prisma.industryAward.groupBy({
        by: ["year"],
        where: { tenantId },
        _count: {
          year: true
        },
        orderBy: {
          year: "desc"
        }
      }),
      prisma.industryAward.groupBy({
        by: ["recognitionLevel"],
        where: { tenantId },
        _count: {
          recognitionLevel: true
        }
      })
    ]);

    // Convert Decimal fields for awards
    const serializedAwards = awards.map(award => ({
      ...award,
      marketingValue: award.marketingValue?.toNumber() || null
    }));

    return NextResponse.json({
      awards: serializedAwards,
      yearStats,
      levelStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching industry awards:", error);
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
      awardName,
      awardingOrganization,
      category,
      year,
      description,
      criteria,
      significance,
      recognitionLevel,
      competitorCount,
      awardImage,
      logoUrl,
      pressReleaseUrl,
      articleUrls,
      achievementDescription,
      ourRoleInSuccess,
      metricsHighlighted,
      allowPromotionalUse,
      allowLogoUsage,
      allowCaseStudyUse,
      promotionalNotes,
      featured,
      marketingValue
    } = body;

    if (!tenantId || !awardName || !awardingOrganization || !year) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const award = await prisma.industryAward.create({
      data: {
        tenantId,
        customerId,
        awardName,
        awardingOrganization,
        category,
        year,
        description,
        criteria,
        significance,
        recognitionLevel: recognitionLevel || "industry",
        competitorCount,
        awardImage,
        logoUrl,
        pressReleaseUrl,
        articleUrls: articleUrls || [],
        achievementDescription,
        ourRoleInSuccess,
        metricsHighlighted: metricsHighlighted || [],
        allowPromotionalUse: allowPromotionalUse || false,
        allowLogoUsage: allowLogoUsage || false,
        allowCaseStudyUse: allowCaseStudyUse || false,
        promotionalNotes,
        verified: false,
        featured: featured || false,
        publicized: false,
        marketingValue: marketingValue ? new Decimal(marketingValue) : null
      },
      include: {
        customer: true
      }
    });

    // Convert Decimal fields for response
    const serializedAward = {
      ...award,
      marketingValue: award.marketingValue?.toNumber() || null
    };

    return NextResponse.json(serializedAward, { status: 201 });

  } catch (error) {
    console.error("Error creating industry award:", error);
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
        { error: "Award ID required" },
        { status: 400 }
      );
    }

    // Convert marketing value to Decimal if present
    if (updateData.marketingValue !== undefined) {
      updateData.marketingValue = updateData.marketingValue ? new Decimal(updateData.marketingValue) : null;
    }

    // Handle verification
    if (updateData.verified && !updateData.verifiedAt) {
      updateData.verifiedAt = new Date();
    }

    const award = await prisma.industryAward.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        customer: true
      }
    });

    // Convert Decimal fields for response
    const serializedAward = {
      ...award,
      marketingValue: award.marketingValue?.toNumber() || null
    };

    return NextResponse.json(serializedAward);

  } catch (error) {
    console.error("Error updating industry award:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
