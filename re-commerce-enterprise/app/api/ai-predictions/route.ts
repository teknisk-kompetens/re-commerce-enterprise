
/**
 * AI PREDICTIONS API ROUTE
 * Generates predictive analytics and forecasts using AI
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

    const { data, predictionType, timeframe, streamResponse } = await request.json();

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
            content: getPredictionPrompt(predictionType, timeframe)
          },
          {
            role: 'user',
            content: JSON.stringify(data)
          }
        ],
        response_format: { type: "json_object" },
        stream: streamResponse || false,
        max_tokens: 3000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error('AI predictions request failed');
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
    console.error('AI predictions error:', error);
    return NextResponse.json({ error: 'AI predictions failed' }, { status: 500 });
  }
}

function getPredictionPrompt(predictionType: string, timeframe: string): string {
  const prompts = {
    'revenue_forecast': `You are an expert financial forecasting AI system.
    Analyze historical revenue data and market conditions to predict future revenue.
    
    Return a JSON response with:
    {
      "forecast": {
        "period": "${timeframe}",
        "predictedRevenue": "number",
        "confidence": "number",
        "growthRate": "number",
        "seasonality": "string"
      },
      "scenarios": [
        {
          "scenario": "optimistic|realistic|pessimistic",
          "revenue": "number",
          "probability": "number",
          "factors": ["string"]
        }
      ],
      "trends": [
        {
          "trend": "string",
          "impact": "positive|negative|neutral",
          "magnitude": "number"
        }
      ],
      "recommendations": ["string"]
    }`,
    
    'customer_churn': `You are an expert customer analytics AI system.
    Analyze customer behavior patterns to predict churn risk.
    
    Return a JSON response with:
    {
      "churnPrediction": {
        "overallChurnRate": "number",
        "timeframe": "${timeframe}",
        "confidence": "number"
      },
      "riskSegments": [
        {
          "segment": "string",
          "churnProbability": "number",
          "customerCount": "number",
          "riskFactors": ["string"]
        }
      ],
      "preventionStrategies": [
        {
          "strategy": "string",
          "targetSegment": "string",
          "expectedImpact": "number",
          "implementation": "string"
        }
      ]
    }`,
    
    'demand_forecasting': `You are an expert demand forecasting AI system.
    Analyze historical demand patterns to predict future demand.
    
    Return a JSON response with:
    {
      "demandForecast": {
        "period": "${timeframe}",
        "predictedDemand": "number",
        "confidence": "number",
        "trendDirection": "increasing|decreasing|stable"
      },
      "factors": [
        {
          "factor": "string",
          "impact": "high|medium|low",
          "direction": "positive|negative"
        }
      ],
      "recommendations": [
        {
          "action": "string",
          "rationale": "string",
          "priority": "high|medium|low"
        }
      ]
    }`,
    
    'market_trends': `You are an expert market analysis AI system.
    Analyze market data to predict future trends and opportunities.
    
    Return a JSON response with:
    {
      "marketTrends": [
        {
          "trend": "string",
          "direction": "emerging|growing|declining|stable",
          "timeframe": "${timeframe}",
          "confidence": "number",
          "impact": "high|medium|low"
        }
      ],
      "opportunities": [
        {
          "opportunity": "string",
          "potential": "number",
          "timeWindow": "string",
          "requirements": ["string"]
        }
      ],
      "risks": [
        {
          "risk": "string",
          "probability": "number",
          "impact": "string",
          "mitigation": "string"
        }
      ]
    }`,
    
    'performance_prediction': `You are an expert performance prediction AI system.
    Analyze system performance data to predict future performance and potential issues.
    
    Return a JSON response with:
    {
      "performancePrediction": {
        "period": "${timeframe}",
        "predictedPerformance": "number",
        "confidence": "number",
        "trend": "improving|declining|stable"
      },
      "potentialIssues": [
        {
          "issue": "string",
          "probability": "number",
          "impact": "high|medium|low",
          "timeframe": "string"
        }
      ],
      "optimizations": [
        {
          "optimization": "string",
          "expectedImprovement": "number",
          "effort": "string",
          "priority": "high|medium|low"
        }
      ]
    }`
  };

  return prompts[predictionType as keyof typeof prompts] || `You are an expert predictive analytics AI system. 
  Analyze the provided data and generate comprehensive predictions for the ${timeframe} timeframe in JSON format.`;
}
