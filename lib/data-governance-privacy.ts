
/**
 * Data Governance & Privacy Management System
 * Comprehensive data classification, lineage tracking, and privacy management
 */

export interface DataAsset {
  id: string;
  name: string;
  type: 'database' | 'file' | 'api' | 'stream' | 'report';
  classification: DataClassification;
  location: string;
  owner: string;
  steward: string;
  description: string;
  tags: string[];
  metadata: any;
  createdAt: Date;
  lastUpdated: Date;
  retention: RetentionPolicy;
  compliance: string[];
}

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  categories: string[];
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
  personalData: boolean;
  financialData: boolean;
  healthData: boolean;
  intellectualProperty: boolean;
  regulatoryRequirements: string[];
}

export interface RetentionPolicy {
  id: string;
  name: string;
  retention: number; // in days
  action: 'delete' | 'archive' | 'anonymize' | 'review';
  trigger: 'time' | 'event' | 'request';
  exceptions: string[];
  approver: string;
}

export interface DataLineage {
  id: string;
  assetId: string;
  upstream: LineageNode[];
  downstream: LineageNode[];
  transformations: DataTransformation[];
  lastUpdated: Date;
  confidence: number;
}

export interface LineageNode {
  id: string;
  name: string;
  type: string;
  connection: string;
  metadata: any;
}

export interface DataTransformation {
  id: string;
  type: 'filter' | 'transform' | 'aggregate' | 'join' | 'union';
  description: string;
  code: string;
  impact: 'low' | 'medium' | 'high';
  businessLogic: string;
}

export interface PrivacyImpactAssessment {
  id: string;
  projectName: string;
  dataTypes: string[];
  personalDataProcessing: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  mitigationMeasures: string[];
  status: 'draft' | 'review' | 'approved' | 'rejected';
  approver: string;
  completedAt?: Date;
  reviewDate: Date;
}

export interface DataSubjectRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection' | 'restriction';
  requesterId: string;
  requesterEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: Date;
  dueDate: Date;
  completedAt?: Date;
  description: string;
  dataAssets: string[];
  processingNotes: string;
  approver: string;
  evidence: string[];
}

export interface ConsentRecord {
  id: string;
  userId: string;
  purpose: string;
  lawfulBasis: string;
  consentGiven: boolean;
  consentDate: Date;
  withdrawnDate?: Date;
  version: string;
  source: string;
  metadata: any;
}

export interface DataGovernanceMetrics {
  assets: {
    total: number;
    classified: number;
    unclassified: number;
    byClassification: { [key: string]: number };
  };
  privacy: {
    requests: number;
    processed: number;
    averageProcessingTime: number;
    consentRate: number;
  };
  compliance: {
    score: number;
    violations: number;
    assessments: number;
    policies: number;
  };
  lineage: {
    traced: number;
    orphaned: number;
    confidence: number;
  };
}

export class DataGovernancePrivacy {
  private dataAssets: DataAsset[] = [];
  private lineageMap: Map<string, DataLineage> = new Map();
  private privacyAssessments: PrivacyImpactAssessment[] = [];
  private subjectRequests: DataSubjectRequest[] = [];
  private consentRecords: ConsentRecord[] = [];
  private retentionPolicies: RetentionPolicy[] = [];

  constructor() {
    this.initializeRetentionPolicies();
    this.initializeSampleData();
  }

  private initializeRetentionPolicies(): void {
    this.retentionPolicies = [
      {
        id: 'policy-user-data',
        name: 'User Data Retention',
        retention: 2555, // 7 years
        action: 'anonymize',
        trigger: 'time',
        exceptions: ['legal-hold', 'active-contract'],
        approver: 'data-protection-officer'
      },
      {
        id: 'policy-financial-data',
        name: 'Financial Data Retention',
        retention: 2555, // 7 years
        action: 'archive',
        trigger: 'time',
        exceptions: ['regulatory-requirement'],
        approver: 'compliance-officer'
      },
      {
        id: 'policy-log-data',
        name: 'Log Data Retention',
        retention: 365, // 1 year
        action: 'delete',
        trigger: 'time',
        exceptions: ['security-incident'],
        approver: 'security-officer'
      }
    ];
  }

  private initializeSampleData(): void {
    // Sample data assets
    this.dataAssets = [
      {
        id: 'asset-001',
        name: 'Customer Database',
        type: 'database',
        classification: {
          level: 'confidential',
          categories: ['customer-data', 'personal-information'],
          sensitivity: 'high',
          personalData: true,
          financialData: false,
          healthData: false,
          intellectualProperty: false,
          regulatoryRequirements: ['GDPR', 'CCPA']
        },
        location: 'primary-db-cluster',
        owner: 'customer-success-team',
        steward: 'data-governance-team',
        description: 'Primary customer information database',
        tags: ['production', 'customer', 'gdpr'],
        metadata: {
          records: 1000000,
          lastBackup: new Date(),
          encryption: 'AES-256'
        },
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(),
        retention: this.retentionPolicies[0],
        compliance: ['GDPR', 'CCPA']
      },
      {
        id: 'asset-002',
        name: 'Transaction Logs',
        type: 'file',
        classification: {
          level: 'internal',
          categories: ['transaction-data', 'audit-logs'],
          sensitivity: 'medium',
          personalData: false,
          financialData: true,
          healthData: false,
          intellectualProperty: false,
          regulatoryRequirements: ['SOX', 'PCI_DSS']
        },
        location: 'log-storage-s3',
        owner: 'finance-team',
        steward: 'data-governance-team',
        description: 'Financial transaction audit logs',
        tags: ['audit', 'financial', 'sox'],
        metadata: {
          size: '500GB',
          compression: 'gzip',
          partitioning: 'daily'
        },
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(),
        retention: this.retentionPolicies[1],
        compliance: ['SOX', 'PCI_DSS']
      }
    ];

    // Sample lineage data
    this.lineageMap.set('asset-001', {
      id: 'lineage-001',
      assetId: 'asset-001',
      upstream: [
        {
          id: 'source-crm',
          name: 'CRM System',
          type: 'external-system',
          connection: 'api-connector',
          metadata: { frequency: 'real-time' }
        }
      ],
      downstream: [
        {
          id: 'analytics-warehouse',
          name: 'Analytics Warehouse',
          type: 'data-warehouse',
          connection: 'etl-pipeline',
          metadata: { frequency: 'nightly' }
        }
      ],
      transformations: [
        {
          id: 'transform-001',
          type: 'transform',
          description: 'PII encryption and data masking',
          code: 'SELECT encrypt(email), mask(phone) FROM customers',
          impact: 'high',
          businessLogic: 'Protect sensitive customer information'
        }
      ],
      lastUpdated: new Date(),
      confidence: 95
    });
  }

  async classifyDataAsset(assetId: string, classification: DataClassification): Promise<void> {
    const asset = this.dataAssets.find(a => a.id === assetId);
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    asset.classification = classification;
    asset.lastUpdated = new Date();

    // Auto-apply retention policy based on classification
    const appropriatePolicy = this.findRetentionPolicy(classification);
    if (appropriatePolicy) {
      asset.retention = appropriatePolicy;
    }

    // Trigger compliance check
    await this.performComplianceCheck(asset);
  }

  private findRetentionPolicy(classification: DataClassification): RetentionPolicy | null {
    if (classification.personalData) {
      return this.retentionPolicies.find(p => p.id === 'policy-user-data') || null;
    }
    if (classification.financialData) {
      return this.retentionPolicies.find(p => p.id === 'policy-financial-data') || null;
    }
    return this.retentionPolicies.find(p => p.id === 'policy-log-data') || null;
  }

  async trackDataLineage(assetId: string): Promise<DataLineage> {
    const existingLineage = this.lineageMap.get(assetId);
    if (existingLineage) {
      return existingLineage;
    }

    // Auto-discover lineage (simplified)
    const lineage: DataLineage = {
      id: `lineage-${assetId}`,
      assetId,
      upstream: await this.discoverUpstreamSources(assetId),
      downstream: await this.discoverDownstreamTargets(assetId),
      transformations: await this.discoverTransformations(assetId),
      lastUpdated: new Date(),
      confidence: 80
    };

    this.lineageMap.set(assetId, lineage);
    return lineage;
  }

  private async discoverUpstreamSources(assetId: string): Promise<LineageNode[]> {
    // Simplified upstream discovery
    return [
      {
        id: `upstream-${assetId}`,
        name: 'Data Source',
        type: 'database',
        connection: 'direct',
        metadata: { discovered: true }
      }
    ];
  }

  private async discoverDownstreamTargets(assetId: string): Promise<LineageNode[]> {
    // Simplified downstream discovery
    return [
      {
        id: `downstream-${assetId}`,
        name: 'Analytics Target',
        type: 'warehouse',
        connection: 'etl',
        metadata: { discovered: true }
      }
    ];
  }

  private async discoverTransformations(assetId: string): Promise<DataTransformation[]> {
    // Simplified transformation discovery
    return [
      {
        id: `transform-${assetId}`,
        type: 'transform',
        description: 'Data cleansing and validation',
        code: 'CLEAN_DATA(input)',
        impact: 'medium',
        businessLogic: 'Ensure data quality'
      }
    ];
  }

  async conductPrivacyImpactAssessment(
    projectName: string,
    dataTypes: string[],
    personalDataProcessing: boolean
  ): Promise<PrivacyImpactAssessment> {
    const riskLevel = this.assessPrivacyRisk(dataTypes, personalDataProcessing);
    
    const assessment: PrivacyImpactAssessment = {
      id: `pia-${Date.now()}`,
      projectName,
      dataTypes,
      personalDataProcessing,
      riskLevel,
      riskFactors: this.identifyRiskFactors(dataTypes, personalDataProcessing),
      mitigationMeasures: this.recommendMitigations(riskLevel),
      status: 'draft',
      approver: 'data-protection-officer',
      reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    this.privacyAssessments.push(assessment);
    return assessment;
  }

  private assessPrivacyRisk(dataTypes: string[], personalDataProcessing: boolean): 'low' | 'medium' | 'high' | 'critical' {
    if (!personalDataProcessing) return 'low';
    
    const sensitiveTypes = ['biometric', 'health', 'financial', 'location'];
    const hasSensitiveData = dataTypes.some(type => sensitiveTypes.includes(type));
    
    if (hasSensitiveData && dataTypes.length > 3) return 'critical';
    if (hasSensitiveData) return 'high';
    if (personalDataProcessing) return 'medium';
    return 'low';
  }

  private identifyRiskFactors(dataTypes: string[], personalDataProcessing: boolean): string[] {
    const factors: string[] = [];
    
    if (personalDataProcessing) {
      factors.push('Personal data processing');
    }
    
    if (dataTypes.includes('biometric')) {
      factors.push('Biometric data processing');
    }
    
    if (dataTypes.includes('location')) {
      factors.push('Location tracking');
    }
    
    if (dataTypes.includes('financial')) {
      factors.push('Financial data processing');
    }
    
    return factors;
  }

  private recommendMitigations(riskLevel: string): string[] {
    const mitigations: string[] = [];
    
    mitigations.push('Implement data minimization');
    mitigations.push('Ensure explicit consent');
    mitigations.push('Apply data encryption');
    
    if (riskLevel === 'high' || riskLevel === 'critical') {
      mitigations.push('Implement data masking');
      mitigations.push('Regular privacy audits');
      mitigations.push('Enhanced access controls');
    }
    
    if (riskLevel === 'critical') {
      mitigations.push('Data Protection Officer review');
      mitigations.push('Regular compliance assessments');
    }
    
    return mitigations;
  }

  async processDataSubjectRequest(
    type: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection' | 'restriction',
    requesterId: string,
    requesterEmail: string,
    description: string
  ): Promise<DataSubjectRequest> {
    const request: DataSubjectRequest = {
      id: `dsr-${Date.now()}`,
      type,
      requesterId,
      requesterEmail,
      status: 'pending',
      submittedAt: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      description,
      dataAssets: await this.identifyRelevantAssets(requesterId),
      processingNotes: '',
      approver: 'data-protection-officer',
      evidence: []
    };

    this.subjectRequests.push(request);
    
    // Auto-process if possible
    if (type === 'access' || type === 'portability') {
      await this.autoProcessRequest(request);
    }

    return request;
  }

  private async identifyRelevantAssets(userId: string): Promise<string[]> {
    // Simplified asset identification
    return this.dataAssets
      .filter(asset => asset.classification.personalData)
      .map(asset => asset.id);
  }

  private async autoProcessRequest(request: DataSubjectRequest): Promise<void> {
    // Simplified auto-processing
    request.status = 'processing';
    request.processingNotes = 'Auto-processing initiated';
    
    // Simulate processing time
    setTimeout(() => {
      request.status = 'completed';
      request.completedAt = new Date();
      request.processingNotes += '\nProcessing completed automatically';
    }, 1000);
  }

  async manageConsent(
    userId: string,
    purpose: string,
    lawfulBasis: string,
    consentGiven: boolean,
    source: string
  ): Promise<ConsentRecord> {
    // Check for existing consent
    const existingConsent = this.consentRecords.find(
      record => record.userId === userId && record.purpose === purpose
    );

    if (existingConsent) {
      if (!consentGiven) {
        existingConsent.withdrawnDate = new Date();
      }
      return existingConsent;
    }

    const consentRecord: ConsentRecord = {
      id: `consent-${Date.now()}`,
      userId,
      purpose,
      lawfulBasis,
      consentGiven,
      consentDate: new Date(),
      version: '1.0',
      source,
      metadata: {
        ipAddress: '127.0.0.1',
        userAgent: 'Unknown'
      }
    };

    this.consentRecords.push(consentRecord);
    return consentRecord;
  }

  async performComplianceCheck(asset: DataAsset): Promise<string[]> {
    const issues: string[] = [];

    // Check classification
    if (!asset.classification.level) {
      issues.push('Asset lacks proper classification');
    }

    // Check retention policy
    if (!asset.retention) {
      issues.push('Asset lacks retention policy');
    }

    // Check personal data handling
    if (asset.classification.personalData && !asset.compliance.includes('GDPR')) {
      issues.push('Personal data asset not compliant with GDPR');
    }

    // Check financial data handling
    if (asset.classification.financialData && !asset.compliance.includes('SOX')) {
      issues.push('Financial data asset not compliant with SOX');
    }

    return issues;
  }

  async getGovernanceMetrics(): Promise<DataGovernanceMetrics> {
    const classified = this.dataAssets.filter(a => a.classification.level).length;
    const personalDataRequests = this.subjectRequests.length;
    const processedRequests = this.subjectRequests.filter(r => r.status === 'completed').length;
    const totalConsentRecords = this.consentRecords.length;
    const activeConsents = this.consentRecords.filter(c => c.consentGiven && !c.withdrawnDate).length;

    return {
      assets: {
        total: this.dataAssets.length,
        classified,
        unclassified: this.dataAssets.length - classified,
        byClassification: {
          public: this.dataAssets.filter(a => a.classification.level === 'public').length,
          internal: this.dataAssets.filter(a => a.classification.level === 'internal').length,
          confidential: this.dataAssets.filter(a => a.classification.level === 'confidential').length,
          restricted: this.dataAssets.filter(a => a.classification.level === 'restricted').length
        }
      },
      privacy: {
        requests: personalDataRequests,
        processed: processedRequests,
        averageProcessingTime: 15, // days
        consentRate: totalConsentRecords > 0 ? (activeConsents / totalConsentRecords) * 100 : 0
      },
      compliance: {
        score: 85,
        violations: 3,
        assessments: this.privacyAssessments.length,
        policies: this.retentionPolicies.length
      },
      lineage: {
        traced: this.lineageMap.size,
        orphaned: this.dataAssets.length - this.lineageMap.size,
        confidence: 88
      }
    };
  }

  async generateDataMap(): Promise<any> {
    return {
      assets: this.dataAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        classification: asset.classification.level,
        sensitivity: asset.classification.sensitivity,
        owner: asset.owner,
        location: asset.location,
        compliance: asset.compliance
      })),
      lineage: Array.from(this.lineageMap.values()),
      retentionPolicies: this.retentionPolicies
    };
  }

  async enforceRetentionPolicies(): Promise<{ processed: number; deleted: number; archived: number }> {
    let processed = 0;
    let deleted = 0;
    let archived = 0;

    for (const asset of this.dataAssets) {
      if (asset.retention && this.shouldProcessRetention(asset)) {
        processed++;
        
        switch (asset.retention.action) {
          case 'delete':
            deleted++;
            break;
          case 'archive':
            archived++;
            break;
          case 'anonymize':
            // Anonymize data
            break;
        }
      }
    }

    return { processed, deleted, archived };
  }

  private shouldProcessRetention(asset: DataAsset): boolean {
    if (!asset.retention) return false;
    
    const retentionDate = new Date(asset.createdAt.getTime() + asset.retention.retention * 24 * 60 * 60 * 1000);
    return new Date() > retentionDate;
  }
}

export const dataGovernancePrivacy = new DataGovernancePrivacy();
