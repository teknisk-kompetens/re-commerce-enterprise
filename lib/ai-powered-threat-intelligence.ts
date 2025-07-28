
/**
 * AI-POWERED THREAT INTELLIGENCE
 * Machine learning-based threat detection and prediction
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface ThreatIntelligenceData {
  indicators: ThreatIndicator[];
  campaigns: APTCampaign[];
  predictions: ThreatPrediction[];
  riskAssessment: RiskAssessment;
  recommendations: SecurityRecommendation[];
}

export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'user_agent';
  value: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  tags: string[];
  description?: string;
  source?: string;
  firstSeen: Date;
  lastSeen: Date;
  active: boolean;
}

export interface APTCampaign {
  id: string;
  name: string;
  description: string;
  threatActor: string;
  tactics: string[];
  techniques: string[];
  indicators: any;
  victims: any;
  attribution?: string;
  confidence: number;
  status: 'active' | 'dormant' | 'defeated';
  aiPrediction: any;
}

export interface ThreatPrediction {
  id: string;
  type: 'malware' | 'phishing' | 'apt' | 'ddos' | 'data_breach';
  probability: number;
  timeframe: string; // "24h", "7d", "30d"
  targetSectors: string[];
  indicators: string[];
  mitigation: string[];
  confidence: number;
  aiModel: string;
  generatedAt: Date;
}

export interface RiskAssessment {
  overallRisk: number;
  sectors: { [key: string]: number };
  threats: { [key: string]: number };
  trends: ThreatTrend[];
  recommendations: string[];
}

export interface ThreatTrend {
  type: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number;
  timeframe: string;
  confidence: number;
}

export interface SecurityRecommendation {
  id: string;
  type: 'preventive' | 'detective' | 'corrective';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementation: string[];
  estimatedEffort: string;
  expectedImpact: number;
  aiGenerated: boolean;
}

export class AIPoweredThreatIntelligence {
  private static readonly API_ENDPOINT = 'https://apps.abacus.ai/v1/chat/completions';
  private static readonly MODEL = 'gpt-4.1-mini';

  /**
   * Analyze threat intelligence using AI
   */
  static async analyzeThreatIntelligence(
    context: string,
    indicators: any[],
    timeframe: string = '24h'
  ): Promise<ThreatIntelligenceData> {
    try {
      // Fetch recent threat events
      const recentEvents = await prisma.threatEvent.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - this.getTimeframeMs(timeframe)),
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });

      // Fetch active APT campaigns
      const aptCampaigns = await prisma.aPTCampaign.findMany({
        where: { status: 'active' },
        orderBy: { lastSeen: 'desc' },
        take: 20,
      });

      // Get AI analysis
      const aiAnalysis = await this.getAIThreatAnalysis(context, recentEvents, aptCampaigns, indicators);

      // Process and store results
      const threatIntelligence = await this.processThreatIntelligence(aiAnalysis, timeframe);

      return threatIntelligence;
    } catch (error) {
      console.error('Error analyzing threat intelligence:', error);
      return this.getDefaultThreatIntelligence();
    }
  }

  /**
   * Get AI threat analysis
   */
  private static async getAIThreatAnalysis(
    context: string,
    events: any[],
    campaigns: any[],
    indicators: any[]
  ): Promise<any> {
    try {
      const prompt = this.buildThreatAnalysisPrompt(context, events, campaigns, indicators);

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
              content: 'You are an expert cybersecurity threat intelligence analyst with deep knowledge of APT groups, malware families, and emerging threats. Provide comprehensive threat analysis with actionable recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 4000,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error getting AI threat analysis:', error);
      return this.getDefaultAIAnalysis();
    }
  }

  /**
   * Build threat analysis prompt
   */
  private static buildThreatAnalysisPrompt(
    context: string,
    events: any[],
    campaigns: any[],
    indicators: any[]
  ): string {
    return `
Analyze the following threat intelligence data and provide comprehensive analysis:

Context: ${context}

Recent Threat Events (${events.length} events):
${events.slice(0, 10).map(event => `
- Event: ${event.type} | Severity: ${event.severity} | Source: ${event.source} | Time: ${event.timestamp}
  Description: ${event.description}
  AI Analysis: ${JSON.stringify(event.aiAnalysis)}
`).join('\n')}

Active APT Campaigns (${campaigns.length} campaigns):
${campaigns.slice(0, 5).map(campaign => `
- Campaign: ${campaign.name} | Actor: ${campaign.threatActor} | Status: ${campaign.status}
  Tactics: ${campaign.tactics.join(', ')}
  Techniques: ${campaign.techniques.join(', ')}
  Confidence: ${campaign.confidence}
`).join('\n')}

Current Indicators:
${indicators.slice(0, 20).map(indicator => `
- Type: ${indicator.type} | Value: ${indicator.value} | Severity: ${indicator.severity}
`).join('\n')}

Please provide a comprehensive analysis in the following JSON format:
{
  "riskAssessment": {
    "overallRisk": 0-100,
    "sectors": {
      "financial": 0-100,
      "healthcare": 0-100,
      "government": 0-100,
      "technology": 0-100,
      "manufacturing": 0-100
    },
    "threats": {
      "malware": 0-100,
      "phishing": 0-100,
      "apt": 0-100,
      "ddos": 0-100,
      "data_breach": 0-100
    },
    "trends": [
      {
        "type": "threat_type",
        "direction": "increasing|decreasing|stable",
        "magnitude": 0-100,
        "timeframe": "24h|7d|30d",
        "confidence": 0-1
      }
    ],
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "predictions": [
    {
      "type": "malware|phishing|apt|ddos|data_breach",
      "probability": 0-100,
      "timeframe": "24h|7d|30d",
      "targetSectors": ["sector1", "sector2"],
      "indicators": ["indicator1", "indicator2"],
      "mitigation": ["mitigation1", "mitigation2"],
      "confidence": 0-1
    }
  ],
  "recommendations": [
    {
      "type": "preventive|detective|corrective",
      "priority": "low|medium|high|critical",
      "title": "Recommendation Title",
      "description": "Detailed description",
      "implementation": ["step1", "step2"],
      "estimatedEffort": "low|medium|high",
      "expectedImpact": 0-100
    }
  ],
  "emergingThreats": [
    {
      "name": "Threat Name",
      "type": "malware|phishing|apt|ddos|other",
      "severity": "low|medium|high|critical",
      "description": "Threat description",
      "indicators": ["indicator1", "indicator2"],
      "mitigation": ["mitigation1", "mitigation2"],
      "confidence": 0-1
    }
  ]
}
`;
  }

  /**
   * Process threat intelligence data
   */
  private static async processThreatIntelligence(
    aiAnalysis: any,
    timeframe: string
  ): Promise<ThreatIntelligenceData> {
    try {
      // Store predictions
      const predictions: ThreatPrediction[] = [];
      for (const prediction of aiAnalysis.predictions || []) {
        predictions.push({
          id: crypto.randomUUID(),
          type: prediction.type,
          probability: prediction.probability,
          timeframe: prediction.timeframe,
          targetSectors: prediction.targetSectors || [],
          indicators: prediction.indicators || [],
          mitigation: prediction.mitigation || [],
          confidence: prediction.confidence,
          aiModel: this.MODEL,
          generatedAt: new Date(),
        });
      }

      // Store recommendations
      const recommendations: SecurityRecommendation[] = [];
      for (const rec of aiAnalysis.recommendations || []) {
        recommendations.push({
          id: crypto.randomUUID(),
          type: rec.type,
          priority: rec.priority,
          title: rec.title,
          description: rec.description,
          implementation: rec.implementation || [],
          estimatedEffort: rec.estimatedEffort,
          expectedImpact: rec.expectedImpact,
          aiGenerated: true,
        });
      }

      // Get current indicators
      const indicatorsRaw = await prisma.threatIndicator.findMany({
        where: { active: true },
        orderBy: { lastSeen: 'desc' },
        take: 100,
      });

      // Get current campaigns
      const campaignsRaw = await prisma.aPTCampaign.findMany({
        where: { status: 'active' },
        orderBy: { lastSeen: 'desc' },
        take: 20,
      });

      // Transform database results to match interface types (null -> undefined)
      const indicators = indicatorsRaw.map(indicator => ({
        ...indicator,
        description: indicator.description || undefined,
        source: indicator.source || undefined,
      }));

      const campaigns = campaignsRaw.map(campaign => ({
        ...campaign,
        attribution: campaign.attribution || undefined,
        status: campaign.status as 'active' | 'dormant' | 'defeated',
      }));

      return {
        indicators,
        campaigns,
        predictions,
        riskAssessment: aiAnalysis.riskAssessment || this.getDefaultRiskAssessment(),
        recommendations,
      };
    } catch (error) {
      console.error('Error processing threat intelligence:', error);
      return this.getDefaultThreatIntelligence();
    }
  }

  /**
   * Hunt for Advanced Persistent Threats
   */
  static async huntAPT(
    huntingQuery: string,
    timeframe: string = '30d'
  ): Promise<{
    campaigns: APTCampaign[];
    indicators: ThreatIndicator[];
    huntingResults: any[];
    aiAnalysis: any;
  }> {
    try {
      // Get AI-powered hunting analysis
      const aiAnalysis = await this.getAIHuntingAnalysis(huntingQuery, timeframe);

      // Execute hunting queries
      const huntingResults = await this.executeHuntingQueries(aiAnalysis.huntingQueries || []);

      // Update APT campaigns based on findings
      const campaigns = await this.updateAPTCampaigns(huntingResults, aiAnalysis);

      // Extract new indicators
      const indicators = await this.extractThreatIndicators(huntingResults, aiAnalysis);

      return {
        campaigns,
        indicators,
        huntingResults,
        aiAnalysis,
      };
    } catch (error) {
      console.error('Error hunting APT:', error);
      return {
        campaigns: [],
        indicators: [],
        huntingResults: [],
        aiAnalysis: {},
      };
    }
  }

  /**
   * Get AI hunting analysis
   */
  private static async getAIHuntingAnalysis(query: string, timeframe: string): Promise<any> {
    try {
      const prompt = `
Analyze the following threat hunting query and provide comprehensive hunting guidance:

Query: ${query}
Timeframe: ${timeframe}

Please provide hunting analysis in JSON format:
{
  "huntingQueries": [
    {
      "name": "Query Name",
      "description": "Query description",
      "query": "Actual query/search terms",
      "expectedResults": "What to look for",
      "severity": "low|medium|high|critical"
    }
  ],
  "aptTechniques": [
    {
      "technique": "MITRE ATT&CK technique",
      "description": "How it applies",
      "indicators": ["indicator1", "indicator2"],
      "huntingApproach": "How to hunt for it"
    }
  ],
  "recommendations": [
    {
      "action": "Recommended action",
      "priority": "low|medium|high|critical",
      "rationale": "Why this is important"
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
              content: 'You are an expert threat hunter with deep knowledge of APT tactics, techniques, and procedures. Provide detailed hunting guidance based on MITRE ATT&CK framework.'
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
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error getting AI hunting analysis:', error);
      return { huntingQueries: [], aptTechniques: [], recommendations: [] };
    }
  }

  /**
   * Execute hunting queries (simplified simulation)
   */
  private static async executeHuntingQueries(queries: any[]): Promise<any[]> {
    const results = [];
    
    for (const query of queries) {
      // Simulate hunting results
      const result = {
        queryName: query.name,
        query: query.query,
        matches: Math.floor(Math.random() * 10),
        severity: query.severity,
        findings: [
          {
            timestamp: new Date(),
            source: 'system_logs',
            indicator: 'suspicious_activity',
            confidence: Math.random(),
            description: `Potential ${query.severity} threat detected`,
          }
        ],
        recommendations: query.recommendations || [],
      };
      
      results.push(result);
    }
    
    return results;
  }

  /**
   * Update APT campaigns based on hunting results
   */
  private static async updateAPTCampaigns(huntingResults: any[], aiAnalysis: any): Promise<APTCampaign[]> {
    const campaigns: APTCampaign[] = [];
    
    // Get existing campaigns
    const existingCampaigns = await prisma.aPTCampaign.findMany({
      where: { status: 'active' },
    });

    // Update or create campaigns based on findings
    for (const campaign of existingCampaigns) {
      campaigns.push({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        threatActor: campaign.threatActor,
        tactics: campaign.tactics,
        techniques: campaign.techniques,
        indicators: campaign.indicators as string[],
        victims: campaign.victims as string[],
        attribution: campaign.attribution || undefined,
        confidence: campaign.confidence,
        status: campaign.status as 'active' | 'dormant' | 'defeated',
        aiPrediction: campaign.aiPrediction,
      });
    }

    return campaigns;
  }

  /**
   * Extract threat indicators from hunting results
   */
  private static async extractThreatIndicators(huntingResults: any[], aiAnalysis: any): Promise<ThreatIndicator[]> {
    const indicators: ThreatIndicator[] = [];
    
    for (const result of huntingResults) {
      for (const finding of result.findings) {
        indicators.push({
          id: crypto.randomUUID(),
          type: 'hash', // Simplified
          value: finding.indicator,
          severity: result.severity,
          confidence: finding.confidence,
          tags: ['ai_generated', 'threat_hunting'],
          description: finding.description,
          source: 'threat_hunting',
          firstSeen: new Date(),
          lastSeen: new Date(),
          active: true,
        });
      }
    }
    
    return indicators;
  }

  /**
   * Get default threat intelligence
   */
  private static getDefaultThreatIntelligence(): ThreatIntelligenceData {
    return {
      indicators: [],
      campaigns: [],
      predictions: [],
      riskAssessment: this.getDefaultRiskAssessment(),
      recommendations: [],
    };
  }

  /**
   * Get default risk assessment
   */
  private static getDefaultRiskAssessment(): RiskAssessment {
    return {
      overallRisk: 50,
      sectors: {
        financial: 40,
        healthcare: 35,
        government: 60,
        technology: 55,
        manufacturing: 30,
      },
      threats: {
        malware: 45,
        phishing: 60,
        apt: 30,
        ddos: 25,
        data_breach: 40,
      },
      trends: [],
      recommendations: ['Maintain current security posture', 'Monitor for emerging threats'],
    };
  }

  /**
   * Get default AI analysis
   */
  private static getDefaultAIAnalysis(): any {
    return {
      riskAssessment: this.getDefaultRiskAssessment(),
      predictions: [],
      recommendations: [],
      emergingThreats: [],
    };
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

  /**
   * Get threat intelligence summary
   */
  static async getThreatIntelligenceSummary(timeframe: string = '24h') {
    try {
      const [events, campaigns, indicators, metrics] = await Promise.all([
        prisma.threatEvent.count({
          where: {
            timestamp: {
              gte: new Date(Date.now() - this.getTimeframeMs(timeframe)),
            },
          },
        }),
        prisma.aPTCampaign.count({
          where: { status: 'active' },
        }),
        prisma.threatIndicator.count({
          where: { active: true },
        }),
        prisma.securityMetric.findMany({
          where: {
            category: 'threats',
            timestamp: {
              gte: new Date(Date.now() - this.getTimeframeMs(timeframe)),
            },
          },
          orderBy: { timestamp: 'desc' },
          take: 10,
        }),
      ]);

      return {
        events,
        campaigns,
        indicators,
        metrics: metrics.length,
        lastUpdated: new Date(),
        riskLevel: this.calculateOverallRiskLevel(events, campaigns, indicators),
      };
    } catch (error) {
      console.error('Error getting threat intelligence summary:', error);
      return {
        events: 0,
        campaigns: 0,
        indicators: 0,
        metrics: 0,
        lastUpdated: new Date(),
        riskLevel: 'unknown',
      };
    }
  }

  /**
   * Calculate overall risk level
   */
  private static calculateOverallRiskLevel(events: number, campaigns: number, indicators: number): string {
    const score = events * 0.3 + campaigns * 0.4 + indicators * 0.3;
    
    if (score > 80) return 'critical';
    if (score > 60) return 'high';
    if (score > 40) return 'medium';
    return 'low';
  }
}
