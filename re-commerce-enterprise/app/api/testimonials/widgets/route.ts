
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const active = searchParams.get("active") !== "false";
    const published = searchParams.get("published") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      active,
      ...(published && { published: true })
    };

    const [widgets, total] = await Promise.all([
      prisma.testimonialWidget.findMany({
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
      prisma.testimonialWidget.count({ where: whereClause })
    ]);

    return NextResponse.json({
      widgets,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching testimonial widgets:", error);
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
      type,
      displayCount,
      autoRotate,
      rotateInterval,
      showRating,
      showAuthor,
      showCompany,
      showImage,
      theme,
      primaryColor,
      backgroundColor,
      textColor,
      borderRadius,
      filterCriteria,
      sortOrder,
      websiteUrl
    } = body;

    if (!tenantId || !name || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate embed code
    const widgetId = `testimonial-widget-${Date.now()}`;
    const embedCode = `<div id="${widgetId}"></div>
<script>
(function() {
  var script = document.createElement('script');
  script.src = '${process.env.NEXT_PUBLIC_APP_URL}/api/testimonials/widgets/${widgetId}/embed.js';
  document.head.appendChild(script);
})();
</script>`;

    const widget = await prisma.testimonialWidget.create({
      data: {
        tenantId,
        name,
        description,
        type,
        displayCount: displayCount || 3,
        autoRotate: autoRotate !== false,
        rotateInterval: rotateInterval || 5000,
        showRating: showRating !== false,
        showAuthor: showAuthor !== false,
        showCompany: showCompany !== false,
        showImage: showImage !== false,
        theme: theme || "default",
        primaryColor: primaryColor || "#0066cc",
        backgroundColor: backgroundColor || "#ffffff",
        textColor: textColor || "#333333",
        borderRadius: borderRadius || 8,
        filterCriteria: filterCriteria || {},
        sortOrder: sortOrder || "newest",
        embedCode,
        websiteUrl,
        active: true,
        published: false
      }
    });

    return NextResponse.json(widget, { status: 201 });

  } catch (error) {
    console.error("Error creating testimonial widget:", error);
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
        { error: "Widget ID required" },
        { status: 400 }
      );
    }

    const widget = await prisma.testimonialWidget.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(widget);

  } catch (error) {
    console.error("Error updating testimonial widget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
