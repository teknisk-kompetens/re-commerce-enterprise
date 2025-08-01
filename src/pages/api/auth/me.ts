
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const token = req.cookies['auth-token']

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organization: true }
    })

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return res.status(401).json({ message: 'Invalid token' })
  }
}
