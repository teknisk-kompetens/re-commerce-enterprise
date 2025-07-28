
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const published = searchParams.get("published") !== "false";
    const featured = searchParams.get("featured") === "true";
    const type = searchParams.get("type");
    const rating = searchParams.get("rating");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      published,
      ...(status && { status }),
      ...(featured && { featured: true }),
      ...(type && { type }),
      ...(rating && { rating: { gte: parseInt(rating) } })
    };

    let orderBy: any = { createdAt: "desc" };

    const [testimonials, total, stats] = await Promise.all([
      prisma.testimonial.findMany({
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
          story: {
            select: {
              title: true,
              industry: true,
              useCase: true
            }
          }
        }
      }),
      prisma.testimonial.count({ where: whereClause }),
      prisma.testimonial.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: {
          status: true
        }
      })
    ]);

    return NextResponse.json({
      testimonials,
      stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching testimonials:", error);
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
      storyId,
      content,
      rating,
      headline,
      authorName,
      authorTitle,
      authorCompany,
      authorEmail,
      authorImage,
      type,
      format,
      videoUrl,
      audioUrl,
      imageUrl,
      attachments,
      collectionMethod,
      collectedBy,
      allowPublicUse,
      allowMarketing,
      allowCaseStudy,
      allowWebsite,
      allowSocial,
      category,
      tags,
      keywords
    } = body;

    if (!tenantId || !content || !authorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        tenantId,
        customerId,
        storyId,
        content,
        rating,
        headline,
        authorName,
        authorTitle,
        authorCompany,
        authorEmail,
        authorImage,
        type: type || "text",
        format: format || "short",
        videoUrl,
        audioUrl,
        imageUrl,
        attachments: attachments || [],
        collectionMethod,
        collectedBy,
        collectedAt: new Date(),
        allowPublicUse: allowPublicUse || false,
        allowMarketing: allowMarketing || false,
        allowCaseStudy: allowCaseStudy || false,
        allowWebsite: allowWebsite || false,
        allowSocial: allowSocial || false,
        category,
        tags: tags || [],
        keywords: keywords || [],
        status: "pending",
        published: false
      },
      include: {
        customer: true,
        story: true
      }
    });

    return NextResponse.json(testimonial, { status: 201 });

  } catch (error) {
    console.error("Error creating testimonial:", error);
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
        { error: "Testimonial ID required" },
        { status: 400 }
      );
    }

    if (updateData.status === "approved" && !updateData.publishedAt) {
      updateData.published = true;
      updateData.publishedAt = new Date();
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        customer: true,
        story: true
      }
    });

    return NextResponse.json(testimonial);

  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
