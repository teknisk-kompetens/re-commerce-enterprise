
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  if (req.method === 'GET') {
    try {
      const canvases = await prisma.canvas.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      res.status(200).json(canvases)
    } catch (error) {
      console.error('Error fetching canvases:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, data, settings } = req.body

      const canvas = await prisma.canvas.create({
        data: {
          name,
          description,
          data,
          settings,
          userId: user.id,
          organizationId: null // We'll handle organization later if needed
        }
      })

      res.status(201).json(canvas)
    } catch (error) {
      console.error('Error creating canvas:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
