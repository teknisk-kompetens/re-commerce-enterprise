
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");
    const allowWebsite = searchParams.get("allowWebsite") === "true";
    const allowMarketing = searchParams.get("allowMarketing") === "true";
    const industry = searchParams.get("industry");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(featured && { featured: true }),
      ...(category && { category }),
      ...(allowWebsite && { allowWebsite: true }),
      ...(allowMarketing && { allowMarketing: true })
    };

    // Add industry filter through customer relation
    if (industry) {
      whereClause.customer = {
        industry
      };
    }

    const [logos, total, stats] = await Promise.all([
      prisma.customerLogo.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
        include: {
          customer: {
            select: {
              companyName: true,
              industry: true,
              companySize: true,
              website: true
            }
          }
        }
      }),
      prisma.customerLogo.count({ where: whereClause }),
      prisma.customerLogo.groupBy({
        by: ["category"],
        where: { tenantId },
        _count: {
          category: true
        }
      })
    ]);

    return NextResponse.json({
      logos,
      stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching customer logos:", error);
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
      logoUrl,
      companyName,
      altText,
      variations,
      sizes,
      allowWebsite,
      allowMarketing,
      allowPresentations,
      allowSocial,
      allowPrint,
      permissionGrantedBy,
      permissionExpiresAt,
      permissionNotes,
      featured,
      displayOrder,
      category
    } = body;

    if (!tenantId || !customerId || !logoUrl || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const logo = await prisma.customerLogo.create({
      data: {
        tenantId,
        customerId,
        logoUrl,
        companyName,
        altText,
        variations: variations || [],
        sizes: sizes || [],
        allowWebsite: allowWebsite || false,
        allowMarketing: allowMarketing || false,
        allowPresentations: allowPresentations || false,
        allowSocial: allowSocial || false,
        allowPrint: allowPrint || false,
        permissionGrantedBy,
        permissionGrantedAt: permissionGrantedBy ? new Date() : null,
        permissionExpiresAt: permissionExpiresAt ? new Date(permissionExpiresAt) : null,
        permissionNotes,
        featured: featured || false,
        displayOrder: displayOrder || 0,
        category
      },
      include: {
        customer: true
      }
    });

    return NextResponse.json(logo, { status: 201 });

  } catch (error) {
    console.error("Error creating customer logo:", error);
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
        { error: "Logo ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.permissionExpiresAt) {
      updateData.permissionExpiresAt = new Date(updateData.permissionExpiresAt);
    }

    // Update usage tracking
    if (updateData.incrementUsage) {
      delete updateData.incrementUsage;
      updateData.usageCount = { increment: 1 };
      updateData.lastUsedAt = new Date();
    }

    const logo = await prisma.customerLogo.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        customer: true
      }
    });

    return NextResponse.json(logo);

  } catch (error) {
    console.error("Error updating customer logo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
