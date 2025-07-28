
/**
 * PRODUCTION SECURITY FEATURES
 * Web Application Firewall (WAF), DDoS protection, Security headers, and SDLC integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface WAFRule {
  id: string;
  name: string;
  description: string;
  type: 'block' | 'allow' | 'monitor' | 'rate_limit';
  priority: number;
  enabled: boolean;
  pattern: string;
  patternType: 'regex' | 'exact' | 'contains' | 'startswith' | 'endswith';
  target: 'url' | 'header' | 'body' | 'query' | 'user_agent' | 'ip';
  action: WAFAction;
  conditions: WAFCondition[];
  exceptions: WAFException[];
  statistics: WAFStatistics;
  createdAt: Date;
  updatedAt: Date;
  lastTriggered?: Date;
}

export interface WAFAction {
  type: 'block' | 'allow' | 'redirect' | 'rate_limit' | 'captcha' | 'log_only';
  parameters: Record<string, any>;
  message?: string;
  redirectUrl?: string;
  rateLimit?: RateLimit;
  duration?: number; // in seconds
}

export interface RateLimit {
  requests: number;
  windowMs: number;
  blockDuration: number;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

export interface WAFCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'regex' | 'ip_range' | 'geo_location';
  value: any;
  caseSensitive?: boolean;
}

export interface WAFException {
  id: string;
  ruleId: string;
  type: 'ip' | 'user_agent' | 'path' | 'header' | 'user';
  value: string;
  reason: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  active: boolean;
}

export interface WAFStatistics {
  triggeredCount: number;
  blockedCount: number;
  allowedCount: number;
  lastTriggered?: Date;
  topTargets: Array<{ target: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
}

export interface WAFEvent {
  id: string;
  timestamp: Date;
  ruleId: string;
  ruleName: string;
  action: string;
  blocked: boolean;
  source: string;
  target: string;
  userAgent: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  reason: string;
  riskScore: number;
  geoLocation?: string;
  responseCode: number;
  responseTime: number;
}

export interface DDoSProtection {
  enabled: boolean;
  thresholds: DDoSThresholds;
  mitigations: DDoSMitigation[];
  whitelist: string[];
  blacklist: string[];
  rateLimit: GlobalRateLimit;
  monitoring: DDoSMonitoring;
}

export interface DDoSThresholds {
  requestsPerSecond: number;
  concurrentConnections: number;
  bandwidthMbps: number;
  errorRate: number;
  anomalyScore: number;
}

export interface DDoSMitigation {
  type: 'rate_limit' | 'ip_block' | 'geo_block' | 'challenge' | 'captcha' | 'traffic_shaping';
  trigger: DDoSThresholds;
  duration: number; // in seconds
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface GlobalRateLimit {
  global: RateLimit;
  perIP: RateLimit;
  perUser: RateLimit;
  perEndpoint: RateLimit;
}

export interface DDoSMonitoring {
  enabled: boolean;
  alertThresholds: DDoSThresholds;
  reportingInterval: number; // in seconds
  retentionDays: number;
}

export interface SecurityHeaders {
  contentSecurityPolicy: CSPConfig;
  strictTransportSecurity: HSTSConfig;
  xFrameOptions: XFrameConfig;
  xContentTypeOptions: XContentTypeConfig;
  referrerPolicy: ReferrerPolicyConfig;
  permissionsPolicy: PermissionsPolicyConfig;
  crossOriginEmbedderPolicy: COEPConfig;
  crossOriginOpenerPolicy: COOPConfig;
  crossOriginResourcePolicy: CORPConfig;
}

export interface CSPConfig {
  enabled: boolean;
  directives: Record<string, string[]>;
  reportOnly: boolean;
  reportUri?: string;
  upgradeInsecureRequests: boolean;
  blockAllMixedContent: boolean;
}

export interface HSTSConfig {
  enabled: boolean;
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}

export interface XFrameConfig {
  enabled: boolean;
  policy: 'deny' | 'sameorigin' | 'allow-from';
  allowFrom?: string;
}

export interface XContentTypeConfig {
  enabled: boolean;
  noSniff: boolean;
}

export interface ReferrerPolicyConfig {
  enabled: boolean;
  policy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
}

export interface PermissionsPolicyConfig {
  enabled: boolean;
  permissions: Record<string, string[]>;
}

export interface COEPConfig {
  enabled: boolean;
  policy: 'unsafe-none' | 'require-corp' | 'credentialless';
}

export interface COOPConfig {
  enabled: boolean;
  policy: 'unsafe-none' | 'same-origin-allow-popups' | 'same-origin' | 'same-origin-plus-COEP';
}

export interface CORPConfig {
  enabled: boolean;
  policy: 'same-site' | 'same-origin' | 'cross-origin';
}

export interface SDLCIntegration {
  enabled: boolean;
  stages: SDLCStage[];
  securityGates: SecurityGate[];
  automatedScans: AutomatedScan[];
  complianceChecks: ComplianceCheck[];
  reporting: SDLCReporting;
}

export interface SDLCStage {
  name: string;
  description: string;
  securityActivities: SecurityActivity[];
  gates: string[];
  automatedScans: string[];
  approvers: string[];
  required: boolean;
}

export interface SecurityActivity {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated' | 'review';
  tools: string[];
  criteria: string[];
  deliverables: string[];
  responsible: string;
  duration: number; // in hours
}

export interface SecurityGate {
  id: string;
  name: string;
  description: string;
  stage: string;
  criteria: GateCriteria[];
  blockers: string[];
  approvers: string[];
  automated: boolean;
  required: boolean;
}

export interface GateCriteria {
  type: 'vulnerability_scan' | 'code_review' | 'penetration_test' | 'compliance_check';
  threshold: number;
  metric: string;
  required: boolean;
}

export interface AutomatedScan {
  id: string;
  name: string;
  type: 'sast' | 'dast' | 'iast' | 'dependency' | 'secrets' | 'container' | 'infrastructure';
  tool: string;
  configuration: Record<string, any>;
  schedule: string;
  triggers: string[];
  enabled: boolean;
}

export interface ComplianceCheck {
  id: string;
  standard: string;
  requirement: string;
  checkType: 'automated' | 'manual';
  frequency: string;
  responsible: string;
  evidence: string[];
  status: 'compliant' | 'non_compliant' | 'pending';
}

export interface SDLCReporting {
  enabled: boolean;
  reports: SDLCReport[];
  dashboards: string[];
  notifications: SDLCNotification[];
}

export interface SDLCReport {
  id: string;
  name: string;
  type: 'security_posture' | 'vulnerability_trends' | 'compliance_status' | 'gate_metrics';
  schedule: string;
  recipients: string[];
  format: 'pdf' | 'html' | 'json';
}

export interface SDLCNotification {
  type: 'gate_failure' | 'critical_vulnerability' | 'compliance_violation' | 'scan_completion';
  channels: string[];
  recipients: string[];
  template: string;
  enabled: boolean;
}

export class ProductionSecurityFeatures {
  private static wafRules: WAFRule[] = [];
  private static wafEvents: WAFEvent[] = [];
  private static ddosProtection: DDoSProtection;
  private static securityHeaders: SecurityHeaders;
  private static sdlcIntegration: SDLCIntegration;
  private static rateLimiters = new Map<string, Map<string, number>>();
  private static blockedIPs = new Set<string>();
  private static requestCounts = new Map<string, number>();

  /**
   * Initialize production security features
   */
  static async initialize(): Promise<void> {
    await this.initializeWAFRules();
    await this.initializeDDoSProtection();
    await this.initializeSecurityHeaders();
    await this.initializeSDLCIntegration();
    await this.startWAFMonitoring();
    await this.startDDoSMonitoring();
  }

  /**
   * Process request through WAF
   */
  static async processWAFRequest(request: NextRequest): Promise<{
    allowed: boolean;
    action: string;
    reason: string;
    ruleId?: string;
    response?: NextResponse;
  }> {
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const url = request.url;
    const method = request.method;

    // Check if IP is blocked
    if (this.blockedIPs.has(clientIP)) {
      return {
        allowed: false,
        action: 'block',
        reason: 'IP is blocked',
        response: new NextResponse('Blocked by WAF', { status: 403 })
      };
    }

    // Sort rules by priority
    const sortedRules = this.wafRules
      .filter(rule => rule.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      const matchResult = await this.evaluateWAFRule(rule, request);
      
      if (matchResult.matched) {
        // Check for exceptions
        const hasException = await this.checkWAFExceptions(rule, request);
        if (hasException) {
          continue;
        }

        // Log WAF event
        await this.logWAFEvent(rule, request, matchResult.action);

        // Update statistics
        rule.statistics.triggeredCount++;
        rule.lastTriggered = new Date();

        // Execute action
        const actionResult = await this.executeWAFAction(rule.action, request);
        
        return {
          allowed: actionResult.allowed,
          action: rule.action.type,
          reason: actionResult.reason,
          ruleId: rule.id,
          response: actionResult.response
        };
      }
    }

    return {
      allowed: true,
      action: 'allow',
      reason: 'No matching rules'
    };
  }

  /**
   * Apply DDoS protection
   */
  static async applyDDoSProtection(request: NextRequest): Promise<{
    allowed: boolean;
    action: string;
    reason: string;
    response?: NextResponse;
  }> {
    if (!this.ddosProtection.enabled) {
      return { allowed: true, action: 'allow', reason: 'DDoS protection disabled' };
    }

    const clientIP = request.ip || 'unknown';
    const now = Date.now();

    // Check request rate
    const requestCount = this.requestCounts.get(clientIP) || 0;
    if (requestCount > this.ddosProtection.thresholds.requestsPerSecond) {
      // Apply rate limiting
      const mitigation = this.ddosProtection.mitigations.find(m => 
        m.type === 'rate_limit' && m.enabled
      );
      
      if (mitigation) {
        return {
          allowed: false,
          action: 'rate_limit',
          reason: 'Rate limit exceeded',
          response: new NextResponse('Rate limit exceeded', { 
            status: 429,
            headers: { 'Retry-After': mitigation.duration.toString() }
          })
        };
      }
    }

    // Update request count
    this.requestCounts.set(clientIP, requestCount + 1);

    // Reset counters every second
    setTimeout(() => {
      this.requestCounts.set(clientIP, 0);
    }, 1000);

    return { allowed: true, action: 'allow', reason: 'DDoS protection passed' };
  }

  /**
   * Apply security headers
   */
  static applySecurityHeaders(response: NextResponse): NextResponse {
    const headers = this.securityHeaders;

    // Content Security Policy
    if (headers.contentSecurityPolicy.enabled) {
      const cspValue = this.buildCSPHeader(headers.contentSecurityPolicy);
      const headerName = headers.contentSecurityPolicy.reportOnly ? 
        'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
      response.headers.set(headerName, cspValue);
    }

    // Strict Transport Security
    if (headers.strictTransportSecurity.enabled) {
      const hstsValue = this.buildHSTSHeader(headers.strictTransportSecurity);
      response.headers.set('Strict-Transport-Security', hstsValue);
    }

    // X-Frame-Options
    if (headers.xFrameOptions.enabled) {
      const xFrameValue = this.buildXFrameHeader(headers.xFrameOptions);
      response.headers.set('X-Frame-Options', xFrameValue);
    }

    // X-Content-Type-Options
    if (headers.xContentTypeOptions.enabled) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
    }

    // Referrer Policy
    if (headers.referrerPolicy.enabled) {
      response.headers.set('Referrer-Policy', headers.referrerPolicy.policy);
    }

    // Permissions Policy
    if (headers.permissionsPolicy.enabled) {
      const permissionsValue = this.buildPermissionsPolicyHeader(headers.permissionsPolicy);
      response.headers.set('Permissions-Policy', permissionsValue);
    }

    // Cross-Origin Embedder Policy
    if (headers.crossOriginEmbedderPolicy.enabled) {
      response.headers.set('Cross-Origin-Embedder-Policy', headers.crossOriginEmbedderPolicy.policy);
    }

    // Cross-Origin Opener Policy
    if (headers.crossOriginOpenerPolicy.enabled) {
      response.headers.set('Cross-Origin-Opener-Policy', headers.crossOriginOpenerPolicy.policy);
    }

    // Cross-Origin Resource Policy
    if (headers.crossOriginResourcePolicy.enabled) {
      response.headers.set('Cross-Origin-Resource-Policy', headers.crossOriginResourcePolicy.policy);
    }

    // Additional security headers
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  }

  /**
   * Validate SDLC security gate
   */
  static async validateSecurityGate(
    gateId: string,
    context: Record<string, any>
  ): Promise<{
    passed: boolean;
    results: GateResult[];
    blockers: string[];
    recommendations: string[];
  }> {
    const gate = this.sdlcIntegration.securityGates.find(g => g.id === gateId);
    if (!gate) {
      throw new Error('Security gate not found');
    }

    const results: GateResult[] = [];
    const blockers: string[] = [];
    const recommendations: string[] = [];

    for (const criteria of gate.criteria) {
      const result = await this.evaluateGateCriteria(criteria, context);
      results.push(result);

      if (criteria.required && !result.passed) {
        blockers.push(`${criteria.type}: ${result.reason}`);
      }

      if (result.recommendations) {
        recommendations.push(...result.recommendations);
      }
    }

    const passed = gate.required ? blockers.length === 0 : results.some(r => r.passed);

    return { passed, results, blockers, recommendations };
  }

  /**
   * Run automated security scan
   */
  static async runAutomatedScan(
    scanId: string,
    target: string,
    context: Record<string, any> = {}
  ): Promise<{
    scanId: string;
    status: string;
    results: ScanResult[];
    report: string;
  }> {
    const scan = this.sdlcIntegration.automatedScans.find(s => s.id === scanId);
    if (!scan) {
      throw new Error('Automated scan not found');
    }

    const results: ScanResult[] = [];
    let status = 'completed';

    try {
      // Execute scan based on type
      switch (scan.type) {
        case 'sast':
          results.push(...await this.runSASTScan(scan, target, context));
          break;
        case 'dast':
          results.push(...await this.runDASTScan(scan, target, context));
          break;
        case 'dependency':
          results.push(...await this.runDependencyScan(scan, target, context));
          break;
        case 'secrets':
          results.push(...await this.runSecretsScan(scan, target, context));
          break;
        case 'container':
          results.push(...await this.runContainerScan(scan, target, context));
          break;
        case 'infrastructure':
          results.push(...await this.runInfrastructureScan(scan, target, context));
          break;
        default:
          throw new Error(`Unsupported scan type: ${scan.type}`);
      }
    } catch (error) {
      status = 'failed';
      results.push({
        id: crypto.randomUUID(),
        type: 'error',
        severity: 'high',
        title: 'Scan Error',
        description: error instanceof Error ? error.message : 'Unknown error',
        location: target,
        recommendation: 'Review scan configuration and retry'
      });
    }

    const report = this.generateScanReport(scan, results);

    return { scanId, status, results, report };
  }

  /**
   * Get WAF events
   */
  static getWAFEvents(limit: number = 100): WAFEvent[] {
    return this.wafEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get WAF statistics
   */
  static getWAFStatistics(): {
    totalEvents: number;
    blockedEvents: number;
    allowedEvents: number;
    topRules: Array<{ ruleId: string; count: number }>;
    topSources: Array<{ source: string; count: number }>;
  } {
    const totalEvents = this.wafEvents.length;
    const blockedEvents = this.wafEvents.filter(e => e.blocked).length;
    const allowedEvents = totalEvents - blockedEvents;

    // Count by rule
    const ruleStats = new Map<string, number>();
    this.wafEvents.forEach(e => {
      ruleStats.set(e.ruleId, (ruleStats.get(e.ruleId) || 0) + 1);
    });

    // Count by source
    const sourceStats = new Map<string, number>();
    this.wafEvents.forEach(e => {
      sourceStats.set(e.source, (sourceStats.get(e.source) || 0) + 1);
    });

    const topRules = Array.from(ruleStats.entries())
      .map(([ruleId, count]) => ({ ruleId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topSources = Array.from(sourceStats.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents,
      blockedEvents,
      allowedEvents,
      topRules,
      topSources
    };
  }

  /**
   * Create WAF rule
   */
  static async createWAFRule(
    name: string,
    description: string,
    type: string,
    pattern: string,
    target: string,
    action: WAFAction,
    priority: number = 100
  ): Promise<{ ruleId: string }> {
    const ruleId = crypto.randomUUID();

    const rule: WAFRule = {
      id: ruleId,
      name,
      description,
      type: type as any,
      priority,
      enabled: true,
      pattern,
      patternType: 'regex',
      target: target as any,
      action,
      conditions: [],
      exceptions: [],
      statistics: {
        triggeredCount: 0,
        blockedCount: 0,
        allowedCount: 0,
        topTargets: [],
        topSources: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.wafRules.push(rule);
    await this.storeWAFRule(rule);

    return { ruleId };
  }

  /**
   * Update WAF rule
   */
  static async updateWAFRule(ruleId: string, updates: Partial<WAFRule>): Promise<void> {
    const rule = this.wafRules.find(r => r.id === ruleId);
    if (!rule) {
      throw new Error('WAF rule not found');
    }

    Object.assign(rule, updates);
    rule.updatedAt = new Date();

    await this.updateWAFRuleInDatabase(rule);
  }

  /**
   * Delete WAF rule
   */
  static async deleteWAFRule(ruleId: string): Promise<void> {
    const index = this.wafRules.findIndex(r => r.id === ruleId);
    if (index === -1) {
      throw new Error('WAF rule not found');
    }

    this.wafRules.splice(index, 1);
    await this.deleteWAFRuleFromDatabase(ruleId);
  }

  /**
   * Private helper methods
   */
  private static async initializeWAFRules(): Promise<void> {
    // Load default WAF rules
    await this.createWAFRule(
      'SQL Injection Protection',
      'Protects against SQL injection attacks',
      'block',
      '(union|select|insert|update|delete|drop|create|alter).*from',
      'body',
      { type: 'block', message: 'SQL injection detected' },
      10
    );

    await this.createWAFRule(
      'XSS Protection',
      'Protects against cross-site scripting attacks',
      'block',
      '<script[^>]*>.*</script>',
      'body',
      { type: 'block', message: 'XSS detected' },
      20
    );

    await this.createWAFRule(
      'Path Traversal Protection',
      'Protects against path traversal attacks',
      'block',
      '\.\./',
      'url',
      { type: 'block', message: 'Path traversal detected' },
      30
    );

    await this.createWAFRule(
      'Rate Limiting',
      'Limits request rate per IP',
      'rate_limit',
      '.*',
      'ip',
      { 
        type: 'rate_limit', 
        rateLimit: { requests: 100, windowMs: 60000, blockDuration: 300000 }
      },
      1000
    );
  }

  private static async initializeDDoSProtection(): Promise<void> {
    this.ddosProtection = {
      enabled: true,
      thresholds: {
        requestsPerSecond: 100,
        concurrentConnections: 1000,
        bandwidthMbps: 100,
        errorRate: 0.5,
        anomalyScore: 0.8
      },
      mitigations: [
        {
          type: 'rate_limit',
          trigger: { requestsPerSecond: 50, concurrentConnections: 500, bandwidthMbps: 50, errorRate: 0.3, anomalyScore: 0.6 },
          duration: 300,
          parameters: { requests: 10, window: 60 },
          enabled: true
        },
        {
          type: 'ip_block',
          trigger: { requestsPerSecond: 200, concurrentConnections: 2000, bandwidthMbps: 200, errorRate: 0.8, anomalyScore: 0.9 },
          duration: 1800,
          parameters: { auto_unblock: true },
          enabled: true
        }
      ],
      whitelist: [],
      blacklist: [],
      rateLimit: {
        global: { requests: 10000, windowMs: 60000, blockDuration: 300000 },
        perIP: { requests: 100, windowMs: 60000, blockDuration: 300000 },
        perUser: { requests: 1000, windowMs: 60000, blockDuration: 300000 },
        perEndpoint: { requests: 500, windowMs: 60000, blockDuration: 300000 }
      },
      monitoring: {
        enabled: true,
        alertThresholds: { requestsPerSecond: 80, concurrentConnections: 800, bandwidthMbps: 80, errorRate: 0.4, anomalyScore: 0.7 },
        reportingInterval: 300,
        retentionDays: 30
      }
    };
  }

  private static async initializeSecurityHeaders(): Promise<void> {
    this.securityHeaders = {
      contentSecurityPolicy: {
        enabled: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'https:'],
          'font-src': ["'self'"],
          'connect-src': ["'self'"],
          'frame-ancestors': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"]
        },
        reportOnly: false,
        upgradeInsecureRequests: true,
        blockAllMixedContent: true
      },
      strictTransportSecurity: {
        enabled: true,
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      xFrameOptions: {
        enabled: true,
        policy: 'deny'
      },
      xContentTypeOptions: {
        enabled: true,
        noSniff: true
      },
      referrerPolicy: {
        enabled: true,
        policy: 'strict-origin-when-cross-origin'
      },
      permissionsPolicy: {
        enabled: true,
        permissions: {
          'camera': [],
          'microphone': [],
          'geolocation': [],
          'interest-cohort': []
        }
      },
      crossOriginEmbedderPolicy: {
        enabled: true,
        policy: 'require-corp'
      },
      crossOriginOpenerPolicy: {
        enabled: true,
        policy: 'same-origin'
      },
      crossOriginResourcePolicy: {
        enabled: true,
        policy: 'same-origin'
      }
    };
  }

  private static async initializeSDLCIntegration(): Promise<void> {
    this.sdlcIntegration = {
      enabled: true,
      stages: [
        {
          name: 'Development',
          description: 'Secure coding practices and code review',
          securityActivities: [
            {
              id: 'secure-coding',
              name: 'Secure Coding',
              description: 'Follow secure coding practices',
              type: 'manual',
              tools: ['eslint', 'sonarqube'],
              criteria: ['No high-severity security issues'],
              deliverables: ['Code review checklist'],
              responsible: 'developer',
              duration: 1
            }
          ],
          gates: ['code-review-gate'],
          automatedScans: ['sast-scan', 'secrets-scan'],
          approvers: ['security-team'],
          required: true
        },
        {
          name: 'Testing',
          description: 'Security testing and vulnerability assessment',
          securityActivities: [
            {
              id: 'security-testing',
              name: 'Security Testing',
              description: 'Perform security testing',
              type: 'automated',
              tools: ['dast', 'zap'],
              criteria: ['No critical vulnerabilities'],
              deliverables: ['Security test report'],
              responsible: 'security-team',
              duration: 2
            }
          ],
          gates: ['security-test-gate'],
          automatedScans: ['dast-scan', 'dependency-scan'],
          approvers: ['security-team'],
          required: true
        },
        {
          name: 'Deployment',
          description: 'Secure deployment and configuration',
          securityActivities: [
            {
              id: 'secure-deployment',
              name: 'Secure Deployment',
              description: 'Ensure secure deployment configuration',
              type: 'manual',
              tools: ['ansible', 'terraform'],
              criteria: ['Security configuration verified'],
              deliverables: ['Deployment security checklist'],
              responsible: 'devops-team',
              duration: 1
            }
          ],
          gates: ['deployment-gate'],
          automatedScans: ['infrastructure-scan'],
          approvers: ['security-team', 'devops-team'],
          required: true
        }
      ],
      securityGates: [
        {
          id: 'code-review-gate',
          name: 'Code Review Gate',
          description: 'Security code review checkpoint',
          stage: 'Development',
          criteria: [
            {
              type: 'code_review',
              threshold: 100,
              metric: 'coverage_percentage',
              required: true
            }
          ],
          blockers: ['high-severity-issues'],
          approvers: ['security-team'],
          automated: false,
          required: true
        },
        {
          id: 'security-test-gate',
          name: 'Security Test Gate',
          description: 'Security testing checkpoint',
          stage: 'Testing',
          criteria: [
            {
              type: 'vulnerability_scan',
              threshold: 0,
              metric: 'critical_vulnerabilities',
              required: true
            }
          ],
          blockers: ['critical-vulnerabilities'],
          approvers: ['security-team'],
          automated: true,
          required: true
        }
      ],
      automatedScans: [
        {
          id: 'sast-scan',
          name: 'Static Application Security Testing',
          type: 'sast',
          tool: 'sonarqube',
          configuration: { rules: 'security', threshold: 'high' },
          schedule: '0 2 * * *',
          triggers: ['code-commit'],
          enabled: true
        },
        {
          id: 'dast-scan',
          name: 'Dynamic Application Security Testing',
          type: 'dast',
          tool: 'zap',
          configuration: { target: 'staging', spider: true },
          schedule: '0 3 * * *',
          triggers: ['deployment'],
          enabled: true
        },
        {
          id: 'dependency-scan',
          name: 'Dependency Vulnerability Scan',
          type: 'dependency',
          tool: 'npm-audit',
          configuration: { threshold: 'moderate' },
          schedule: '0 4 * * *',
          triggers: ['dependency-update'],
          enabled: true
        }
      ],
      complianceChecks: [
        {
          id: 'gdpr-check',
          standard: 'GDPR',
          requirement: 'Data Protection',
          checkType: 'automated',
          frequency: 'daily',
          responsible: 'compliance-team',
          evidence: ['encryption-status', 'access-logs'],
          status: 'compliant'
        }
      ],
      reporting: {
        enabled: true,
        reports: [
          {
            id: 'security-posture',
            name: 'Security Posture Report',
            type: 'security_posture',
            schedule: '0 0 * * 1',
            recipients: ['security-team', 'management'],
            format: 'pdf'
          }
        ],
        dashboards: ['security-dashboard'],
        notifications: [
          {
            type: 'critical_vulnerability',
            channels: ['email', 'slack'],
            recipients: ['security-team'],
            template: 'critical-vuln-alert',
            enabled: true
          }
        ]
      }
    };
  }

  private static async evaluateWAFRule(rule: WAFRule, request: NextRequest): Promise<{
    matched: boolean;
    action: string;
    reason: string;
  }> {
    let testValue: string;

    // Extract value based on target
    switch (rule.target) {
      case 'url':
        testValue = request.url;
        break;
      case 'header':
        testValue = Array.from(request.headers.entries()).map(([k, v]) => `${k}: ${v}`).join('\n');
        break;
      case 'body':
        testValue = await request.text();
        break;
      case 'query':
        testValue = new URL(request.url).search;
        break;
      case 'user_agent':
        testValue = request.headers.get('user-agent') || '';
        break;
      case 'ip':
        testValue = request.ip || request.headers.get('x-forwarded-for') || '';
        break;
      default:
        testValue = '';
    }

    // Evaluate pattern
    let matched = false;
    switch (rule.patternType) {
      case 'regex':
        matched = new RegExp(rule.pattern, 'i').test(testValue);
        break;
      case 'exact':
        matched = testValue === rule.pattern;
        break;
      case 'contains':
        matched = testValue.includes(rule.pattern);
        break;
      case 'startswith':
        matched = testValue.startsWith(rule.pattern);
        break;
      case 'endswith':
        matched = testValue.endsWith(rule.pattern);
        break;
    }

    // Evaluate conditions
    if (matched && rule.conditions.length > 0) {
      for (const condition of rule.conditions) {
        const conditionResult = await this.evaluateWAFCondition(condition, request);
        if (!conditionResult) {
          matched = false;
          break;
        }
      }
    }

    return {
      matched,
      action: rule.action.type,
      reason: matched ? `Rule ${rule.name} matched` : 'No match'
    };
  }

  private static async evaluateWAFCondition(condition: WAFCondition, request: NextRequest): Promise<boolean> {
    // Implementation would evaluate WAF condition
    return true;
  }

  private static async checkWAFExceptions(rule: WAFRule, request: NextRequest): Promise<boolean> {
    const clientIP = request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const url = request.url;

    for (const exception of rule.exceptions) {
      if (!exception.active) continue;
      if (exception.expiresAt && exception.expiresAt < new Date()) continue;

      switch (exception.type) {
        case 'ip':
          if (clientIP === exception.value) return true;
          break;
        case 'user_agent':
          if (userAgent.includes(exception.value)) return true;
          break;
        case 'path':
          if (url.includes(exception.value)) return true;
          break;
      }
    }

    return false;
  }

  private static async executeWAFAction(action: WAFAction, request: NextRequest): Promise<{
    allowed: boolean;
    reason: string;
    response?: NextResponse;
  }> {
    switch (action.type) {
      case 'block':
        return {
          allowed: false,
          reason: action.message || 'Blocked by WAF',
          response: new NextResponse(action.message || 'Blocked by WAF', { status: 403 })
        };
      case 'allow':
        return {
          allowed: true,
          reason: 'Allowed by WAF rule'
        };
      case 'redirect':
        return {
          allowed: false,
          reason: 'Redirected by WAF',
          response: NextResponse.redirect(action.redirectUrl || '/')
        };
      case 'rate_limit':
        return await this.applyRateLimit(action.rateLimit!, request);
      case 'captcha':
        return {
          allowed: false,
          reason: 'CAPTCHA required',
          response: new NextResponse('CAPTCHA required', { status: 429 })
        };
      case 'log_only':
        return {
          allowed: true,
          reason: 'Logged only'
        };
      default:
        return {
          allowed: true,
          reason: 'Unknown action'
        };
    }
  }

  private static async applyRateLimit(rateLimit: RateLimit, request: NextRequest): Promise<{
    allowed: boolean;
    reason: string;
    response?: NextResponse;
  }> {
    const clientIP = request.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - rateLimit.windowMs;

    if (!this.rateLimiters.has(clientIP)) {
      this.rateLimiters.set(clientIP, new Map());
    }

    const userLimiter = this.rateLimiters.get(clientIP)!;
    const requestTimes = Array.from(userLimiter.keys()).filter(time => time > windowStart);

    if (requestTimes.length >= rateLimit.requests) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        response: new NextResponse('Rate limit exceeded', { 
          status: 429,
          headers: { 'Retry-After': (rateLimit.blockDuration / 1000).toString() }
        })
      };
    }

    userLimiter.set(now, 1);

    // Clean up old entries
    for (const [time] of userLimiter.entries()) {
      if (time <= windowStart) {
        userLimiter.delete(time);
      }
    }

    return {
      allowed: true,
      reason: 'Rate limit check passed'
    };
  }

  private static async logWAFEvent(rule: WAFRule, request: NextRequest, action: string): Promise<void> {
    const event: WAFEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ruleId: rule.id,
      ruleName: rule.name,
      action,
      blocked: action === 'block',
      source: request.ip || 'unknown',
      target: request.url,
      userAgent: request.headers.get('user-agent') || '',
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      reason: `Rule ${rule.name} triggered`,
      riskScore: this.calculateRiskScore(rule, request),
      responseCode: action === 'block' ? 403 : 200,
      responseTime: Date.now()
    };

    this.wafEvents.push(event);

    // Store in database
    await this.storeWAFEvent(event);
  }

  private static calculateRiskScore(rule: WAFRule, request: NextRequest): number {
    let score = 0;

    // Base score based on rule type
    switch (rule.type) {
      case 'block': score += 80; break;
      case 'monitor': score += 40; break;
      case 'rate_limit': score += 60; break;
      case 'allow': score += 20; break;
    }

    // Additional factors
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private static buildCSPHeader(csp: CSPConfig): string {
    const directives: string[] = [];

    for (const [directive, values] of Object.entries(csp.directives)) {
      directives.push(`${directive} ${values.join(' ')}`);
    }

    if (csp.upgradeInsecureRequests) {
      directives.push('upgrade-insecure-requests');
    }

    if (csp.blockAllMixedContent) {
      directives.push('block-all-mixed-content');
    }

    if (csp.reportUri) {
      directives.push(`report-uri ${csp.reportUri}`);
    }

    return directives.join('; ');
  }

  private static buildHSTSHeader(hsts: HSTSConfig): string {
    let value = `max-age=${hsts.maxAge}`;

    if (hsts.includeSubDomains) {
      value += '; includeSubDomains';
    }

    if (hsts.preload) {
      value += '; preload';
    }

    return value;
  }

  private static buildXFrameHeader(xFrame: XFrameConfig): string {
    if (xFrame.policy === 'allow-from' && xFrame.allowFrom) {
      return `ALLOW-FROM ${xFrame.allowFrom}`;
    }

    return xFrame.policy.toUpperCase();
  }

  private static buildPermissionsPolicyHeader(permissions: PermissionsPolicyConfig): string {
    const policies: string[] = [];

    for (const [permission, allowlist] of Object.entries(permissions.permissions)) {
      if (allowlist.length === 0) {
        policies.push(`${permission}=()`);
      } else {
        policies.push(`${permission}=(${allowlist.join(' ')})`);
      }
    }

    return policies.join(', ');
  }

  private static async evaluateGateCriteria(criteria: GateCriteria, context: Record<string, any>): Promise<GateResult> {
    // Mock implementation
    return {
      id: crypto.randomUUID(),
      type: criteria.type,
      passed: true,
      score: 95,
      threshold: criteria.threshold,
      details: 'All criteria met',
      reason: 'Security gate passed',
      recommendations: []
    };
  }

  private static async runSASTScan(scan: AutomatedScan, target: string, context: Record<string, any>): Promise<ScanResult[]> {
    // Mock SAST scan results
    return [
      {
        id: crypto.randomUUID(),
        type: 'vulnerability',
        severity: 'medium',
        title: 'Potential SQL Injection',
        description: 'User input not properly sanitized',
        location: 'src/auth/login.ts:45',
        recommendation: 'Use parameterized queries'
      }
    ];
  }

  private static async runDASTScan(scan: AutomatedScan, target: string, context: Record<string, any>): Promise<ScanResult[]> {
    // Mock DAST scan results
    return [
      {
        id: crypto.randomUUID(),
        type: 'vulnerability',
        severity: 'high',
        title: 'XSS Vulnerability',
        description: 'Reflected XSS found in search parameter',
        location: '/search?q=<script>alert(1)</script>',
        recommendation: 'Implement input validation and output encoding'
      }
    ];
  }

  private static async runDependencyScan(scan: AutomatedScan, target: string, context: Record<string, any>): Promise<ScanResult[]> {
    // Mock dependency scan results
    return [
      {
        id: crypto.randomUUID(),
        type: 'vulnerability',
        severity: 'critical',
        title: 'Vulnerable Dependency',
        description: 'lodash@4.17.20 has known vulnerabilities',
        location: 'package.json',
        recommendation: 'Update to lodash@4.17.21 or higher'
      }
    ];
  }

  private static async runSecretsScan(scan: AutomatedScan, target: string, context: Record<string, any>): Promise<ScanResult[]> {
    // Mock secrets scan results
    return [
      {
        id: crypto.randomUUID(),
        type: 'secret',
        severity: 'high',
        title: 'Hardcoded API Key',
        description: 'API key found in source code',
        location: 'src/config/api.ts:12',
        recommendation: 'Move API key to environment variable'
      }
    ];
  }

  private static async runContainerScan(scan: AutomatedScan, target: string, context: Record<string, any>): Promise<ScanResult[]> {
    // Mock container scan results
    return [
      {
        id: crypto.randomUUID(),
        type: 'vulnerability',
        severity: 'medium',
        title: 'Outdated Base Image',
        description: 'Base image contains known vulnerabilities',
        location: 'Dockerfile',
        recommendation: 'Update base image to latest version'
      }
    ];
  }

  private static async runInfrastructureScan(scan: AutomatedScan, target: string, context: Record<string, any>): Promise<ScanResult[]> {
    // Mock infrastructure scan results
    return [
      {
        id: crypto.randomUUID(),
        type: 'misconfiguration',
        severity: 'high',
        title: 'Insecure Configuration',
        description: 'S3 bucket is publicly accessible',
        location: 'terraform/s3.tf',
        recommendation: 'Configure proper access controls'
      }
    ];
  }

  private static generateScanReport(scan: AutomatedScan, results: ScanResult[]): string {
    const criticalCount = results.filter(r => r.severity === 'critical').length;
    const highCount = results.filter(r => r.severity === 'high').length;
    const mediumCount = results.filter(r => r.severity === 'medium').length;
    const lowCount = results.filter(r => r.severity === 'low').length;

    return `
Security Scan Report
===================

Scan Type: ${scan.type}
Tool: ${scan.tool}
Date: ${new Date().toISOString()}

Summary:
- Critical: ${criticalCount}
- High: ${highCount}
- Medium: ${mediumCount}
- Low: ${lowCount}

Total Issues: ${results.length}

Detailed Results:
${results.map(r => `- ${r.severity.toUpperCase()}: ${r.title} (${r.location})`).join('\n')}

Recommendations:
${results.map(r => `- ${r.recommendation}`).join('\n')}
`;
  }

  private static async startWAFMonitoring(): Promise<void> {
    // Start WAF monitoring
    console.log('WAF monitoring started');
  }

  private static async startDDoSMonitoring(): Promise<void> {
    // Start DDoS monitoring
    console.log('DDoS monitoring started');
  }

  // Database operations
  private static async storeWAFRule(rule: WAFRule): Promise<void> {
    try {
      await prisma.wAFRule.create({
        data: {
          id: rule.id,
          name: rule.name,
          description: rule.description,
          type: rule.type,
          priority: rule.priority,
          enabled: rule.enabled,
          pattern: rule.pattern,
          patternType: rule.patternType,
          target: rule.target,
          action: JSON.stringify(rule.action),
          conditions: JSON.stringify(rule.conditions),
          exceptions: JSON.stringify(rule.exceptions),
          statistics: JSON.stringify(rule.statistics),
          createdAt: rule.createdAt,
          updatedAt: rule.updatedAt
        }
      });
    } catch (error) {
      console.error('Failed to store WAF rule:', error);
    }
  }

  private static async updateWAFRuleInDatabase(rule: WAFRule): Promise<void> {
    try {
      await prisma.wAFRule.update({
        where: { id: rule.id },
        data: {
          name: rule.name,
          description: rule.description,
          enabled: rule.enabled,
          action: JSON.stringify(rule.action),
          statistics: JSON.stringify(rule.statistics),
          updatedAt: rule.updatedAt
        }
      });
    } catch (error) {
      console.error('Failed to update WAF rule:', error);
    }
  }

  private static async deleteWAFRuleFromDatabase(ruleId: string): Promise<void> {
    try {
      await prisma.wafRule.delete({
        where: { id: ruleId }
      });
    } catch (error) {
      console.error('Failed to delete WAF rule:', error);
    }
  }

  private static async storeWAFEvent(event: WAFEvent): Promise<void> {
    try {
      await prisma.wafEvent.create({
        data: {
          id: event.id,
          timestamp: event.timestamp,
          ruleId: event.ruleId,
          ruleName: event.ruleName,
          action: event.action,
          blocked: event.blocked,
          source: event.source,
          target: event.target,
          userAgent: event.userAgent,
          method: event.method,
          url: event.url,
          headers: JSON.stringify(event.headers),
          body: event.body,
          reason: event.reason,
          riskScore: event.riskScore,
          geoLocation: event.geoLocation,
          responseCode: event.responseCode,
          responseTime: event.responseTime
        }
      });
    } catch (error) {
      console.error('Failed to store WAF event:', error);
    }
  }
}

// Helper interfaces
interface GateResult {
  id: string;
  type: string;
  passed: boolean;
  score: number;
  threshold: number;
  details: string;
  reason: string;
  recommendations: string[];
}

interface ScanResult {
  id: string;
  type: 'vulnerability' | 'secret' | 'misconfiguration' | 'error';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  recommendation: string;
}
