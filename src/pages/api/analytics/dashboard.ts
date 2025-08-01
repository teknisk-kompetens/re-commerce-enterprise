
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get various analytics data
    const [
      totalWidgets,
      totalScenes,
      totalCanvases,
      totalSearches,
      recentActivity
    ] = await Promise.all([
      prisma.widget.count({ where: { userId: user.id } }),
      prisma.scene.count({ where: { userId: user.id } }),
      prisma.canvas.count({ where: { userId: user.id } }),
      prisma.search.count({ where: { userId: user.id } }),
      prisma.search.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          query: true,
          createdAt: true
        }
      })
    ])

    const dashboardData = {
      summary: {
        totalWidgets,
        totalScenes,
        totalCanvases,
        totalSearches
      },
      recentActivity,
      charts: {
        activityOverTime: [], // Mock data - implement actual analytics
        popularWidgets: [],
        searchTrends: []
      }
    }

    res.status(200).json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default requireAuth(handler)
