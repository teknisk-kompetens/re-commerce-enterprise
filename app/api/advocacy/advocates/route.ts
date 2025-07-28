
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const advocacyTier = searchParams.get("advocacyTier");
    const programStatus = searchParams.get("programStatus");
    const minScore = searchParams.get("minScore");
    const industry = searchParams.get("industry");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(advocacyTier && { advocacyTier }),
      ...(programStatus && { programStatus }),
      ...(minScore && { advocacyScore: { gte: parseInt(minScore) } })
    };

    // Add industry filter through customer relation
    if (industry) {
      whereClause.customer = {
        industry
      };
    }

    const [advocates, total, stats, tierDistribution] = await Promise.all([
      prisma.customerAdvocate.findMany({
        where: whereClause,
        orderBy: { advocacyScore: "desc" },
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
          },
          _count: {
            select: {
              referrals: true,
              rewards: true,
              ambassadorPrograms: true,
              contentContributions: true
            }
          }
        }
      }),
      prisma.customerAdvocate.count({ where: whereClause }),
      prisma.customerAdvocate.aggregate({
        where: { tenantId },
        _avg: {
          advocacyScore: true,
          activitiesCount: true,
          referralsGiven: true,
          testimonialsProvided: true
        },
        _sum: {
          activitiesCount: true,
          referralsGiven: true,
          testimonialsProvided: true,
          caseStudiesParticipated: true,
          eventsAttended: true,
          contentContributed: true
        }
      }),
      prisma.customerAdvocate.groupBy({
        by: ["advocacyTier"],
        where: { tenantId },
        _count: {
          advocacyTier: true
        }
      })
    ]);

    // Convert Decimal fields for advocates
    const serializedAdvocates = advocates.map(advocate => ({
      ...advocate,
      totalRewardsEarned: advocate.totalRewardsEarned.toNumber()
    }));

    // Convert Decimal fields for stats
    const serializedStats = {
      ...stats,
      _avg: {
        advocacyScore: stats._avg.advocacyScore || null,
        activitiesCount: stats._avg.activitiesCount || null,
        referralsGiven: stats._avg.referralsGiven || null,
        testimonialsProvided: stats._avg.testimonialsProvided || null
      }
    };

    return NextResponse.json({
      advocates: serializedAdvocates,
      stats: serializedStats,
      tierDistribution,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching customer advocates:", error);
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
      contactName,
      contactTitle,
      contactEmail,
      contactPhone,
      advocacyTier,
      communicationPrefs,
      contentInterests,
      eventInterests,
      allowPublicProfile,
      allowNameUsage,
      allowContactSharing,
      quarterlyGoals
    } = body;

    if (!tenantId || !customerId || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const advocate = await prisma.customerAdvocate.create({
      data: {
        tenantId,
        customerId,
        contactName,
        contactTitle,
        contactEmail,
        contactPhone,
        advocacyTier: advocacyTier || "bronze",
        advocacyScore: 0,
        communicationPrefs: communicationPrefs || {},
        contentInterests: contentInterests || [],
        eventInterests: eventInterests || [],
        allowPublicProfile: allowPublicProfile || false,
        allowNameUsage: allowNameUsage !== false,
        allowContactSharing: allowContactSharing || false,
        quarterlyGoals: quarterlyGoals || {},
        programStatus: "active"
      },
      include: {
        customer: true
      }
    });

    // Convert Decimal fields for response
    const serializedAdvocate = {
      ...advocate,
      totalRewardsEarned: advocate.totalRewardsEarned.toNumber()
    };

    return NextResponse.json(serializedAdvocate, { status: 201 });

  } catch (error) {
    console.error("Error creating customer advocate:", error);
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
        { error: "Advocate ID required" },
        { status: 400 }
      );
    }

    // Convert totalRewardsEarned to Decimal if present
    if (updateData.totalRewardsEarned !== undefined) {
      updateData.totalRewardsEarned = new Decimal(updateData.totalRewardsEarned);
    }

    const advocate = await prisma.customerAdvocate.update({
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
    const serializedAdvocate = {
      ...advocate,
      totalRewardsEarned: advocate.totalRewardsEarned.toNumber()
    };

    return NextResponse.json(serializedAdvocate);

  } catch (error) {
    console.error("Error updating customer advocate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
