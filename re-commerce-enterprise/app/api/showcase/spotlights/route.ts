
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const featured = searchParams.get("featured") === "true";
    const published = searchParams.get("published") !== "false";
    const upcoming = searchParams.get("upcoming") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const now = new Date();
    const whereClause: any = {
      tenantId,
      published,
      ...(featured && { featured: true }),
      ...(upcoming && {
        scheduledFor: {
          gte: now
        }
      })
    };

    let orderBy: any = { createdAt: "desc" };
    if (upcoming) {
      orderBy = { scheduledFor: "asc" };
    }

    const [spotlights, total] = await Promise.all([
      prisma.customerSpotlight.findMany({
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
              description: true,
              keyMetrics: true
            }
          }
        }
      }),
      prisma.customerSpotlight.count({ where: whereClause })
    ]);

    return NextResponse.json({
      spotlights,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching customer spotlights:", error);
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
      title,
      subtitle,
      description,
      content,
      heroImage,
      portraits,
      videoUrl,
      quote,
      quotee,
      quoteeTitle,
      scheduledFor,
      expiresAt,
      channels
    } = body;

    if (!tenantId || !customerId || !title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const spotlight = await prisma.customerSpotlight.create({
      data: {
        tenantId,
        customerId,
        storyId,
        title,
        subtitle,
        description,
        content,
        heroImage,
        portraits: portraits || [],
        videoUrl,
        quote,
        quotee,
        quoteeTitle,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        channels: channels || [],
        published: false
      },
      include: {
        customer: true,
        story: true
      }
    });

    return NextResponse.json(spotlight, { status: 201 });

  } catch (error) {
    console.error("Error creating customer spotlight:", error);
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
        { error: "Spotlight ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.scheduledFor) {
      updateData.scheduledFor = new Date(updateData.scheduledFor);
    }
    if (updateData.expiresAt) {
      updateData.expiresAt = new Date(updateData.expiresAt);
    }
    if (updateData.published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const spotlight = await prisma.customerSpotlight.update({
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

    return NextResponse.json(spotlight);

  } catch (error) {
    console.error("Error updating customer spotlight:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
