
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// POST /api/demo-builder/executions/[id]/complete
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { completion, interactions, satisfaction, feedbacks } = await request.json();

    const execution = await prisma.demoExecution.update({
      where: { executionId: params.id },
      data: {
        completedAt: new Date(),
        completion: completion || 100,
        status: 'completed',
        satisfaction: satisfaction,
        interactions: JSON.stringify(interactions || []),
        feedbacks: JSON.stringify(feedbacks || []),
        duration: Math.floor((new Date().getTime() - new Date().getTime()) / 1000) // Calculate actual duration
      }
    });

    // Update profile popularity
    await prisma.demoProfile.update({
      where: { id: execution.profileId },
      data: {
        popularity: { increment: 1 },
        lastUsed: new Date()
      }
    });

    return NextResponse.json(execution);
  } catch (error) {
    console.error('Error completing demo execution:', error);
    return NextResponse.json(
      { error: 'Failed to complete demo execution' },
      { status: 500 }
    );
  }
}
