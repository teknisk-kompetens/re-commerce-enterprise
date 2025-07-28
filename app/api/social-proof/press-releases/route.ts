
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const releaseType = searchParams.get("releaseType");
    const industry = searchParams.get("industry");
    const status = searchParams.get("status");
    const published = searchParams.get("published") === "true";
    const year = searchParams.get("year");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(releaseType && { releaseType }),
      ...(industry && { industry }),
      ...(status && { status }),
      ...(year && {
        publishedDate: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${parseInt(year) + 1}-01-01`)
        }
      })
    };

    if (published) {
      whereClause.status = "published";
      whereClause.publishedDate = { not: null };
    }

    const [pressReleases, total, statusStats, typeStats] = await Promise.all([
      prisma.pressRelease.findMany({
        where: whereClause,
        orderBy: [{ publishedDate: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset
      }),
      prisma.pressRelease.count({ where: whereClause }),
      prisma.pressRelease.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: {
          status: true
        }
      }),
      prisma.pressRelease.groupBy({
        by: ["releaseType"],
        where: { tenantId },
        _count: {
          releaseType: true
        }
      })
    ]);

    return NextResponse.json({
      pressReleases,
      statusStats,
      typeStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching press releases:", error);
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
      headline,
      subheadline,
      content,
      summary,
      releaseType,
      industry,
      geography,
      sourceStoryId,
      sourceAwardId,
      quoteSources,
      distributionDate,
      publishedDate,
      embargoDate,
      featuredImage,
      additionalImages,
      downloadableAssets,
      mediaContact,
      companyContact,
      slug,
      metaDescription,
      keywords,
      distributionChannels
    } = body;

    if (!tenantId || !headline || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const generatedSlug = slug || headline.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const pressRelease = await prisma.pressRelease.create({
      data: {
        tenantId,
        headline,
        subheadline,
        content,
        summary,
        releaseType: releaseType || "customer-success",
        industry,
        geography,
        sourceStoryId,
        sourceAwardId,
        quoteSources: quoteSources || [],
        distributionDate: distributionDate ? new Date(distributionDate) : null,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        embargoDate: embargoDate ? new Date(embargoDate) : null,
        featuredImage,
        additionalImages: additionalImages || [],
        downloadableAssets: downloadableAssets || [],
        mediaContact: mediaContact || {},
        companyContact: companyContact || {},
        slug: generatedSlug,
        metaDescription,
        keywords: keywords || [],
        distributionChannels: distributionChannels || [],
        pickupTracking: [],
        views: 0,
        downloads: 0,
        mediaPickups: 0,
        socialShares: 0,
        status: "draft"
      }
    });

    return NextResponse.json(pressRelease, { status: 201 });

  } catch (error) {
    console.error("Error creating press release:", error);
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
        { error: "Press Release ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.distributionDate) {
      updateData.distributionDate = new Date(updateData.distributionDate);
    }
    if (updateData.publishedDate) {
      updateData.publishedDate = new Date(updateData.publishedDate);
    }
    if (updateData.embargoDate) {
      updateData.embargoDate = new Date(updateData.embargoDate);
    }

    // Handle status updates
    if (updateData.status === "published" && !updateData.publishedDate) {
      updateData.publishedDate = new Date();
    }
    if (updateData.status === "approved" && !updateData.approvedAt) {
      updateData.approvedAt = new Date();
    }

    const pressRelease = await prisma.pressRelease.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(pressRelease);

  } catch (error) {
    console.error("Error updating press release:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
