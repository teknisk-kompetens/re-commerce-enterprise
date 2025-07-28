
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const featured = searchParams.get("featured") === "true";
    const verified = searchParams.get("verified") === "true";
    const quoteType = searchParams.get("quoteType");
    const category = searchParams.get("category");
    const allowMarketing = searchParams.get("allowMarketing") === "true";
    const customerId = searchParams.get("customerId");
    const storyId = searchParams.get("storyId");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(featured && { featured: true }),
      ...(verified && { verified: true }),
      ...(quoteType && { quoteType }),
      ...(category && { category }),
      ...(allowMarketing && { allowMarketing: true }),
      ...(customerId && { customerId }),
      ...(storyId && { storyId })
    };

    const [quotes, total, typeStats] = await Promise.all([
      prisma.successQuote.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { effectiveness: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
        include: {
          customer: {
            select: {
              companyName: true,
              industry: true,
              companySize: true,
              logoUrl: true
            }
          },
          story: {
            select: {
              title: true,
              industry: true,
              useCase: true
            }
          }
        }
      }),
      prisma.successQuote.count({ where: whereClause }),
      prisma.successQuote.groupBy({
        by: ["quoteType", "category"],
        where: { tenantId },
        _count: {
          quoteType: true
        }
      })
    ]);

    // Convert Decimal fields for quotes
    const serializedQuotes = quotes.map(quote => ({
      ...quote,
      effectiveness: quote.effectiveness?.toNumber() || null
    }));

    return NextResponse.json({
      quotes: serializedQuotes,
      typeStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching success quotes:", error);
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
      storyId,
      quote,
      attribution,
      title,
      company,
      context,
      quoteType,
      category,
      keywords,
      originalSource,
      sourceUrl,
      dateGiven,
      allowMarketing,
      allowWebsite,
      allowSocial,
      allowPrint,
      attributionRequired,
      authorImage,
      companyLogo,
      designTemplate,
      featured,
      verified
    } = body;

    if (!tenantId || !quote || !attribution) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const successQuote = await prisma.successQuote.create({
      data: {
        tenantId,
        customerId,
        storyId,
        quote,
        attribution,
        title,
        company,
        context,
        quoteType: quoteType || "testimonial",
        category,
        keywords: keywords || [],
        originalSource,
        sourceUrl,
        dateGiven: dateGiven ? new Date(dateGiven) : null,
        allowMarketing: allowMarketing || false,
        allowWebsite: allowWebsite || false,
        allowSocial: allowSocial || false,
        allowPrint: allowPrint || false,
        attributionRequired: attributionRequired !== false,
        authorImage,
        companyLogo,
        designTemplate,
        featured: featured || false,
        verified: verified || false,
        usageCount: 0
      },
      include: {
        customer: true,
        story: true
      }
    });

    // Convert Decimal fields for response
    const serializedQuote = {
      ...successQuote,
      effectiveness: successQuote.effectiveness?.toNumber() || null
    };

    return NextResponse.json(serializedQuote, { status: 201 });

  } catch (error) {
    console.error("Error creating success quote:", error);
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
        { error: "Quote ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.dateGiven) {
      updateData.dateGiven = new Date(updateData.dateGiven);
    }

    // Convert effectiveness to Decimal if present
    if (updateData.effectiveness !== undefined) {
      updateData.effectiveness = updateData.effectiveness ? new Decimal(updateData.effectiveness) : null;
    }

    // Update usage tracking
    if (updateData.incrementUsage) {
      delete updateData.incrementUsage;
      updateData.usageCount = { increment: 1 };
    }

    const successQuote = await prisma.successQuote.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        customer: true,
        story: true
      }
    });

    // Convert Decimal fields for response
    const serializedQuote = {
      ...successQuote,
      effectiveness: successQuote.effectiveness?.toNumber() || null
    };

    return NextResponse.json(serializedQuote);

  } catch (error) {
    console.error("Error updating success quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
