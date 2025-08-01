
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthenticatedUser {
  id: string
  email: string
  role: string
}

export async function getAuthenticatedUser(req: NextApiRequest): Promise<AuthenticatedUser | null> {
  try {
    const token = req.cookies['auth-token']

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export function requireAuth(handler: (req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getAuthenticatedUser(req)
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' })
    }
    
    return handler(req, res, user)
  }
}
