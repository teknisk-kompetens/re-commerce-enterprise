
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// API Gateway Types
export interface APIGatewayConfig {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  version: string;
  status: string;
  rateLimitConfig: Record<string, any>;
  authentication: Record<string, any>;
  middleware: any[];
  monitoring: boolean;
  analytics: boolean;
}

export interface APIEndpointConfig {
  id: string;
  gatewayId: string;
  path: string;
  method: string;
  description: string;
  handler: string;
  middleware: any[];
  rateLimits: Record<string, any>;
  auth: Record<string, any>;
  validation: Record<string, any>;
  enabled: boolean;
}

export interface APIKeyConfig {
  id: string;
  gatewayId: string;
  keyId: string;
  name: string;
  description?: string;
  key: string;
  scopes: string[];
  rateLimits: Record<string, any>;
  expiresAt?: Date;
  active: boolean;
}

export interface APIAnalyticsData {
  endpointId: string;
  timestamp: Date;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  userAgent?: string;
  ipAddress?: string;
  apiKey?: string;
}

export class APIGatewayService {
  // Create API Gateway
  async createAPIGateway(data: {
    name: string;
    description: string;
    baseUrl: string;
    version?: string;
    rateLimitConfig?: Record<string, any>;
    authentication?: Record<string, any>;
    middleware?: any[];
  }): Promise<APIGatewayConfig> {
    try {
      const gateway = await prisma.aPIGateway.create({
        data: {
          name: data.name,
          description: data.description,
          baseUrl: data.baseUrl,
          version: data.version || '1.0',
          status: 'active',
          rateLimitConfig: data.rateLimitConfig || {
            global: { limit: 10000, window: 3600 },
            authenticated: { limit: 50000, window: 3600 },
            anonymous: { limit: 1000, window: 3600 }
          },
          authentication: data.authentication || {
            type: 'api_key',
            required: true,
            header: 'X-API-Key'
          },
          middleware: data.middleware || ['cors', 'rate_limit', 'auth', 'analytics'],
          monitoring: true,
          analytics: true,
          metadata: {
            createdBy: 'system',
            gatewayType: 'enterprise'
          }
        }
      });

      return {
        id: gateway.id,
        name: gateway.name,
        description: gateway.description,
        baseUrl: gateway.baseUrl,
        version: gateway.version,
        status: gateway.status,
        rateLimitConfig: gateway.rateLimitConfig as Record<string, any>,
        authentication: gateway.authentication as Record<string, any>,
        middleware: gateway.middleware as any[],
        monitoring: gateway.monitoring,
        analytics: gateway.analytics
      };
    } catch (error) {
      console.error('Failed to create API gateway:', error);
      throw new Error('Failed to create API gateway');
    }
  }

  // Get API Gateways
  async getAPIGateways(filter?: {
    status?: string;
    version?: string;
  }): Promise<APIGatewayConfig[]> {
    try {
      const gateways = await prisma.aPIGateway.findMany({
        where: {
          ...(filter?.status && { status: filter.status }),
          ...(filter?.version && { version: filter.version })
        },
        orderBy: { createdAt: 'desc' }
      });

      return gateways.map(gateway => ({
        id: gateway.id,
        name: gateway.name,
        description: gateway.description,
        baseUrl: gateway.baseUrl,
        version: gateway.version,
        status: gateway.status,
        rateLimitConfig: gateway.rateLimitConfig as Record<string, any>,
        authentication: gateway.authentication as Record<string, any>,
        middleware: gateway.middleware as any[],
        monitoring: gateway.monitoring,
        analytics: gateway.analytics
      }));
    } catch (error) {
      console.error('Failed to get API gateways:', error);
      throw new Error('Failed to get API gateways');
    }
  }

  // Create API Endpoint
  async createAPIEndpoint(data: {
    gatewayId: string;
    path: string;
    method: string;
    description: string;
    handler: string;
    middleware?: any[];
    rateLimits?: Record<string, any>;
    auth?: Record<string, any>;
    validation?: Record<string, any>;
  }): Promise<APIEndpointConfig> {
    try {
      const endpoint = await prisma.aPIEndpoint.create({
        data: {
          gatewayId: data.gatewayId,
          path: data.path,
          method: data.method.toUpperCase(),
          description: data.description,
          handler: data.handler,
          middleware: data.middleware || [],
          rateLimits: data.rateLimits || {},
          auth: data.auth || {},
          validation: data.validation || {},
          enabled: true,
          metadata: {
            createdBy: 'system',
            endpointType: 'enterprise'
          }
        }
      });

      return {
        id: endpoint.id,
        gatewayId: endpoint.gatewayId,
        path: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        handler: endpoint.handler,
        middleware: endpoint.middleware as any[],
        rateLimits: endpoint.rateLimits as Record<string, any>,
        auth: endpoint.auth as Record<string, any>,
        validation: endpoint.validation as Record<string, any>,
        enabled: endpoint.enabled
      };
    } catch (error) {
      console.error('Failed to create API endpoint:', error);
      throw new Error('Failed to create API endpoint');
    }
  }

  // Get API Endpoints
  async getAPIEndpoints(gatewayId?: string): Promise<APIEndpointConfig[]> {
    try {
      const endpoints = await prisma.aPIEndpoint.findMany({
        where: gatewayId ? { gatewayId } : {},
        orderBy: { createdAt: 'desc' }
      });

      return endpoints.map(endpoint => ({
        id: endpoint.id,
        gatewayId: endpoint.gatewayId,
        path: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        handler: endpoint.handler,
        middleware: endpoint.middleware as any[],
        rateLimits: endpoint.rateLimits as Record<string, any>,
        auth: endpoint.auth as Record<string, any>,
        validation: endpoint.validation as Record<string, any>,
        enabled: endpoint.enabled
      }));
    } catch (error) {
      console.error('Failed to get API endpoints:', error);
      throw new Error('Failed to get API endpoints');
    }
  }

  // Create API Key
  async createAPIKey(data: {
    gatewayId: string;
    name: string;
    description?: string;
    scopes: string[];
    rateLimits?: Record<string, any>;
    expiresAt?: Date;
  }): Promise<APIKeyConfig> {
    try {
      const keyId = `apk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const key = `sk_${Math.random().toString(36).substr(2, 32)}`;

      const apiKey = await prisma.aPIKey.create({
        data: {
          gatewayId: data.gatewayId,
          keyId,
          name: data.name,
          description: data.description,
          key,
          scopes: data.scopes,
          rateLimits: data.rateLimits || {},
          expiresAt: data.expiresAt,
          active: true,
          metadata: {
            createdBy: 'system',
            keyType: 'enterprise'
          }
        }
      });

      return {
        id: apiKey.id,
        gatewayId: apiKey.gatewayId,
        keyId: apiKey.keyId,
        name: apiKey.name,
        description: apiKey.description || undefined,
        key: apiKey.key,
        scopes: apiKey.scopes,
        rateLimits: apiKey.rateLimits as Record<string, any>,
        expiresAt: apiKey.expiresAt || undefined,
        active: apiKey.active
      };
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw new Error('Failed to create API key');
    }
  }

  // Get API Keys
  async getAPIKeys(gatewayId?: string): Promise<APIKeyConfig[]> {
    try {
      const apiKeys = await prisma.aPIKey.findMany({
        where: gatewayId ? { gatewayId } : {},
        orderBy: { createdAt: 'desc' }
      });

      return apiKeys.map(apiKey => ({
        id: apiKey.id,
        gatewayId: apiKey.gatewayId,
        keyId: apiKey.keyId,
        name: apiKey.name,
        description: apiKey.description || undefined,
        key: apiKey.key,
        scopes: apiKey.scopes,
        rateLimits: apiKey.rateLimits as Record<string, any>,
        expiresAt: apiKey.expiresAt || undefined,
        active: apiKey.active
      }));
    } catch (error) {
      console.error('Failed to get API keys:', error);
      throw new Error('Failed to get API keys');
    }
  }

  // Log API Analytics
  async logAPIAnalytics(data: APIAnalyticsData): Promise<void> {
    try {
      await prisma.aPIAnalytics.create({
        data: {
          endpointId: data.endpointId,
          timestamp: data.timestamp,
          method: data.method,
          path: data.path,
          statusCode: data.statusCode,
          responseTime: data.responseTime,
          requestSize: data.requestSize,
          responseSize: data.responseSize,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          apiKey: data.apiKey,
          metadata: {
            loggedAt: new Date(),
            source: 'api_gateway'
          }
        }
      });
    } catch (error) {
      console.error('Failed to log API analytics:', error);
    }
  }

  // Get API Analytics
  async getAPIAnalytics(gatewayId?: string, endpointId?: string): Promise<{
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    topEndpoints: Array<{ path: string; method: string; count: number }>;
    statusCodeDistribution: Record<string, number>;
    requestsByHour: Array<{ hour: number; count: number }>;
    errorRate: number;
    throughput: number;
  }> {
    try {
      const whereCondition = {
        ...(endpointId && { endpointId }),
        ...(gatewayId && {
          endpoint: {
            gatewayId
          }
        })
      };

      const [totalRequests, successfulRequests, failedRequests] = await Promise.all([
        prisma.aPIAnalytics.count({ where: whereCondition }),
        prisma.aPIAnalytics.count({
          where: {
            ...whereCondition,
            statusCode: { gte: 200, lt: 400 }
          }
        }),
        prisma.aPIAnalytics.count({
          where: {
            ...whereCondition,
            statusCode: { gte: 400 }
          }
        })
      ]);

      const analytics = await prisma.aPIAnalytics.findMany({
        where: whereCondition,
        orderBy: { timestamp: 'desc' },
        take: 10000
      });

      const avgResponseTime = analytics.length > 0 
        ? analytics.reduce((sum, log) => sum + log.responseTime, 0) / analytics.length
        : 0;

      // Top endpoints
      const endpointCounts = analytics.reduce((acc, log) => {
        const key = `${log.method} ${log.path}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topEndpoints = Object.entries(endpointCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([key, count]) => {
          const [method, path] = key.split(' ', 2);
          return { path, method, count };
        });

      // Status code distribution
      const statusCodeDistribution = analytics.reduce((acc, log) => {
        const statusGroup = Math.floor(log.statusCode / 100) * 100;
        acc[`${statusGroup}xx`] = (acc[`${statusGroup}xx`] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Requests by hour
      const requestsByHour = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: analytics.filter(log => log.timestamp.getHours() === hour).length
      }));

      const errorRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;
      const throughput = totalRequests / 24; // Requests per hour

      return {
        totalRequests,
        successfulRequests,
        failedRequests,
        avgResponseTime: Math.round(avgResponseTime),
        topEndpoints,
        statusCodeDistribution,
        requestsByHour,
        errorRate: Math.round(errorRate * 100) / 100,
        throughput: Math.round(throughput)
      };
    } catch (error) {
      console.error('Failed to get API analytics:', error);
      throw new Error('Failed to get API analytics');
    }
  }

  // Validate API Key
  async validateAPIKey(key: string, gatewayId?: string): Promise<{
    valid: boolean;
    apiKey?: APIKeyConfig;
    error?: string;
  }> {
    try {
      const apiKey = await prisma.aPIKey.findUnique({
        where: { key },
        include: {
          gateway: true
        }
      });

      if (!apiKey) {
        return { valid: false, error: 'Invalid API key' };
      }

      if (!apiKey.active) {
        return { valid: false, error: 'API key is inactive' };
      }

      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return { valid: false, error: 'API key has expired' };
      }

      if (gatewayId && apiKey.gatewayId !== gatewayId) {
        return { valid: false, error: 'API key is not valid for this gateway' };
      }

      return {
        valid: true,
        apiKey: {
          id: apiKey.id,
          gatewayId: apiKey.gatewayId,
          keyId: apiKey.keyId,
          name: apiKey.name,
          description: apiKey.description || undefined,
          key: apiKey.key,
          scopes: apiKey.scopes,
          rateLimits: apiKey.rateLimits as Record<string, any>,
          expiresAt: apiKey.expiresAt || undefined,
          active: apiKey.active
        }
      };
    } catch (error) {
      console.error('Failed to validate API key:', error);
      return { valid: false, error: 'Failed to validate API key' };
    }
  }
}

export const apiGatewayService = new APIGatewayService();
