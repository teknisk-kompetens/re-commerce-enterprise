
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Financial Integration Types
export interface FinancialConnection {
  id: string;
  name: string;
  type: 'quickbooks' | 'netsuite' | 'xero' | 'sage' | 'freshbooks';
  version: string;
  endpoint: string;
  credentials: Record<string, any>;
  config: Record<string, any>;
  status: string;
  lastSync?: Date;
  enabled: boolean;
}

export interface FinancialSyncResult {
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

export class FinancialIntegrationService {
  // Create Financial Integration
  async createFinancialIntegration(data: {
    name: string;
    type: string;
    version: string;
    endpoint: string;
    credentials: Record<string, any>;
    config: Record<string, any>;
    syncSettings?: Record<string, any>;
    syncInterval?: number;
  }): Promise<FinancialConnection> {
    try {
      const integration = await prisma.financialIntegration.create({
        data: {
          name: data.name,
          type: data.type,
          version: data.version,
          endpoint: data.endpoint,
          credentials: data.credentials,
          config: data.config,
          syncSettings: data.syncSettings || {},
          syncInterval: data.syncInterval || 3600,
          status: 'active',
          enabled: true,
          metadata: {
            createdBy: 'system',
            connectionType: 'financial',
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
      console.error('Failed to create financial integration:', error);
      throw new Error('Failed to create financial integration');
    }
  }

  // Get Financial Integrations
  async getFinancialIntegrations(filter?: {
    type?: string;
    status?: string;
    enabled?: boolean;
  }): Promise<FinancialConnection[]> {
    try {
      const integrations = await prisma.financialIntegration.findMany({
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
      console.error('Failed to get financial integrations:', error);
      throw new Error('Failed to get financial integrations');
    }
  }

  // Start Financial Sync
  async startFinancialSync(
    integrationId: string,
    operation: 'import' | 'export' | 'sync' | 'validate',
    options?: Record<string, any>
  ): Promise<FinancialSyncResult> {
    try {
      const syncId = `fin_sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const syncLog = await prisma.financialSyncLog.create({
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

      // Simulate financial sync process
      setTimeout(async () => {
        try {
          const mockResults = this.simulateFinancialSync(operation);
          
          await prisma.financialSyncLog.update({
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
          await prisma.financialIntegration.update({
            where: { id: integrationId },
            data: { lastSync: new Date() }
          });
        } catch (error) {
          await prisma.financialSyncLog.update({
            where: { id: syncLog.id },
            data: {
              status: 'failed',
              errors: [{ message: 'Sync process failed', error: error?.toString() }],
              endTime: new Date()
            }
          });
        }
      }, 2000);

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
      console.error('Failed to start financial sync:', error);
      throw new Error('Failed to start financial sync');
    }
  }

  // Get Financial Analytics
  async getFinancialAnalytics(integrationId?: string): Promise<{
    totalIntegrations: number;
    activeIntegrations: number;
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    avgSyncTime: number;
    recentSyncs: FinancialSyncResult[];
    financialMetrics: {
      totalRevenue: number;
      totalExpenses: number;
      netIncome: number;
      grossMargin: number;
      operatingMargin: number;
      cashFlow: number;
      accountsReceivable: number;
      accountsPayable: number;
    };
    monthlyTrends: Array<{
      month: string;
      revenue: number;
      expenses: number;
      profit: number;
    }>;
    topExpenseCategories: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  }> {
    try {
      const [totalIntegrations, activeIntegrations] = await Promise.all([
        prisma.financialIntegration.count(integrationId ? { where: { id: integrationId } } : {}),
        prisma.financialIntegration.count({
          where: {
            ...(integrationId && { id: integrationId }),
            status: 'active',
            enabled: true
          }
        })
      ]);

      const [totalSyncs, successfulSyncs, failedSyncs] = await Promise.all([
        prisma.financialSyncLog.count(integrationId ? { where: { integrationId } } : {}),
        prisma.financialSyncLog.count({
          where: {
            ...(integrationId && { integrationId }),
            status: 'completed'
          }
        }),
        prisma.financialSyncLog.count({
          where: {
            ...(integrationId && { integrationId }),
            status: 'failed'
          }
        })
      ]);

      const recentSyncLogs = await prisma.financialSyncLog.findMany({
        where: integrationId ? { integrationId } : {},
        orderBy: { startTime: 'desc' },
        take: 10
      });

      const recentSyncs: FinancialSyncResult[] = recentSyncLogs.map(log => ({
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

      // Mock financial metrics
      const totalRevenue = Math.floor(Math.random() * 10000000) + 5000000;
      const totalExpenses = Math.floor(totalRevenue * (Math.random() * 0.3 + 0.6));
      const netIncome = totalRevenue - totalExpenses;
      const grossMargin = ((totalRevenue - totalExpenses * 0.6) / totalRevenue) * 100;
      const operatingMargin = (netIncome / totalRevenue) * 100;
      const cashFlow = Math.floor(Math.random() * 2000000) + 500000;
      const accountsReceivable = Math.floor(Math.random() * 1000000) + 200000;
      const accountsPayable = Math.floor(Math.random() * 800000) + 150000;

      const financialMetrics = {
        totalRevenue,
        totalExpenses,
        netIncome,
        grossMargin,
        operatingMargin,
        cashFlow,
        accountsReceivable,
        accountsPayable
      };

      // Mock monthly trends (last 12 months)
      const monthlyTrends = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthRevenue = Math.floor(Math.random() * 1000000) + 400000;
        const monthExpenses = Math.floor(monthRevenue * (Math.random() * 0.3 + 0.6));
        
        return {
          month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
          revenue: monthRevenue,
          expenses: monthExpenses,
          profit: monthRevenue - monthExpenses
        };
      }).reverse();

      // Mock top expense categories
      const expenseCategories = [
        'Salaries & Benefits',
        'Office Rent',
        'Marketing',
        'Technology',
        'Professional Services',
        'Travel',
        'Utilities',
        'Insurance'
      ];

      const topExpenseCategories = expenseCategories.map(category => {
        const amount = Math.floor(Math.random() * 500000) + 50000;
        const percentage = (amount / totalExpenses) * 100;
        return { category, amount, percentage };
      }).sort((a, b) => b.amount - a.amount).slice(0, 5);

      return {
        totalIntegrations,
        activeIntegrations,
        totalSyncs,
        successfulSyncs,
        failedSyncs,
        avgSyncTime: Math.round(avgSyncTime / 1000),
        recentSyncs,
        financialMetrics,
        monthlyTrends,
        topExpenseCategories
      };
    } catch (error) {
      console.error('Failed to get financial analytics:', error);
      throw new Error('Failed to get financial analytics');
    }
  }

  // Private helper methods
  private simulateFinancialSync(operation: string): {
    recordsProcessed: number;
    recordsSucceeded: number;
    recordsFailed: number;
    errors: any[];
  } {
    const recordsProcessed = Math.floor(Math.random() * 5000) + 1000;
    const failureRate = Math.random() * 0.02; // 0-2% failure rate
    const recordsFailed = Math.floor(recordsProcessed * failureRate);
    const recordsSucceeded = recordsProcessed - recordsFailed;
    
    const errors = recordsFailed > 0 ? [
      { message: 'Account code validation failed', count: Math.floor(recordsFailed * 0.7) },
      { message: 'Currency conversion error', count: Math.floor(recordsFailed * 0.3) }
    ] : [];

    return {
      recordsProcessed,
      recordsSucceeded,
      recordsFailed,
      errors
    };
  }
}

export const financialIntegrationService = new FinancialIntegrationService();
