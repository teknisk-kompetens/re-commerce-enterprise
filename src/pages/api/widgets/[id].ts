
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const widget = await prisma.widget.findFirst({
        where: {
          id: id as string,
          userId: user.id
        }
      })

      if (!widget) {
        return res.status(404).json({ message: 'Widget not found' })
      }

      res.status(200).json(widget)
    } catch (error) {
      console.error('Error fetching widget:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, config, blueprint } = req.body

      const widget = await prisma.widget.update({
        where: {
          id: id as string
        },
        data: {
          name,
          description,
          config,
          blueprint,
          updatedAt: new Date()
        }
      })

      res.status(200).json(widget)
    } catch (error) {
      console.error('Error updating widget:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      // First check if widget exists and belongs to user
      const widget = await prisma.widget.findFirst({
        where: {
          id: id as string,
          userId: user.id
        }
      })

      if (!widget) {
        return res.status(404).json({ message: 'Widget not found' })
      }

      // Delete the widget
      await prisma.widget.delete({
        where: {
          id: id as string
        }
      })

      res.status(204).end()
    } catch (error) {
      console.error('Error deleting widget:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
