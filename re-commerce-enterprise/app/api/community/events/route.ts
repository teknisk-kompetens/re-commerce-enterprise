
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const type = searchParams.get("type");
    const status = searchParams.get("status") ?? "published";
    const upcoming = searchParams.get("upcoming") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      status,
      ...(type && { type }),
      ...(upcoming && { startTime: { gte: new Date() } }),
    };

    const events = await prisma.communityEvent.findMany({
      where: whereClause,
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        registrations: {
          select: { id: true, status: true },
        },
        _count: {
          select: { registrations: true, feedback: true },
        },
      },
      orderBy: { startTime: upcoming ? "asc" : "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      events,
      pagination: {
        limit,
        offset,
        total: await prisma.communityEvent.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
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
      startTime,
      endTime,
      organizerId,
      location,
      maxAttendees,
      price = 0.0,
      registrationRequired = true,
    } = body;

    if (!tenantId || !title || !slug || !type || !startTime || !endTime || !organizerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.communityEvent.create({
      data: {
        tenantId,
        title,
        description,
        slug,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        organizerId,
        location,
        maxAttendees,
        price,
        registrationRequired,
        status: "draft",
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
