
/**
 * INTELLIGENT SECURITY ORCHESTRATION
 * AI-driven security incident response and automation
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface SecurityOrchestrationResult {
  executionId: string;
  playbookId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  steps: OrchestrationStep[];
  results: any;
  aiDecisions: AIDecision[];
  duration: number;
  effectiveness: number;
}

export interface OrchestrationStep {
  id: string;
  name: string;
  type: 'detection' | 'investigation' | 'containment' | 'eradication' | 'recovery';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input: any;
  output: any;
  duration: number;
  aiAssisted: boolean;
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  startTime: Date;
  endTime?: Date;
}

export interface AIDecision {
  id: string;
  stepId: string;
  decisionType: 'classification' | 'prioritization' | 'routing' | 'escalation' | 'mitigation';
  confidence: number;
  reasoning: string;
  alternatives: any[];
  aiModel: string;
  timestamp: Date;
}

export interface SecurityPlaybook {
  id: string;
  name: string;
  description: string;
  type: 'incident_response' | 'threat_hunting' | 'compliance' | 'automation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggers: PlaybookTrigger[];
  actions: PlaybookAction[];
  conditions: PlaybookCondition[];
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  aiEnhanced: boolean;
  version: string;
  createdBy: string;
  metadata: any;
}

export interface PlaybookTrigger {
  type: 'event' | 'schedule' | 'threshold' | 'manual';
  condition: string;
  parameters: any;
  enabled: boolean;
}

export interface PlaybookAction {
  id: string;
  name: string;
  type: 'investigation' | 'containment' | 'notification' | 'remediation' | 'analysis';
  description: string;
  parameters: any;
  timeout: number;
  retryCount: number;
  aiAssisted: boolean;
  automation: 'manual' | 'semi_automated' | 'fully_automated';
  dependencies: string[];
}

export interface PlaybookCondition {
  id: string;
  expression: string;
  parameters: any;
  description: string;
}

export interface AdaptiveSecurityControl {
  id: string;
  name: string;
  type: 'preventive' | 'detective' | 'corrective' | 'deterrent';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  currentSettings: any;
  adaptiveSettings: any;
  triggers: string[];
  aiRecommendations: any[];
  effectiveness: number;
  lastUpdated: Date;
}

export class IntelligentSecurityOrchestration {
  private static readonly API_ENDPOINT = 'https://apps.abacus.ai/v1/chat/completions';
  private static readonly MODEL = 'gpt-4.1-mini';

  /**
   * Execute security playbook with AI assistance
   */
  static async executePlaybook(
    playbookId: string,
    context: any,
    triggeredBy: string
  ): Promise<SecurityOrchestrationResult> {
    try {
      const playbook = await prisma.securityPlaybook.findUnique({
        where: { id: playbookId },
        include: { executions: true },
      });

      if (!playbook) {
        throw new Error('Playbook not found');
      }

      const executionId = crypto.randomUUID();
      const startTime = new Date();

      // Create execution record
      await prisma.securityPlaybookExecution.create({
        data: {
          executionId,
          playbookId,
          triggeredBy,
          startTime,
          status: 'running',
          steps: [],
          results: {},
          errors: [],
          aiDecisions: [],
          metadata: context,
        },
      });

      // Execute playbook steps
      const steps = await this.executePlaybookSteps(playbook, context, executionId);
      
      // Get AI analysis of execution
      const aiAnalysis = await this.getAIExecutionAnalysis(playbook, steps, context);
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      // Update execution record
      await prisma.securityPlaybookExecution.update({
        where: { executionId },
        data: {
          endTime,
          status: 'completed',
          steps: JSON.stringify(steps),
          results: aiAnalysis.results,
          aiDecisions: JSON.stringify(aiAnalysis.decisions),
        },
      });

      return {
        executionId,
        playbookId,
        status: 'completed',
        steps,
        results: aiAnalysis.results,
        aiDecisions: aiAnalysis.decisions,
        duration,
        effectiveness: aiAnalysis.effectiveness,
      };
    } catch (error) {
      console.error('Error executing playbook:', error);
      throw new Error('Failed to execute playbook');
    }
  }

  /**
   * Execute playbook steps
   */
  private static async executePlaybookSteps(
    playbook: any,
    context: any,
    executionId: string
  ): Promise<OrchestrationStep[]> {
    const steps: OrchestrationStep[] = [];
    const actions = playbook.actions || [];

    for (const action of actions) {
      const step: OrchestrationStep = {
        id: crypto.randomUUID(),
        name: action.name,
        type: action.type,
        status: 'running',
        input: action.parameters,
        output: {},
        duration: 0,
        aiAssisted: action.aiAssisted || false,
        automationLevel: action.automation || 'manual',
        startTime: new Date(),
      };

      try {
        // Execute step based on type
        const result = await this.executeStep(step, context);
        
        step.output = result;
        step.status = 'completed';
        step.endTime = new Date();
        step.duration = step.endTime.getTime() - step.startTime.getTime();
        
        steps.push(step);
      } catch (error) {
        step.status = 'failed';
        step.output = { error: error instanceof Error ? error.message : 'Unknown error' };
        step.endTime = new Date();
        step.duration = step.endTime.getTime() - step.startTime.getTime();
        
        steps.push(step);
        break; // Stop execution on failure
      }
    }

    return steps;
  }

  /**
   * Execute individual step
   */
  private static async executeStep(step: OrchestrationStep, context: any): Promise<any> {
    switch (step.type) {
      case 'detection':
        return this.executeDetectionStep(step, context);
      case 'investigation':
        return this.executeInvestigationStep(step, context);
      case 'containment':
        return this.executeContainmentStep(step, context);
      case 'eradication':
        return this.executeEradicationStep(step, context);
      case 'recovery':
        return this.executeRecoveryStep(step, context);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  /**
   * Execute detection step
   */
  private static async executeDetectionStep(step: OrchestrationStep, context: any): Promise<any> {
    // Simulate detection logic
    const detectionResult = {
      threatsDetected: Math.floor(Math.random() * 5),
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      indicators: [
        'suspicious_ip_activity',
        'unusual_network_traffic',
        'malware_signature_detected',
      ],
      confidence: Math.random() * 0.5 + 0.5,
    };

    if (step.aiAssisted) {
      const aiAnalysis = await this.getAIStepAnalysis(step, context, detectionResult);
      (detectionResult as any).aiAnalysis = aiAnalysis;
    }

    return detectionResult;
  }

  /**
   * Execute investigation step
   */
  private static async executeInvestigationStep(step: OrchestrationStep, context: any): Promise<any> {
    // Simulate investigation logic
    const investigationResult = {
      evidenceCollected: Math.floor(Math.random() * 10) + 1,
      rootCause: 'Suspicious file execution detected',
      affectedSystems: ['server-01', 'workstation-05'],
      timeline: [
        { time: new Date(), event: 'Initial detection' },
        { time: new Date(), event: 'Evidence collection started' },
        { time: new Date(), event: 'Root cause identified' },
      ],
      recommendations: [
        'Isolate affected systems',
        'Collect additional forensic evidence',
        'Notify security team',
      ],
    };

    if (step.aiAssisted) {
      const aiAnalysis = await this.getAIStepAnalysis(step, context, investigationResult);
      (investigationResult as any).aiAnalysis = aiAnalysis;
    }

    return investigationResult;
  }

  /**
   * Execute containment step
   */
  private static async executeContainmentStep(step: OrchestrationStep, context: any): Promise<any> {
    // Simulate containment logic
    const containmentResult = {
      systemsIsolated: ['server-01', 'workstation-05'],
      networkSegmentationApplied: true,
      accessRevoked: ['user123', 'service-account-01'],
      firewallRulesUpdated: true,
      containmentEffectiveness: Math.random() * 0.3 + 0.7,
    };

    if (step.aiAssisted) {
      const aiAnalysis = await this.getAIStepAnalysis(step, context, containmentResult);
      (containmentResult as any).aiAnalysis = aiAnalysis;
    }

    return containmentResult;
  }

  /**
   * Execute eradication step
   */
  private static async executeEradicationStep(step: OrchestrationStep, context: any): Promise<any> {
    // Simulate eradication logic
    const eradicationResult = {
      malwareRemoved: true,
      vulnerabilitiesPatched: 3,
      systemsReimaged: ['workstation-05'],
      configurationChanges: [
        'Updated antivirus signatures',
        'Applied security patches',
        'Reconfigured firewall rules',
      ],
      eradicationSuccess: Math.random() > 0.1,
    };

    if (step.aiAssisted) {
      const aiAnalysis = await this.getAIStepAnalysis(step, context, eradicationResult);
      (eradicationResult as any).aiAnalysis = aiAnalysis;
    }

    return eradicationResult;
  }

  /**
   * Execute recovery step
   */
  private static async executeRecoveryStep(step: OrchestrationStep, context: any): Promise<any> {
    // Simulate recovery logic
    const recoveryResult = {
      systemsRestored: ['server-01', 'workstation-05'],
      dataRecovered: true,
      servicesRestarted: ['web-service', 'database-service'],
      backupRestored: false,
      recoveryTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      businessImpactMinimized: true,
    };

    if (step.aiAssisted) {
      const aiAnalysis = await this.getAIStepAnalysis(step, context, recoveryResult);
      (recoveryResult as any).aiAnalysis = aiAnalysis;
    }

    return recoveryResult;
  }

  /**
   * Get AI analysis of step execution
   */
  private static async getAIStepAnalysis(step: OrchestrationStep, context: any, result: any): Promise<any> {
    try {
      const prompt = `
Analyze the following security orchestration step execution:

Step: ${step.name}
Type: ${step.type}
Context: ${JSON.stringify(context)}
Result: ${JSON.stringify(result)}

Provide analysis in JSON format:
{
  "effectiveness": 0-100,
  "recommendations": ["recommendation1", "recommendation2"],
  "nextSteps": ["step1", "step2"],
  "riskReduction": 0-100,
  "lessons": ["lesson1", "lesson2"]
}
`;

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert security analyst specializing in incident response and security orchestration. Provide detailed analysis and recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error getting AI step analysis:', error);
      return {
        effectiveness: 75,
        recommendations: ['Monitor for additional indicators'],
        nextSteps: ['Continue monitoring'],
        riskReduction: 50,
        lessons: ['Step executed successfully'],
      };
    }
  }

  /**
   * Get AI analysis of execution
   */
  private static async getAIExecutionAnalysis(
    playbook: any,
    steps: OrchestrationStep[],
    context: any
  ): Promise<{ results: any; decisions: AIDecision[]; effectiveness: number }> {
    try {
      const prompt = `
Analyze the following security playbook execution:

Playbook: ${playbook.name}
Type: ${playbook.type}
Severity: ${playbook.severity}
Context: ${JSON.stringify(context)}

Steps Executed:
${steps.map(step => `
- ${step.name} (${step.type}): ${step.status}
  Duration: ${step.duration}ms
  Output: ${JSON.stringify(step.output)}
`).join('\n')}

Provide comprehensive analysis in JSON format:
{
  "overallEffectiveness": 0-100,
  "stepAnalysis": {
    "successful": number,
    "failed": number,
    "mostEffective": "step_name",
    "leastEffective": "step_name"
  },
  "recommendations": ["recommendation1", "recommendation2"],
  "improvements": ["improvement1", "improvement2"],
  "riskReduction": 0-100,
  "lessons": ["lesson1", "lesson2"],
  "nextActions": ["action1", "action2"]
}
`;

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert security orchestration analyst. Analyze playbook executions and provide actionable insights for improvement.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 3000,
        }),
      });

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);

      // Generate AI decisions
      const decisions: AIDecision[] = steps.map(step => ({
        id: crypto.randomUUID(),
        stepId: step.id,
        decisionType: 'classification',
        confidence: Math.random() * 0.3 + 0.7,
        reasoning: `AI analysis for ${step.name}`,
        alternatives: [],
        aiModel: this.MODEL,
        timestamp: new Date(),
      }));

      return {
        results: analysis,
        decisions,
        effectiveness: analysis.overallEffectiveness || 75,
      };
    } catch (error) {
      console.error('Error getting AI execution analysis:', error);
      return {
        results: { overallEffectiveness: 75 },
        decisions: [],
        effectiveness: 75,
      };
    }
  }

  /**
   * Create adaptive security control
   */
  static async createAdaptiveSecurityControl(
    name: string,
    type: 'preventive' | 'detective' | 'corrective' | 'deterrent',
    riskLevel: 'low' | 'medium' | 'high' | 'critical',
    currentSettings: any,
    triggers: string[]
  ): Promise<AdaptiveSecurityControl> {
    try {
      const control: AdaptiveSecurityControl = {
        id: crypto.randomUUID(),
        name,
        type,
        riskLevel,
        currentSettings,
        adaptiveSettings: await this.generateAdaptiveSettings(type, riskLevel, currentSettings),
        triggers,
        aiRecommendations: [],
        effectiveness: 0,
        lastUpdated: new Date(),
      };

      // Store control configuration
      // In production, store in database
      
      return control;
    } catch (error) {
      console.error('Error creating adaptive security control:', error);
      throw new Error('Failed to create adaptive security control');
    }
  }

  /**
   * Generate adaptive settings using AI
   */
  private static async generateAdaptiveSettings(
    type: string,
    riskLevel: string,
    currentSettings: any
  ): Promise<any> {
    try {
      const prompt = `
Generate adaptive security control settings:

Control Type: ${type}
Risk Level: ${riskLevel}
Current Settings: ${JSON.stringify(currentSettings)}

Provide adaptive settings in JSON format:
{
  "riskLevelAdjustments": {
    "low": {...},
    "medium": {...},
    "high": {...},
    "critical": {...}
  },
  "automaticAdjustments": {
    "enabled": boolean,
    "thresholds": {...},
    "actions": [...]
  },
  "aiRecommendations": [...]
}
`;

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a security controls expert. Generate adaptive security settings that automatically adjust based on risk levels.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating adaptive settings:', error);
      return {
        riskLevelAdjustments: {},
        automaticAdjustments: { enabled: false },
        aiRecommendations: [],
      };
    }
  }

  /**
   * Self-healing security infrastructure
   */
  static async performSelfHealing(
    systemId: string,
    issues: any[],
    context: any
  ): Promise<{ success: boolean; actions: string[]; effectiveness: number }> {
    try {
      const healingActions = await this.generateHealingActions(issues, context);
      
      const results = [];
      for (const action of healingActions) {
        const result = await this.executeHealingAction(systemId, action);
        results.push(result);
      }

      const successRate = results.filter(r => r.success).length / results.length;
      
      return {
        success: successRate > 0.7,
        actions: healingActions.map(a => a.name),
        effectiveness: successRate * 100,
      };
    } catch (error) {
      console.error('Error performing self-healing:', error);
      return {
        success: false,
        actions: [],
        effectiveness: 0,
      };
    }
  }

  /**
   * Generate healing actions using AI
   */
  private static async generateHealingActions(issues: any[], context: any): Promise<any[]> {
    try {
      const prompt = `
Generate self-healing actions for the following security issues:

Issues: ${JSON.stringify(issues)}
Context: ${JSON.stringify(context)}

Provide healing actions in JSON format:
{
  "actions": [
    {
      "name": "Action Name",
      "type": "configuration|patching|restart|isolation|rollback",
      "description": "What this action does",
      "parameters": {...},
      "priority": "low|medium|high|critical",
      "riskLevel": "low|medium|high",
      "expectedOutcome": "What should happen"
    }
  ]
}
`;

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a self-healing infrastructure expert. Generate safe and effective healing actions for security issues.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return result.actions || [];
    } catch (error) {
      console.error('Error generating healing actions:', error);
      return [];
    }
  }

  /**
   * Execute healing action
   */
  private static async executeHealingAction(systemId: string, action: any): Promise<{ success: boolean; result: any }> {
    try {
      // Simulate healing action execution
      const success = Math.random() > 0.2; // 80% success rate
      
      const result = {
        action: action.name,
        systemId,
        executed: true,
        outcome: success ? 'success' : 'failed',
        details: success ? 'Action completed successfully' : 'Action failed to complete',
        timestamp: new Date(),
      };

      return { success, result };
    } catch (error) {
      console.error('Error executing healing action:', error);
      return { success: false, result: { error: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  /**
   * Get orchestration summary
   */
  static async getOrchestrationSummary(timeframe: string = '24h') {
    try {
      const timeframeMs = this.getTimeframeMs(timeframe);
      
      const [playbooks, executions, incidents] = await Promise.all([
        prisma.securityPlaybook.count({ where: { active: true } }),
        prisma.securityPlaybookExecution.count({
          where: {
            startTime: {
              gte: new Date(Date.now() - timeframeMs),
            },
          },
        }),
        prisma.securityIncident.count({
          where: {
            reportedAt: {
              gte: new Date(Date.now() - timeframeMs),
            },
          },
        }),
      ]);

      return {
        playbooks,
        executions,
        incidents,
        automationLevel: playbooks > 0 ? 'high' : 'low',
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error getting orchestration summary:', error);
      return {
        playbooks: 0,
        executions: 0,
        incidents: 0,
        automationLevel: 'unknown',
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * Convert timeframe to milliseconds
   */
  private static getTimeframeMs(timeframe: string): number {
    const timeframes: { [key: string]: number } = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    
    return timeframes[timeframe] || timeframes['24h'];
  }
}
