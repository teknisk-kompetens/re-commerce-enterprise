
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const forums = await prisma.communityForum.findMany({
      where: {
        tenantId,
        ...(category && { category }),
        isArchived: false,
      },
      include: {
        threads: {
          take: 5,
          orderBy: { lastPostAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: {
            threads: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" },
        { lastActivity: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      forums,
      pagination: {
        limit,
        offset,
        total: await prisma.communityForum.count({
          where: { tenantId, isArchived: false },
        }),
      },
    });
  } catch (error) {
    console.error("Community forums fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch forums" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      name,
      description,
      slug,
      category = "general",
      isPrivate = false,
      rules,
      createdBy,
    } = body;

    if (!tenantId || !name || !slug || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const forum = await prisma.communityForum.create({
      data: {
        tenantId,
        name,
        description,
        slug,
        category,
        isPrivate,
        rules,
        createdBy,
        memberCount: 1,
      },
      include: {
        _count: {
          select: { threads: true },
        },
      },
    });

    return NextResponse.json({ forum }, { status: 201 });
  } catch (error) {
    console.error("Forum creation error:", error);
    return NextResponse.json(
      { error: "Failed to create forum" },
      { status: 500 }
    );
  }
}
