
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status") ?? "published";
    const creatorId = searchParams.get("creatorId");
    const sortBy = searchParams.get("sortBy") ?? "newest";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {
      status,
      visibility: "public",
      ...(category && { category }),
      ...(creatorId && { creatorId }),
    };

    let orderBy: any = { createdAt: "desc" };
    switch (sortBy) {
      case "popular":
        orderBy = { usageCount: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "downloads":
        orderBy = { downloadCount: "desc" };
        break;
      case "newest":
        orderBy = { publishedAt: "desc" };
        break;
    }

    const widgets = await prisma.marketplaceWidget.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        reviews: {
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
            reviews: true,
            downloads: true,
            favorites: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      widgets,
      pagination: {
        limit,
        offset,
        total: await prisma.marketplaceWidget.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Marketplace widgets fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch widgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      displayName,
      description,
      slug,
      category,
      creatorId,
      widgetType,
      sourceCode,
      configSchema = {},
      tags = [],
      price = 0.0,
      licenseType = "MIT",
      isOpenSource = true,
    } = body;

    if (!name || !displayName || !description || !slug || !category || !creatorId || !widgetType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const widget = await prisma.marketplaceWidget.create({
      data: {
        name,
        displayName,
        description,
        slug,
        category,
        creatorId,
        widgetType,
        sourceCode,
        configSchema,
        tags,
        price,
        licenseType,
        isOpenSource,
        status: "draft",
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ widget }, { status: 201 });
  } catch (error) {
    console.error("Widget creation error:", error);
    return NextResponse.json(
      { error: "Failed to create widget" },
      { status: 500 }
    );
  }
}
