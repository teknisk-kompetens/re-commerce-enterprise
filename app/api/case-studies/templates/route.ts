
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const industry = searchParams.get("industry");
    const useCase = searchParams.get("useCase");
    const companySize = searchParams.get("companySize");
    const templateType = searchParams.get("templateType");
    const featured = searchParams.get("featured") === "true";
    const isPublic = searchParams.get("public") !== "false";
    const premium = searchParams.get("premium") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      public: isPublic,
      deprecated: false,
      ...(industry && { industry }),
      ...(useCase && { useCase }),
      ...(companySize && { companySize }),
      ...(templateType && { templateType }),
      ...(featured && { featured: true }),
      ...(premium && { premium: true })
    };

    const [templates, total, categoryStats] = await Promise.all([
      prisma.caseStudyTemplate.findMany({
        where: whereClause,
        orderBy: [{ featured: "desc" }, { rating: "desc" }, { usageCount: "desc" }],
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              collaborations: true,
              analytics: true,
              distributions: true
            }
          }
        }
      }),
      prisma.caseStudyTemplate.count({ where: whereClause }),
      prisma.caseStudyTemplate.groupBy({
        by: ["industry", "templateType"],
        where: { tenantId, public: true },
        _count: {
          industry: true
        }
      })
    ]);

    // Convert Decimal fields for templates
    const serializedTemplates = templates.map(template => ({
      ...template,
      rating: template.rating.toNumber(),
      price: template.price.toNumber()
    }));

    return NextResponse.json({
      templates: serializedTemplates,
      categoryStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching case study templates:", error);
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
      industry,
      useCase,
      companySize,
      sections,
      fields,
      layout,
      templateType,
      difficulty,
      estimatedTime,
      guidelines,
      examples,
      tips,
      templateFile,
      previewImages,
      sampleContent,
      featured,
      public: isPublic,
      premium,
      price,
      currency,
      version
    } = body;

    if (!tenantId || !name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const template = await prisma.caseStudyTemplate.create({
      data: {
        tenantId,
        name,
        description,
        industry,
        useCase,
        companySize,
        sections: sections || [],
        fields: fields || [],
        layout: layout || {},
        templateType: templateType || "standard",
        difficulty: difficulty || "medium",
        estimatedTime,
        guidelines: guidelines || [],
        examples: examples || [],
        tips: tips || [],
        templateFile,
        previewImages: previewImages || [],
        sampleContent: sampleContent || {},
        usageCount: 0,
        rating: new Decimal(0),
        ratingCount: 0,
        featured: featured || false,
        public: isPublic !== false,
        premium: premium || false,
        price: new Decimal(price || 0),
        currency: currency || "USD",
        version: version || "1.0",
        deprecated: false
      }
    });

    // Convert Decimal fields for response
    const serializedTemplate = {
      ...template,
      rating: template.rating.toNumber(),
      price: template.price.toNumber()
    };

    return NextResponse.json(serializedTemplate, { status: 201 });

  } catch (error) {
    console.error("Error creating case study template:", error);
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
        { error: "Template ID required" },
        { status: 400 }
      );
    }

    // Convert Decimal fields if present
    if (updateData.rating !== undefined) {
      updateData.rating = new Decimal(updateData.rating);
    }
    if (updateData.price !== undefined) {
      updateData.price = new Decimal(updateData.price);
    }

    // Update usage tracking
    if (updateData.incrementUsage) {
      delete updateData.incrementUsage;
      updateData.usageCount = { increment: 1 };
      updateData.lastUpdated = new Date();
    }

    const template = await prisma.caseStudyTemplate.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    // Convert Decimal fields for response
    const serializedTemplate = {
      ...template,
      rating: template.rating.toNumber(),
      price: template.price.toNumber()
    };

    return NextResponse.json(serializedTemplate);

  } catch (error) {
    console.error("Error updating case study template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
