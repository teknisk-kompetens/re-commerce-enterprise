
/**
 * AI AUTOMATION API ROUTE
 * Handles AI-powered automation requests with streaming support
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

    const { action, data, streamResponse } = await request.json();

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
            content: getSystemPrompt(action)
          },
          {
            role: 'user',
            content: JSON.stringify(data)
          }
        ],
        response_format: { type: "json_object" },
        stream: streamResponse || false,
        max_tokens: 3000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('AI automation request failed');
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
    console.error('AI automation error:', error);
    return NextResponse.json({ error: 'AI automation failed' }, { status: 500 });
  }
}

function getSystemPrompt(action: string): string {
  const prompts = {
    'workflow_optimization': `You are an expert AI automation engineer specializing in workflow optimization.
    Analyze the provided business process data and generate intelligent automation recommendations.
    
    Return a JSON response with the following structure:
    {
      "optimizations": [
        {
          "processName": "string",
          "currentEfficiency": "number",
          "proposedEfficiency": "number",
          "automationSteps": ["string"],
          "expectedROI": "number",
          "implementationTime": "string",
          "priority": "high|medium|low"
        }
      ],
      "recommendations": [
        {
          "title": "string",
          "description": "string",
          "impact": "string",
          "effort": "string"
        }
      ],
      "summary": "string"
    }`,
    
    'process_mining': `You are an expert process mining AI analyst.
    Analyze the provided operational data to identify bottlenecks, inefficiencies, and automation opportunities.
    
    Return a JSON response with:
    {
      "processMap": {
        "steps": ["string"],
        "bottlenecks": ["string"],
        "parallelizable": ["string"]
      },
      "improvements": [
        {
          "area": "string",
          "currentState": "string",
          "proposedState": "string",
          "impact": "string"
        }
      ],
      "automationOpportunities": [
        {
          "task": "string",
          "complexity": "string",
          "automationPotential": "number",
          "tools": ["string"]
        }
      ]
    }`,
    
    'predictive_maintenance': `You are an expert predictive maintenance AI system.
    Analyze system performance data to predict failures and recommend maintenance actions.
    
    Return a JSON response with:
    {
      "predictions": [
        {
          "system": "string",
          "failureRisk": "number",
          "timeToFailure": "string",
          "confidence": "number",
          "symptoms": ["string"]
        }
      ],
      "recommendations": [
        {
          "system": "string",
          "action": "string",
          "priority": "string",
          "timeframe": "string"
        }
      ],
      "healthScore": "number"
    }`,
    
    'intelligent_scheduling': `You are an expert AI scheduler and resource optimization system.
    Analyze resource requirements and constraints to create optimal schedules.
    
    Return a JSON response with:
    {
      "schedule": [
        {
          "resource": "string",
          "tasks": ["string"],
          "timeSlots": ["string"],
          "utilization": "number"
        }
      ],
      "optimization": {
        "efficiencyGain": "number",
        "resourceSavings": "number",
        "recommendations": ["string"]
      }
    }`
  };

  return prompts[action as keyof typeof prompts] || `You are an expert AI automation assistant. 
  Analyze the provided data and return helpful automation recommendations in JSON format.`;
}
