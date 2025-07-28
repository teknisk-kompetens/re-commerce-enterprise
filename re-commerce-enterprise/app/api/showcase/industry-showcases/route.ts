
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const industry = searchParams.get("industry");
    const featured = searchParams.get("featured") === "true";
    const published = searchParams.get("published") !== "false";
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      published,
      ...(industry && { industry }),
      ...(featured && { featured: true })
    };

    const [showcases, total, industries] = await Promise.all([
      prisma.industryShowcase.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { viewCount: "desc" }],
        take: limit,
        skip: offset
      }),
      prisma.industryShowcase.count({ where: whereClause }),
      prisma.industryShowcase.groupBy({
        by: ["industry"],
        where: { tenantId, published: true },
        _count: {
          industry: true
        },
        orderBy: {
          _count: {
            industry: "desc"
          }
        }
      })
    ]);

    return NextResponse.json({
      showcases,
      industries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching industry showcases:", error);
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
      industry,
      title,
      description,
      content,
      storyIds,
      marketSize,
      growthRate,
      keyTrends,
      commonChallenges,
      solutions,
      averageROI,
      implementationTime,
      adoptionRate,
      heroImage,
      infographics,
      videoUrl,
      slug,
      metaTitle,
      metaDescription,
      keywords
    } = body;

    if (!tenantId || !industry || !title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const generatedSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const showcase = await prisma.industryShowcase.create({
      data: {
        tenantId,
        industry,
        title,
        description,
        content,
        storyIds: storyIds || [],
        marketSize,
        growthRate,
        keyTrends: keyTrends || [],
        commonChallenges: commonChallenges || [],
        solutions: solutions || [],
        averageROI,
        implementationTime,
        adoptionRate,
        heroImage,
        infographics: infographics || [],
        videoUrl,
        slug: generatedSlug,
        metaTitle,
        metaDescription,
        keywords: keywords || [],
        published: false
      }
    });

    return NextResponse.json(showcase, { status: 201 });

  } catch (error) {
    console.error("Error creating industry showcase:", error);
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
        { error: "Showcase ID required" },
        { status: 400 }
      );
    }

    if (updateData.published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const showcase = await prisma.industryShowcase.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(showcase);

  } catch (error) {
    console.error("Error updating industry showcase:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
