
import { prisma } from './db'
import { TenantQuery } from './tenant-utils'

export interface RoleData {
  id: string
  name: string
  description?: string
  permissions: string[]
  isSystem: boolean
  tenantId?: string
}

export interface PermissionData {
  id: string
  name: string
  resource: string
  action: string
  description?: string
}

export class RBACService {
  /**
   * Get user permissions for a specific tenant
   */
  static async getUserPermissions(userId: string, tenantId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
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

    if (!user) return []

    const permissions = new Set<string>()

    // Add permissions from roles
    user.roles.forEach((userRole: any) => {
      userRole.role.permissions.forEach((rolePermission: any) => {
        if (rolePermission.granted) {
          permissions.add(rolePermission.permission.name)
        }
      })
    })

    // Add direct user permissions
    user.permissions.forEach((userPermission: any) => {
      if (userPermission.granted && userPermission.tenantId === tenantId) {
        permissions.add(userPermission.permission.name)
      }
    })

    return Array.from(permissions)
  }

  /**
   * Check if user has specific permission
   */
  static async hasPermission(userId: string, tenantId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, tenantId)
    return permissions.includes(permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  static async hasAnyPermission(userId: string, tenantId: string, permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId, tenantId)
    return permissions.some(permission => userPermissions.includes(permission))
  }

  /**
   * Check if user has all specified permissions
   */
  static async hasAllPermissions(userId: string, tenantId: string, permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId, tenantId)
    return permissions.every(permission => userPermissions.includes(permission))
  }

  /**
   * Assign role to user
   */
  static async assignRole(userId: string, roleId: string, tenantId: string, assignedBy?: string): Promise<void> {
    await prisma.userRole.create({
      data: {
        userId,
        roleId,
        tenantId,
        assignedBy
      }
    })
  }

  /**
   * Remove role from user
   */
  static async removeRole(userId: string, roleId: string, tenantId: string): Promise<void> {
    await prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
        tenantId
      }
    })
  }

  /**
   * Grant permission to user
   */
  static async grantPermission(userId: string, permissionId: string, tenantId: string, assignedBy?: string): Promise<void> {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId_tenantId: {
          userId,
          permissionId,
          tenantId
        }
      },
      create: {
        userId,
        permissionId,
        tenantId,
        granted: true,
        assignedBy
      },
      update: {
        granted: true,
        assignedBy
      }
    })
  }

  /**
   * Revoke permission from user
   */
  static async revokePermission(userId: string, permissionId: string, tenantId: string): Promise<void> {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId_tenantId: {
          userId,
          permissionId,
          tenantId
        }
      },
      create: {
        userId,
        permissionId,
        tenantId,
        granted: false
      },
      update: {
        granted: false
      }
    })
  }

  /**
   * Create system roles and permissions
   */
  static async initializeSystemRoles(): Promise<void> {
    // Create system permissions
    const systemPermissions = [
      { name: 'users:read', resource: 'users', action: 'read', description: 'Read user information' },
      { name: 'users:write', resource: 'users', action: 'write', description: 'Create and update users' },
      { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
      { name: 'users:manage', resource: 'users', action: 'manage', description: 'Full user management' },
      { name: 'tasks:read', resource: 'tasks', action: 'read', description: 'Read tasks' },
      { name: 'tasks:write', resource: 'tasks', action: 'write', description: 'Create and update tasks' },
      { name: 'tasks:delete', resource: 'tasks', action: 'delete', description: 'Delete tasks' },
      { name: 'tasks:manage', resource: 'tasks', action: 'manage', description: 'Full task management' },
      { name: 'projects:read', resource: 'projects', action: 'read', description: 'Read projects' },
      { name: 'projects:write', resource: 'projects', action: 'write', description: 'Create and update projects' },
      { name: 'projects:delete', resource: 'projects', action: 'delete', description: 'Delete projects' },
      { name: 'projects:manage', resource: 'projects', action: 'manage', description: 'Full project management' },
      { name: 'categories:read', resource: 'categories', action: 'read', description: 'Read categories' },
      { name: 'categories:write', resource: 'categories', action: 'write', description: 'Create and update categories' },
      { name: 'categories:delete', resource: 'categories', action: 'delete', description: 'Delete categories' },
      { name: 'categories:manage', resource: 'categories', action: 'manage', description: 'Full category management' },
      { name: 'settings:read', resource: 'settings', action: 'read', description: 'Read settings' },
      { name: 'settings:write', resource: 'settings', action: 'write', description: 'Update settings' },
      { name: 'settings:manage', resource: 'settings', action: 'manage', description: 'Full settings management' },
      { name: 'audit:read', resource: 'audit', action: 'read', description: 'Read audit logs' },
      { name: 'system:manage', resource: 'system', action: 'manage', description: 'System administration' }
    ]

    for (const permission of systemPermissions) {
      await prisma.permission.upsert({
        where: { name: permission.name },
        create: {
          ...permission,
          isSystem: true
        },
        update: {
          ...permission,
          isSystem: true
        }
      })
    }

    // Create system roles
    const systemRoles = [
      {
        name: 'SuperAdmin',
        description: 'Full system access across all tenants',
        permissions: ['system:manage', 'users:manage', 'tasks:manage', 'projects:manage', 'categories:manage', 'settings:manage', 'audit:read']
      },
      {
        name: 'TenantAdmin',
        description: 'Full access within tenant',
        permissions: ['users:manage', 'tasks:manage', 'projects:manage', 'categories:manage', 'settings:manage', 'audit:read']
      },
      {
        name: 'Manager',
        description: 'Management access within tenant',
        permissions: ['users:read', 'users:write', 'tasks:manage', 'projects:manage', 'categories:manage', 'settings:read']
      },
      {
        name: 'User',
        description: 'Standard user access',
        permissions: ['tasks:read', 'tasks:write', 'projects:read', 'categories:read']
      },
      {
        name: 'ReadOnly',
        description: 'Read-only access',
        permissions: ['tasks:read', 'projects:read', 'categories:read']
      }
    ]

    for (const role of systemRoles) {
      // For system roles, we need to handle null tenantId differently
      let createdRole = await prisma.role.findFirst({
        where: {
          name: role.name,
          tenantId: null,
          isSystem: true
        }
      })

      if (!createdRole) {
        createdRole = await prisma.role.create({
          data: {
            name: role.name,
            description: role.description,
            isSystem: true,
            tenantId: null
          }
        })
      } else {
        createdRole = await prisma.role.update({
          where: { id: createdRole.id },
          data: {
            description: role.description,
            isSystem: true
          }
        })
      }

      // Assign permissions to role
      for (const permissionName of role.permissions) {
        const permission = await prisma.permission.findUnique({
          where: { name: permissionName }
        })

        if (permission) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: createdRole.id,
                permissionId: permission.id
              }
            },
            create: {
              roleId: createdRole.id,
              permissionId: permission.id,
              granted: true
            },
            update: {
              granted: true
            }
          })
        }
      }
    }
  }

  /**
   * Get all roles for a tenant
   */
  static async getTenantRoles(tenantId: string): Promise<RoleData[]> {
    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { tenantId: tenantId },
          { tenantId: null, isSystem: true }
        ]
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return roles.map((role: any) => ({
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      permissions: role.permissions.filter((p: any) => p.granted).map((p: any) => p.permission.name),
      isSystem: role.isSystem,
      tenantId: role.tenantId || undefined
    }))
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions(): Promise<PermissionData[]> {
    const permissions = await prisma.permission.findMany()
    return permissions.map((permission: any) => ({
      id: permission.id,
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description || undefined
    }))
  }
}
