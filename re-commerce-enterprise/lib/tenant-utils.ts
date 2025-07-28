
import { prisma } from './db'
import { TenantConfig } from './tenant-context'

// Tenant Resolution Utilities
export class TenantService {
  /**
   * Resolve tenant by hostname/subdomain
   */
  static async resolveTenant(hostname: string, subdomain?: string, domain?: string): Promise<TenantConfig | null> {
    try {
      // First try to find by domain
      let tenant = await prisma.tenant.findFirst({
        where: {
          OR: [
            { domain: hostname },
            { domain: domain || hostname },
            { subdomain: subdomain || '' },
          ],
          isActive: true,
        },
      })

      // If not found and we have subdomain, try subdomain lookup
      if (!tenant && subdomain) {
        tenant = await prisma.tenant.findFirst({
          where: {
            subdomain: subdomain,
            isActive: true,
          },
        })
      }

      // If still not found, try default tenant (for development)
      if (!tenant) {
        tenant = await prisma.tenant.findFirst({
          where: {
            OR: [
              { domain: 'localhost' },
              { subdomain: 'demo' },
              { subdomain: 'default' },
            ],
            isActive: true,
          },
        })
      }

      if (!tenant) {
        return null
      }

      return {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        subdomain: tenant.subdomain,
        isActive: tenant.isActive,
        plan: tenant.plan,
        maxUsers: tenant.maxUsers,
        settings: tenant.settings,
        branding: tenant.branding,
      }
    } catch (error) {
      console.error('Error resolving tenant:', error)
      return null
    }
  }

  /**
   * Create new tenant
   */
  static async createTenant(data: {
    name: string
    domain: string
    subdomain: string
    plan?: string
    maxUsers?: number
    settings?: any
    branding?: any
  }): Promise<TenantConfig> {
    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        domain: data.domain,
        subdomain: data.subdomain,
        plan: data.plan || 'basic',
        maxUsers: data.maxUsers || 100,
        settings: data.settings,
        branding: data.branding,
      },
    })

    return {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      subdomain: tenant.subdomain,
      isActive: tenant.isActive,
      plan: tenant.plan,
      maxUsers: tenant.maxUsers,
      settings: tenant.settings,
      branding: tenant.branding,
    }
  }

  /**
   * Update tenant
   */
  static async updateTenant(tenantId: string, data: Partial<TenantConfig>): Promise<TenantConfig | null> {
    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data,
    })

    return {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      subdomain: tenant.subdomain,
      isActive: tenant.isActive,
      plan: tenant.plan,
      maxUsers: tenant.maxUsers,
      settings: tenant.settings,
      branding: tenant.branding,
    }
  }

  /**
   * Get tenant statistics
   */
  static async getTenantStats(tenantId: string) {
    const [userCount, taskCount, projectCount] = await Promise.all([
      prisma.user.count({ where: { tenantId } }),
      prisma.task.count({ where: { tenantId } }),
      prisma.project.count({ where: { tenantId } }),
    ])

    return {
      userCount,
      taskCount,
      projectCount,
    }
  }

  /**
   * Check if tenant has reached user limit
   */
  static async checkUserLimit(tenantId: string): Promise<boolean> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { maxUsers: true },
    })

    if (!tenant) return false

    const userCount = await prisma.user.count({
      where: { tenantId, isActive: true },
    })

    return userCount >= tenant.maxUsers
  }
}

// Database Query Utilities with Tenant Isolation
export class TenantQuery {
  /**
   * Get tenant-aware Prisma client with automatic tenant filtering
   */
  static forTenant(tenantId: string) {
    return {
      user: {
        findMany: (args?: any) => 
          prisma.user.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.user.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.user.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.user.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.user.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.user.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.user.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      task: {
        findMany: (args?: any) => 
          prisma.task.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.task.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.task.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.task.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.task.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.task.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.task.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      project: {
        findMany: (args?: any) => 
          prisma.project.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.project.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.project.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.project.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.project.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.project.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.project.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      category: {
        findMany: (args?: any) => 
          prisma.category.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.category.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.category.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.category.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.category.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.category.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.category.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      // DAG 2 Models
      analytics: {
        findMany: (args?: any) => 
          prisma.analytics.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.analytics.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.analytics.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.analytics.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.analytics.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.analytics.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.analytics.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        groupBy: (args: any) => 
          prisma.analytics.groupBy({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      dashboardWidget: {
        findMany: (args?: any) => 
          prisma.dashboardWidget.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.dashboardWidget.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.dashboardWidget.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.dashboardWidget.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.dashboardWidget.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.dashboardWidget.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.dashboardWidget.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      workflow: {
        findMany: (args?: any) => 
          prisma.workflow.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.workflow.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.workflow.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.workflow.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.workflow.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.workflow.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.workflow.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      workflowExecution: {
        findMany: (args?: any) => 
          prisma.workflowExecution.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.workflowExecution.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.workflowExecution.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.workflowExecution.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.workflowExecution.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.workflowExecution.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.workflowExecution.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      workflowTrigger: {
        findMany: (args?: any) => 
          prisma.workflowTrigger.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.workflowTrigger.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.workflowTrigger.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.workflowTrigger.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.workflowTrigger.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.workflowTrigger.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.workflowTrigger.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      notification: {
        findMany: (args?: any) => 
          prisma.notification.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.notification.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.notification.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.notification.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.notification.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        updateMany: (args: any) => 
          prisma.notification.updateMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.notification.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.notification.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      activityFeed: {
        findMany: (args?: any) => 
          prisma.activityFeed.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.activityFeed.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.activityFeed.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.activityFeed.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.activityFeed.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.activityFeed.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.activityFeed.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      comment: {
        findMany: (args?: any) => 
          prisma.comment.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.comment.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.comment.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.comment.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.comment.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.comment.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        deleteMany: (args: any) => 
          prisma.comment.deleteMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.comment.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      attachment: {
        findMany: (args?: any) => 
          prisma.attachment.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.attachment.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.attachment.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.attachment.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.attachment.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.attachment.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.attachment.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      apiKey: {
        findMany: (args?: any) => 
          prisma.apiKey.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.apiKey.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.apiKey.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.apiKey.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.apiKey.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.apiKey.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.apiKey.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      webhook: {
        findMany: (args?: any) => 
          prisma.webhook.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.webhook.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.webhook.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.webhook.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.webhook.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.webhook.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.webhook.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
      webhookDelivery: {
        findMany: (args?: any) => 
          prisma.webhookDelivery.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args: any) => 
          prisma.webhookDelivery.findUnique({
            ...args,
            where: { ...args.where, tenantId },
          }),
        findFirst: (args?: any) => 
          prisma.webhookDelivery.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) => 
          prisma.webhookDelivery.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) => 
          prisma.webhookDelivery.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) => 
          prisma.webhookDelivery.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
        count: (args?: any) => 
          prisma.webhookDelivery.count({
            ...args,
            where: { ...args?.where, tenantId },
          }),
      },
    }
  }
}

// Tenant-aware React hooks
export function useTenantQuery(tenantId: string) {
  return TenantQuery.forTenant(tenantId)
}
