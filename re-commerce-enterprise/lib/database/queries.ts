
/**
 * CHUNK 1: DATABASE OPTIMIZATION
 * Optimized database queries with caching and indexing
 */

import { db, prisma } from './connection-pool';
import { logger } from '../error-handling/logger';

export class OptimizedQueries {
  // Widget Factory Queries
  static async getWidgetBlueprints(tenantId: string, options: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
  } = {}) {
    const { limit = 50, offset = 0, category, search } = options;
    const cacheKey = `widget_blueprints:${tenantId}:${JSON.stringify(options)}`;

    return db.cachedQuery(
      cacheKey,
      async () => {
        const where: any = { tenantId };
        
        if (category) {
          where.category = category;
        }
        
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [blueprints, total] = await Promise.all([
          prisma.widgetBlueprint.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { updatedAt: 'desc' },
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              config: true,
              isPublic: true,
              createdAt: true,
              updatedAt: true,
              creator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          }),
          prisma.widgetBlueprint.count({ where }),
        ]);

        return { blueprints, total };
      },
      300 // 5 minutes cache
    );
  }

  static async createWidgetBlueprint(data: {
    name: string;
    description?: string;
    category: string;
    config: any;
    tenantId: string;
    creatorId: string;
    isPublic?: boolean;
  }) {
    try {
      const blueprint = await prisma.widgetBlueprint.create({
        data: {
          ...data,
          isPublic: data.isPublic ?? false,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Invalidate cache
      await db.getRedis().del(`widget_blueprints:${data.tenantId}:*`);

      logger.info('Widget blueprint created', {
        blueprintId: blueprint.id,
        tenantId: data.tenantId,
        creatorId: data.creatorId,
      });

      return blueprint;
    } catch (error) {
      logger.error('Failed to create widget blueprint', error as Error, {
        tenantId: data.tenantId,
        creatorId: data.creatorId,
      });
      throw error;
    }
  }

  static async updateWidgetBlueprint(id: string, data: Partial<{
    name: string;
    description: string;
    category: string;
    config: any;
    isPublic: boolean;
  }>) {
    try {
      const blueprint = await prisma.widgetBlueprint.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Invalidate cache
      await db.getRedis().del(`widget_blueprints:${blueprint.tenantId}:*`);

      logger.info('Widget blueprint updated', {
        blueprintId: id,
        tenantId: blueprint.tenantId,
      });

      return blueprint;
    } catch (error) {
      logger.error('Failed to update widget blueprint', error as Error, {
        blueprintId: id,
      });
      throw error;
    }
  }

  // Canvas Project Queries
  static async getCanvasProjects(userId: string, tenantId: string) {
    const cacheKey = `canvas_projects:${userId}:${tenantId}`;

    return db.cachedQuery(
      cacheKey,
      () => prisma.canvasProject.findMany({
        where: {
          userId,
          tenantId,
        },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          config: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      600 // 10 minutes cache
    );
  }

  // Performance Analytics
  static async logPerformanceMetric(data: {
    tenantId: string;
    userId?: string;
    component: string;
    action: string;
    duration: number;
    metadata?: any;
  }) {
    try {
      await prisma.analyticsEvent.create({
        data: {
          tenantId: data.tenantId,
          userId: data.userId,
          eventType: 'performance',
          eventData: {
            component: data.component,
            action: data.action,
            duration: data.duration,
            ...data.metadata,
          },
        },
      });
    } catch (error) {
      // Don't throw on analytics errors
      logger.warn('Failed to log performance metric', {
        error: (error as Error).message,
        data,
      });
    }
  }

  // Batch operations for better performance
  static async batchCreateWidgets(widgets: Array<{
    name: string;
    type: string;
    config: any;
    tenantId: string;
    creatorId: string;
  }>) {
    try {
      const result = await prisma.$transaction(
        widgets.map(widget =>
          prisma.widgetBlueprint.create({
            data: widget,
          })
        )
      );

      // Invalidate cache for all affected tenants
      const tenantIds = [...new Set(widgets.map(w => w.tenantId))];
      await Promise.all(
        tenantIds.map(tenantId =>
          db.getRedis().del(`widget_blueprints:${tenantId}:*`)
        )
      );

      logger.info('Batch widget creation completed', {
        count: widgets.length,
        tenantIds,
      });

      return result;
    } catch (error) {
      logger.error('Batch widget creation failed', error as Error, {
        count: widgets.length,
      });
      throw error;
    }
  }
}
