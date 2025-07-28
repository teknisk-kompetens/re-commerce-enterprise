
/**
 * BEHAVIORAL ANALYTICS ENGINE
 * Continuous authentication and behavioral biometrics
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface BehavioralMetrics {
  keystrokeDynamics: {
    dwellTime: number[];
    flightTime: number[];
    typingSpeed: number;
    rhythmPattern: number[];
    pressurePattern: number[];
  };
  mouseDynamics: {
    movementSpeed: number[];
    acceleration: number[];
    clickPattern: number[];
    scrollBehavior: number[];
    pauseDuration: number[];
  };
  touchDynamics: {
    touchPressure: number[];
    touchArea: number[];
    swipeVelocity: number[];
    tapTiming: number[];
    gesturePattern: number[];
  };
  navigationPattern: {
    pageSequence: string[];
    timeOnPage: number[];
    clickSequence: string[];
    scrollDepth: number[];
    interactionRate: number;
  };
  timePattern: {
    activeHours: number[];
    sessionDuration: number[];
    breakPattern: number[];
    workflowTiming: number[];
  };
  devicePattern: {
    screenResolution: string;
    deviceOrientation: string;
    batteryLevel: number;
    networkType: string;
    locationPattern: string[];
  };
}

export interface BehavioralAnalysisResult {
  userId: string;
  riskScore: number;
  confidence: number;
  anomalies: BehavioralAnomaly[];
  recommendations: string[];
  continuousAuthScore: number;
  learningPhase: boolean;
  profileMaturity: number;
}

export interface BehavioralAnomaly {
  type: 'keystroke' | 'mouse' | 'touch' | 'navigation' | 'time' | 'device';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence: number;
  timeline: Date[];
  indicators: string[];
  mitigation: string;
}

export class BehavioralAnalyticsEngine {
  private static readonly LEARNING_THRESHOLD = 50; // Minimum interactions for stable profile
  private static readonly CONFIDENCE_THRESHOLD = 0.8;
  private static readonly ANOMALY_THRESHOLD = 0.3;

  /**
   * Analyze behavioral metrics and update user profile
   */
  static async analyzeBehavior(
    userId: string,
    metrics: BehavioralMetrics,
    sessionId: string
  ): Promise<BehavioralAnalysisResult> {
    try {
      // Get or create behavioral profile
      let profile = await prisma.behavioralProfile.findFirst({
        where: { userId },
      });

      if (!profile) {
        profile = await prisma.behavioralProfile.create({
          data: {
            userId,
            keystrokeDynamics: {},
            mouseDynamics: {},
            touchDynamics: {},
            navigationPattern: {},
            timePattern: {},
            devicePattern: {},
            riskScore: 0,
            confidence: 0,
            learningPhase: true,
          },
        });
      }

      // Update profile with new metrics
      const updatedProfile = await this.updateBehavioralProfile(profile, metrics);
      
      // Detect anomalies
      const anomalies = await this.detectAnomalies(updatedProfile, metrics);
      
      // Calculate risk score
      const riskScore = this.calculateRiskScore(anomalies, updatedProfile);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(anomalies, riskScore);
      
      // Update profile in database
      await prisma.behavioralProfile.update({
        where: { id: profile.id },
        data: {
          keystrokeDynamics: updatedProfile.keystrokeDynamics,
          mouseDynamics: updatedProfile.mouseDynamics,
          touchDynamics: updatedProfile.touchDynamics,
          navigationPattern: updatedProfile.navigationPattern,
          timePattern: updatedProfile.timePattern,
          devicePattern: updatedProfile.devicePattern,
          riskScore,
          confidence: updatedProfile.confidence,
          learningPhase: updatedProfile.learningPhase,
          lastAnalyzed: new Date(),
        },
      });

      // Store anomalies if significant
      if (anomalies.length > 0) {
        await this.storeAnomalies(userId, anomalies, sessionId);
      }

      return {
        userId,
        riskScore,
        confidence: updatedProfile.confidence,
        anomalies,
        recommendations,
        continuousAuthScore: this.calculateContinuousAuthScore(riskScore, updatedProfile.confidence),
        learningPhase: updatedProfile.learningPhase,
        profileMaturity: this.calculateProfileMaturity(updatedProfile),
      };
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      return {
        userId,
        riskScore: 100,
        confidence: 0,
        anomalies: [],
        recommendations: ['System error - manual review required'],
        continuousAuthScore: 0,
        learningPhase: true,
        profileMaturity: 0,
      };
    }
  }

  /**
   * Update behavioral profile with new metrics
   */
  private static async updateBehavioralProfile(
    profile: any,
    metrics: BehavioralMetrics
  ): Promise<any> {
    const weight = 0.1; // Learning rate
    
    // Update keystroke dynamics
    profile.keystrokeDynamics = this.updateMetrics(
      profile.keystrokeDynamics,
      metrics.keystrokeDynamics,
      weight
    );

    // Update mouse dynamics
    profile.mouseDynamics = this.updateMetrics(
      profile.mouseDynamics,
      metrics.mouseDynamics,
      weight
    );

    // Update touch dynamics
    profile.touchDynamics = this.updateMetrics(
      profile.touchDynamics,
      metrics.touchDynamics,
      weight
    );

    // Update navigation pattern
    profile.navigationPattern = this.updateMetrics(
      profile.navigationPattern,
      metrics.navigationPattern,
      weight
    );

    // Update time pattern
    profile.timePattern = this.updateMetrics(
      profile.timePattern,
      metrics.timePattern,
      weight
    );

    // Update device pattern
    profile.devicePattern = this.updateMetrics(
      profile.devicePattern,
      metrics.devicePattern,
      weight
    );

    // Update confidence and learning phase
    profile.confidence = Math.min(1, profile.confidence + 0.02);
    profile.learningPhase = profile.confidence < this.CONFIDENCE_THRESHOLD;

    return profile;
  }

  /**
   * Update metrics using exponential weighted average
   */
  private static updateMetrics(existing: any, newMetrics: any, weight: number): any {
    const updated = { ...existing };
    
    for (const [key, value] of Object.entries(newMetrics)) {
      if (Array.isArray(value)) {
        updated[key] = existing[key] 
          ? existing[key].map((v: number, i: number) => 
              v * (1 - weight) + (value[i] || 0) * weight
            )
          : value;
      } else if (typeof value === 'number') {
        updated[key] = existing[key] 
          ? existing[key] * (1 - weight) + value * weight
          : value;
      } else {
        updated[key] = value;
      }
    }
    
    return updated;
  }

  /**
   * Detect behavioral anomalies
   */
  private static async detectAnomalies(
    profile: any,
    currentMetrics: BehavioralMetrics
  ): Promise<BehavioralAnomaly[]> {
    const anomalies: BehavioralAnomaly[] = [];

    // Check keystroke anomalies
    if (this.isKeystrokeAnomaly(profile.keystrokeDynamics, currentMetrics.keystrokeDynamics)) {
      anomalies.push({
        type: 'keystroke',
        severity: 'medium',
        description: 'Unusual typing pattern detected',
        confidence: 0.75,
        timeline: [new Date()],
        indicators: ['typing_speed_deviation', 'rhythm_change'],
        mitigation: 'Additional authentication required',
      });
    }

    // Check mouse anomalies
    if (this.isMouseAnomaly(profile.mouseDynamics, currentMetrics.mouseDynamics)) {
      anomalies.push({
        type: 'mouse',
        severity: 'low',
        description: 'Unusual mouse movement pattern',
        confidence: 0.65,
        timeline: [new Date()],
        indicators: ['movement_speed_change', 'click_pattern_deviation'],
        mitigation: 'Monitor for additional anomalies',
      });
    }

    // Check navigation anomalies
    if (this.isNavigationAnomaly(profile.navigationPattern, currentMetrics.navigationPattern)) {
      anomalies.push({
        type: 'navigation',
        severity: 'high',
        description: 'Unusual navigation pattern detected',
        confidence: 0.85,
        timeline: [new Date()],
        indicators: ['unusual_page_sequence', 'abnormal_interaction_rate'],
        mitigation: 'Challenge user identity',
      });
    }

    // Check time pattern anomalies
    if (this.isTimeAnomaly(profile.timePattern, currentMetrics.timePattern)) {
      anomalies.push({
        type: 'time',
        severity: 'medium',
        description: 'Unusual activity timing pattern',
        confidence: 0.7,
        timeline: [new Date()],
        indicators: ['off_hours_access', 'unusual_session_duration'],
        mitigation: 'Verify user identity',
      });
    }

    return anomalies;
  }

  /**
   * Check for keystroke anomalies
   */
  private static isKeystrokeAnomaly(baseline: any, current: any): boolean {
    if (!baseline?.typingSpeed || !current?.typingSpeed) return false;
    
    const speedDifference = Math.abs(baseline.typingSpeed - current.typingSpeed);
    const threshold = baseline.typingSpeed * 0.3; // 30% deviation
    
    return speedDifference > threshold;
  }

  /**
   * Check for mouse anomalies
   */
  private static isMouseAnomaly(baseline: any, current: any): boolean {
    if (!baseline?.movementSpeed || !current?.movementSpeed) return false;
    
    const avgBaseline = baseline.movementSpeed.reduce((a: number, b: number) => a + b, 0) / baseline.movementSpeed.length;
    const avgCurrent = current.movementSpeed.reduce((a: number, b: number) => a + b, 0) / current.movementSpeed.length;
    
    return Math.abs(avgBaseline - avgCurrent) > avgBaseline * 0.4; // 40% deviation
  }

  /**
   * Check for navigation anomalies
   */
  private static isNavigationAnomaly(baseline: any, current: any): boolean {
    if (!baseline?.interactionRate || !current?.interactionRate) return false;
    
    return Math.abs(baseline.interactionRate - current.interactionRate) > 0.5;
  }

  /**
   * Check for time pattern anomalies
   */
  private static isTimeAnomaly(baseline: any, current: any): boolean {
    if (!baseline?.activeHours || !current?.activeHours) return false;
    
    const currentHour = new Date().getHours();
    const isTypicalHour = baseline.activeHours.includes(currentHour);
    
    return !isTypicalHour && baseline.activeHours.length > 10; // Only flag if we have enough data
  }

  /**
   * Calculate risk score based on anomalies
   */
  private static calculateRiskScore(anomalies: BehavioralAnomaly[], profile: any): number {
    let riskScore = 0;
    
    anomalies.forEach(anomaly => {
      const severityMultiplier = {
        low: 10,
        medium: 25,
        high: 50,
        critical: 100,
      }[anomaly.severity];
      
      riskScore += severityMultiplier * anomaly.confidence;
    });

    // Adjust for profile maturity
    if (profile.learningPhase) {
      riskScore *= 0.5; // Reduce risk during learning phase
    }

    return Math.min(100, riskScore);
  }

  /**
   * Generate recommendations based on analysis
   */
  private static generateRecommendations(anomalies: BehavioralAnomaly[], riskScore: number): string[] {
    const recommendations: string[] = [];
    
    if (riskScore > 80) {
      recommendations.push('Immediate identity verification required');
      recommendations.push('Consider blocking session until verified');
    } else if (riskScore > 50) {
      recommendations.push('Additional authentication recommended');
      recommendations.push('Monitor user activity closely');
    } else if (riskScore > 20) {
      recommendations.push('Increased monitoring recommended');
    }

    // Specific recommendations for anomaly types
    const anomalyTypes = anomalies.map(a => a.type);
    if (anomalyTypes.includes('keystroke')) {
      recommendations.push('Consider keyboard-based challenges');
    }
    if (anomalyTypes.includes('navigation')) {
      recommendations.push('Monitor page access patterns');
    }
    if (anomalyTypes.includes('time')) {
      recommendations.push('Verify off-hours access authorization');
    }

    return recommendations;
  }

  /**
   * Calculate continuous authentication score
   */
  private static calculateContinuousAuthScore(riskScore: number, confidence: number): number {
    const baseScore = 100 - riskScore;
    const confidenceBonus = confidence * 20;
    
    return Math.max(0, Math.min(100, baseScore + confidenceBonus));
  }

  /**
   * Calculate profile maturity
   */
  private static calculateProfileMaturity(profile: any): number {
    const factors = [
      profile.confidence,
      profile.learningPhase ? 0.5 : 1,
      // Add more maturity factors as needed
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  /**
   * Store anomalies in database
   */
  private static async storeAnomalies(
    userId: string,
    anomalies: BehavioralAnomaly[],
    sessionId: string
  ): Promise<void> {
    try {
      for (const anomaly of anomalies) {
        await prisma.behavioralAnomaly.create({
          data: {
            userId,
            type: anomaly.type,
            severity: anomaly.severity,
            description: anomaly.description,
            confidence: anomaly.confidence,
            status: anomaly.severity === 'high' || anomaly.severity === 'critical' ? 'investigating' : 'active',
            metadata: {
              indicators: anomaly.indicators,
              mitigation: anomaly.mitigation,
              investigation: anomaly.severity === 'high' || anomaly.severity === 'critical',
              falsePositive: false,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error storing anomalies:', error);
    }
  }

  /**
   * Get user's behavioral profile summary
   */
  static async getUserBehavioralProfile(userId: string) {
    try {
      const profile = await prisma.behavioralProfile.findFirst({
        where: { userId },
      });

      if (!profile) {
        return {
          exists: false,
          learningPhase: true,
          confidence: 0,
          riskScore: 50,
          maturity: 0,
          lastAnalyzed: null,
        };
      }

      const recentAnomalies = await prisma.behavioralAnomaly.findMany({
        where: { 
          userId,
          detected: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        orderBy: { detected: 'desc' },
        take: 10,
      });

      return {
        exists: true,
        learningPhase: profile.learningPhase,
        confidence: profile.confidence,
        riskScore: profile.riskScore,
        maturity: this.calculateProfileMaturity(profile),
        lastAnalyzed: profile.lastAnalyzed,
        recentAnomalies: recentAnomalies.length,
        criticalAnomalies: recentAnomalies.filter(a => a.severity === 'critical').length,
      };
    } catch (error) {
      console.error('Error getting behavioral profile:', error);
      return {
        exists: false,
        learningPhase: true,
        confidence: 0,
        riskScore: 100,
        maturity: 0,
        lastAnalyzed: null,
      };
    }
  }
}
