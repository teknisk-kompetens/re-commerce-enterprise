
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/expansion-roadmap - Get expansion roadmaps for tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const phase = searchParams.get('phase');
    const targetRegion = searchParams.get('targetRegion');

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (status) where.status = status;
    if (phase) where.phase = phase;
    if (targetRegion) where.targetRegion = targetRegion;

    const roadmaps = await prisma.expansionRoadmap.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { plannedLaunch: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate roadmap analytics
    const analytics = {
      totalRoadmaps: roadmaps.length,
      byStatus: roadmaps.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as any),
      byPhase: roadmaps.reduce((acc, r) => {
        acc[r.phase] = (acc[r.phase] || 0) + 1;
        return acc;
      }, {} as any),
      totalInvestment: roadmaps.reduce((sum, r) => sum + (r.estimatedCost || 0), 0),
      actualSpent: roadmaps.reduce((sum, r) => sum + (r.actualCost || 0), 0),
      averageProgress: roadmaps.reduce((sum, r) => sum + r.progressPercent, 0) / roadmaps.length,
      regionsTargeted: [...new Set(roadmaps.flatMap(r => r.targetCountries))].length,
      languagesTargeted: [...new Set(roadmaps.flatMap(r => r.targetLanguages))].length,
      currenciesTargeted: [...new Set(roadmaps.flatMap(r => r.targetCurrencies))].length
    };

    // Add timeline analysis
    const timeline = roadmaps
      .filter(r => r.plannedLaunch)
      .sort((a, b) => new Date(a.plannedLaunch!).getTime() - new Date(b.plannedLaunch!).getTime())
      .map(r => ({
        id: r.id,
        targetRegion: r.targetRegion,
        phase: r.phase,
        plannedLaunch: r.plannedLaunch,
        actualLaunch: r.actualLaunch,
        status: r.status,
        progressPercent: r.progressPercent
      }));

    return NextResponse.json({
      success: true,
      data: roadmaps,
      analytics,
      timeline,
      summary: {
        active: roadmaps.filter(r => r.status === 'in_progress').length,
        launched: roadmaps.filter(r => r.status === 'launched').length,
        planned: roadmaps.filter(r => r.status === 'planning').length,
        paused: roadmaps.filter(r => r.status === 'paused').length
      }
    });

  } catch (error) {
    console.error('Error fetching expansion roadmaps:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expansion roadmaps' },
      { status: 500 }
    );
  }
}

// POST /api/expansion-roadmap - Create new expansion roadmap
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      tenantId,
      targetRegion,
      targetCountries = [],
      targetLanguages = [],
      targetCurrencies = [],
      phase = 'research',
      plannedLaunch,
      actualLaunch,
      requirements = [],
      prerequisites = [],
      risks = [],
      mitigations = [],
      estimatedCost,
      actualCost,
      budgetAllocated,
      progressPercent = 0,
      milestones = [],
      completedTasks = [],
      pendingTasks = [],
      targetMetrics = {},
      actualMetrics = {},
      roi,
      status = 'planning',
      statusReason,
      projectManager,
      teamMembers = [],
      externalPartners = [],
      createdBy
    } = body;

    // Validate required fields
    if (!tenantId || !targetRegion) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID and target region are required' },
        { status: 400 }
      );
    }

    const roadmap = await prisma.expansionRoadmap.create({
      data: {
        tenantId,
        targetRegion,
        targetCountries,
        targetLanguages,
        targetCurrencies,
        phase,
        plannedLaunch: plannedLaunch ? new Date(plannedLaunch) : null,
        actualLaunch: actualLaunch ? new Date(actualLaunch) : null,
        requirements,
        prerequisites,
        risks,
        mitigations,
        estimatedCost,
        actualCost,
        budgetAllocated,
        progressPercent,
        milestones,
        completedTasks,
        pendingTasks,
        targetMetrics,
        actualMetrics,
        roi,
        status,
        statusReason,
        projectManager,
        teamMembers,
        externalPartners,
        createdBy
      }
    });

    return NextResponse.json({
      success: true,
      data: roadmap,
      message: 'Expansion roadmap created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating expansion roadmap:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create expansion roadmap' },
      { status: 500 }
    );
  }
}

// PUT /api/expansion-roadmap - Update expansion roadmap
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('id');
    const action = searchParams.get('action'); // start, pause, launch, complete, cancel
    
    if (!roadmapId) {
      return NextResponse.json(
        { success: false, error: 'Roadmap ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    let updateData: any = { ...body };

    // Handle specific actions
    if (action === 'start') {
      updateData.status = 'in_progress';
      updateData.phase = 'planning';
    } else if (action === 'pause') {
      updateData.status = 'paused';
      updateData.statusReason = body.reason || 'Paused for review';
    } else if (action === 'launch') {
      updateData.status = 'launched';
      updateData.actualLaunch = new Date();
      updateData.phase = 'launch';
      updateData.progressPercent = 100;
    } else if (action === 'complete') {
      updateData.status = 'launched';
      updateData.phase = 'scale';
      updateData.progressPercent = 100;
    } else if (action === 'cancel') {
      updateData.status = 'cancelled';
      updateData.statusReason = body.reason || 'Project cancelled';
    }

    // Convert date strings to Date objects if present
    if (updateData.plannedLaunch) updateData.plannedLaunch = new Date(updateData.plannedLaunch);
    if (updateData.actualLaunch) updateData.actualLaunch = new Date(updateData.actualLaunch);

    const roadmap = await prisma.expansionRoadmap.update({
      where: { id: roadmapId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: roadmap,
      message: 'Expansion roadmap updated successfully'
    });

  } catch (error) {
    console.error('Error updating expansion roadmap:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update expansion roadmap' },
      { status: 500 }
    );
  }
}

// DELETE /api/expansion-roadmap - Delete expansion roadmap
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('id');
    
    if (!roadmapId) {
      return NextResponse.json(
        { success: false, error: 'Roadmap ID is required' },
        { status: 400 }
      );
    }

    // Check if roadmap is in active phase
    const roadmap = await prisma.expansionRoadmap.findUnique({
      where: { id: roadmapId },
      select: { status: true, phase: true }
    });

    if (roadmap && ['in_progress', 'launched'].includes(roadmap.status)) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete active or launched expansion roadmap' },
        { status: 409 }
      );
    }

    await prisma.expansionRoadmap.delete({
      where: { id: roadmapId }
    });

    return NextResponse.json({
      success: true,
      message: 'Expansion roadmap deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting expansion roadmap:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete expansion roadmap' },
      { status: 500 }
    );
  }
}
