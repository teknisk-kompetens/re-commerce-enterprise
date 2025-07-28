
/**
 * AI CUSTOMER INTELLIGENCE API ROUTE
 * Advanced customer behavior analysis and personalization
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

    const { analysisType, customerData, streamResponse } = await request.json();

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
            content: getCustomerIntelligencePrompt(analysisType)
          },
          {
            role: 'user',
            content: JSON.stringify(customerData)
          }
        ],
        response_format: { type: "json_object" },
        stream: streamResponse || false,
        max_tokens: 3000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('Customer intelligence request failed');
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
    console.error('Customer intelligence error:', error);
    return NextResponse.json({ error: 'Customer intelligence failed' }, { status: 500 });
  }
}

function getCustomerIntelligencePrompt(analysisType: string): string {
  const prompts = {
    'behavior_analysis': `You are an expert customer behavior analyst with AI capabilities.
    Analyze customer behavior patterns to identify trends, preferences, and opportunities.
    
    Return a JSON response with:
    {
      "behaviorProfile": {
        "customerType": "string",
        "engagementLevel": "high|medium|low",
        "loyaltyScore": "number",
        "riskLevel": "high|medium|low"
      },
      "patterns": [
        {
          "pattern": "string",
          "frequency": "number",
          "significance": "high|medium|low",
          "trend": "increasing|decreasing|stable"
        }
      ],
      "preferences": {
        "channels": ["string"],
        "products": ["string"],
        "timing": "string",
        "communication": "string"
      },
      "insights": [
        {
          "insight": "string",
          "confidence": "number",
          "actionable": "boolean",
          "recommendation": "string"
        }
      ]
    }`,
    
    'segmentation': `You are an expert customer segmentation specialist with AI capabilities.
    Analyze customer data to create meaningful segments and targeting strategies.
    
    Return a JSON response with:
    {
      "segments": [
        {
          "segmentName": "string",
          "size": "number",
          "characteristics": ["string"],
          "value": "high|medium|low",
          "growth": "number"
        }
      ],
      "targeting": [
        {
          "segment": "string",
          "strategy": "string",
          "channels": ["string"],
          "message": "string",
          "expectedROI": "number"
        }
      ],
      "optimization": {
        "highValueSegments": ["string"],
        "growthOpportunities": ["string"],
        "retentionFocus": ["string"]
      }
    }`,
    
    'churn_prediction': `You are an expert churn prediction specialist with AI capabilities.
    Analyze customer data to predict churn risk and recommend retention strategies.
    
    Return a JSON response with:
    {
      "churnAnalysis": {
        "overallRisk": "high|medium|low",
        "predictedChurnRate": "number",
        "timeframe": "string",
        "confidence": "number"
      },
      "riskFactors": [
        {
          "factor": "string",
          "weight": "number",
          "trend": "increasing|decreasing|stable"
        }
      ],
      "customers": [
        {
          "customerId": "string",
          "churnProbability": "number",
          "riskLevel": "high|medium|low",
          "keyFactors": ["string"],
          "intervention": "string"
        }
      ],
      "retentionStrategies": [
        {
          "strategy": "string",
          "targetSegment": "string",
          "effectiveness": "number",
          "implementation": "string"
        }
      ]
    }`,
    
    'personalization': `You are an expert personalization specialist with AI capabilities.
    Analyze customer data to create personalized experiences and recommendations.
    
    Return a JSON response with:
    {
      "personalization": {
        "profileCompleteness": "number",
        "personalizationPotential": "high|medium|low",
        "keyAttributes": ["string"]
      },
      "recommendations": [
        {
          "type": "product|content|offer",
          "item": "string",
          "relevanceScore": "number",
          "reasoning": "string",
          "timing": "string"
        }
      ],
      "strategies": [
        {
          "strategy": "string",
          "implementation": "string",
          "expectedLift": "number",
          "effort": "low|medium|high"
        }
      ],
      "optimization": {
        "testingRecommendations": ["string"],
        "dataEnrichment": ["string"],
        "automationOpportunities": ["string"]
      }
    }`,
    
    'journey_analysis': `You are an expert customer journey analyst with AI capabilities.
    Analyze customer journey data to identify pain points and optimization opportunities.
    
    Return a JSON response with:
    {
      "journeyMap": {
        "stages": ["string"],
        "touchpoints": ["string"],
        "criticalMoments": ["string"]
      },
      "painPoints": [
        {
          "stage": "string",
          "issue": "string",
          "impact": "high|medium|low",
          "frequency": "number",
          "solution": "string"
        }
      ],
      "optimization": [
        {
          "area": "string",
          "improvement": "string",
          "effort": "low|medium|high",
          "impact": "number"
        }
      ],
      "metrics": {
        "conversionRate": "number",
        "dropOffPoints": ["string"],
        "engagementScore": "number"
      }
    }`,
    
    'lifetime_value': `You are an expert customer lifetime value analyst with AI capabilities.
    Analyze customer data to predict and optimize customer lifetime value.
    
    Return a JSON response with:
    {
      "clvAnalysis": {
        "averageCLV": "number",
        "clvDistribution": "object",
        "growthPotential": "number"
      },
      "segments": [
        {
          "segment": "string",
          "averageCLV": "number",
          "characteristics": ["string"],
          "optimization": "string"
        }
      ],
      "predictions": [
        {
          "customerId": "string",
          "predictedCLV": "number",
          "confidence": "number",
          "factors": ["string"]
        }
      ],
      "strategies": [
        {
          "strategy": "string",
          "targetSegment": "string",
          "expectedIncrease": "number",
          "implementation": "string"
        }
      ]
    }`
  };

  return prompts[analysisType as keyof typeof prompts] || `You are an expert customer intelligence analyst. 
  Analyze the provided customer data and generate comprehensive insights in JSON format.`;
}
