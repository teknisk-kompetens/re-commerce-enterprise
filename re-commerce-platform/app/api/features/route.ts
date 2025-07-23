
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platformSlug = searchParams.get('platform')
    const sessionId = searchParams.get('sessionId')

    if (!platformSlug) {
      return NextResponse.json(
        { error: 'Platform slug is required' },
        { status: 400 }
      )
    }

    const platform = await prisma.platform.findUnique({
      where: { slug: platformSlug },
      include: {
        features: {
          include: {
            votes: true
          }
        }
      }
    })

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      )
    }

    const featuresWithVotes = platform.features.map(feature: any) => {
      const votes = {
        dislike: 0,
        like: 0,
        love: 0
      }

      feature.votes.forEach(vote => {
        votes[vote.voteType as keyof typeof votes]++
      })

      const userVote = sessionId 
        ? feature.votes.find(vote => vote.sessionId === sessionId)?.voteType || null
        : null

      return {
        id: feature.id,
        title: feature.title,
        description: feature.description,
        category: feature.category,
        priority: feature.priority,
        votes,
        userVote
      }
    })

    return NextResponse.json({
      platform: {
        id: platform.id,
        name: platform.name,
        slug: platform.slug,
        description: platform.description,
        status: platform.status
      },
      features: featuresWithVotes
    })
  } catch (error) {
    console.error('Get features error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
