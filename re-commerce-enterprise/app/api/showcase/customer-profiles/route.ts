
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const industry = searchParams.get("industry");
    const companySize = searchParams.get("companySize");
    const advocacyScore = searchParams.get("advocacyScore");
    const allowShowcase = searchParams.get("allowShowcase") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const searchQuery = searchParams.get("search");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(industry && { industry }),
      ...(companySize && { companySize }),
      ...(allowShowcase && { allowShowcase: true }),
      ...(advocacyScore && { advocacyScore: { gte: parseInt(advocacyScore) } }),
      ...(searchQuery && {
        OR: [
          { companyName: { contains: searchQuery, mode: "insensitive" } },
          { industry: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } }
        ]
      })
    };

    const [customers, total] = await Promise.all([
      prisma.customerProfile.findMany({
        where: whereClause,
        orderBy: { advocacyScore: "desc" },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              successStories: true,
              testimonials: true,
              referrals: true,
              achievements: true
            }
          }
        }
      }),
      prisma.customerProfile.count({ where: whereClause })
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching customer profiles:", error);
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
      companyName,
      industry,
      companySize,
      website,
      logoUrl,
      primaryContact,
      billingContact,
      technicalContact,
      headquarters,
      employees,
      revenue,
      founded,
      description,
      customerSince,
      planType,
      contractValue,
      renewalDate,
      allowShowcase,
      allowTestimonials,
      allowCaseStudies,
      allowLogoUsage,
      allowReferrals
    } = body;

    if (!tenantId || !companyName || !industry || !companySize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customer = await prisma.customerProfile.create({
      data: {
        tenantId,
        companyName,
        industry,
        companySize,
        website,
        logoUrl,
        primaryContact: primaryContact || {},
        billingContact: billingContact || {},
        technicalContact: technicalContact || {},
        headquarters,
        employees,
        revenue,
        founded,
        description,
        customerSince: customerSince ? new Date(customerSince) : null,
        planType,
        contractValue,
        renewalDate: renewalDate ? new Date(renewalDate) : null,
        allowShowcase: allowShowcase || false,
        allowTestimonials: allowTestimonials || false,
        allowCaseStudies: allowCaseStudies || false,
        allowLogoUsage: allowLogoUsage || false,
        allowReferrals: allowReferrals || false
      }
    });

    return NextResponse.json(customer, { status: 201 });

  } catch (error) {
    console.error("Error creating customer profile:", error);
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
        { error: "Customer ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.customerSince) {
      updateData.customerSince = new Date(updateData.customerSince);
    }
    if (updateData.renewalDate) {
      updateData.renewalDate = new Date(updateData.renewalDate);
    }

    const customer = await prisma.customerProfile.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(customer);

  } catch (error) {
    console.error("Error updating customer profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
