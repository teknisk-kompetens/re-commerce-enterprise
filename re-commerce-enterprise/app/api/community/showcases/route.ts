
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const status = searchParams.get("status") ?? "published";
    const featured = searchParams.get("featured") === "true";
    const creatorId = searchParams.get("creatorId");
    const sortBy = searchParams.get("sortBy") ?? "newest";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      status,
      ...(category && { category }),
      ...(featured && { isFeatured: true }),
      ...(creatorId && { creatorId }),
    };

    let orderBy: any = { createdAt: "desc" };
    switch (sortBy) {
      case "popular":
        orderBy = { viewCount: "desc" };
        break;
      case "liked":
        orderBy = { likeCount: "desc" };
        break;
      case "commented":
        orderBy = { commentCount: "desc" };
        break;
      case "newest":
        orderBy = { publishedAt: "desc" };
        break;
    }

    const showcases = await prisma.developerShowcase.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      showcases,
      pagination: {
        limit,
        offset,
        total: await prisma.developerShowcase.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Showcases fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch showcases" },
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
      category,
      creatorId,
      repositoryUrl,
      liveUrl,
      downloadUrl,
      documentationUrl,
      featuredImage,
      screenshots = [],
      videoUrl,
      technologies = [],
      frameworks = [],
      languages = [],
      tags = [],
      isOpenSource = false,
    } = body;

    if (!tenantId || !title || !slug || !category || !creatorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const showcase = await prisma.developerShowcase.create({
      data: {
        tenantId,
        title,
        description,
        slug,
        category,
        creatorId,
        repositoryUrl,
        liveUrl,
        downloadUrl,
        documentationUrl,
        featuredImage,
        screenshots,
        videoUrl,
        technologies,
        frameworks,
        languages,
        tags,
        isOpenSource,
        status: "draft",
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ showcase }, { status: 201 });
  } catch (error) {
    console.error("Showcase creation error:", error);
    return NextResponse.json(
      { error: "Failed to create showcase" },
      { status: 500 }
    );
  }
}
