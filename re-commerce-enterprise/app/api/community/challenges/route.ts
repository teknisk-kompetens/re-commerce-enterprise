
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const difficulty = searchParams.get("difficulty");
    const organizerId = searchParams.get("organizerId");
    const active = searchParams.get("active") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(type && { type }),
      ...(status && { status }),
      ...(difficulty && { difficulty }),
      ...(organizerId && { organizerId }),
      ...(active && {
        status: "open",
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
      }),
    };

    const challenges = await prisma.communityChallenge.findMany({
      where: whereClause,
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        submissions: {
          take: 5,
          orderBy: { averageScore: "desc" },
          include: {
            submitter: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: [
        { startTime: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      challenges,
      pagination: {
        limit,
        offset,
        total: await prisma.communityChallenge.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Challenges fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      title,
      description,
      slug,
      type,
      category = "general",
      difficulty = "beginner",
      startTime,
      endTime,
      submissionDeadline,
      organizerId,
      maxParticipants,
      teamSize = 1,
      requirements = [],
      rules,
      judingCriteria = [],
      prizes = [],
      pointReward = 0,
    } = body;

    if (!tenantId || !title || !slug || !type || !startTime || !endTime || !submissionDeadline || !organizerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const challenge = await prisma.communityChallenge.create({
      data: {
        tenantId,
        title,
        description,
        slug,
        type,
        category,
        difficulty,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        submissionDeadline: new Date(submissionDeadline),
        organizerId,
        maxParticipants,
        teamSize,
        requirements,
        rules,
        judingCriteria,
        prizes,
        pointReward,
        status: "draft",
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    console.error("Challenge creation error:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}
