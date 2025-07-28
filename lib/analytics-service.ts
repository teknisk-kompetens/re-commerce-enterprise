
import { prisma } from './db'
import { TenantQuery } from './tenant-utils'

export interface AnalyticsMetric {
  metric: string
  value: number
  metadata?: any
  userId?: string
  timestamp?: Date
}

export interface DashboardMetrics {
  totalTasks: number
  completedTasks: number
  totalUsers: number
  activeUsers: number
  totalProjects: number
  completionRate: number
  averageTaskTime: number
  userActivityTrend: Array<{ date: string; count: number }>
  taskCompletionTrend: Array<{ date: string; completed: number; total: number }>
  projectProgress: Array<{ projectId: string; name: string; progress: number }>
  topPerformers: Array<{ userId: string; name: string; tasksCompleted: number }>
}

export class AnalyticsService {
  static async recordMetric(tenantId: string, metric: AnalyticsMetric): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      await tenantQuery.analytics.create({
        data: {
          metric: metric.metric,
          value: metric.value,
          metadata: metric.metadata,
          userId: metric.userId,
          timestamp: metric.timestamp || new Date()
        }
      })
    } catch (error) {
      console.error('Failed to record metric:', error)
      throw error
    }
  }

  static async getDashboardMetrics(tenantId: string): Promise<DashboardMetrics> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      // Get basic counts
      const [totalTasks, completedTasks, totalUsers, activeUsers, totalProjects] = await Promise.all([
        tenantQuery.task.count(),
        tenantQuery.task.count({ where: { completed: true } }),
        tenantQuery.user.count(),
        tenantQuery.user.count({ where: { isActive: true } }),
        tenantQuery.project.count()
      ])

      // Calculate completion rate
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      // Get user activity trend (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const userActivityTrend = await prisma.analyticsEvent.groupBy({
        by: ['timestamp'],
        where: {
          tenantId,
          eventType: 'user_activity',
          timestamp: { gte: thirtyDaysAgo }
        },
        _count: { id: true }
      })

      // Get task completion trend (last 30 days)
      const taskCompletionData = await prisma.analyticsEvent.groupBy({
        by: ['timestamp'],
        where: {
          tenantId,
          eventType: 'task_completion',
          timestamp: { gte: thirtyDaysAgo }
        },
        _count: { id: true }
      })

      // Get project progress
      const projects = await prisma.project.findMany({
        where: { tenantId },
        include: {
          tasks: {
            select: {
              id: true,
              completedAt: true
            }
          }
        }
      })

      const projectProgress = projects.map((project: any) => {
        const totalTasks = project.tasks.length
        const completedTasks = project.tasks.filter((t: any) => t.completed).length
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        
        return {
          projectId: project.id,
          name: project.name,
          progress: Math.round(progress)
        }
      })

      // Get top performers
      const topPerformers = await prisma.user.findMany({
        where: { tenantId },
        include: {
          assignedTasks: {
            where: { completedAt: { not: null } },
            select: { id: true }
          }
        },
        take: 10
      })

      const topPerformersFormatted = topPerformers
        .map((user: any) => ({
          userId: user.id,
          name: user.name || user.email,
          tasksCompleted: user.tasks.length
        }))
        .sort((a: any, b: any) => b.tasksCompleted - a.tasksCompleted)
        .slice(0, 5)

      // Format trends
      const userActivityTrendFormatted = userActivityTrend.map((item: any) => ({
        date: item.timestamp.toISOString().split('T')[0],
        count: item._sum?.value || 0
      }))

      const taskCompletionTrendFormatted = taskCompletionData.map((item: any) => ({
        date: item.createdAt.toISOString().split('T')[0],
        completed: 0, // This would need more complex logic
        total: item._count.id
      }))

      return {
        totalTasks,
        completedTasks,
        totalUsers,
        activeUsers,
        totalProjects,
        completionRate: Math.round(completionRate),
        averageTaskTime: 0, // This would need task time tracking
        userActivityTrend: userActivityTrendFormatted,
        taskCompletionTrend: taskCompletionTrendFormatted,
        projectProgress,
        topPerformers: topPerformersFormatted
      }
    } catch (error) {
      console.error('Failed to get dashboard metrics:', error)
      throw error
    }
  }

  static async getMetrics(tenantId: string, metric: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const where: any = { metric }
      if (startDate && endDate) {
        where.timestamp = {
          gte: startDate,
          lte: endDate
        }
      }

      const metrics = await tenantQuery.analytics.findMany({
        where,
        orderBy: { timestamp: 'desc' }
      })

      return metrics
    } catch (error) {
      console.error('Failed to get metrics:', error)
      throw error
    }
  }

  static async recordUserActivity(tenantId: string, userId: string, activity: string): Promise<void> {
    await this.recordMetric(tenantId, {
      metric: 'user_activity',
      value: 1,
      userId,
      metadata: { activity }
    })
  }

  static async recordTaskCompletion(tenantId: string, userId: string, taskId: string, timeTaken?: number): Promise<void> {
    await this.recordMetric(tenantId, {
      metric: 'task_completion',
      value: 1,
      userId,
      metadata: { taskId, timeTaken }
    })
  }

  static async recordProjectProgress(tenantId: string, projectId: string, progress: number): Promise<void> {
    await this.recordMetric(tenantId, {
      metric: 'project_progress',
      value: progress,
      metadata: { projectId }
    })
  }
}
