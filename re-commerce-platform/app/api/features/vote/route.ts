
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { featureId, voteType, sessionId } = await request.json()

    if (!featureId || !sessionId) {
      return NextResponse.json(
        { error: 'Feature ID and session ID are required' },
        { status: 400 }
      )
    }

    // Check if user has already voted
    const existingVote = await prisma.featureVote.findUnique({
      where: {
        sessionId_featureId: {
          sessionId,
          featureId: parseInt(featureId)
        }
      }
    })

    if (voteType === 'remove') {
      // Remove vote
      if (existingVote) {
        await prisma.featureVote.delete({
          where: {
            id: existingVote.id
          }
        })
      }
    } else {
      // Add or update vote
      if (existingVote) {
        await prisma.featureVote.update({
          where: {
            id: existingVote.id
          },
          data: {
            voteType
          }
        })
      } else {
        await prisma.featureVote.create({
          data: {
            sessionId,
            featureId: parseInt(featureId),
            voteType
          }
        })
      }
    }

    // Get updated vote counts
    const votes = await prisma.featureVote.groupBy({
      by: ['voteType'],
      where: {
        featureId: parseInt(featureId)
      },
      _count: {
        voteType: true
      }
    })

    const voteMap = {
      dislike: 0,
      like: 0,
      love: 0
    }

    votes.forEach(vote => {
      voteMap[vote.voteType as keyof typeof voteMap] = vote._count.voteType
    })

    // Get user's current vote
    const userVote = await prisma.featureVote.findUnique({
      where: {
        sessionId_featureId: {
          sessionId,
          featureId: parseInt(featureId)
        }
      }
    })

    return NextResponse.json({
      votes: voteMap,
      userVote: userVote?.voteType || null
    })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
