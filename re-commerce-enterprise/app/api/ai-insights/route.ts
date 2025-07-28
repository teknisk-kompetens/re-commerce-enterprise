
/**
 * AI INSIGHTS API ROUTE
 * Generates business intelligence insights using AI
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

    const { data, analysisType, streamResponse } = await request.json();

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
            content: getInsightsPrompt(analysisType)
          },
          {
            role: 'user',
            content: JSON.stringify(data)
          }
        ],
        response_format: { type: "json_object" },
        stream: streamResponse || false,
        max_tokens: 3000,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error('AI insights request failed');
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
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'AI insights failed' }, { status: 500 });
  }
}

function getInsightsPrompt(analysisType: string): string {
  const prompts = {
    'business_intelligence': `You are an expert business intelligence analyst with AI capabilities.
    Analyze the provided business data and generate actionable insights.
    
    Return a JSON response with:
    {
      "keyInsights": [
        {
          "title": "string",
          "insight": "string",
          "impact": "high|medium|low",
          "confidence": "number",
          "dataPoints": ["string"]
        }
      ],
      "trends": [
        {
          "metric": "string",
          "trend": "increasing|decreasing|stable",
          "percentage": "number",
          "timeframe": "string"
        }
      ],
      "recommendations": [
        {
          "action": "string",
          "rationale": "string",
          "expectedOutcome": "string",
          "timeframe": "string"
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
    
    'predictive_analytics': `You are an expert predictive analytics AI system.
    Analyze historical data patterns to predict future trends and outcomes.
    
    Return a JSON response with:
    {
      "predictions": [
        {
          "metric": "string",
          "currentValue": "number",
          "predictedValue": "number",
          "timeframe": "string",
          "confidence": "number",
          "factors": ["string"]
        }
      ],
      "scenarios": [
        {
          "scenario": "string",
          "probability": "number",
          "impact": "string",
          "preparations": ["string"]
        }
      ],
      "modelAccuracy": "number"
    }`,
    
    'customer_analytics': `You are an expert customer analytics AI specialist.
    Analyze customer data to identify patterns, segments, and opportunities.
    
    Return a JSON response with:
    {
      "segments": [
        {
          "name": "string",
          "size": "number",
          "characteristics": ["string"],
          "value": "number",
          "recommendations": ["string"]
        }
      ],
      "behavior": {
        "patterns": ["string"],
        "preferences": ["string"],
        "journeyInsights": ["string"]
      },
      "opportunities": [
        {
          "opportunity": "string",
          "potential": "number",
          "effort": "string",
          "priority": "high|medium|low"
        }
      ]
    }`,
    
    'performance_analytics': `You are an expert performance analytics AI system.
    Analyze system and business performance data to identify optimization opportunities.
    
    Return a JSON response with:
    {
      "performanceMetrics": [
        {
          "metric": "string",
          "current": "number",
          "target": "number",
          "trend": "string",
          "status": "good|warning|critical"
        }
      ],
      "bottlenecks": [
        {
          "area": "string",
          "impact": "number",
          "causes": ["string"],
          "solutions": ["string"]
        }
      ],
      "optimizations": [
        {
          "area": "string",
          "improvement": "string",
          "effort": "string",
          "impact": "number"
        }
      ]
    }`
  };

  return prompts[analysisType as keyof typeof prompts] || `You are an expert AI business analyst. 
  Analyze the provided data and return comprehensive business insights in JSON format.`;
}
