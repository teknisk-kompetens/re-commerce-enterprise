
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contributorId = searchParams.get("contributorId");
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {
      ...(contributorId && { contributorId }),
      ...(projectId && { projectId }),
      ...(type && { type }),
      ...(status && { status }),
    };

    const contributions = await prisma.contribution.findMany({
      where: whereClause,
      include: {
        contributor: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true, slug: true, repositoryUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      contributions,
      pagination: {
        limit,
        offset,
        total: await prisma.contribution.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Contributions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      contributorId,
      type,
      title,
      description,
      pullRequestUrl,
      issueUrl,
      commitHash,
      commitMessage,
      filesChanged = 0,
      linesAdded = 0,
      linesDeleted = 0,
      complexity = "simple",
      impact = "minor",
    } = body;

    if (!projectId || !contributorId || !type || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if this is the user's first contribution to this project
    const existingContributions = await prisma.contribution.count({
      where: { projectId, contributorId },
    });

    const isFirstContribution = existingContributions === 0;

    // Calculate points based on contribution type and impact
    let pointsAwarded = 0;
    switch (type) {
      case "code":
        pointsAwarded = impact === "critical" ? 100 : impact === "major" ? 50 : impact === "moderate" ? 25 : 10;
        break;
      case "documentation":
        pointsAwarded = impact === "major" ? 30 : 15;
        break;
      case "bug_report":
        pointsAwarded = impact === "critical" ? 25 : 10;
        break;
      case "feature_request":
        pointsAwarded = 5;
        break;
      case "review":
        pointsAwarded = 15;
        break;
      case "testing":
        pointsAwarded = 20;
        break;
    }

    // Bonus points for first contribution
    if (isFirstContribution) {
      pointsAwarded += 50;
    }

    const contribution = await prisma.contribution.create({
      data: {
        projectId,
        contributorId,
        type,
        title,
        description,
        pullRequestUrl,
        issueUrl,
        commitHash,
        commitMessage,
        filesChanged,
        linesAdded,
        linesDeleted,
        complexity,
        impact,
        pointsAwarded,
        isFirstContribution,
        status: "submitted",
      },
      include: {
        contributor: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Update project statistics
    await prisma.openSourceProject.update({
      where: { id: projectId },
      data: {
        contributorCount: isFirstContribution ? { increment: 1 } : undefined,
        lastActivityAt: new Date(),
      },
    });

    // Update or create contribution tracking for the user
    const currentDate = new Date();
    const period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    await prisma.contributionTracking.upsert({
      where: {
        userId_period: {
          userId: contributorId,
          period,
        },
      },
      update: {
        totalContributions: { increment: 1 },
        [`${type}Contributions`]: { increment: 1 },
        linesAdded: { increment: linesAdded },
        linesDeleted: { increment: linesDeleted },
        filesChanged: { increment: filesChanged },
        pointsEarned: { increment: pointsAwarded },
      },
      create: {
        userId: contributorId,
        period,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        totalContributions: 1,
        [`${type}Contributions`]: 1,
        linesAdded,
        linesDeleted,
        filesChanged,
        pointsEarned: pointsAwarded,
        projectsContributed: 1,
      },
    });

    return NextResponse.json({ contribution }, { status: 201 });
  } catch (error) {
    console.error("Contribution creation error:", error);
    return NextResponse.json(
      { error: "Failed to create contribution" },
      { status: 500 }
    );
  }
}
