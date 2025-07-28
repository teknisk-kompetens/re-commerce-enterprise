
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Workflow Automation Types
export interface WorkflowEngineConfig {
  id: string;
  name: string;
  description: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'event_driven';
  status: string;
  config: Record<string, any>;
  triggers: any[];
  actions: any[];
  conditions: any[];
  enabled: boolean;
  createdBy: string;
}

export interface WorkflowConfig {
  id: string;
  engineId: string;
  name: string;
  description: string;
  type: 'approval' | 'automation' | 'integration' | 'notification';
  definition: Record<string, any>;
  config: Record<string, any>;
  triggers: any[];
  steps: any[];
  conditions: any[];
  version: string;
  status: 'draft' | 'active' | 'inactive' | 'deprecated';
  enabled: boolean;
  createdBy: string;
}

export interface WorkflowExecutionResult {
  id: string;
  workflowId: string;
  engineId: string;
  executionId: string;
  triggeredBy: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
  currentStep: number;
  steps: any[];
  variables: Record<string, any>;
  results: Record<string, any>;
  errors: any[];
}

export class WorkflowAutomationService {
  // Create Workflow Engine
  async createWorkflowEngine(data: {
    name: string;
    description: string;
    type: 'sequential' | 'parallel' | 'conditional' | 'event_driven';
    config?: Record<string, any>;
    triggers?: any[];
    actions?: any[];
    conditions?: any[];
    createdBy: string;
  }): Promise<WorkflowEngineConfig> {
    try {
      const engine = await prisma.workflowEngine.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          status: 'active',
          config: data.config || {},
          triggers: data.triggers || [],
          actions: data.actions || [],
          conditions: data.conditions || [],
          enabled: true,
          createdBy: data.createdBy,
          metadata: {
            createdAt: new Date(),
            engineType: data.type,
            version: '1.0'
          }
        }
      });

      return {
        id: engine.id,
        name: engine.name,
        description: engine.description,
        type: engine.type as any,
        status: engine.status,
        config: engine.config as Record<string, any>,
        triggers: engine.triggers as any[],
        actions: engine.actions as any[],
        conditions: engine.conditions as any[],
        enabled: engine.enabled,
        createdBy: engine.createdBy
      };
    } catch (error) {
      console.error('Failed to create workflow engine:', error);
      throw new Error('Failed to create workflow engine');
    }
  }

  // Get Workflow Engines
  async getWorkflowEngines(filter?: {
    type?: string;
    status?: string;
    enabled?: boolean;
  }): Promise<WorkflowEngineConfig[]> {
    try {
      const engines = await prisma.workflowEngine.findMany({
        where: {
          ...(filter?.type && { type: filter.type }),
          ...(filter?.status && { status: filter.status }),
          ...(filter?.enabled !== undefined && { enabled: filter.enabled })
        },
        orderBy: { createdAt: 'desc' }
      });

      return engines.map(engine => ({
        id: engine.id,
        name: engine.name,
        description: engine.description,
        type: engine.type as any,
        status: engine.status,
        config: engine.config as Record<string, any>,
        triggers: engine.triggers as any[],
        actions: engine.actions as any[],
        conditions: engine.conditions as any[],
        enabled: engine.enabled,
        createdBy: engine.createdBy
      }));
    } catch (error) {
      console.error('Failed to get workflow engines:', error);
      throw new Error('Failed to get workflow engines');
    }
  }

  // Create Workflow
  async createWorkflow(data: {
    engineId: string;
    name: string;
    description: string;
    type: 'approval' | 'automation' | 'integration' | 'notification';
    definition: Record<string, any>;
    config?: Record<string, any>;
    triggers?: any[];
    steps?: any[];
    conditions?: any[];
    createdBy: string;
  }): Promise<WorkflowConfig> {
    try {
      const workflow = await prisma.workflow.create({
        data: {
          engineId: data.engineId,
          name: data.name,
          description: data.description,
          type: data.type,
          definition: data.definition,
          config: data.config || {},
          triggers: data.triggers || [],
          steps: data.steps || [],
          conditions: data.conditions || [],
          version: '1.0',
          status: 'draft',
          enabled: true,
          createdBy: data.createdBy,
          metadata: {
            createdAt: new Date(),
            workflowType: data.type,
            version: '1.0'
          }
        }
      });

      return {
        id: workflow.id,
        engineId: workflow.engineId,
        name: workflow.name,
        description: workflow.description,
        type: workflow.type as any,
        definition: workflow.definition as Record<string, any>,
        config: workflow.config as Record<string, any>,
        triggers: workflow.triggers as any[],
        steps: workflow.steps as any[],
        conditions: workflow.conditions as any[],
        version: workflow.version,
        status: workflow.status as any,
        enabled: workflow.enabled,
        createdBy: workflow.createdBy
      };
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw new Error('Failed to create workflow');
    }
  }

  // Get Workflows
  async getWorkflows(engineId?: string): Promise<WorkflowConfig[]> {
    try {
      const workflows = await prisma.workflow.findMany({
        where: engineId ? { engineId } : {},
        orderBy: { createdAt: 'desc' }
      });

      return workflows.map(workflow => ({
        id: workflow.id,
        engineId: workflow.engineId,
        name: workflow.name,
        description: workflow.description,
        type: workflow.type as any,
        definition: workflow.definition as Record<string, any>,
        config: workflow.config as Record<string, any>,
        triggers: workflow.triggers as any[],
        steps: workflow.steps as any[],
        conditions: workflow.conditions as any[],
        version: workflow.version,
        status: workflow.status as any,
        enabled: workflow.enabled,
        createdBy: workflow.createdBy
      }));
    } catch (error) {
      console.error('Failed to get workflows:', error);
      throw new Error('Failed to get workflows');
    }
  }

  // Execute Workflow
  async executeWorkflow(
    workflowId: string,
    triggeredBy: string,
    variables?: Record<string, any>
  ): Promise<WorkflowExecutionResult> {
    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: { engine: true }
      });

      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const executionId = `workflow_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const execution = await prisma.workflowExecution.create({
        data: {
          workflowId,
          engineId: workflow.engineId,
          executionId,
          triggeredBy,
          startTime: new Date(),
          status: 'running',
          currentStep: 0,
          steps: [],
          variables: variables || {},
          results: {},
          errors: [],
          metadata: {
            workflowName: workflow.name,
            workflowType: workflow.type,
            engineType: workflow.engine.type
          }
        }
      });

      // Simulate workflow execution
      setTimeout(async () => {
        try {
          const mockResults = this.simulateWorkflowExecution(workflow.type, workflow.steps as any[]);
          
          await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: {
              status: 'completed',
              endTime: new Date(),
              currentStep: mockResults.steps.length,
              steps: mockResults.steps,
              results: mockResults.results,
              errors: mockResults.errors
            }
          });
        } catch (error) {
          await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: {
              status: 'failed',
              endTime: new Date(),
              errors: [{ message: 'Workflow execution failed', error: error?.toString() }]
            }
          });
        }
      }, 2000);

      return {
        id: execution.id,
        workflowId: execution.workflowId,
        engineId: execution.engineId,
        executionId: execution.executionId,
        triggeredBy: execution.triggeredBy,
        startTime: execution.startTime,
        endTime: execution.endTime || undefined,
        status: execution.status as any,
        currentStep: execution.currentStep,
        steps: execution.steps as any[],
        variables: execution.variables as Record<string, any>,
        results: execution.results as Record<string, any>,
        errors: execution.errors as any[]
      };
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      throw new Error('Failed to execute workflow');
    }
  }

  // Get Workflow Executions
  async getWorkflowExecutions(workflowId?: string): Promise<WorkflowExecutionResult[]> {
    try {
      const executions = await prisma.workflowExecution.findMany({
        where: workflowId ? { workflowId } : {},
        orderBy: { startTime: 'desc' },
        take: 50
      });

      return executions.map(execution => ({
        id: execution.id,
        workflowId: execution.workflowId,
        engineId: execution.engineId,
        executionId: execution.executionId,
        triggeredBy: execution.triggeredBy,
        startTime: execution.startTime,
        endTime: execution.endTime || undefined,
        status: execution.status as any,
        currentStep: execution.currentStep,
        steps: execution.steps as any[],
        variables: execution.variables as Record<string, any>,
        results: execution.results as Record<string, any>,
        errors: execution.errors as any[]
      }));
    } catch (error) {
      console.error('Failed to get workflow executions:', error);
      throw new Error('Failed to get workflow executions');
    }
  }

  // Get Workflow Analytics
  async getWorkflowAnalytics(workflowId?: string): Promise<{
    totalEngines: number;
    activeEngines: number;
    totalWorkflows: number;
    activeWorkflows: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    avgExecutionTime: number;
    executionsByType: Record<string, number>;
    executionsByStatus: Record<string, number>;
    recentExecutions: WorkflowExecutionResult[];
  }> {
    try {
      const [totalEngines, activeEngines] = await Promise.all([
        prisma.workflowEngine.count(),
        prisma.workflowEngine.count({ where: { status: 'active', enabled: true } })
      ]);

      const [totalWorkflows, activeWorkflows] = await Promise.all([
        prisma.workflow.count(workflowId ? { where: { id: workflowId } } : {}),
        prisma.workflow.count({
          where: {
            ...(workflowId && { id: workflowId }),
            status: 'active',
            enabled: true
          }
        })
      ]);

      const [totalExecutions, successfulExecutions, failedExecutions] = await Promise.all([
        prisma.workflowExecution.count(workflowId ? { where: { workflowId } } : {}),
        prisma.workflowExecution.count({
          where: {
            ...(workflowId && { workflowId }),
            status: 'completed'
          }
        }),
        prisma.workflowExecution.count({
          where: {
            ...(workflowId && { workflowId }),
            status: 'failed'
          }
        })
      ]);

      const executions = await prisma.workflowExecution.findMany({
        where: workflowId ? { workflowId } : {},
        include: { workflow: true },
        orderBy: { startTime: 'desc' },
        take: 100
      });

      const completedExecutions = executions.filter(exec => exec.endTime);
      const avgExecutionTime = completedExecutions.length > 0 
        ? completedExecutions.reduce((acc, exec) => 
            acc + (exec.endTime!.getTime() - exec.startTime.getTime()), 0) / completedExecutions.length
        : 0;

      const executionsByType = executions.reduce((acc, exec) => {
        acc[exec.workflow.type] = (acc[exec.workflow.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const executionsByStatus = executions.reduce((acc, exec) => {
        acc[exec.status] = (acc[exec.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recentExecutions = executions.slice(0, 10).map(execution => ({
        id: execution.id,
        workflowId: execution.workflowId,
        engineId: execution.engineId,
        executionId: execution.executionId,
        triggeredBy: execution.triggeredBy,
        startTime: execution.startTime,
        endTime: execution.endTime || undefined,
        status: execution.status as any,
        currentStep: execution.currentStep,
        steps: execution.steps as any[],
        variables: execution.variables as Record<string, any>,
        results: execution.results as Record<string, any>,
        errors: execution.errors as any[]
      }));

      return {
        totalEngines,
        activeEngines,
        totalWorkflows,
        activeWorkflows,
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        avgExecutionTime: Math.round(avgExecutionTime / 1000), // Convert to seconds
        executionsByType,
        executionsByStatus,
        recentExecutions
      };
    } catch (error) {
      console.error('Failed to get workflow analytics:', error);
      throw new Error('Failed to get workflow analytics');
    }
  }

  // Private helper methods
  private simulateWorkflowExecution(type: string, steps: any[]): {
    steps: any[];
    results: Record<string, any>;
    errors: any[];
  } {
    const executedSteps = steps.map((step, index) => ({
      stepNumber: index + 1,
      name: step.name || `Step ${index + 1}`,
      status: Math.random() > 0.1 ? 'completed' : 'failed',
      startTime: new Date(),
      endTime: new Date(),
      result: Math.random() > 0.1 ? 'Success' : 'Failed',
      details: {
        input: step.input || {},
        output: step.output || {},
        processingTime: Math.floor(Math.random() * 1000) + 100
      }
    }));

    const failedSteps = executedSteps.filter(step => step.status === 'failed');
    const errors = failedSteps.map(step => ({
      stepNumber: step.stepNumber,
      message: `Step ${step.stepNumber} failed: ${step.name}`,
      error: 'Simulation error'
    }));

    const results = {
      completedSteps: executedSteps.filter(step => step.status === 'completed').length,
      failedSteps: failedSteps.length,
      totalProcessingTime: executedSteps.reduce((sum, step) => sum + step.details.processingTime, 0),
      success: failedSteps.length === 0
    };

    return {
      steps: executedSteps,
      results,
      errors
    };
  }
}

export const workflowAutomationService = new WorkflowAutomationService();
