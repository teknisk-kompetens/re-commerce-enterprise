
/**
 * Advanced Security Summary API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedWebAuthnService } from '@/lib/advanced-webauthn-service';
import { AIPoweredThreatIntelligence } from '@/lib/ai-powered-threat-intelligence';
import { QuantumResistantCryptography } from '@/lib/quantum-resistant-cryptography';
import { IntelligentSecurityOrchestration } from '@/lib/intelligent-security-orchestration';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';

    // Get summaries from all advanced security services
    const [
      threatIntelligence,
      quantumCrypto,
      orchestration,
    ] = await Promise.all([
      AIPoweredThreatIntelligence.getThreatIntelligenceSummary(timeframe),
      QuantumResistantCryptography.getQuantumCryptographyStatus(),
      IntelligentSecurityOrchestration.getOrchestrationSummary(timeframe),
    ]);

    // Calculate overall security posture
    const securityPosture = calculateSecurityPosture(threatIntelligence, quantumCrypto, orchestration);

    const summary = {
      threatIntelligence,
      quantumCryptography: quantumCrypto,
      orchestration,
      securityPosture,
      lastUpdated: new Date(),
      metrics: {
        totalThreats: threatIntelligence.events + threatIntelligence.indicators,
        activeCampaigns: threatIntelligence.campaigns,
        quantumReadiness: quantumCrypto.quantumReadiness,
        automationLevel: orchestration.automationLevel,
        overallRisk: securityPosture.riskLevel,
      },
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error getting advanced security summary:', error);
    return NextResponse.json(
      { error: 'Failed to get advanced security summary' },
      { status: 500 }
    );
  }
}

function calculateSecurityPosture(threatIntel: any, quantumCrypto: any, orchestration: any) {
  let score = 100;
  
  // Adjust based on threat intelligence
  if (threatIntel.riskLevel === 'critical') score -= 40;
  else if (threatIntel.riskLevel === 'high') score -= 25;
  else if (threatIntel.riskLevel === 'medium') score -= 15;
  
  // Adjust based on quantum readiness
  if (quantumCrypto.quantumReadiness === 'ready') score += 10;
  else if (quantumCrypto.quantumReadiness === 'not_ready') score -= 10;
  
  // Adjust based on automation level
  if (orchestration.automationLevel === 'high') score += 15;
  else if (orchestration.automationLevel === 'low') score -= 10;
  
  score = Math.max(0, Math.min(100, score));
  
  let riskLevel = 'low';
  if (score < 40) riskLevel = 'critical';
  else if (score < 60) riskLevel = 'high';
  else if (score < 80) riskLevel = 'medium';
  
  return {
    score,
    riskLevel,
    capabilities: {
      passwordless: true,
      behavioralAnalytics: true,
      aiThreatIntelligence: true,
      quantumResistant: quantumCrypto.quantumReadiness === 'ready',
      selfHealing: orchestration.automationLevel === 'high',
    },
  };
}
