
/**
 * AI PREDICTIVE MAINTENANCE API ROUTE
 * Predictive maintenance and system health monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { maintenanceType, systemData, streamResponse } = await request.json();

    const response = await fetch(`https://apps.abacus.ai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: getPredictiveMaintenancePrompt(maintenanceType)
          },
          {
            role: 'user',
            content: JSON.stringify(systemData)
          }
        ],
        response_format: { type: "json_object" },
        stream: streamResponse || false,
        max_tokens: 3000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error('Predictive maintenance request failed');
    }

    if (streamResponse) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const reader = response.body?.getReader();
            if (!reader) {
              throw new Error('No reader available');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                    return;
                  }
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content || '';
                    if (content) {
                      buffer += content;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({content})}\n\n`));
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        }
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Predictive maintenance error:', error);
    return NextResponse.json({ error: 'Predictive maintenance failed' }, { status: 500 });
  }
}

function getPredictiveMaintenancePrompt(maintenanceType: string): string {
  const prompts = {
    'system_health': `You are an expert system health monitoring AI specialist.
    Analyze system performance data to assess health and predict potential issues.
    
    Return a JSON response with:
    {
      "healthAssessment": {
        "overallHealth": "excellent|good|fair|poor|critical",
        "healthScore": "number",
        "trend": "improving|stable|declining",
        "lastAssessment": "string"
      },
      "systemMetrics": [
        {
          "metric": "string",
          "current": "number",
          "normal": "number",
          "status": "normal|warning|critical",
          "trend": "improving|stable|declining"
        }
      ],
      "alerts": [
        {
          "severity": "info|warning|critical",
          "system": "string",
          "message": "string",
          "action": "string",
          "timeframe": "string"
        }
      ],
      "recommendations": [
        {
          "recommendation": "string",
          "priority": "high|medium|low",
          "impact": "string",
          "effort": "string"
        }
      ]
    }`,
    
    'failure_prediction': `You are an expert failure prediction AI specialist.
    Analyze system data to predict potential failures and recommend preventive actions.
    
    Return a JSON response with:
    {
      "predictions": [
        {
          "system": "string",
          "component": "string",
          "failureType": "string",
          "probability": "number",
          "timeToFailure": "string",
          "confidence": "number"
        }
      ],
      "riskAssessment": {
        "highRisk": ["string"],
        "mediumRisk": ["string"],
        "lowRisk": ["string"]
      },
      "preventiveActions": [
        {
          "system": "string",
          "action": "string",
          "urgency": "immediate|soon|planned",
          "cost": "low|medium|high",
          "benefit": "string"
        }
      ],
      "monitoring": {
        "criticalMetrics": ["string"],
        "checkFrequency": "string",
        "alertThresholds": "object"
      }
    }`,
    
    'anomaly_detection': `You are an expert anomaly detection AI specialist.
    Analyze system behavior to identify unusual patterns and potential issues.
    
    Return a JSON response with:
    {
      "anomalies": [
        {
          "type": "string",
          "system": "string",
          "severity": "low|medium|high",
          "description": "string",
          "firstDetected": "string",
          "pattern": "string"
        }
      ],
      "analysis": {
        "totalAnomalies": "number",
        "newAnomalies": "number",
        "resolvedAnomalies": "number",
        "trendAnalysis": "string"
      },
      "investigation": [
        {
          "anomaly": "string",
          "possibleCauses": ["string"],
          "investigationSteps": ["string"],
          "priority": "high|medium|low"
        }
      ],
      "baseline": {
        "normalBehavior": "string",
        "thresholds": "object",
        "calibration": "string"
      }
    }`,
    
    'maintenance_scheduling': `You are an expert maintenance scheduling AI specialist.
    Analyze system data to optimize maintenance schedules and resource allocation.
    
    Return a JSON response with:
    {
      "schedule": [
        {
          "system": "string",
          "maintenanceType": "preventive|corrective|predictive",
          "scheduledDate": "string",
          "duration": "string",
          "priority": "high|medium|low",
          "resources": ["string"]
        }
      ],
      "optimization": {
        "efficiencyGain": "number",
        "costSavings": "number",
        "downtimeReduction": "number"
      },
      "resourceAllocation": [
        {
          "resource": "string",
          "utilization": "number",
          "availability": "string",
          "skills": ["string"]
        }
      ],
      "recommendations": [
        {
          "recommendation": "string",
          "rationale": "string",
          "impact": "string",
          "implementation": "string"
        }
      ]
    }`,
    
    'performance_optimization': `You are an expert performance optimization AI specialist.
    Analyze system performance data to identify optimization opportunities.
    
    Return a JSON response with:
    {
      "performance": {
        "currentLevel": "number",
        "targetLevel": "number",
        "improvement": "number",
        "trend": "improving|stable|declining"
      },
      "bottlenecks": [
        {
          "component": "string",
          "impact": "high|medium|low",
          "cause": "string",
          "solution": "string",
          "effort": "low|medium|high"
        }
      ],
      "optimizations": [
        {
          "area": "string",
          "currentValue": "number",
          "optimizedValue": "number",
          "improvement": "number",
          "implementation": "string"
        }
      ],
      "monitoring": {
        "kpis": ["string"],
        "targets": "object",
        "alerting": "string"
      }
    }`,
    
    'self_healing': `You are an expert self-healing systems AI specialist.
    Analyze system issues to recommend automated healing actions.
    
    Return a JSON response with:
    {
      "healingCapabilities": {
        "automatedFixes": ["string"],
        "manualInterventions": ["string"],
        "successRate": "number"
      },
      "issues": [
        {
          "issue": "string",
          "severity": "low|medium|high",
          "healingAction": "string",
          "automated": "boolean",
          "confidence": "number"
        }
      ],
      "recommendations": [
        {
          "enhancement": "string",
          "benefit": "string",
          "complexity": "low|medium|high",
          "priority": "high|medium|low"
        }
      ],
      "monitoring": {
        "healthChecks": ["string"],
        "responseTime": "string",
        "escalation": "string"
      }
    }`
  };

  return prompts[maintenanceType as keyof typeof prompts] || `You are an expert predictive maintenance specialist. 
  Analyze the provided system data and generate comprehensive maintenance insights in JSON format.`;
}
