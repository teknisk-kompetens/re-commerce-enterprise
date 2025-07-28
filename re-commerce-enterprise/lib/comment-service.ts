
import { prisma } from './db'
import { TenantQuery } from './tenant-utils'
import { NotificationService } from './notification-service'
import { RealtimeService } from './realtime-service'

export interface CommentData {
  content: string
  entity: string
  entityId: string
  authorId: string
  parentId?: string
}

export class CommentService {
  static async createComment(tenantId: string, data: CommentData): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const comment = await tenantQuery.comment.create({
        data: {
          content: data.content,
          entity: data.entity,
          entityId: data.entityId,
          authorId: data.authorId,
          parentId: data.parentId
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          parent: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })

      // Create activity feed entry
      await NotificationService.createActivityFeed(tenantId, {
        action: 'commented',
        entity: data.entity,
        entityId: data.entityId,
        description: `Added a comment`,
        userId: data.authorId,
        metadata: { commentId: comment.id }
      })

      // Send real-time update
      RealtimeService.broadcastToTenant(tenantId, {
        type: 'comment_added',
        data: {
          entity: data.entity,
          entityId: data.entityId,
          comment
        },
        tenantId,
        timestamp: Date.now()
      })

      return comment
    } catch (error) {
      console.error('Failed to create comment:', error)
      throw error
    }
  }

  static async getComments(tenantId: string, entity: string, entityId: string, options: {
    page?: number
    limit?: number
    includeReplies?: boolean
  } = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      const { page = 1, limit = 20, includeReplies = true } = options

      const where: any = {
        entity,
        entityId
      }

      if (!includeReplies) {
        where.parentId = null
      }

      const [comments, total] = await Promise.all([
        tenantQuery.comment.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            parent: includeReplies ? {
              select: {
                id: true,
                content: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            } : false,
            replies: includeReplies ? {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            } : false
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        tenantQuery.comment.count({ where })
      ])

      return {
        comments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get comments:', error)
      throw error
    }
  }

  static async updateComment(tenantId: string, commentId: string, authorId: string, content: string): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const comment = await tenantQuery.comment.update({
        where: {
          id: commentId,
          authorId // Ensure only author can update
        },
        data: {
          content,
          updatedAt: new Date()
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      // Send real-time update
      RealtimeService.broadcastToTenant(tenantId, {
        type: 'comment_updated',
        data: {
          entity: comment.entity,
          entityId: comment.entityId,
          comment
        },
        tenantId,
        timestamp: Date.now()
      })

      return comment
    } catch (error) {
      console.error('Failed to update comment:', error)
      throw error
    }
  }

  static async deleteComment(tenantId: string, commentId: string, authorId: string): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      // Get comment details before deletion
      const comment = await tenantQuery.comment.findUnique({
        where: { id: commentId }
      })

      if (!comment) {
        throw new Error('Comment not found')
      }

      if (comment.authorId !== authorId) {
        throw new Error('Not authorized to delete this comment')
      }

      // Delete comment and its replies
      await tenantQuery.comment.deleteMany({
        where: {
          OR: [
            { id: commentId },
            { parentId: commentId }
          ]
        }
      })

      // Send real-time update
      RealtimeService.broadcastToTenant(tenantId, {
        type: 'comment_deleted',
        data: {
          entity: comment.entity,
          entityId: comment.entityId,
          commentId
        },
        tenantId,
        timestamp: Date.now()
      })
    } catch (error) {
      console.error('Failed to delete comment:', error)
      throw error
    }
  }

  static async getCommentCount(tenantId: string, entity: string, entityId: string): Promise<number> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const count = await tenantQuery.comment.count({
        where: {
          entity,
          entityId
        }
      })

      return count
    } catch (error) {
      console.error('Failed to get comment count:', error)
      throw error
    }
  }

  static async getRecentComments(tenantId: string, limit: number = 10): Promise<any[]> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const comments = await tenantQuery.comment.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      return comments
    } catch (error) {
      console.error('Failed to get recent comments:', error)
      throw error
    }
  }
}
