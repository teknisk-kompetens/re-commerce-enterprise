
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// HR Integration Types
export interface HRConnection {
  id: string;
  name: string;
  type: 'workday' | 'bamboohr' | 'adp' | 'successfactors' | 'cornerstoneонdemand';
  version: string;
  endpoint: string;
  credentials: Record<string, any>;
  config: Record<string, any>;
  status: string;
  lastSync?: Date;
  enabled: boolean;
}

export interface HRSyncResult {
  syncId: string;
  operation: 'import' | 'export' | 'sync' | 'validate';
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  errors: any[];
  startTime: Date;
  endTime?: Date;
  status: 'started' | 'completed' | 'failed' | 'cancelled';
}

export class HRIntegrationService {
  // Create HR Integration
  async createHRIntegration(data: {
    name: string;
    type: string;
    version: string;
    endpoint: string;
    credentials: Record<string, any>;
    config: Record<string, any>;
    syncSettings?: Record<string, any>;
    syncInterval?: number;
  }): Promise<HRConnection> {
    try {
      const integration = await prisma.hRIntegration.create({
        data: {
          name: data.name,
          type: data.type,
          version: data.version,
          endpoint: data.endpoint,
          credentials: data.credentials,
          config: data.config,
          syncSettings: data.syncSettings || {},
          syncInterval: data.syncInterval || 7200,
          status: 'active',
          enabled: true,
          metadata: {
            createdBy: 'system',
            connectionType: 'hr',
            securityLevel: 'high'
          }
        }
      });

      return {
        id: integration.id,
        name: integration.name,
        type: integration.type as any,
        version: integration.version,
        endpoint: integration.endpoint,
        credentials: integration.credentials as Record<string, any>,
        config: integration.config as Record<string, any>,
        status: integration.status,
        lastSync: integration.lastSync || undefined,
        enabled: integration.enabled
      };
    } catch (error) {
      console.error('Failed to create HR integration:', error);
      throw new Error('Failed to create HR integration');
    }
  }

  // Get HR Integrations
  async getHRIntegrations(filter?: {
    type?: string;
    status?: string;
    enabled?: boolean;
  }): Promise<HRConnection[]> {
    try {
      const integrations = await prisma.hRIntegration.findMany({
        where: {
          ...(filter?.type && { type: filter.type }),
          ...(filter?.status && { status: filter.status }),
          ...(filter?.enabled !== undefined && { enabled: filter.enabled })
        },
        orderBy: { createdAt: 'desc' }
      });

      return integrations.map(integration => ({
        id: integration.id,
        name: integration.name,
        type: integration.type as any,
        version: integration.version,
        endpoint: integration.endpoint,
        credentials: integration.credentials as Record<string, any>,
        config: integration.config as Record<string, any>,
        status: integration.status,
        lastSync: integration.lastSync || undefined,
        enabled: integration.enabled
      }));
    } catch (error) {
      console.error('Failed to get HR integrations:', error);
      throw new Error('Failed to get HR integrations');
    }
  }

  // Start HR Sync
  async startHRSync(
    integrationId: string,
    operation: 'import' | 'export' | 'sync' | 'validate',
    options?: Record<string, any>
  ): Promise<HRSyncResult> {
    try {
      const syncId = `hr_sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const syncLog = await prisma.hRSyncLog.create({
        data: {
          integrationId,
          syncId,
          operation,
          status: 'started',
          recordsProcessed: 0,
          recordsSucceeded: 0,
          recordsFailed: 0,
          errors: [],
          startTime: new Date(),
          metadata: {
            options: options || {},
            triggeredBy: 'system'
          }
        }
      });

      // Simulate HR sync process
      setTimeout(async () => {
        try {
          const mockResults = this.simulateHRSync(operation);
          
          await prisma.hRSyncLog.update({
            where: { id: syncLog.id },
            data: {
              status: 'completed',
              recordsProcessed: mockResults.recordsProcessed,
              recordsSucceeded: mockResults.recordsSucceeded,
              recordsFailed: mockResults.recordsFailed,
              errors: mockResults.errors,
              endTime: new Date()
            }
          });

          // Update integration last sync
          await prisma.hRIntegration.update({
            where: { id: integrationId },
            data: { lastSync: new Date() }
          });
        } catch (error) {
          await prisma.hRSyncLog.update({
            where: { id: syncLog.id },
            data: {
              status: 'failed',
              errors: [{ message: 'Sync process failed', error: error?.toString() }],
              endTime: new Date()
            }
          });
        }
      }, 2500);

      return {
        syncId,
        operation,
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        errors: [],
        startTime: syncLog.startTime,
        status: 'started'
      };
    } catch (error) {
      console.error('Failed to start HR sync:', error);
      throw new Error('Failed to start HR sync');
    }
  }

  // Get HR Analytics
  async getHRAnalytics(integrationId?: string): Promise<{
    totalIntegrations: number;
    activeIntegrations: number;
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    avgSyncTime: number;
    recentSyncs: HRSyncResult[];
    employeeMetrics: {
      totalEmployees: number;
      activeEmployees: number;
      newHires: number;
      departures: number;
      turnoverRate: number;
      averageTenure: number;
    };
    departmentMetrics: Record<string, number>;
    performanceMetrics: {
      averageRating: number;
      completedReviews: number;
      pendingReviews: number;
    };
  }> {
    try {
      const [totalIntegrations, activeIntegrations] = await Promise.all([
        prisma.hRIntegration.count(integrationId ? { where: { id: integrationId } } : {}),
        prisma.hRIntegration.count({
          where: {
            ...(integrationId && { id: integrationId }),
            status: 'active',
            enabled: true
          }
        })
      ]);

      const [totalSyncs, successfulSyncs, failedSyncs] = await Promise.all([
        prisma.hRSyncLog.count(integrationId ? { where: { integrationId } } : {}),
        prisma.hRSyncLog.count({
          where: {
            ...(integrationId && { integrationId }),
            status: 'completed'
          }
        }),
        prisma.hRSyncLog.count({
          where: {
            ...(integrationId && { integrationId }),
            status: 'failed'
          }
        })
      ]);

      const recentSyncLogs = await prisma.hRSyncLog.findMany({
        where: integrationId ? { integrationId } : {},
        orderBy: { startTime: 'desc' },
        take: 10
      });

      const recentSyncs: HRSyncResult[] = recentSyncLogs.map(log => ({
        syncId: log.syncId,
        operation: log.operation as any,
        recordsProcessed: log.recordsProcessed,
        recordsSucceeded: log.recordsSucceeded,
        recordsFailed: log.recordsFailed,
        errors: log.errors as any[],
        startTime: log.startTime,
        endTime: log.endTime || undefined,
        status: log.status as any
      }));

      // Calculate average sync time
      const completedSyncs = recentSyncLogs.filter(log => log.endTime);
      const avgSyncTime = completedSyncs.length > 0 
        ? completedSyncs.reduce((acc, log) => 
            acc + (log.endTime!.getTime() - log.startTime.getTime()), 0) / completedSyncs.length
        : 0;

      // Mock HR-specific metrics
      const employeeMetrics = {
        totalEmployees: Math.floor(Math.random() * 5000) + 1000,
        activeEmployees: Math.floor(Math.random() * 4800) + 950,
        newHires: Math.floor(Math.random() * 200) + 50,
        departures: Math.floor(Math.random() * 150) + 30,
        turnoverRate: Math.random() * 15 + 5, // 5-20%
        averageTenure: Math.random() * 3 + 2 // 2-5 years
      };

      const departmentMetrics = {
        'Engineering': Math.floor(Math.random() * 500) + 200,
        'Sales': Math.floor(Math.random() * 300) + 100,
        'Marketing': Math.floor(Math.random() * 200) + 80,
        'HR': Math.floor(Math.random() * 100) + 30,
        'Operations': Math.floor(Math.random() * 150) + 70,
        'Finance': Math.floor(Math.random() * 120) + 50
      };

      const performanceMetrics = {
        averageRating: Math.random() * 1.5 + 3.5, // 3.5-5.0
        completedReviews: Math.floor(Math.random() * 800) + 200,
        pendingReviews: Math.floor(Math.random() * 150) + 50
      };

      return {
        totalIntegrations,
        activeIntegrations,
        totalSyncs,
        successfulSyncs,
        failedSyncs,
        avgSyncTime: Math.round(avgSyncTime / 1000),
        recentSyncs,
        employeeMetrics,
        departmentMetrics,
        performanceMetrics
      };
    } catch (error) {
      console.error('Failed to get HR analytics:', error);
      throw new Error('Failed to get HR analytics');
    }
  }

  // Private helper methods
  private simulateHRSync(operation: string): {
    recordsProcessed: number;
    recordsSucceeded: number;
    recordsFailed: number;
    errors: any[];
  } {
    const recordsProcessed = Math.floor(Math.random() * 2000) + 500;
    const failureRate = Math.random() * 0.03; // 0-3% failure rate
    const recordsFailed = Math.floor(recordsProcessed * failureRate);
    const recordsSucceeded = recordsProcessed - recordsFailed;
    
    const errors = recordsFailed > 0 ? [
      { message: 'Employee ID mismatch', count: Math.floor(recordsFailed * 0.6) },
      { message: 'Missing required fields', count: Math.floor(recordsFailed * 0.4) }
    ] : [];

    return {
      recordsProcessed,
      recordsSucceeded,
      recordsFailed,
      errors
    };
  }
}

export const hrIntegrationService = new HRIntegrationService();
