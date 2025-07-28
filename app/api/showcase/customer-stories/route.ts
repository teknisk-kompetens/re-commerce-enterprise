
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const industry = searchParams.get("industry");
    const companySize = searchParams.get("companySize");
    const featured = searchParams.get("featured") === "true";
    const verified = searchParams.get("verified") === "true";
    const published = searchParams.get("published") !== "false";
    const sortBy = searchParams.get("sortBy") ?? "newest";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const searchQuery = searchParams.get("search");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      published,
      ...(industry && { industry }),
      ...(companySize && { companySize }),
      ...(featured && { featured: true }),
      ...(verified && { verified: true }),
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
          { industry: { contains: searchQuery, mode: "insensitive" } },
          { useCase: { contains: searchQuery, mode: "insensitive" } }
        ]
      })
    };

    let orderBy: any = { createdAt: "desc" };
    switch (sortBy) {
      case "popular":
        orderBy = { viewCount: "desc" };
        break;
      case "featured":
        orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
        break;
      case "verified":
        orderBy = [{ verified: "desc" }, { createdAt: "desc" }];
        break;
      case "industry":
        orderBy = { industry: "asc" };
        break;
    }

    const [stories, total] = await Promise.all([
      prisma.customerSuccessStory.findMany({
        where: whereClause,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          customer: {
            select: {
              companyName: true,
              logoUrl: true,
              industry: true,
              companySize: true
            }
          },
          author: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              testimonials: true,
              achievements: true,
              transformations: true
            }
          }
        }
      }),
      prisma.customerSuccessStory.count({ where: whereClause })
    ]);

    return NextResponse.json({
      stories,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching customer success stories:", error);
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
      title,
      description,
      content,
      industry,
      companySize,
      useCase,
      heroImage,
      gallery,
      videoUrl,
      attachments,
      timeline,
      challenges,
      solutions,
      outcomes,
      keyMetrics,
      roiData,
      beforeAfter,
      tags,
      category,
      priority,
      authorId,
      allowPublicSharing,
      allowCaseStudyUse,
      allowMarketingUse
    } = body;

    if (!tenantId || !title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const story = await prisma.customerSuccessStory.create({
      data: {
        tenantId,
        customerId,
        title,
        description,
        content,
        industry,
        companySize,
        useCase,
        heroImage,
        gallery: gallery || [],
        videoUrl,
        attachments: attachments || [],
        timeline,
        challenges: challenges || [],
        solutions: solutions || [],
        outcomes: outcomes || [],
        keyMetrics: keyMetrics || [],
        roiData: roiData || {},
        beforeAfter: beforeAfter || {},
        tags: tags || [],
        category,
        priority: priority || 0,
        authorId,
        allowPublicSharing: allowPublicSharing !== false,
        allowCaseStudyUse: allowCaseStudyUse || false,
        allowMarketingUse: allowMarketingUse || false,
        published: false, // Start as draft
        verified: false
      },
      include: {
        customer: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(story, { status: 201 });

  } catch (error) {
    console.error("Error creating customer success story:", error);
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
        { error: "Story ID required" },
        { status: 400 }
      );
    }

    const story = await prisma.customerSuccessStory.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        customer: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(story);

  } catch (error) {
    console.error("Error updating customer success story:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
