
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(status && { status }),
      ...(type && { type })
    };

    const [campaigns, total] = await Promise.all([
      prisma.testimonialCollection.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              testimonials: true
            }
          }
        }
      }),
      prisma.testimonialCollection.count({ where: whereClause })
    ]);

    return NextResponse.json({
      campaigns,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching testimonial campaigns:", error);
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
      name,
      description,
      purpose,
      type,
      method,
      targetSegment,
      targetCount,
      template,
      questions,
      startDate,
      endDate,
      automated,
      reminderSchedule,
      followUpTemplate
    } = body;

    if (!tenantId || !name || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const campaign = await prisma.testimonialCollection.create({
      data: {
        tenantId,
        name,
        description,
        purpose,
        type: type || "email",
        method: method || "automated",
        targetSegment: targetSegment || {},
        targetCount,
        template: template || {},
        questions: questions || [],
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        automated: automated || false,
        reminderSchedule: reminderSchedule || [],
        followUpTemplate: followUpTemplate || {},
        status: "draft"
      }
    });

    return NextResponse.json(campaign, { status: 201 });

  } catch (error) {
    console.error("Error creating testimonial campaign:", error);
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
        { error: "Campaign ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const campaign = await prisma.testimonialCollection.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(campaign);

  } catch (error) {
    console.error("Error updating testimonial campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
