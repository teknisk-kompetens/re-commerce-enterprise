
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// POST /api/demo-builder/executions
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const execution = await prisma.demoExecution.create({
      data: {
        profileId: data.profileId,
        executionId: data.executionId,
        sessionId: data.sessionId,
        userId: data.userId,
        userRole: data.userPersonalization?.role,
        userIndustry: data.userPersonalization?.industry,
        userPainPoints: JSON.stringify(data.userPersonalization?.painPoints || []),
        userFocusAreas: JSON.stringify(data.userPersonalization?.focusAreas || []),
        totalSteps: data.totalSteps,
        interactions: JSON.stringify([]),
        feedbacks: JSON.stringify([]),
        aiResponses: JSON.stringify([]),
        personalizations: JSON.stringify(data.userPersonalization || {}),
        bouncePoints: JSON.stringify([])
      }
    });

    return NextResponse.json(execution, { status: 201 });
  } catch (error) {
    console.error('Error creating demo execution:', error);
    return NextResponse.json(
      { error: 'Failed to create demo execution' },
      { status: 500 }
    );
  }
}

// GET /api/demo-builder/executions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (profileId) where.profileId = profileId;
    if (sessionId) where.sessionId = sessionId;
    if (userId) where.userId = userId;

    const executions = await prisma.demoExecution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Parse JSON fields
    const formattedExecutions = executions.map(execution => ({
      ...execution,
      userPainPoints: typeof execution.userPainPoints === 'string' 
        ? JSON.parse(execution.userPainPoints) 
        : execution.userPainPoints,
      userFocusAreas: typeof execution.userFocusAreas === 'string' 
        ? JSON.parse(execution.userFocusAreas) 
        : execution.userFocusAreas,
      interactions: typeof execution.interactions === 'string' 
        ? JSON.parse(execution.interactions) 
        : execution.interactions,
      feedbacks: typeof execution.feedbacks === 'string' 
        ? JSON.parse(execution.feedbacks) 
        : execution.feedbacks,
      aiResponses: typeof execution.aiResponses === 'string' 
        ? JSON.parse(execution.aiResponses) 
        : execution.aiResponses,
      personalizations: typeof execution.personalizations === 'string' 
        ? JSON.parse(execution.personalizations) 
        : execution.personalizations,
      bouncePoints: typeof execution.bouncePoints === 'string' 
        ? JSON.parse(execution.bouncePoints) 
        : execution.bouncePoints
    }));

    return NextResponse.json(formattedExecutions);
  } catch (error) {
    console.error('Error fetching demo executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo executions' },
      { status: 500 }
    );
  }
}
