
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const developerId = searchParams.get("developerId");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {
      ...(developerId && { developerId }),
      ...(category && { category }),
      ...(status && { status }),
    };

    const plugins = await prisma.plugin.findMany({
      where: whereClause,
      include: {
        developer: {
          select: { id: true, name: true, email: true },
        },
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: {
            versions: true,
            installations: true,
            reviews: true,
          },
        },
      },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      plugins,
      pagination: {
        limit,
        offset,
        total: await prisma.plugin.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Plugins fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plugins" },
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
      developerId,
      manifest = {},
      permissions = [],
      dependencies = [],
      licenseType = "MIT",
      tags = [],
    } = body;

    if (!name || !displayName || !description || !slug || !category || !developerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plugin = await prisma.plugin.create({
      data: {
        name,
        displayName,
        description,
        slug,
        category,
        developerId,
        manifest,
        permissions,
        dependencies,
        licenseType,
        tags,
        status: "draft",
      },
      include: {
        developer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ plugin }, { status: 201 });
  } catch (error) {
    console.error("Plugin creation error:", error);
    return NextResponse.json(
      { error: "Failed to create plugin" },
      { status: 500 }
    );
  }
}
