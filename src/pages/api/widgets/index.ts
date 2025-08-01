
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  if (req.method === 'GET') {
    try {
      const widgets = await prisma.widget.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      res.status(200).json(widgets)
    } catch (error) {
      console.error('Error fetching widgets:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, type, config, blueprint } = req.body

      const widget = await prisma.widget.create({
        data: {
          name,
          description,
          type: type || 'custom',
          config: config || {},
          blueprint: blueprint || {},
          userId: user.id,
          organizationId: null // We'll handle organization later if needed
        }
      })

      res.status(201).json(widget)
    } catch (error) {
      console.error('Error creating widget:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
