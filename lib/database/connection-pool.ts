
/**
 * CHUNK 1: DATABASE OPTIMIZATION
 * Prisma connection pooling and query optimization
 */

import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Singleton pattern for Prisma client with connection pooling
class DatabaseManager {
  private static instance: DatabaseManager;
  private prisma: PrismaClient;
  private redis: Redis;

  private constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    // Redis for caching
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public getRedis(): Redis {
    return this.redis;
  }

  // Cached query wrapper
  public async cachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = 300 // 5 minutes default
  ): Promise<T> {
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const result = await queryFn();
      await this.redis.setex(key, ttl, JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Cache error, falling back to direct query:', error);
      return await queryFn();
    }
  }

  // Optimized widget queries
  public async getWidgetBlueprints(tenantId: string, limit: number = 50) {
    const cacheKey = `widget_blueprints:${tenantId}:${limit}`;
    
    return this.cachedQuery(
      cacheKey,
      () => this.prisma.widgetBlueprint.findMany({
        where: { tenantId },
        take: limit,
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
      600 // 10 minutes cache
    );
  }

  // Batch operations for better performance
  public async batchUpdateWidgets(updates: Array<{ id: string; data: any }>) {
    const transaction = updates.map(({ id, data }) =>
      this.prisma.widgetBlueprint.update({
        where: { id },
        data,
      })
    );

    return this.prisma.$transaction(transaction);
  }

  // Connection health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      await this.redis.ping();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Graceful shutdown
  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    await this.redis.quit();
  }
}

export const db = DatabaseManager.getInstance();
export const prisma = db.getPrisma();
export const redis = db.getRedis();
