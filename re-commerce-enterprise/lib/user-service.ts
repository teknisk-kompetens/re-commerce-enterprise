
import { prisma } from './db'
import { TenantQuery } from './tenant-utils'
import { AuditLogger } from './audit-logger'
import { RBACService } from './rbac-service'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface CreateUserData {
  email: string
  name?: string
  password?: string
  role?: string
  tenantId: string
  createdBy?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
  isActive?: boolean
  profile?: any
  preferences?: any
}

export interface UserInvitation {
  email: string
  tenantId: string
  role: string
  invitedBy: string
  expiresAt: Date
}

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserData): Promise<any> {
    const { email, name, password, role = 'user', tenantId, createdBy } = data

    // Check if user already exists in tenant
    const existingUser = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId
        }
      }
    })

    if (existingUser) {
      throw new Error('User already exists in this tenant')
    }

    // Hash password if provided
    let hashedPassword: string | undefined
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12)
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        tenantId,
        emailVerified: password ? undefined : null // If no password, user needs to verify email
      }
    })

    // Assign default role
    const defaultRole = await prisma.role.findFirst({
      where: {
        name: role,
        OR: [
          { tenantId: tenantId },
          { tenantId: null, isSystem: true }
        ]
      }
    })

    if (defaultRole) {
      await RBACService.assignRole(user.id, defaultRole.id, tenantId, createdBy)
    }

    // Log user creation
    await AuditLogger.log({
      action: 'USER_CREATED',
      resource: 'users',
      resourceId: user.id,
      details: { email, name, role },
      tenantId,
      userId: createdBy
    })

    return user
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, data: UpdateUserData, updatedBy?: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email_tenantId: {
            email: data.email,
            tenantId: user.tenantId
          }
        }
      })

      if (existingUser) {
        throw new Error('Email already in use')
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        emailVerified: data.email && data.email !== user.email ? null : user.emailVerified
      }
    })

    // Log user update
    await AuditLogger.log({
      action: 'USER_UPDATED',
      resource: 'users',
      resourceId: userId,
      details: data,
      tenantId: user.tenantId,
      userId: updatedBy
    })

    return updatedUser
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string, deletedBy?: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    // Log user deletion
    await AuditLogger.log({
      action: 'USER_DELETED',
      resource: 'users',
      resourceId: userId,
      details: { email: user.email, name: user.name },
      tenantId: user.tenantId,
      userId: deletedBy
    })
  }

  /**
   * Invite user to tenant
   */
  static async inviteUser(invitation: UserInvitation): Promise<string> {
    const { email, tenantId, role, invitedBy, expiresAt } = invitation

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId
        }
      }
    })

    if (existingUser) {
      throw new Error('User already exists in this tenant')
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex')

    // Create user with invitation token
    const user = await prisma.user.create({
      data: {
        email,
        role,
        tenantId,
        isActive: false,
        emailVerificationToken: token,
        passwordResetExpires: expiresAt
      }
    })

    // Log invitation
    await AuditLogger.log({
      action: 'USER_INVITED',
      resource: 'users',
      resourceId: user.id,
      details: { email, role },
      tenantId,
      userId: invitedBy
    })

    return token
  }

  /**
   * Accept user invitation
   */
  static async acceptInvitation(token: string, password: string, name?: string): Promise<any> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw new Error('Invalid or expired invitation')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        password: hashedPassword,
        isActive: true,
        emailVerified: new Date(),
        emailVerificationToken: null,
        passwordResetExpires: null
      }
    })

    // Log invitation acceptance
    await AuditLogger.log({
      action: 'INVITATION_ACCEPTED',
      resource: 'users',
      resourceId: user.id,
      details: { email: user.email },
      tenantId: user.tenantId,
      userId: user.id
    })

    return updatedUser
  }

  /**
   * Send password reset
   */
  static async sendPasswordReset(email: string, tenantId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expiresAt
      }
    })

    // Log password reset request
    await AuditLogger.log({
      action: 'PASSWORD_RESET_REQUESTED',
      resource: 'users',
      resourceId: user.id,
      details: { email },
      tenantId,
      userId: user.id
    })

    return token
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<any> {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw new Error('Invalid or expired reset token')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })

    // Log password reset
    await AuditLogger.log({
      action: 'PASSWORD_RESET_COMPLETED',
      resource: 'users',
      resourceId: user.id,
      details: { email: user.email },
      tenantId: user.tenantId,
      userId: user.id
    })

    return updatedUser
  }

  /**
   * Get users for tenant
   */
  static async getUsers(tenantId: string, options: {
    page?: number
    limit?: number
    search?: string
    role?: string
    isActive?: boolean
  } = {}): Promise<{
    users: any[]
    total: number
    page: number
    limit: number
  }> {
    const { page = 1, limit = 10, search, role, isActive } = options
    const offset = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          roles: {
            include: {
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.user.count({ where })
    ])

    return {
      users,
      total,
      page,
      limit
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<any> {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
  }
}
