
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const maintainerId = searchParams.get("maintainerId");
    const category = searchParams.get("category");
    const language = searchParams.get("language");
    const status = searchParams.get("status") ?? "active";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {
      status,
      visibility: "public",
      ...(maintainerId && { maintainerId }),
      ...(category && { category }),
      ...(language && { language }),
    };

    const projects = await prisma.openSourceProject.findMany({
      where: whereClause,
      include: {
        maintainer: {
          select: { id: true, name: true, email: true },
        },
        contributions: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            contributor: {
              select: { id: true, name: true },
            },
          },
        },
        releases: {
          take: 3,
          orderBy: { publishedAt: "desc" },
        },
        qualityMetrics: {
          take: 1,
          orderBy: { analysisDate: "desc" },
        },
        _count: {
          select: {
            contributions: true,
            releases: true,
          },
        },
      },
      orderBy: [
        { lastActivityAt: "desc" },
        { starCount: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      projects,
      pagination: {
        limit,
        offset,
        total: await prisma.openSourceProject.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Open source projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      slug,
      maintainerId,
      repositoryUrl,
      category,
      language,
      languages = [],
      topics = [],
      tags = [],
      license,
      contributionGuide,
      codeOfConduct,
    } = body;

    if (!name || !description || !slug || !maintainerId || !repositoryUrl || !category || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await prisma.openSourceProject.create({
      data: {
        name,
        description,
        slug,
        maintainerId,
        repositoryUrl,
        category,
        language,
        languages,
        topics,
        tags,
        license,
        contributionGuide,
        codeOfConduct,
        status: "active",
      },
      include: {
        maintainer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Open source project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
