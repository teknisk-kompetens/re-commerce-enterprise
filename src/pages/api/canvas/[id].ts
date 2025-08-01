
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const canvas = await prisma.canvas.findFirst({
        where: {
          id: id as string,
          userId: user.id
        }
      })

      if (!canvas) {
        return res.status(404).json({ message: 'Canvas not found' })
      }

      res.status(200).json(canvas)
    } catch (error) {
      console.error('Error fetching canvas:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, data, settings } = req.body

      const canvas = await prisma.canvas.update({
        where: {
          id: id as string
        },
        data: {
          name,
          description,
          data,
          settings,
          updatedAt: new Date()
        }
      })

      res.status(200).json(canvas)
    } catch (error) {
      console.error('Error updating canvas:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.canvas.delete({
        where: {
          id: id as string
        }
      })

      res.status(204).end()
    } catch (error) {
      console.error('Error deleting canvas:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
