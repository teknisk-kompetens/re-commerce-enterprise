
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leaderboardId = searchParams.get("leaderboardId");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!leaderboardId) {
      return NextResponse.json({ error: "Leaderboard ID required" }, { status: 400 });
    }

    const leaderboard = await prisma.leaderboard.findUnique({
      where: { id: leaderboardId },
    });

    if (!leaderboard) {
      return NextResponse.json({ error: "Leaderboard not found" }, { status: 404 });
    }

    const entries = await prisma.leaderboardEntry.findMany({
      where: { leaderboardId },
      include: {
        profile: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { currentRank: "asc" },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.leaderboardEntry.count({
      where: { leaderboardId },
    });

    // Get user's specific entry if userId provided
    let userEntry = null;
    if (userId) {
      userEntry = await prisma.leaderboardEntry.findFirst({
        where: {
          leaderboardId,
          profile: {
            userId,
          },
        },
        include: {
          profile: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      entries,
      userEntry,
      leaderboard,
      pagination: {
        limit,
        offset,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Leaderboard entries fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      leaderboardId,
      userId,
      tenantId,
      score,
      recalculateRankings = true,
    } = body;

    if (!leaderboardId || !userId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get gamification profile
    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Gamification profile not found" }, { status: 404 });
    }

    // Check if entry already exists
    let entry = await prisma.leaderboardEntry.findUnique({
      where: {
        leaderboardId_profileId: {
          leaderboardId,
          profileId: profile.id,
        },
      },
    });

    if (entry) {
      // Update existing entry
      const previousScore = entry.score;
      const scoreChange = BigInt(score) - previousScore;

      entry = await prisma.leaderboardEntry.update({
        where: {
          leaderboardId_profileId: {
            leaderboardId,
            profileId: profile.id,
          },
        },
        data: {
          score: BigInt(score),
          previousScore,
          scoreChange,
          totalActivities: { increment: 1 },
        },
      });
    } else {
      // Create new entry
      entry = await prisma.leaderboardEntry.create({
        data: {
          leaderboardId,
          profileId: profile.id,
          currentRank: 1, // Will be updated when rankings are recalculated
          score: BigInt(score),
          previousScore: BigInt(0),
          scoreChange: BigInt(score),
          totalActivities: 1,
        },
      });
    }

    // Recalculate rankings if requested
    if (recalculateRankings) {
      await recalculateLeaderboardRankings(leaderboardId);
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Leaderboard entry creation error:", error);
    return NextResponse.json(
      { error: "Failed to create/update leaderboard entry" },
      { status: 500 }
    );
  }
}

async function recalculateLeaderboardRankings(leaderboardId: string) {
  try {
    // Get all entries sorted by score
    const entries = await prisma.leaderboardEntry.findMany({
      where: { leaderboardId },
      orderBy: { score: "desc" },
    });

    // Update rankings
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const newRank = i + 1;
      const rankChange = entry.currentRank ? newRank - entry.currentRank : 0;

      await prisma.leaderboardEntry.update({
        where: { id: entry.id },
        data: {
          previousRank: entry.currentRank,
          currentRank: newRank,
          rankChange: rankChange,
        },
      });
    }
  } catch (error) {
    console.error("Leaderboard ranking recalculation error:", error);
  }
}
