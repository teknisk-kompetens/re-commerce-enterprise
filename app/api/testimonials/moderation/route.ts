
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const moderatorId = searchParams.get("moderatorId");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(status && { status }),
      ...(moderatorId && { moderatorId })
    };

    const [moderations, total] = await Promise.all([
      prisma.testimonialModeration.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          testimonial: {
            select: {
              content: true,
              authorName: true,
              authorCompany: true,
              rating: true,
              type: true
            }
          },
          moderator: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.testimonialModeration.count({ where: whereClause })
    ]);

    return NextResponse.json({
      moderations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching testimonial moderations:", error);
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
      testimonialId,
      moderatorId,
      action,
      reason,
      notes,
      changes,
      qualityScore,
      credibilityScore,
      usabilityScore
    } = body;

    if (!tenantId || !testimonialId || !moderatorId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create moderation record
    const moderation = await prisma.testimonialModeration.create({
      data: {
        tenantId,
        testimonialId,
        moderatorId,
        action,
        reason,
        notes,
        changes: changes || [],
        qualityScore,
        credibilityScore,
        usabilityScore,
        status: "completed"
      }
    });

    // Update testimonial based on action
    let testimonialUpdateData: any = {
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
      moderationNotes: notes
    };

    switch (action) {
      case "approve":
        testimonialUpdateData.status = "approved";
        testimonialUpdateData.published = true;
        testimonialUpdateData.publishedAt = new Date();
        break;
      case "reject":
        testimonialUpdateData.status = "rejected";
        testimonialUpdateData.published = false;
        break;
      case "flag":
        testimonialUpdateData.status = "needs-review";
        break;
    }

    await prisma.testimonial.update({
      where: { id: testimonialId },
      data: testimonialUpdateData
    });

    return NextResponse.json(moderation, { status: 201 });

  } catch (error) {
    console.error("Error creating testimonial moderation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
