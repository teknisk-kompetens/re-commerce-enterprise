
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, message, platformSlug } = await request.json()

    if (!name || !email || !platformSlug) {
      return NextResponse.json(
        { error: 'Name, email, and platform are required' },
        { status: 400 }
      )
    }

    // Find platform
    const platform = await prisma.platform.findUnique({
      where: { slug: platformSlug }
    })

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      )
    }

    // Create interest record
    const interest = await prisma.platformInterest.create({
      data: {
        name,
        email,
        phone,
        company,
        message,
        platformId: platform.id
      }
    })

    return NextResponse.json({
      success: true,
      id: interest.id
    })
  } catch (error) {
    console.error('Platform interest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
