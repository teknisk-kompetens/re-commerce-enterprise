
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  if (req.method === 'GET') {
    try {
      const scenes = await prisma.scene.findMany({
        where: {
          userId: user.id
        },
        include: {
          widgets: {
            include: {
              widget: true
            },
            orderBy: {
              position: 'asc'
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      res.status(200).json(scenes)
    } catch (error) {
      console.error('Error fetching scenes:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, config } = req.body

      const scene = await prisma.scene.create({
        data: {
          name,
          description,
          config,
          userId: user.id,
          organizationId: null // We'll handle organization later if needed
        }
      })

      res.status(201).json(scene)
    } catch (error) {
      console.error('Error creating scene:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
