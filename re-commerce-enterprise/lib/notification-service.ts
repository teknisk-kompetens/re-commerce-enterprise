
import { prisma } from './db'
import { TenantQuery } from './tenant-utils'

export interface NotificationData {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'task' | 'project' | 'system'
  userId: string
  senderId?: string
  data?: any
}

export interface ActivityFeedData {
  action: string
  entity: string
  entityId: string
  description: string
  userId: string
  metadata?: any
}

export class NotificationService {
  static async createNotification(tenantId: string, notification: NotificationData): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const created = await tenantQuery.notification.create({
        data: {
          title: notification.title,
          message: notification.message,
          type: notification.type,
          userId: notification.userId,
          senderId: notification.senderId,
          data: notification.data
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          sender: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return created
    } catch (error) {
      console.error('Failed to create notification:', error)
      throw error
    }
  }

  static async getNotifications(tenantId: string, userId: string, options: { page?: number; limit?: number; unreadOnly?: boolean } = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      const { page = 1, limit = 20, unreadOnly = false } = options

      const where: any = { userId }
      if (unreadOnly) {
        where.isRead = false
      }

      const [notifications, total] = await Promise.all([
        tenantQuery.notification.findMany({
          where,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        tenantQuery.notification.count({ where })
      ])

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get notifications:', error)
      throw error
    }
  }

  static async markAsRead(tenantId: string, notificationId: string, userId: string): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      await tenantQuery.notification.updateMany({
        where: {
          id: notificationId,
          userId: userId
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  }

  static async markAllAsRead(tenantId: string, userId: string): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      await tenantQuery.notification.updateMany({
        where: {
          userId: userId,
          isRead: false
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      throw error
    }
  }

  static async getUnreadCount(tenantId: string, userId: string): Promise<number> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const count = await tenantQuery.notification.count({
        where: {
          userId: userId,
          isRead: false
        }
      })

      return count
    } catch (error) {
      console.error('Failed to get unread count:', error)
      throw error
    }
  }

  static async createActivityFeed(tenantId: string, activity: ActivityFeedData): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const created = await tenantQuery.activityFeed.create({
        data: {
          action: activity.action,
          entity: activity.entity,
          entityId: activity.entityId,
          description: activity.description,
          userId: activity.userId,
          metadata: activity.metadata
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return created
    } catch (error) {
      console.error('Failed to create activity feed:', error)
      throw error
    }
  }

  static async getActivityFeed(tenantId: string, options: { page?: number; limit?: number; entity?: string; entityId?: string } = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      const { page = 1, limit = 20, entity, entityId } = options

      const where: any = {}
      if (entity) where.entity = entity
      if (entityId) where.entityId = entityId

      const [activities, total] = await Promise.all([
        tenantQuery.activityFeed.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { timestamp: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        tenantQuery.activityFeed.count({ where })
      ])

      return {
        activities,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get activity feed:', error)
      throw error
    }
  }

  // Notification templates
  static async notifyTaskAssigned(tenantId: string, userId: string, taskId: string, taskTitle: string, assignedBy: string): Promise<void> {
    await this.createNotification(tenantId, {
      title: 'New Task Assigned',
      message: `You have been assigned to task: ${taskTitle}`,
      type: 'task',
      userId,
      senderId: assignedBy,
      data: { taskId, taskTitle }
    })

    await this.createActivityFeed(tenantId, {
      action: 'assigned',
      entity: 'task',
      entityId: taskId,
      description: `Task "${taskTitle}" was assigned`,
      userId: assignedBy,
      metadata: { assignedTo: userId }
    })
  }

  static async notifyTaskCompleted(tenantId: string, taskId: string, taskTitle: string, completedBy: string): Promise<void> {
    await this.createActivityFeed(tenantId, {
      action: 'completed',
      entity: 'task',
      entityId: taskId,
      description: `Task "${taskTitle}" was completed`,
      userId: completedBy,
      metadata: { taskTitle }
    })
  }

  static async notifyProjectCreated(tenantId: string, projectId: string, projectName: string, createdBy: string): Promise<void> {
    await this.createActivityFeed(tenantId, {
      action: 'created',
      entity: 'project',
      entityId: projectId,
      description: `Project "${projectName}" was created`,
      userId: createdBy,
      metadata: { projectName }
    })
  }

  static async notifyUserJoined(tenantId: string, userId: string, userName: string): Promise<void> {
    await this.createActivityFeed(tenantId, {
      action: 'joined',
      entity: 'user',
      entityId: userId,
      description: `${userName} joined the team`,
      userId: userId,
      metadata: { userName }
    })
  }
}
