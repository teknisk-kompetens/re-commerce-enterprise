
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const initiatorId = searchParams.get("initiatorId");
    const templateId = searchParams.get("templateId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const accessLevel = searchParams.get("accessLevel");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(initiatorId && { initiatorId }),
      ...(templateId && { templateId }),
      ...(type && { type }),
      ...(status && { status }),
      ...(accessLevel && { accessLevel })
    };

    const [collaborations, total, statusStats] = await Promise.all([
      prisma.caseStudyCollaboration.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          template: {
            select: {
              name: true,
              industry: true,
              templateType: true
            }
          },
          initiator: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.caseStudyCollaboration.count({ where: whereClause }),
      prisma.caseStudyCollaboration.groupBy({
        by: ["status", "type"],
        where: { tenantId },
        _count: {
          status: true
        }
      })
    ]);

    return NextResponse.json({
      collaborations,
      statusStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching case study collaborations:", error);
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
      templateId,
      initiatorId,
      title,
      description,
      objective,
      participants,
      type,
      accessLevel,
      workflowSteps,
      approvalRequired,
      finalApprover,
      targetCompletion
    } = body;

    if (!tenantId || !initiatorId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collaboration = await prisma.caseStudyCollaboration.create({
      data: {
        tenantId,
        templateId,
        initiatorId,
        title,
        description,
        objective,
        participants: participants || [],
        type: type || "internal",
        accessLevel: accessLevel || "private",
        contentStatus: "draft",
        currentVersion: "1.0",
        versionHistory: [],
        workflowSteps: workflowSteps || [],
        approvalRequired: approvalRequired !== false,
        finalApprover,
        contentSections: [],
        sharedAssets: [],
        comments: [],
        targetCompletion: targetCompletion ? new Date(targetCompletion) : null,
        status: "active",
        progress: 0
      },
      include: {
        template: true,
        initiator: true
      }
    });

    return NextResponse.json(collaboration, { status: 201 });

  } catch (error) {
    console.error("Error creating case study collaboration:", error);
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
        { error: "Collaboration ID required" },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects if present
    if (updateData.targetCompletion) {
      updateData.targetCompletion = new Date(updateData.targetCompletion);
    }

    // Handle completion tracking
    if (updateData.status === "completed" && !updateData.actualCompletion) {
      updateData.actualCompletion = new Date();
      updateData.progress = 100;
    }

    const collaboration = await prisma.caseStudyCollaboration.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        template: true,
        initiator: true
      }
    });

    return NextResponse.json(collaboration);

  } catch (error) {
    console.error("Error updating case study collaboration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
