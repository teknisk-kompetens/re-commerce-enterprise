
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status") ?? "approved";
    const featured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sortBy") ?? "popularity";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {
      status,
      visibility: "public",
      ...(category && { category }),
    };

    let orderBy: any = { createdAt: "desc" };
    switch (sortBy) {
      case "popularity":
        orderBy = { installCount: "desc" };
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

    const plugins = await prisma.plugin.findMany({
      where: whereClause,
      include: {
        developer: {
          select: { id: true, name: true, email: true },
        },
        versions: {
          where: { status: "stable" },
          orderBy: { createdAt: "desc" },
          take: 1,
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
            versions: true,
            installations: true,
            reviews: true,
          },
        },
      },
      orderBy,
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
    console.error("Plugin marketplace fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace plugins" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pluginId, userId, tenantId, action } = body;

    if (!pluginId || !userId || !tenantId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action === "install") {
      // Get the latest stable version
      const latestVersion = await prisma.pluginVersion.findFirst({
        where: {
          pluginId,
          status: "stable",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!latestVersion) {
        return NextResponse.json(
          { error: "No stable version available" },
          { status: 400 }
        );
      }

      // Check if already installed
      const existingInstallation = await prisma.pluginInstallation.findUnique({
        where: {
          pluginId_userId_tenantId: {
            pluginId,
            userId,
            tenantId,
          },
        },
      });

      if (existingInstallation) {
        return NextResponse.json(
          { error: "Plugin already installed" },
          { status: 409 }
        );
      }

      // Create installation
      const installation = await prisma.pluginInstallation.create({
        data: {
          pluginId,
          versionId: latestVersion.id,
          userId,
          tenantId,
          status: "installed",
          installMethod: "marketplace",
        },
      });

      // Update plugin statistics
      await prisma.plugin.update({
        where: { id: pluginId },
        data: {
          installCount: { increment: 1 },
          activeInstalls: { increment: 1 },
        },
      });

      await prisma.pluginVersion.update({
        where: { id: latestVersion.id },
        data: { installCount: { increment: 1 } },
      });

      return NextResponse.json({ installation }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Plugin marketplace action error:", error);
    return NextResponse.json(
      { error: "Failed to perform marketplace action" },
      { status: 500 }
    );
  }
}
