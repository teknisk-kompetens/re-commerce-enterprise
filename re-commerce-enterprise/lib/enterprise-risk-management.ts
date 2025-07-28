
/**
 * Enterprise Risk Management System
 * Comprehensive risk assessment, monitoring, and mitigation
 */

export interface RiskAssessment {
  id: string;
  name: string;
  description: string;
  type: 'operational' | 'financial' | 'strategic' | 'compliance' | 'security' | 'reputation';
  category: string;
  
  // Risk Details
  probability: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  impact: 'negligible' | 'minor' | 'moderate' | 'major' | 'catastrophic';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 1-25 scale
  
  // Context
  triggers: string[];
  consequences: string[];
  affectedAreas: string[];
  stakeholders: string[];
  
  // Timeline
  identifiedAt: Date;
  lastReviewed: Date;
  nextReview: Date;
  
  // Ownership
  owner: string;
  assessedBy: string;
  reviewers: string[];
  
  // Status
  status: 'identified' | 'assessed' | 'mitigated' | 'monitored' | 'closed';
  
  // Mitigation
  mitigationStrategy: MitigationStrategy;
  controlMeasures: ControlMeasure[];
  
  // Compliance
  regulatoryRequirements: string[];
  complianceStatus: 'compliant' | 'non_compliant' | 'partially_compliant';
  
  // Metrics
  residualRisk: number;
  costOfControl: number;
  riskAppetite: number;
  tolerance: number;
}

export interface MitigationStrategy {
  id: string;
  type: 'avoid' | 'reduce' | 'transfer' | 'accept';
  description: string;
  actions: MitigationAction[];
  timeline: string;
  budget: number;
  owner: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  effectiveness: number; // 0-100
}

export interface MitigationAction {
  id: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'directive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  dueDate: Date;
  cost: number;
  progress: number; // 0-100
}

export interface ControlMeasure {
  id: string;
  name: string;
  description: string;
  type: 'technical' | 'administrative' | 'physical' | 'legal';
  category: 'preventive' | 'detective' | 'corrective' | 'compensating';
  
  // Effectiveness
  effectiveness: 'low' | 'medium' | 'high';
  implementationStatus: 'not_implemented' | 'partially_implemented' | 'fully_implemented';
  
  // Testing
  lastTested: Date;
  testResult: 'passed' | 'failed' | 'partial' | 'not_tested';
  testFrequency: 'monthly' | 'quarterly' | 'annually' | 'ad_hoc';
  
  // Ownership
  owner: string;
  implementer: string;
  
  // Costs
  implementationCost: number;
  operationalCost: number;
  
  // Dependencies
  dependencies: string[];
  relatedControls: string[];
}

export interface RiskIndicator {
  id: string;
  name: string;
  description: string;
  type: 'kri' | 'kpi' | 'kci'; // Key Risk Indicator / Key Performance Indicator / Key Control Indicator
  category: string;
  
  // Measurement
  metric: string;
  unit: string;
  currentValue: number;
  targetValue: number;
  threshold: {
    green: number;
    yellow: number;
    red: number;
  };
  
  // Status
  status: 'green' | 'yellow' | 'red';
  trend: 'improving' | 'stable' | 'deteriorating';
  
  // Data
  dataSource: string;
  lastUpdated: Date;
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  
  // Ownership
  owner: string;
  
  // History
  history: IndicatorHistory[];
}

export interface IndicatorHistory {
  date: Date;
  value: number;
  status: 'green' | 'yellow' | 'red';
  notes: string;
}

export interface RiskEvent {
  id: string;
  title: string;
  description: string;
  type: 'near_miss' | 'incident' | 'loss' | 'opportunity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Occurrence
  occurredAt: Date;
  detectedAt: Date;
  reportedAt: Date;
  reportedBy: string;
  
  // Impact
  actualImpact: {
    financial: number;
    operational: string;
    reputation: string;
    compliance: string;
  };
  
  // Response
  responseActions: ResponseAction[];
  lessonsLearned: string[];
  
  // Related
  relatedRisks: string[];
  rootCause: string;
  
  // Status
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  
  // Investigation
  investigator: string;
  investigationNotes: string;
  resolution: string;
  
  // Prevention
  preventiveActions: string[];
  controlUpdates: string[];
}

export interface ResponseAction {
  id: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate: Date;
  cost: number;
}

export interface RiskReport {
  id: string;
  title: string;
  type: 'dashboard' | 'executive' | 'detailed' | 'regulatory';
  period: {
    start: Date;
    end: Date;
  };
  
  // Executive Summary
  executiveSummary: {
    totalRisks: number;
    criticalRisks: number;
    riskTrend: 'improving' | 'stable' | 'deteriorating';
    keyFindings: string[];
  };
  
  // Risk Metrics
  riskMetrics: {
    averageRiskScore: number;
    riskDistribution: { [key: string]: number };
    mitigationEffectiveness: number;
    controlCoverage: number;
  };
  
  // Events
  riskEvents: {
    totalEvents: number;
    criticalEvents: number;
    financialImpact: number;
    topCategories: string[];
  };
  
  // Recommendations
  recommendations: string[];
  actionItems: string[];
  
  // Generated
  generatedAt: Date;
  generatedBy: string;
  approver: string;
  approved: boolean;
}

export interface BusinessContinuityPlan {
  id: string;
  name: string;
  description: string;
  scope: string[];
  
  // Risk Context
  threats: string[];
  vulnerabilities: string[];
  impacts: string[];
  
  // Recovery
  recoveryTimeObjective: number; // in hours
  recoveryPointObjective: number; // in hours
  
  // Procedures
  procedures: BCPProcedure[];
  
  // Resources
  keyPersonnel: string[];
  alternateLocations: string[];
  criticalSystems: string[];
  
  // Testing
  lastTested: Date;
  testResults: string;
  nextTest: Date;
  
  // Lifecycle
  version: string;
  lastUpdated: Date;
  owner: string;
  approved: boolean;
  approver: string;
}

export interface BCPProcedure {
  id: string;
  name: string;
  description: string;
  type: 'prevention' | 'response' | 'recovery' | 'restoration';
  order: number;
  steps: string[];
  resources: string[];
  roles: string[];
  timeline: string;
  dependencies: string[];
}

export class EnterpriseRiskManagement {
  private riskAssessments: RiskAssessment[] = [];
  private riskIndicators: RiskIndicator[] = [];
  private riskEvents: RiskEvent[] = [];
  private businessContinuityPlans: BusinessContinuityPlan[] = [];
  private reports: RiskReport[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Initialize sample risk assessments
    this.riskAssessments = [
      {
        id: 'risk-001',
        name: 'Data Breach Risk',
        description: 'Risk of unauthorized access to customer data',
        type: 'security',
        category: 'cybersecurity',
        probability: 'medium',
        impact: 'major',
        riskLevel: 'high',
        riskScore: 15,
        triggers: ['Phishing attacks', 'Insider threats', 'System vulnerabilities'],
        consequences: ['Financial losses', 'Regulatory fines', 'Reputation damage'],
        affectedAreas: ['Customer data', 'Financial systems', 'Operations'],
        stakeholders: ['CISO', 'Legal', 'Customer service'],
        identifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
        owner: 'ciso',
        assessedBy: 'security-team',
        reviewers: ['risk-manager', 'compliance-officer'],
        status: 'mitigated',
        mitigationStrategy: {
          id: 'strategy-001',
          type: 'reduce',
          description: 'Implement comprehensive cybersecurity controls',
          actions: [
            {
              id: 'action-001',
              description: 'Deploy advanced threat detection',
              type: 'preventive',
              priority: 'high',
              status: 'completed',
              assignedTo: 'security-team',
              dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
              cost: 50000,
              progress: 100
            }
          ],
          timeline: '6 months',
          budget: 200000,
          owner: 'ciso',
          status: 'completed',
          effectiveness: 85
        },
        controlMeasures: [
          {
            id: 'control-001',
            name: 'Multi-Factor Authentication',
            description: 'Require MFA for all system access',
            type: 'technical',
            category: 'preventive',
            effectiveness: 'high',
            implementationStatus: 'fully_implemented',
            lastTested: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            testResult: 'passed',
            testFrequency: 'monthly',
            owner: 'security-team',
            implementer: 'it-team',
            implementationCost: 25000,
            operationalCost: 5000,
            dependencies: ['identity-system'],
            relatedControls: ['control-002']
          }
        ],
        regulatoryRequirements: ['GDPR', 'CCPA', 'SOC2'],
        complianceStatus: 'compliant',
        residualRisk: 6,
        costOfControl: 200000,
        riskAppetite: 8,
        tolerance: 2
      },
      {
        id: 'risk-002',
        name: 'Operational Disruption',
        description: 'Risk of business interruption due to system failures',
        type: 'operational',
        category: 'business-continuity',
        probability: 'low',
        impact: 'major',
        riskLevel: 'medium',
        riskScore: 10,
        triggers: ['System failures', 'Natural disasters', 'Cyber attacks'],
        consequences: ['Service downtime', 'Revenue loss', 'Customer dissatisfaction'],
        affectedAreas: ['Operations', 'Customer service', 'Revenue'],
        stakeholders: ['COO', 'CTO', 'Customer service'],
        identifiedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        lastReviewed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        owner: 'coo',
        assessedBy: 'operations-team',
        reviewers: ['risk-manager', 'cto'],
        status: 'monitored',
        mitigationStrategy: {
          id: 'strategy-002',
          type: 'reduce',
          description: 'Implement robust business continuity measures',
          actions: [
            {
              id: 'action-002',
              description: 'Establish backup data centers',
              type: 'preventive',
              priority: 'high',
              status: 'in_progress',
              assignedTo: 'infrastructure-team',
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              cost: 100000,
              progress: 60
            }
          ],
          timeline: '4 months',
          budget: 150000,
          owner: 'coo',
          status: 'in_progress',
          effectiveness: 70
        },
        controlMeasures: [
          {
            id: 'control-002',
            name: 'Automated Failover',
            description: 'Automatic failover to backup systems',
            type: 'technical',
            category: 'detective',
            effectiveness: 'high',
            implementationStatus: 'partially_implemented',
            lastTested: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
            testResult: 'partial',
            testFrequency: 'quarterly',
            owner: 'infrastructure-team',
            implementer: 'devops-team',
            implementationCost: 75000,
            operationalCost: 10000,
            dependencies: ['backup-systems'],
            relatedControls: ['control-003']
          }
        ],
        regulatoryRequirements: ['ISO-22301'],
        complianceStatus: 'partially_compliant',
        residualRisk: 4,
        costOfControl: 150000,
        riskAppetite: 6,
        tolerance: 2
      }
    ];

    // Initialize sample risk indicators
    this.riskIndicators = [
      {
        id: 'indicator-001',
        name: 'Security Incidents',
        description: 'Number of security incidents per month',
        type: 'kri',
        category: 'security',
        metric: 'incident_count',
        unit: 'count',
        currentValue: 3,
        targetValue: 2,
        threshold: {
          green: 2,
          yellow: 4,
          red: 6
        },
        status: 'yellow',
        trend: 'stable',
        dataSource: 'security-system',
        lastUpdated: new Date(),
        frequency: 'daily',
        owner: 'ciso',
        history: [
          {
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            value: 2,
            status: 'green',
            notes: 'Within acceptable range'
          },
          {
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            value: 4,
            status: 'yellow',
            notes: 'Slight increase observed'
          }
        ]
      },
      {
        id: 'indicator-002',
        name: 'System Uptime',
        description: 'Percentage of system availability',
        type: 'kpi',
        category: 'operational',
        metric: 'uptime_percentage',
        unit: 'percentage',
        currentValue: 99.2,
        targetValue: 99.5,
        threshold: {
          green: 99.5,
          yellow: 99.0,
          red: 98.5
        },
        status: 'yellow',
        trend: 'improving',
        dataSource: 'monitoring-system',
        lastUpdated: new Date(),
        frequency: 'real_time',
        owner: 'cto',
        history: [
          {
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            value: 99.0,
            status: 'yellow',
            notes: 'Below target'
          },
          {
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            value: 99.2,
            status: 'yellow',
            notes: 'Improving but still below target'
          }
        ]
      }
    ];

    // Initialize sample business continuity plans
    this.businessContinuityPlans = [
      {
        id: 'bcp-001',
        name: 'IT Disaster Recovery Plan',
        description: 'Plan for recovering IT systems after a disaster',
        scope: ['IT infrastructure', 'Data systems', 'Applications'],
        threats: ['Natural disasters', 'Cyber attacks', 'Hardware failures'],
        vulnerabilities: ['Single points of failure', 'Insufficient backups'],
        impacts: ['Service disruption', 'Data loss', 'Revenue impact'],
        recoveryTimeObjective: 4,
        recoveryPointObjective: 1,
        procedures: [
          {
            id: 'procedure-001',
            name: 'Immediate Response',
            description: 'Initial response to disaster',
            type: 'response',
            order: 1,
            steps: ['Assess damage', 'Activate response team', 'Notify stakeholders'],
            resources: ['Emergency contacts', 'Communication systems'],
            roles: ['Incident commander', 'Technical lead'],
            timeline: '1 hour',
            dependencies: []
          }
        ],
        keyPersonnel: ['IT Director', 'System Administrator', 'Network Engineer'],
        alternateLocations: ['Backup data center', 'Cloud infrastructure'],
        criticalSystems: ['Core database', 'Web application', 'Email system'],
        lastTested: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        testResults: 'Successful with minor improvements needed',
        nextTest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        version: '2.1',
        lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        owner: 'cto',
        approved: true,
        approver: 'ceo'
      }
    ];
  }

  async assessRisk(riskData: Partial<RiskAssessment>): Promise<RiskAssessment> {
    const riskScore = this.calculateRiskScore(
      riskData.probability || 'medium',
      riskData.impact || 'moderate'
    );

    const riskLevel = this.determineRiskLevel(riskScore);

    const assessment: RiskAssessment = {
      id: `risk-${Date.now()}`,
      name: riskData.name || 'New Risk',
      description: riskData.description || '',
      type: riskData.type || 'operational',
      category: riskData.category || 'general',
      probability: riskData.probability || 'medium',
      impact: riskData.impact || 'moderate',
      riskLevel,
      riskScore,
      triggers: riskData.triggers || [],
      consequences: riskData.consequences || [],
      affectedAreas: riskData.affectedAreas || [],
      stakeholders: riskData.stakeholders || [],
      identifiedAt: new Date(),
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      owner: riskData.owner || 'risk-manager',
      assessedBy: riskData.assessedBy || 'system',
      reviewers: riskData.reviewers || [],
      status: 'identified',
      mitigationStrategy: riskData.mitigationStrategy || {
        id: `strategy-${Date.now()}`,
        type: 'reduce',
        description: 'To be determined',
        actions: [],
        timeline: 'TBD',
        budget: 0,
        owner: riskData.owner || 'risk-manager',
        status: 'planned',
        effectiveness: 0
      },
      controlMeasures: riskData.controlMeasures || [],
      regulatoryRequirements: riskData.regulatoryRequirements || [],
      complianceStatus: 'compliant',
      residualRisk: riskScore,
      costOfControl: 0,
      riskAppetite: 10,
      tolerance: 5
    };

    this.riskAssessments.push(assessment);
    return assessment;
  }

  private calculateRiskScore(probability: string, impact: string): number {
    const probabilityScores = {
      'very_low': 1,
      'low': 2,
      'medium': 3,
      'high': 4,
      'very_high': 5
    };

    const impactScores = {
      'negligible': 1,
      'minor': 2,
      'moderate': 3,
      'major': 4,
      'catastrophic': 5
    };

    return probabilityScores[probability as keyof typeof probabilityScores] * 
           impactScores[impact as keyof typeof impactScores];
  }

  private determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 20) return 'critical';
    if (riskScore >= 12) return 'high';
    if (riskScore >= 6) return 'medium';
    return 'low';
  }

  async updateRiskAssessment(riskId: string, updates: Partial<RiskAssessment>): Promise<RiskAssessment> {
    const risk = this.riskAssessments.find(r => r.id === riskId);
    if (!risk) {
      throw new Error(`Risk assessment not found: ${riskId}`);
    }

    // Recalculate risk score if probability or impact changed
    if (updates.probability || updates.impact) {
      const newScore = this.calculateRiskScore(
        updates.probability || risk.probability,
        updates.impact || risk.impact
      );
      updates.riskScore = newScore;
      updates.riskLevel = this.determineRiskLevel(newScore);
    }

    Object.assign(risk, updates);
    risk.lastReviewed = new Date();

    return risk;
  }

  async implementMitigationAction(riskId: string, actionId: string): Promise<MitigationAction> {
    const risk = this.riskAssessments.find(r => r.id === riskId);
    if (!risk) {
      throw new Error(`Risk assessment not found: ${riskId}`);
    }

    const action = risk.mitigationStrategy.actions.find(a => a.id === actionId);
    if (!action) {
      throw new Error(`Mitigation action not found: ${actionId}`);
    }

    action.status = 'completed';
    action.progress = 100;

    // Update mitigation strategy effectiveness
    const completedActions = risk.mitigationStrategy.actions.filter(a => a.status === 'completed');
    const totalActions = risk.mitigationStrategy.actions.length;
    
    risk.mitigationStrategy.effectiveness = totalActions > 0 
      ? (completedActions.length / totalActions) * 100 
      : 0;

    // Update residual risk
    risk.residualRisk = Math.max(1, risk.riskScore - (risk.mitigationStrategy.effectiveness / 10));

    return action;
  }

  async monitorRiskIndicators(): Promise<{ alerts: string[]; trends: string[] }> {
    const alerts: string[] = [];
    const trends: string[] = [];

    for (const indicator of this.riskIndicators) {
      // Update indicator status based on current value
      if (indicator.currentValue >= indicator.threshold.red) {
        indicator.status = 'red';
        alerts.push(`${indicator.name} is in RED status (${indicator.currentValue})`);
      } else if (indicator.currentValue >= indicator.threshold.yellow) {
        indicator.status = 'yellow';
        alerts.push(`${indicator.name} is in YELLOW status (${indicator.currentValue})`);
      } else {
        indicator.status = 'green';
      }

      // Analyze trend
      if (indicator.history.length >= 2) {
        const recent = indicator.history[indicator.history.length - 1];
        const previous = indicator.history[indicator.history.length - 2];
        
        if (recent.value > previous.value) {
          indicator.trend = 'deteriorating';
          trends.push(`${indicator.name} is deteriorating (${previous.value} → ${recent.value})`);
        } else if (recent.value < previous.value) {
          indicator.trend = 'improving';
          trends.push(`${indicator.name} is improving (${previous.value} → ${recent.value})`);
        } else {
          indicator.trend = 'stable';
        }
      }
    }

    return { alerts, trends };
  }

  async recordRiskEvent(eventData: Partial<RiskEvent>): Promise<RiskEvent> {
    const event: RiskEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || 'Risk Event',
      description: eventData.description || '',
      type: eventData.type || 'incident',
      severity: eventData.severity || 'medium',
      occurredAt: eventData.occurredAt || new Date(),
      detectedAt: eventData.detectedAt || new Date(),
      reportedAt: new Date(),
      reportedBy: eventData.reportedBy || 'system',
      actualImpact: eventData.actualImpact || {
        financial: 0,
        operational: 'Minor',
        reputation: 'None',
        compliance: 'None'
      },
      responseActions: eventData.responseActions || [],
      lessonsLearned: eventData.lessonsLearned || [],
      relatedRisks: eventData.relatedRisks || [],
      rootCause: eventData.rootCause || 'Under investigation',
      status: 'open',
      investigator: eventData.investigator || 'risk-team',
      investigationNotes: '',
      resolution: '',
      preventiveActions: [],
      controlUpdates: []
    };

    this.riskEvents.push(event);
    
    // Auto-link to related risks
    await this.linkEventToRisks(event);
    
    return event;
  }

  private async linkEventToRisks(event: RiskEvent): Promise<void> {
    // Simple keyword matching to link events to risks
    const keywords = event.description.toLowerCase().split(' ');
    
    for (const risk of this.riskAssessments) {
      const riskKeywords = risk.name.toLowerCase().split(' ');
      const hasMatch = keywords.some(keyword => 
        riskKeywords.some(riskKeyword => 
          keyword.includes(riskKeyword) || riskKeyword.includes(keyword)
        )
      );
      
      if (hasMatch && !event.relatedRisks.includes(risk.id)) {
        event.relatedRisks.push(risk.id);
      }
    }
  }

  async generateRiskReport(type: RiskReport['type']): Promise<RiskReport> {
    const period = {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    };

    const totalRisks = this.riskAssessments.length;
    const criticalRisks = this.riskAssessments.filter(r => r.riskLevel === 'critical').length;
    const highRisks = this.riskAssessments.filter(r => r.riskLevel === 'high').length;
    
    const averageRiskScore = this.riskAssessments.reduce((sum, r) => sum + r.riskScore, 0) / totalRisks;
    
    const riskDistribution = this.riskAssessments.reduce((acc, risk) => {
      acc[risk.riskLevel] = (acc[risk.riskLevel] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const recentEvents = this.riskEvents.filter(e => e.occurredAt >= period.start);
    const totalFinancialImpact = recentEvents.reduce((sum, e) => sum + e.actualImpact.financial, 0);

    const report: RiskReport = {
      id: `report-${Date.now()}`,
      title: `Risk Management Report - ${type}`,
      type,
      period,
      executiveSummary: {
        totalRisks,
        criticalRisks,
        riskTrend: criticalRisks > highRisks ? 'deteriorating' : 'stable',
        keyFindings: [
          `${criticalRisks} critical risks requiring immediate attention`,
          `Average risk score: ${averageRiskScore.toFixed(1)}`,
          `${recentEvents.length} risk events in the past 30 days`
        ]
      },
      riskMetrics: {
        averageRiskScore,
        riskDistribution,
        mitigationEffectiveness: this.calculateAverageMitigationEffectiveness(),
        controlCoverage: this.calculateControlCoverage()
      },
      riskEvents: {
        totalEvents: recentEvents.length,
        criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
        financialImpact: totalFinancialImpact,
        topCategories: this.getTopEventCategories(recentEvents)
      },
      recommendations: this.generateRecommendations(),
      actionItems: this.generateActionItems(),
      generatedAt: new Date(),
      generatedBy: 'risk-system',
      approver: 'risk-manager',
      approved: false
    };

    this.reports.push(report);
    return report;
  }

  private calculateAverageMitigationEffectiveness(): number {
    const effectiveness = this.riskAssessments.map(r => r.mitigationStrategy.effectiveness);
    return effectiveness.reduce((sum, e) => sum + e, 0) / effectiveness.length;
  }

  private calculateControlCoverage(): number {
    const totalRisks = this.riskAssessments.length;
    const risksWithControls = this.riskAssessments.filter(r => r.controlMeasures.length > 0).length;
    return totalRisks > 0 ? (risksWithControls / totalRisks) * 100 : 0;
  }

  private getTopEventCategories(events: RiskEvent[]): string[] {
    const categories = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const criticalRisks = this.riskAssessments.filter(r => r.riskLevel === 'critical').length;
    if (criticalRisks > 0) {
      recommendations.push(`Address ${criticalRisks} critical risks immediately`);
    }

    const lowEffectiveness = this.riskAssessments.filter(r => r.mitigationStrategy.effectiveness < 50).length;
    if (lowEffectiveness > 0) {
      recommendations.push(`Improve mitigation strategies for ${lowEffectiveness} risks`);
    }

    const overdueControls = this.riskAssessments.filter(r => 
      r.controlMeasures.some(c => c.testResult === 'failed')
    ).length;
    if (overdueControls > 0) {
      recommendations.push(`Update failed control measures for ${overdueControls} risks`);
    }

    recommendations.push('Conduct regular risk assessment reviews');
    recommendations.push('Enhance risk monitoring and reporting');

    return recommendations;
  }

  private generateActionItems(): string[] {
    const actionItems: string[] = [];
    
    // Find overdue mitigation actions
    const overdueActions = this.riskAssessments.flatMap(r => 
      r.mitigationStrategy.actions.filter(a => a.status !== 'completed' && a.dueDate < new Date())
    );

    if (overdueActions.length > 0) {
      actionItems.push(`Complete ${overdueActions.length} overdue mitigation actions`);
    }

    // Find risks needing review
    const needsReview = this.riskAssessments.filter(r => r.nextReview < new Date());
    if (needsReview.length > 0) {
      actionItems.push(`Review ${needsReview.length} risks that are due for review`);
    }

    actionItems.push('Update business continuity plans');
    actionItems.push('Conduct risk indicator analysis');

    return actionItems;
  }

  async getRiskDashboard(): Promise<any> {
    const monitoring = await this.monitorRiskIndicators();
    
    return {
      summary: {
        totalRisks: this.riskAssessments.length,
        criticalRisks: this.riskAssessments.filter(r => r.riskLevel === 'critical').length,
        highRisks: this.riskAssessments.filter(r => r.riskLevel === 'high').length,
        recentEvents: this.riskEvents.filter(e => 
          e.occurredAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      },
      alerts: monitoring.alerts,
      trends: monitoring.trends,
      topRisks: this.riskAssessments
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          name: r.name,
          riskLevel: r.riskLevel,
          riskScore: r.riskScore,
          owner: r.owner
        })),
      indicators: this.riskIndicators.map(i => ({
        id: i.id,
        name: i.name,
        status: i.status,
        currentValue: i.currentValue,
        targetValue: i.targetValue,
        trend: i.trend
      }))
    };
  }

  async searchRisks(filters: {
    type?: string;
    riskLevel?: string;
    status?: string;
    owner?: string;
  }): Promise<RiskAssessment[]> {
    return this.riskAssessments.filter(risk => {
      if (filters.type && risk.type !== filters.type) return false;
      if (filters.riskLevel && risk.riskLevel !== filters.riskLevel) return false;
      if (filters.status && risk.status !== filters.status) return false;
      if (filters.owner && risk.owner !== filters.owner) return false;
      return true;
    });
  }
}

export const enterpriseRiskManagement = new EnterpriseRiskManagement();
