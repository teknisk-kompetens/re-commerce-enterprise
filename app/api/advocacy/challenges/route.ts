
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const challengeType = searchParams.get("challengeType");
    const featured = searchParams.get("featured") === "true";
    const active = searchParams.get("active") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const now = new Date();
    const whereClause: any = {
      tenantId,
      ...(status && { status }),
      ...(category && { category }),
      ...(challengeType && { challengeType }),
      ...(featured && { featured: true }),
      ...(active && {
        status: "active",
        startDate: { lte: now },
        endDate: { gte: now }
      })
    };

    const [challenges, total, categoryStats] = await Promise.all([
      prisma.advocacyChallenge.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { startDate: "desc" }],
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              advocates: true,
              submissions: true
            }
          }
        }
      }),
      prisma.advocacyChallenge.count({ where: whereClause }),
      prisma.advocacyChallenge.groupBy({
        by: ["category", "status"],
        where: { tenantId },
        _count: {
          category: true
        },
        _sum: {
          participantCount: true,
          completedCount: true
        }
      })
    ]);

    return NextResponse.json({
      challenges,
      categoryStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching advocacy challenges:", error);
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
      title,
      description,
      objective,
      category,
      challengeType,
      difficulty,
      startDate,
      endDate,
      eligibility,
      requirements,
      restrictions,
      successMetrics,
      completionGoal,
      qualityStandards,
      rewardStructure,
      maxParticipants,
      leaderboard,
      publicResults,
      featured
    } = body;

    if (!tenantId || !title || !description || !objective || !category || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const challenge = await prisma.advocacyChallenge.create({
      data: {
        tenantId,
        title,
        description,
        objective,
        category,
        challengeType: challengeType || "individual",
        difficulty: difficulty || "medium",
        startDate: start,
        endDate: end,
        duration,
        eligibility: eligibility || [],
        requirements: requirements || [],
        restrictions: restrictions || [],
        successMetrics: successMetrics || [],
        completionGoal,
        qualityStandards: qualityStandards || [],
        rewardStructure: rewardStructure || {},
        maxParticipants,
        leaderboard: leaderboard !== false,
        publicResults: publicResults !== false,
        featured: featured || false,
        status: "draft"
      }
    });

    return NextResponse.json(challenge, { status: 201 });

  } catch (error) {
    console.error("Error creating advocacy challenge:", error);
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
        { error: "Challenge ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    // Recalculate duration if dates are updated
    if (updateData.startDate && updateData.endDate) {
      updateData.duration = Math.ceil((updateData.endDate.getTime() - updateData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    const challenge = await prisma.advocacyChallenge.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(challenge);

  } catch (error) {
    console.error("Error updating advocacy challenge:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
