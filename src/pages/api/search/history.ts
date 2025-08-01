
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  if (req.method === 'GET') {
    try {
      const searches = await prisma.search.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      })

      const formattedSearches = searches.map(search => ({
        id: search.id,
        query: search.query,
        createdAt: search.createdAt,
        metadata: search.metadata
      }))

      res.status(200).json(formattedSearches)
    } catch (error) {
      console.error('Error fetching search history:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
