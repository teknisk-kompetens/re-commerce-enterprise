
import { prisma } from './db'
import { TenantQuery } from './tenant-utils'

export interface WorkflowDefinition {
  nodes: Array<{
    id: string
    type: string
    data: any
    position: { x: number; y: number }
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    type?: string
    data?: any
  }>
}

export interface WorkflowExecutionContext {
  variables: Record<string, any>
  currentNode?: string
  completedNodes: string[]
  errors: string[]
}

export class WorkflowService {
  static async createWorkflow(tenantId: string, data: {
    name: string
    description?: string
    definition: WorkflowDefinition
    isTemplate?: boolean
    createdBy: string
  }): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const workflow = await tenantQuery.workflow.create({
        data: {
          name: data.name,
          description: data.description,
          definition: data.definition,
          isTemplate: data.isTemplate || false,
          createdBy: data.createdBy,
          version: 1
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return workflow
    } catch (error) {
      console.error('Failed to create workflow:', error)
      throw error
    }
  }

  static async getWorkflows(tenantId: string, options: {
    page?: number
    limit?: number
    isTemplate?: boolean
    isActive?: boolean
    createdBy?: string
  } = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      const { page = 1, limit = 20, isTemplate, isActive, createdBy } = options

      const where: any = {}
      if (isTemplate !== undefined) where.isTemplate = isTemplate
      if (isActive !== undefined) where.isActive = isActive
      if (createdBy) where.createdBy = createdBy

      const [workflows, total] = await Promise.all([
        tenantQuery.workflow.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            executions: {
              select: {
                id: true,
                status: true,
                startedAt: true,
                completedAt: true
              },
              orderBy: { startedAt: 'desc' },
              take: 5
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        tenantQuery.workflow.count({ where })
      ])

      return {
        workflows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get workflows:', error)
      throw error
    }
  }

  static async getWorkflow(tenantId: string, workflowId: string): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const workflow = await tenantQuery.workflow.findUnique({
        where: { id: workflowId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          executions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: { startedAt: 'desc' }
          },
          triggers: true
        }
      })

      return workflow
    } catch (error) {
      console.error('Failed to get workflow:', error)
      throw error
    }
  }

  static async executeWorkflow(tenantId: string, workflowId: string, triggeredBy: string, initialData: any = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      // Get workflow definition
      const workflow = await tenantQuery.workflow.findUnique({
        where: { id: workflowId, isActive: true }
      })

      if (!workflow) {
        throw new Error('Workflow not found or inactive')
      }

      // Create execution record
      const execution = await tenantQuery.workflowExecution.create({
        data: {
          workflowId,
          triggeredBy,
          status: 'pending',
          data: {
            variables: initialData,
            currentNode: null,
            completedNodes: [],
            errors: []
          }
        }
      })

      // Start workflow execution (simplified - in real implementation, this would be more complex)
      await this.processWorkflowExecution(tenantId, execution.id)

      return execution
    } catch (error) {
      console.error('Failed to execute workflow:', error)
      throw error
    }
  }

  private static async processWorkflowExecution(tenantId: string, executionId: string): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      // Update execution status to running
      await tenantQuery.workflowExecution.update({
        where: { id: executionId },
        data: { status: 'running' }
      })

      // Simplified workflow processing - in real implementation, this would:
      // 1. Parse workflow definition
      // 2. Execute nodes in sequence/parallel based on definition
      // 3. Handle conditions, loops, and branches
      // 4. Update execution context and logs

      // For now, just mark as completed
      await tenantQuery.workflowExecution.update({
        where: { id: executionId },
        data: { 
          status: 'completed',
          completedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to process workflow execution:', error)
      
      // Update execution status to failed
      const tenantQuery = TenantQuery.forTenant(tenantId)
      await tenantQuery.workflowExecution.update({
        where: { id: executionId },
        data: { 
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        }
      })
    }
  }

  static async getWorkflowExecutions(tenantId: string, workflowId?: string, options: {
    page?: number
    limit?: number
    status?: string
  } = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      const { page = 1, limit = 20, status } = options

      const where: any = {}
      if (workflowId) where.workflowId = workflowId
      if (status) where.status = status

      const [executions, total] = await Promise.all([
        tenantQuery.workflowExecution.findMany({
          where,
          include: {
            workflow: {
              select: {
                id: true,
                name: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { startedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        tenantQuery.workflowExecution.count({ where })
      ])

      return {
        executions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get workflow executions:', error)
      throw error
    }
  }

  static async createWorkflowTrigger(tenantId: string, data: {
    workflowId: string
    type: 'manual' | 'schedule' | 'event' | 'webhook'
    config: any
  }): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const trigger = await tenantQuery.workflowTrigger.create({
        data: {
          workflowId: data.workflowId,
          type: data.type,
          config: data.config
        }
      })

      return trigger
    } catch (error) {
      console.error('Failed to create workflow trigger:', error)
      throw error
    }
  }

  static async getWorkflowTemplates(tenantId: string): Promise<any[]> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const templates = await tenantQuery.workflow.findMany({
        where: { isTemplate: true, isActive: true },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { name: 'asc' }
      })

      return templates
    } catch (error) {
      console.error('Failed to get workflow templates:', error)
      throw error
    }
  }

  static async duplicateWorkflow(tenantId: string, workflowId: string, newName: string, createdBy: string): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const originalWorkflow = await tenantQuery.workflow.findUnique({
        where: { id: workflowId }
      })

      if (!originalWorkflow) {
        throw new Error('Workflow not found')
      }

      const duplicatedWorkflow = await tenantQuery.workflow.create({
        data: {
          name: newName,
          description: originalWorkflow.description,
          definition: originalWorkflow.definition,
          isTemplate: false,
          createdBy,
          version: 1
        }
      })

      return duplicatedWorkflow
    } catch (error) {
      console.error('Failed to duplicate workflow:', error)
      throw error
    }
  }
}
