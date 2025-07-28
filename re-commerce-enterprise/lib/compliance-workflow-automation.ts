
/**
 * Compliance Workflow Automation System
 * Automated compliance task assignment, tracking, and workflow management
 */

export interface ComplianceTask {
  id: string;
  title: string;
  description: string;
  type: 'assessment' | 'review' | 'audit' | 'remediation' | 'training' | 'documentation';
  category: 'regulatory' | 'internal' | 'vendor' | 'security' | 'privacy';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'overdue';
  
  // Assignment
  assignedTo: string;
  assignedBy: string;
  assignedAt: Date;
  
  // Deadlines
  dueDate: Date;
  reminderDate: Date;
  escalationDate: Date;
  completedAt?: Date;
  
  // Compliance Context
  regulation: string;
  requirement: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Workflow
  workflowId: string;
  stage: string;
  nextStage?: string;
  approver?: string;
  
  // Evidence & Documentation
  evidence: ComplianceEvidence[];
  documents: string[];
  notes: string;
  
  // Dependencies
  dependencies: string[];
  blockers: string[];
  
  // Metrics
  effortEstimate: number; // in hours
  actualEffort?: number;
  costEstimate?: number;
  actualCost?: number;
}

export interface ComplianceEvidence {
  id: string;
  type: 'document' | 'screenshot' | 'audit_log' | 'test_result' | 'certification';
  name: string;
  description: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface ComplianceWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'assessment' | 'audit' | 'remediation' | 'certification' | 'training';
  regulation: string;
  
  // Workflow Definition
  stages: WorkflowStage[];
  triggers: WorkflowTrigger[];
  
  // Configuration
  autoAssignment: boolean;
  autoEscalation: boolean;
  requiredEvidence: string[];
  
  // Lifecycle
  active: boolean;
  version: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Metrics
  avgCompletionTime: number;
  successRate: number;
  utilizationRate: number;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  type: 'task' | 'approval' | 'review' | 'gate';
  order: number;
  
  // Assignment Rules
  assignmentRules: AssignmentRule[];
  defaultAssignee?: string;
  
  // Timing
  sla: number; // in hours
  reminderTime: number; // in hours
  escalationTime: number; // in hours
  
  // Requirements
  requiredSkills: string[];
  requiredRole: string;
  requiredCertification?: string;
  
  // Actions
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  
  // Next Stage Logic
  nextStageRules: NextStageRule[];
}

export interface AssignmentRule {
  id: string;
  condition: string;
  assignTo: string;
  priority: number;
  loadBalancing: boolean;
}

export interface WorkflowAction {
  id: string;
  type: 'notification' | 'email' | 'escalation' | 'approval' | 'automated_check';
  trigger: 'stage_start' | 'stage_complete' | 'deadline_approaching' | 'overdue';
  configuration: any;
}

export interface WorkflowCondition {
  id: string;
  type: 'time' | 'approval' | 'evidence' | 'dependency';
  condition: string;
  required: boolean;
}

export interface NextStageRule {
  id: string;
  condition: string;
  nextStage: string;
  action: 'proceed' | 'reject' | 'escalate';
}

export interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'event' | 'manual' | 'deadline';
  condition: string;
  frequency?: string;
  active: boolean;
}

export interface ComplianceDeadline {
  id: string;
  title: string;
  description: string;
  regulation: string;
  requirement: string;
  dueDate: Date;
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Responsible parties
  owner: string;
  stakeholders: string[];
  
  // Related tasks
  tasks: string[];
  
  // Notifications
  notificationsSent: NotificationLog[];
  escalationLevel: number;
  
  // Impact
  impactAssessment: string;
  consequences: string[];
}

export interface NotificationLog {
  id: string;
  type: 'reminder' | 'escalation' | 'deadline' | 'completion';
  recipient: string;
  sentAt: Date;
  method: 'email' | 'sms' | 'notification' | 'dashboard';
  delivered: boolean;
}

export interface ComplianceReport {
  id: string;
  type: 'workflow' | 'tasks' | 'deadlines' | 'performance';
  period: {
    start: Date;
    end: Date;
  };
  
  // Metrics
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
  
  // By Category
  tasksByCategory: { [key: string]: number };
  tasksByPriority: { [key: string]: number };
  tasksByStatus: { [key: string]: number };
  
  // Performance
  onTimeCompletion: number;
  qualityScore: number;
  resourceUtilization: number;
  
  // Trends
  completionTrend: number;
  workloadTrend: number;
  
  // Recommendations
  recommendations: string[];
  
  // Generated
  generatedAt: Date;
  generatedBy: string;
}

export class ComplianceWorkflowAutomation {
  private tasks: ComplianceTask[] = [];
  private workflows: ComplianceWorkflow[] = [];
  private deadlines: ComplianceDeadline[] = [];
  private evidence: ComplianceEvidence[] = [];
  private notifications: NotificationLog[] = [];

  constructor() {
    this.initializeDefaultWorkflows();
    this.initializeSampleTasks();
  }

  private initializeDefaultWorkflows(): void {
    this.workflows = [
      {
        id: 'workflow-gdpr-assessment',
        name: 'GDPR Compliance Assessment',
        description: 'Comprehensive GDPR compliance assessment workflow',
        type: 'assessment',
        regulation: 'GDPR',
        stages: [
          {
            id: 'stage-1',
            name: 'Initial Assessment',
            description: 'Conduct initial GDPR compliance assessment',
            type: 'task',
            order: 1,
            assignmentRules: [
              {
                id: 'rule-1',
                condition: 'department = "legal"',
                assignTo: 'privacy-officer',
                priority: 1,
                loadBalancing: false
              }
            ],
            sla: 72,
            reminderTime: 48,
            escalationTime: 96,
            requiredSkills: ['gdpr', 'privacy'],
            requiredRole: 'privacy-officer',
            actions: [
              {
                id: 'action-1',
                type: 'notification',
                trigger: 'stage_start',
                configuration: { template: 'gdpr-assessment-start' }
              }
            ],
            conditions: [
              {
                id: 'condition-1',
                type: 'evidence',
                condition: 'privacy_policy_review = completed',
                required: true
              }
            ],
            nextStageRules: [
              {
                id: 'next-1',
                condition: 'assessment_score >= 80',
                nextStage: 'stage-3',
                action: 'proceed'
              },
              {
                id: 'next-2',
                condition: 'assessment_score < 80',
                nextStage: 'stage-2',
                action: 'proceed'
              }
            ]
          },
          {
            id: 'stage-2',
            name: 'Remediation Planning',
            description: 'Plan remediation actions for non-compliant areas',
            type: 'task',
            order: 2,
            assignmentRules: [
              {
                id: 'rule-2',
                condition: 'department = "legal"',
                assignTo: 'compliance-team',
                priority: 1,
                loadBalancing: true
              }
            ],
            sla: 48,
            reminderTime: 24,
            escalationTime: 72,
            requiredSkills: ['remediation', 'project-management'],
            requiredRole: 'compliance-officer',
            actions: [],
            conditions: [],
            nextStageRules: [
              {
                id: 'next-3',
                condition: 'remediation_plan = approved',
                nextStage: 'stage-3',
                action: 'proceed'
              }
            ]
          },
          {
            id: 'stage-3',
            name: 'Final Review',
            description: 'Final review and sign-off',
            type: 'approval',
            order: 3,
            assignmentRules: [
              {
                id: 'rule-3',
                condition: 'always',
                assignTo: 'dpo',
                priority: 1,
                loadBalancing: false
              }
            ],
            sla: 24,
            reminderTime: 12,
            escalationTime: 36,
            requiredSkills: ['approval'],
            requiredRole: 'dpo',
            actions: [],
            conditions: [],
            nextStageRules: []
          }
        ],
        triggers: [
          {
            id: 'trigger-1',
            type: 'schedule',
            condition: 'quarterly',
            frequency: '0 0 1 */3 *',
            active: true
          }
        ],
        autoAssignment: true,
        autoEscalation: true,
        requiredEvidence: ['assessment_report', 'remediation_plan'],
        active: true,
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        avgCompletionTime: 168, // 7 days
        successRate: 95,
        utilizationRate: 87
      }
    ];
  }

  private initializeSampleTasks(): void {
    this.tasks = [
      {
        id: 'task-001',
        title: 'Quarterly GDPR Assessment',
        description: 'Conduct quarterly GDPR compliance assessment',
        type: 'assessment',
        category: 'regulatory',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'privacy-officer',
        assignedBy: 'system',
        assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        reminderDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        escalationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        regulation: 'GDPR',
        requirement: 'Article 32 - Security of Processing',
        riskLevel: 'high',
        workflowId: 'workflow-gdpr-assessment',
        stage: 'stage-1',
        nextStage: 'stage-2',
        approver: 'dpo',
        evidence: [],
        documents: [],
        notes: 'Assessment in progress',
        dependencies: [],
        blockers: [],
        effortEstimate: 16,
        actualEffort: 8
      },
      {
        id: 'task-002',
        title: 'SOX Control Testing',
        description: 'Test financial controls for SOX compliance',
        type: 'audit',
        category: 'regulatory',
        priority: 'critical',
        status: 'pending',
        assignedTo: 'internal-audit',
        assignedBy: 'compliance-manager',
        assignedAt: new Date(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        reminderDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        escalationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        regulation: 'SOX',
        requirement: 'Section 404 - Internal Controls',
        riskLevel: 'critical',
        workflowId: 'workflow-sox-testing',
        stage: 'stage-1',
        evidence: [],
        documents: [],
        notes: 'Quarterly testing cycle',
        dependencies: [],
        blockers: [],
        effortEstimate: 24
      }
    ];
  }

  async createTask(taskData: Partial<ComplianceTask>): Promise<ComplianceTask> {
    const task: ComplianceTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'New Compliance Task',
      description: taskData.description || '',
      type: taskData.type || 'assessment',
      category: taskData.category || 'regulatory',
      priority: taskData.priority || 'medium',
      status: 'pending',
      assignedTo: taskData.assignedTo || 'unassigned',
      assignedBy: taskData.assignedBy || 'system',
      assignedAt: new Date(),
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      reminderDate: taskData.reminderDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      escalationDate: taskData.escalationDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      regulation: taskData.regulation || 'General',
      requirement: taskData.requirement || 'General Requirement',
      riskLevel: taskData.riskLevel || 'medium',
      workflowId: taskData.workflowId || 'default',
      stage: taskData.stage || 'initial',
      evidence: [],
      documents: [],
      notes: taskData.notes || '',
      dependencies: taskData.dependencies || [],
      blockers: taskData.blockers || [],
      effortEstimate: taskData.effortEstimate || 8
    };

    this.tasks.push(task);
    
    // Auto-assign if workflow supports it
    if (taskData.workflowId) {
      await this.autoAssignTask(task);
    }
    
    return task;
  }

  private async autoAssignTask(task: ComplianceTask): Promise<void> {
    const workflow = this.workflows.find(w => w.id === task.workflowId);
    if (!workflow || !workflow.autoAssignment) return;

    const currentStage = workflow.stages.find(s => s.id === task.stage);
    if (!currentStage) return;

    // Apply assignment rules
    for (const rule of currentStage.assignmentRules) {
      if (this.evaluateAssignmentRule(rule, task)) {
        task.assignedTo = rule.assignTo;
        task.status = 'assigned';
        break;
      }
    }
  }

  private evaluateAssignmentRule(rule: AssignmentRule, task: ComplianceTask): boolean {
    // Simplified rule evaluation
    if (rule.condition === 'always') return true;
    if (rule.condition.includes('department')) {
      return task.category === rule.condition.split('=')[1].trim().replace(/"/g, '');
    }
    return false;
  }

  async updateTaskStatus(taskId: string, status: ComplianceTask['status'], notes?: string): Promise<ComplianceTask> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const oldStatus = task.status;
    task.status = status;
    
    if (notes) {
      task.notes += `\n${new Date().toISOString()}: ${notes}`;
    }

    if (status === 'completed') {
      task.completedAt = new Date();
      await this.progressWorkflow(task);
    }

    // Send notifications
    await this.sendStatusChangeNotification(task, oldStatus, status);
    
    return task;
  }

  private async progressWorkflow(task: ComplianceTask): Promise<void> {
    const workflow = this.workflows.find(w => w.id === task.workflowId);
    if (!workflow) return;

    const currentStage = workflow.stages.find(s => s.id === task.stage);
    if (!currentStage) return;

    // Evaluate next stage rules
    for (const rule of currentStage.nextStageRules) {
      if (this.evaluateNextStageRule(rule, task)) {
        if (rule.action === 'proceed' && rule.nextStage) {
          task.stage = rule.nextStage;
          task.status = 'pending';
          await this.autoAssignTask(task);
        }
        break;
      }
    }
  }

  private evaluateNextStageRule(rule: NextStageRule, task: ComplianceTask): boolean {
    // Simplified rule evaluation
    if (rule.condition === 'always') return true;
    if (rule.condition.includes('completed')) return task.status === 'completed';
    return false;
  }

  async addEvidence(taskId: string, evidenceData: Partial<ComplianceEvidence>): Promise<ComplianceEvidence> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const evidence: ComplianceEvidence = {
      id: `evidence-${Date.now()}`,
      type: evidenceData.type || 'document',
      name: evidenceData.name || 'Evidence',
      description: evidenceData.description || '',
      url: evidenceData.url || '',
      uploadedBy: evidenceData.uploadedBy || 'system',
      uploadedAt: new Date(),
      verified: false
    };

    task.evidence.push(evidence);
    this.evidence.push(evidence);
    
    return evidence;
  }

  async verifyEvidence(evidenceId: string, verifiedBy: string): Promise<ComplianceEvidence> {
    const evidence = this.evidence.find(e => e.id === evidenceId);
    if (!evidence) {
      throw new Error(`Evidence not found: ${evidenceId}`);
    }

    evidence.verified = true;
    evidence.verifiedBy = verifiedBy;
    evidence.verifiedAt = new Date();
    
    return evidence;
  }

  async trackDeadlines(): Promise<ComplianceDeadline[]> {
    const now = new Date();
    const upcoming = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Update deadline statuses
    for (const deadline of this.deadlines) {
      if (deadline.dueDate < now && deadline.status !== 'completed') {
        deadline.status = 'overdue';
      } else if (deadline.dueDate < upcoming && deadline.status === 'upcoming') {
        deadline.status = 'due';
      }
    }

    // Send notifications for approaching deadlines
    for (const deadline of this.deadlines) {
      if (deadline.status === 'due' || deadline.status === 'overdue') {
        await this.sendDeadlineNotification(deadline);
      }
    }

    return this.deadlines;
  }

  private async sendStatusChangeNotification(task: ComplianceTask, oldStatus: string, newStatus: string): Promise<void> {
    const notification: NotificationLog = {
      id: `notification-${Date.now()}`,
      type: 'completion',
      recipient: task.assignedTo,
      sentAt: new Date(),
      method: 'email',
      delivered: true
    };

    this.notifications.push(notification);
    console.log(`Notification sent: Task ${task.id} status changed from ${oldStatus} to ${newStatus}`);
  }

  private async sendDeadlineNotification(deadline: ComplianceDeadline): Promise<void> {
    const notification: NotificationLog = {
      id: `notification-${Date.now()}`,
      type: deadline.status === 'overdue' ? 'escalation' : 'deadline',
      recipient: deadline.owner,
      sentAt: new Date(),
      method: 'email',
      delivered: true
    };

    this.notifications.push(notification);
    deadline.notificationsSent.push(notification);
    
    if (deadline.status === 'overdue') {
      deadline.escalationLevel++;
    }
  }

  async getWorkflowMetrics(workflowId?: string): Promise<any> {
    const relevantTasks = workflowId 
      ? this.tasks.filter(t => t.workflowId === workflowId)
      : this.tasks;

    const totalTasks = relevantTasks.length;
    const completedTasks = relevantTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = relevantTasks.filter(t => t.status === 'overdue').length;
    const inProgressTasks = relevantTasks.filter(t => t.status === 'in_progress').length;

    const completionTimes = relevantTasks
      .filter(t => t.completedAt)
      .map(t => t.completedAt!.getTime() - t.assignedAt.getTime());

    const avgCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length / (24 * 60 * 60 * 1000) // Convert to days
      : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      overdue: overdueTasks,
      inProgress: inProgressTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      onTimeRate: totalTasks > 0 ? ((completedTasks - overdueTasks) / totalTasks) * 100 : 0,
      workloadTrend: 'stable',
      bottlenecks: this.identifyBottlenecks(relevantTasks),
      recommendations: this.generateRecommendations(relevantTasks)
    };
  }

  private identifyBottlenecks(tasks: ComplianceTask[]): string[] {
    const bottlenecks: string[] = [];
    
    const stageDistribution = tasks.reduce((acc, task) => {
      acc[task.stage] = (acc[task.stage] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const maxStageCount = Math.max(...Object.values(stageDistribution));
    const avgStageCount = Object.values(stageDistribution).reduce((sum, count) => sum + count, 0) / Object.keys(stageDistribution).length;

    for (const [stage, count] of Object.entries(stageDistribution)) {
      if (count > avgStageCount * 1.5) {
        bottlenecks.push(`High task volume in ${stage}`);
      }
    }

    return bottlenecks;
  }

  private generateRecommendations(tasks: ComplianceTask[]): string[] {
    const recommendations: string[] = [];
    
    const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
    const totalTasks = tasks.length;

    if (overdueTasks / totalTasks > 0.2) {
      recommendations.push('Consider increasing resource allocation for compliance tasks');
    }

    if (overdueTasks / totalTasks > 0.1) {
      recommendations.push('Review task assignment and workload distribution');
    }

    const avgEffort = tasks.reduce((sum, task) => sum + task.effortEstimate, 0) / tasks.length;
    if (avgEffort > 20) {
      recommendations.push('Break down large tasks into smaller, manageable units');
    }

    recommendations.push('Implement automated compliance checks where possible');
    recommendations.push('Conduct regular workflow optimization reviews');

    return recommendations;
  }

  async generateComplianceReport(type: ComplianceReport['type'], period: { start: Date; end: Date }): Promise<ComplianceReport> {
    const relevantTasks = this.tasks.filter(task => 
      task.assignedAt >= period.start && task.assignedAt <= period.end
    );

    const metrics = await this.getWorkflowMetrics();
    
    return {
      id: `report-${Date.now()}`,
      type,
      period,
      totalTasks: relevantTasks.length,
      completedTasks: relevantTasks.filter(t => t.status === 'completed').length,
      overdueTasks: relevantTasks.filter(t => t.status === 'overdue').length,
      averageCompletionTime: metrics.avgCompletionTime,
      tasksByCategory: this.getTaskDistribution(relevantTasks, 'category'),
      tasksByPriority: this.getTaskDistribution(relevantTasks, 'priority'),
      tasksByStatus: this.getTaskDistribution(relevantTasks, 'status'),
      onTimeCompletion: metrics.onTimeRate,
      qualityScore: 85, // Simulated
      resourceUtilization: 78, // Simulated
      completionTrend: 5, // Simulated
      workloadTrend: 2, // Simulated
      recommendations: metrics.recommendations,
      generatedAt: new Date(),
      generatedBy: 'system'
    };
  }

  private getTaskDistribution(tasks: ComplianceTask[], field: keyof ComplianceTask): { [key: string]: number } {
    return tasks.reduce((acc, task) => {
      const value = task[field] as string;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  async escalateOverdueTasks(): Promise<{ escalated: number; notifications: number }> {
    const overdueTasks = this.tasks.filter(t => t.status === 'overdue' || new Date() > t.escalationDate);
    let escalated = 0;
    let notifications = 0;

    for (const task of overdueTasks) {
      // Escalate to approver if available
      if (task.approver) {
        await this.sendEscalationNotification(task);
        escalated++;
        notifications++;
      }
    }

    return { escalated, notifications };
  }

  private async sendEscalationNotification(task: ComplianceTask): Promise<void> {
    const notification: NotificationLog = {
      id: `notification-${Date.now()}`,
      type: 'escalation',
      recipient: task.approver || task.assignedTo,
      sentAt: new Date(),
      method: 'email',
      delivered: true
    };

    this.notifications.push(notification);
    console.log(`Escalation notification sent for task ${task.id}`);
  }

  async getTasksByAssignee(assignee: string): Promise<ComplianceTask[]> {
    return this.tasks.filter(task => task.assignedTo === assignee);
  }

  async searchTasks(filters: {
    status?: string;
    priority?: string;
    category?: string;
    regulation?: string;
    assignedTo?: string;
    dueDate?: Date;
  }): Promise<ComplianceTask[]> {
    return this.tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.category && task.category !== filters.category) return false;
      if (filters.regulation && task.regulation !== filters.regulation) return false;
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      if (filters.dueDate && task.dueDate > filters.dueDate) return false;
      return true;
    });
  }
}

export const complianceWorkflowAutomation = new ComplianceWorkflowAutomation();
