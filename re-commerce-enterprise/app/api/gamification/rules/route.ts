
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = { tenantId };
    if (type) whereClause.type = type;
    if (category) whereClause.category = category;
    if (isActive !== null) whereClause.isActive = isActive === "true";

    const rules = await prisma.gamificationRule.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.gamificationRule.count({
      where: whereClause,
    });

    return NextResponse.json({
      rules,
      pagination: {
        limit,
        offset,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Gamification rules fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gamification rules" },
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
      type,
      category,
      triggerEvent,
      triggerConditions = {},
      triggerLimit,
      pointRewards = {},
      achievementIds = [],
      bonusMultiplier = 1.0,
      isActive = true,
      validFrom,
      validUntil,
      applicableRoles = [],
      minimumLevel = 1,
      maximumLevel,
    } = body;

    if (!tenantId || !name || !type || !triggerEvent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rule = await prisma.gamificationRule.create({
      data: {
        tenantId,
        name,
        description,
        type,
        category,
        triggerEvent,
        triggerConditions,
        triggerLimit,
        pointRewards,
        achievementIds,
        bonusMultiplier,
        isActive,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: validUntil ? new Date(validUntil) : null,
        applicableRoles,
        minimumLevel,
        maximumLevel,
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error("Gamification rule creation error:", error);
    return NextResponse.json(
      { error: "Failed to create gamification rule" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
    }

    const rule = await prisma.gamificationRule.update({
      where: { id },
      data: {
        ...updateData,
        validFrom: updateData.validFrom ? new Date(updateData.validFrom) : undefined,
        validUntil: updateData.validUntil ? new Date(updateData.validUntil) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ rule });
  } catch (error) {
    console.error("Gamification rule update error:", error);
    return NextResponse.json(
      { error: "Failed to update gamification rule" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
    }

    await prisma.gamificationRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gamification rule deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete gamification rule" },
      { status: 500 }
    );
  }
}
