
/**
 * ML OPS API ROUTE
 * Machine Learning Operations with model management and monitoring
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
            content: getMLOpsPrompt(action)
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
      throw new Error('ML Ops request failed');
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
    console.error('ML Ops error:', error);
    return NextResponse.json({ error: 'ML Ops failed' }, { status: 500 });
  }
}

function getMLOpsPrompt(action: string): string {
  const prompts = {
    'model_evaluation': `You are an expert MLOps engineer specializing in model evaluation and performance analysis.
    Analyze the provided model performance data and generate comprehensive evaluation insights.
    
    Return a JSON response with:
    {
      "evaluation": {
        "modelName": "string",
        "accuracy": "number",
        "precision": "number",
        "recall": "number",
        "f1Score": "number",
        "auc": "number",
        "rmse": "number"
      },
      "performanceAnalysis": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "recommendations": ["string"]
      },
      "comparison": {
        "baseline": "number",
        "improvement": "number",
        "significance": "high|medium|low"
      },
      "deployment": {
        "readiness": "ready|needs_improvement|not_ready",
        "requirements": ["string"],
        "risks": ["string"]
      }
    }`,
    
    'model_monitoring': `You are an expert MLOps engineer specializing in model monitoring and drift detection.
    Analyze the provided model monitoring data to detect performance degradation and drift.
    
    Return a JSON response with:
    {
      "monitoring": {
        "modelHealth": "healthy|degraded|critical",
        "performanceTrend": "improving|stable|declining",
        "alertLevel": "none|warning|critical"
      },
      "drift": {
        "dataDrift": "detected|not_detected",
        "conceptDrift": "detected|not_detected",
        "driftMagnitude": "low|medium|high",
        "affectedFeatures": ["string"]
      },
      "recommendations": [
        {
          "action": "string",
          "priority": "high|medium|low",
          "timeframe": "string",
          "impact": "string"
        }
      ],
      "retraining": {
        "required": "boolean",
        "urgency": "high|medium|low",
        "estimatedImprovement": "number"
      }
    }`,
    
    'feature_engineering': `You are an expert MLOps engineer specializing in feature engineering and optimization.
    Analyze the provided dataset and suggest optimal feature engineering strategies.
    
    Return a JSON response with:
    {
      "featureAnalysis": {
        "totalFeatures": "number",
        "importantFeatures": ["string"],
        "redundantFeatures": ["string"],
        "missingData": "number"
      },
      "engineering": [
        {
          "technique": "string",
          "features": ["string"],
          "expectedImprovement": "number",
          "complexity": "low|medium|high"
        }
      ],
      "optimization": {
        "dimensionalityReduction": "boolean",
        "featureSelection": ["string"],
        "encoding": ["string"],
        "scaling": "string"
      },
      "validation": {
        "splitStrategy": "string",
        "crossValidation": "string",
        "testSize": "number"
      }
    }`,
    
    'deployment_pipeline': `You are an expert MLOps engineer specializing in model deployment pipelines.
    Design and optimize the deployment pipeline for the provided model requirements.
    
    Return a JSON response with:
    {
      "pipeline": {
        "stages": ["string"],
        "automation": "full|partial|manual",
        "testingStrategy": "string",
        "rollbackPlan": "string"
      },
      "infrastructure": {
        "platform": "string",
        "scaling": "auto|manual",
        "monitoring": ["string"],
        "logging": ["string"]
      },
      "validation": {
        "preDeployment": ["string"],
        "postDeployment": ["string"],
        "performanceThresholds": ["string"]
      },
      "governance": {
        "approvalProcess": "string",
        "compliance": ["string"],
        "documentation": ["string"]
      }
    }`,
    
    'model_optimization': `You are an expert MLOps engineer specializing in model optimization and performance tuning.
    Analyze the provided model and suggest optimization strategies.
    
    Return a JSON response with:
    {
      "optimization": {
        "currentPerformance": "number",
        "optimizationPotential": "number",
        "primaryBottlenecks": ["string"]
      },
      "techniques": [
        {
          "technique": "string",
          "expectedGain": "number",
          "effort": "low|medium|high",
          "implementation": "string"
        }
      ],
      "hyperparameters": {
        "current": "object",
        "recommended": "object",
        "tuningStrategy": "string"
      },
      "architecture": {
        "currentModel": "string",
        "suggestedChanges": ["string"],
        "alternativeModels": ["string"]
      }
    }`,
    
    'experiment_tracking': `You are an expert MLOps engineer specializing in experiment tracking and management.
    Analyze the provided experiment data and generate insights for experiment optimization.
    
    Return a JSON response with:
    {
      "experiments": [
        {
          "experimentId": "string",
          "status": "running|completed|failed",
          "performance": "number",
          "configuration": "object",
          "insights": ["string"]
        }
      ],
      "comparison": {
        "bestPerforming": "string",
        "significantResults": ["string"],
        "patterns": ["string"]
      },
      "recommendations": {
        "nextExperiments": ["string"],
        "parameterRanges": "object",
        "priorities": ["string"]
      },
      "resources": {
        "usage": "object",
        "optimization": ["string"],
        "allocation": "string"
      }
    }`
  };

  return prompts[action as keyof typeof prompts] || `You are an expert MLOps engineer. 
  Analyze the provided data and generate comprehensive ML operations insights in JSON format.`;
}
