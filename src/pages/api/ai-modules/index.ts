
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  if (req.method === 'GET') {
    try {
      // Get available AI modules - for now return mock data
      const modules = [
        {
          id: 'text-generator',
          name: 'Text Generator',
          description: 'Generate text content using AI',
          type: 'text',
          enabled: true
        },
        {
          id: 'image-analyzer',
          name: 'Image Analyzer',
          description: 'Analyze and describe images',
          type: 'image',
          enabled: true
        },
        {
          id: 'data-processor',
          name: 'Data Processor',
          description: 'Process and analyze data',
          type: 'data',
          enabled: true
        }
      ]

      res.status(200).json(modules)
    } catch (error) {
      console.error('Error fetching AI modules:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default requireAuth(handler)
