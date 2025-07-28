
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// ETL Integration Types
export interface ETLPipelineConfig {
  id: string;
  name: string;
  description: string;
  type: 'extract' | 'transform' | 'load' | 'etl' | 'elt';
  source: Record<string, any>;
  destination: Record<string, any>;
  transformation: Record<string, any>;
  schedule: string;
  status: string;
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
  createdBy: string;
}

export interface ETLRunResult {
  id: string;
  pipelineId: string;
  runId: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  errors: any[];
  logs: any[];
  metrics: Record<string, any>;
}

export class ETLIntegrationService {
  // Create ETL Pipeline
  async createETLPipeline(data: {
    name: string;
    description: string;
    type: 'extract' | 'transform' | 'load' | 'etl' | 'elt';
    source: Record<string, any>;
    destination: Record<string, any>;
    transformation: Record<string, any>;
    schedule: string;
    createdBy: string;
  }): Promise<ETLPipelineConfig> {
    try {
      const pipeline = await prisma.eTLPipeline.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          source: data.source,
          destination: data.destination,
          transformation: data.transformation,
          schedule: data.schedule,
          status: 'active',
          enabled: true,
          createdBy: data.createdBy,
          metadata: {
            createdAt: new Date(),
            pipelineType: data.type,
            version: '1.0'
          }
        }
      });

      return {
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        type: pipeline.type as any,
        source: pipeline.source as Record<string, any>,
        destination: pipeline.destination as Record<string, any>,
        transformation: pipeline.transformation as Record<string, any>,
        schedule: pipeline.schedule,
        status: pipeline.status,
        lastRun: pipeline.lastRun || undefined,
        nextRun: pipeline.nextRun || undefined,
        enabled: pipeline.enabled,
        createdBy: pipeline.createdBy
      };
    } catch (error) {
      console.error('Failed to create ETL pipeline:', error);
      throw new Error('Failed to create ETL pipeline');
    }
  }

  // Get ETL Pipelines
  async getETLPipelines(filter?: {
    type?: string;
    status?: string;
    enabled?: boolean;
  }): Promise<ETLPipelineConfig[]> {
    try {
      const pipelines = await prisma.eTLPipeline.findMany({
        where: {
          ...(filter?.type && { type: filter.type }),
          ...(filter?.status && { status: filter.status }),
          ...(filter?.enabled !== undefined && { enabled: filter.enabled })
        },
        orderBy: { createdAt: 'desc' }
      });

      return pipelines.map(pipeline => ({
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        type: pipeline.type as any,
        source: pipeline.source as Record<string, any>,
        destination: pipeline.destination as Record<string, any>,
        transformation: pipeline.transformation as Record<string, any>,
        schedule: pipeline.schedule,
        status: pipeline.status,
        lastRun: pipeline.lastRun || undefined,
        nextRun: pipeline.nextRun || undefined,
        enabled: pipeline.enabled,
        createdBy: pipeline.createdBy
      }));
    } catch (error) {
      console.error('Failed to get ETL pipelines:', error);
      throw new Error('Failed to get ETL pipelines');
    }
  }

  // Run ETL Pipeline
  async runETLPipeline(
    pipelineId: string,
    options?: Record<string, any>
  ): Promise<ETLRunResult> {
    try {
      const pipeline = await prisma.eTLPipeline.findUnique({
        where: { id: pipelineId }
      });

      if (!pipeline) {
        throw new Error('Pipeline not found');
      }

      const runId = `etl_run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const run = await prisma.eTLRun.create({
        data: {
          pipelineId,
          runId,
          startTime: new Date(),
          status: 'running',
          recordsProcessed: 0,
          recordsSucceeded: 0,
          recordsFailed: 0,
          errors: [],
          logs: [],
          metrics: {
            options: options || {},
            triggeredBy: 'system'
          }
        }
      });

      // Simulate ETL process
      setTimeout(async () => {
        try {
          const mockResults = this.simulateETLProcess(pipeline.type);
          
          await prisma.eTLRun.update({
            where: { id: run.id },
            data: {
              status: 'completed',
              endTime: new Date(),
              recordsProcessed: mockResults.recordsProcessed,
              recordsSucceeded: mockResults.recordsSucceeded,
              recordsFailed: mockResults.recordsFailed,
              errors: mockResults.errors,
              logs: mockResults.logs,
              metrics: {
                ...run.metrics,
                ...mockResults.metrics
              }
            }
          });

          // Update pipeline last run
          await prisma.eTLPipeline.update({
            where: { id: pipelineId },
            data: { lastRun: new Date() }
          });
        } catch (error) {
          await prisma.eTLRun.update({
            where: { id: run.id },
            data: {
              status: 'failed',
              endTime: new Date(),
              errors: [{ message: 'ETL process failed', error: error?.toString() }]
            }
          });
        }
      }, 3000);

      return {
        id: run.id,
        pipelineId: run.pipelineId,
        runId: run.runId,
        startTime: run.startTime,
        endTime: run.endTime || undefined,
        status: run.status as any,
        recordsProcessed: run.recordsProcessed,
        recordsSucceeded: run.recordsSucceeded,
        recordsFailed: run.recordsFailed,
        errors: run.errors as any[],
        logs: run.logs as any[],
        metrics: run.metrics as Record<string, any>
      };
    } catch (error) {
      console.error('Failed to run ETL pipeline:', error);
      throw new Error('Failed to run ETL pipeline');
    }
  }

  // Get ETL Runs
  async getETLRuns(pipelineId?: string): Promise<ETLRunResult[]> {
    try {
      const runs = await prisma.eTLRun.findMany({
        where: pipelineId ? { pipelineId } : {},
        orderBy: { startTime: 'desc' },
        take: 50
      });

      return runs.map(run => ({
        id: run.id,
        pipelineId: run.pipelineId,
        runId: run.runId,
        startTime: run.startTime,
        endTime: run.endTime || undefined,
        status: run.status as any,
        recordsProcessed: run.recordsProcessed,
        recordsSucceeded: run.recordsSucceeded,
        recordsFailed: run.recordsFailed,
        errors: run.errors as any[],
        logs: run.logs as any[],
        metrics: run.metrics as Record<string, any>
      }));
    } catch (error) {
      console.error('Failed to get ETL runs:', error);
      throw new Error('Failed to get ETL runs');
    }
  }

  // Get ETL Analytics
  async getETLAnalytics(pipelineId?: string): Promise<{
    totalPipelines: number;
    activePipelines: number;
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    avgProcessingTime: number;
    totalRecordsProcessed: number;
    dataVolumeByDay: Array<{ date: string; volume: number }>;
    pipelinePerformance: Array<{ name: string; successRate: number; avgTime: number }>;
  }> {
    try {
      const [totalPipelines, activePipelines] = await Promise.all([
        prisma.eTLPipeline.count(pipelineId ? { where: { id: pipelineId } } : {}),
        prisma.eTLPipeline.count({
          where: {
            ...(pipelineId && { id: pipelineId }),
            status: 'active',
            enabled: true
          }
        })
      ]);

      const [totalRuns, successfulRuns, failedRuns] = await Promise.all([
        prisma.eTLRun.count(pipelineId ? { where: { pipelineId } } : {}),
        prisma.eTLRun.count({
          where: {
            ...(pipelineId && { pipelineId }),
            status: 'completed'
          }
        }),
        prisma.eTLRun.count({
          where: {
            ...(pipelineId && { pipelineId }),
            status: 'failed'
          }
        })
      ]);

      const runs = await prisma.eTLRun.findMany({
        where: pipelineId ? { pipelineId } : {},
        orderBy: { startTime: 'desc' },
        take: 100
      });

      const completedRuns = runs.filter(run => run.endTime);
      const avgProcessingTime = completedRuns.length > 0 
        ? completedRuns.reduce((acc, run) => 
            acc + (run.endTime!.getTime() - run.startTime.getTime()), 0) / completedRuns.length
        : 0;

      const totalRecordsProcessed = runs.reduce((sum, run) => sum + run.recordsProcessed, 0);

      // Data volume by day (last 7 days)
      const dataVolumeByDay = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayRuns = runs.filter(run => 
          run.startTime.toDateString() === date.toDateString()
        );
        return {
          date: date.toISOString().split('T')[0],
          volume: dayRuns.reduce((sum, run) => sum + run.recordsProcessed, 0)
        };
      }).reverse();

      // Pipeline performance
      const pipelinePerformance = await this.getPipelinePerformance(pipelineId);

      return {
        totalPipelines,
        activePipelines,
        totalRuns,
        successfulRuns,
        failedRuns,
        avgProcessingTime: Math.round(avgProcessingTime / 1000), // Convert to seconds
        totalRecordsProcessed,
        dataVolumeByDay,
        pipelinePerformance
      };
    } catch (error) {
      console.error('Failed to get ETL analytics:', error);
      throw new Error('Failed to get ETL analytics');
    }
  }

  // Private helper methods
  private simulateETLProcess(type: string): {
    recordsProcessed: number;
    recordsSucceeded: number;
    recordsFailed: number;
    errors: any[];
    logs: any[];
    metrics: Record<string, any>;
  } {
    const recordsProcessed = Math.floor(Math.random() * 10000) + 1000;
    const failureRate = Math.random() * 0.05; // 0-5% failure rate
    const recordsFailed = Math.floor(recordsProcessed * failureRate);
    const recordsSucceeded = recordsProcessed - recordsFailed;
    
    const errors = recordsFailed > 0 ? [
      { message: 'Data format validation failed', count: Math.floor(recordsFailed * 0.6) },
      { message: 'Duplicate key constraint', count: Math.floor(recordsFailed * 0.4) }
    ] : [];

    const logs = [
      { timestamp: new Date(), level: 'info', message: `Starting ${type} process` },
      { timestamp: new Date(), level: 'info', message: `Processing ${recordsProcessed} records` },
      { timestamp: new Date(), level: 'info', message: `Successfully processed ${recordsSucceeded} records` },
      ...(recordsFailed > 0 ? [{ timestamp: new Date(), level: 'warn', message: `Failed to process ${recordsFailed} records` }] : []),
      { timestamp: new Date(), level: 'info', message: `${type} process completed` }
    ];

    const metrics = {
      throughput: Math.floor(recordsProcessed / 60), // Records per minute
      memoryUsage: Math.random() * 1000 + 500, // MB
      cpuUsage: Math.random() * 100,
      networkIO: Math.random() * 100,
      diskIO: Math.random() * 100
    };

    return {
      recordsProcessed,
      recordsSucceeded,
      recordsFailed,
      errors,
      logs,
      metrics
    };
  }

  private async getPipelinePerformance(pipelineId?: string): Promise<Array<{ name: string; successRate: number; avgTime: number }>> {
    try {
      const pipelines = await prisma.eTLPipeline.findMany({
        where: pipelineId ? { id: pipelineId } : {},
        include: {
          runs: {
            orderBy: { startTime: 'desc' },
            take: 20
          }
        }
      });

      return pipelines.map(pipeline => {
        const { runs } = pipeline;
        const successfulRuns = runs.filter(run => run.status === 'completed').length;
        const successRate = runs.length > 0 ? (successfulRuns / runs.length) * 100 : 0;
        
        const completedRuns = runs.filter(run => run.endTime);
        const avgTime = completedRuns.length > 0 
          ? completedRuns.reduce((acc, run) => 
              acc + (run.endTime!.getTime() - run.startTime.getTime()), 0) / completedRuns.length
          : 0;

        return {
          name: pipeline.name,
          successRate: Math.round(successRate * 100) / 100,
          avgTime: Math.round(avgTime / 1000) // Convert to seconds
        };
      });
    } catch (error) {
      console.error('Failed to get pipeline performance:', error);
      return [];
    }
  }
}

export const etlIntegrationService = new ETLIntegrationService();
