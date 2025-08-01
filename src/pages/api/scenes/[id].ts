
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const scene = await prisma.scene.findFirst({
        where: {
          id: id as string,
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
        }
      })

      if (!scene) {
        return res.status(404).json({ message: 'Scene not found' })
      }

      res.status(200).json(scene)
    } catch (error) {
      console.error('Error fetching scene:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, config, widgets } = req.body

      // Update scene
      const scene = await prisma.scene.update({
        where: {
          id: id as string
        },
        data: {
          name,
          description,
          config,
          updatedAt: new Date()
        }
      })

      // Update widgets if provided
      if (widgets && Array.isArray(widgets)) {
        // Delete existing scene widgets
        await prisma.sceneWidget.deleteMany({
          where: {
            sceneId: id as string
          }
        })

        // Create new scene widgets
        if (widgets.length > 0) {
          await prisma.sceneWidget.createMany({
            data: widgets.map((widget: any) => ({
              sceneId: id as string,
              widgetId: widget.widgetId,
              position: widget.position,
              config: widget.config
            }))
          })
        }
      }

      // Fetch updated scene with widgets
      const updatedScene = await prisma.scene.findFirst({
        where: {
          id: id as string
        },
        include: {
          widgets: {
            include: {
              widget: true
            }
          }
        }
      })

      res.status(200).json(updatedScene)
    } catch (error) {
      console.error('Error updating scene:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.scene.delete({
        where: {
          id: id as string
        }
      })

      res.status(204).end()
    } catch (error) {
      console.error('Error deleting scene:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
