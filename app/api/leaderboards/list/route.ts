
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const period = searchParams.get("period");
    const isPublic = searchParams.get("isPublic");
    const status = searchParams.get("status") ?? "active";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = { tenantId, status };
    if (category) whereClause.category = category;
    if (type) whereClause.type = type;
    if (period) whereClause.period = period;
    if (isPublic !== null) whereClause.isPublic = isPublic === "true";

    const leaderboards = await prisma.leaderboard.findMany({
      where: whereClause,
      include: {
        entries: {
          take: 10,
          orderBy: { currentRank: "asc" },
          include: {
            profile: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
        _count: {
          select: {
            entries: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.leaderboard.count({
      where: whereClause,
    });

    return NextResponse.json({
      leaderboards,
      pagination: {
        limit,
        offset,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Leaderboards fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      name,
      description,
      category,
      type,
      metric,
      scoringFormula = {},
      rankingMethod = "points",
      period,
      startDate,
      endDate,
      resetFrequency,
      isCompetition = false,
      competitionType,
      maxParticipants,
      entryRequirements = {},
      rewardStructure = {},
      prizes = [],
      isPublic = true,
      accessLevel = "all",
      displaySettings = {},
    } = body;

    if (!tenantId || !name || !category || !type || !metric || !period) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const leaderboard = await prisma.leaderboard.create({
      data: {
        tenantId,
        name,
        description,
        category,
        type,
        metric,
        scoringFormula,
        rankingMethod,
        period,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        resetFrequency,
        isCompetition,
        competitionType,
        maxParticipants,
        entryRequirements,
        rewardStructure,
        prizes,
        isPublic,
        accessLevel,
        displaySettings,
      },
    });

    return NextResponse.json({ leaderboard }, { status: 201 });
  } catch (error) {
    console.error("Leaderboard creation error:", error);
    return NextResponse.json(
      { error: "Failed to create leaderboard" },
      { status: 500 }
    );
  }
}
