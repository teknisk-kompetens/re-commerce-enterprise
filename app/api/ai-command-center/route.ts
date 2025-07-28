
/**
 * AI COMMAND CENTER API ROUTE
 * Manages AI systems and provides control operations
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

    const { action, systemId, data } = await request.json();

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
            content: getCommandCenterPrompt(action)
          },
          {
            role: 'user',
            content: JSON.stringify({ systemId, data })
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error('AI command center request failed');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('AI command center error:', error);
    return NextResponse.json({ error: 'Command center operation failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'status';

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
            content: getStatusPrompt(type)
          },
          {
            role: 'user',
            content: JSON.stringify({ request: type, timestamp: new Date().toISOString() })
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error('AI command center status request failed');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('AI command center status error:', error);
    return NextResponse.json({ error: 'Status request failed' }, { status: 500 });
  }
}

function getCommandCenterPrompt(action: string): string {
  const prompts = {
    'start': `You are an expert AI system orchestrator specializing in starting and initializing AI systems.
    Analyze the system start request and provide comprehensive initialization guidance.
    
    Return a JSON response with:
    {
      "operation": "start",
      "systemId": "string",
      "status": "success|failed|pending",
      "steps": [
        {
          "step": "string",
          "description": "string",
          "status": "completed|in_progress|pending|failed",
          "duration": "string"
        }
      ],
      "healthCheck": {
        "cpu": "number",
        "memory": "number",
        "network": "number",
        "dependencies": ["string"]
      },
      "recommendations": ["string"],
      "estimatedStartTime": "string"
    }`,
    
    'stop': `You are an expert AI system orchestrator specializing in safely stopping AI systems.
    Analyze the system stop request and provide comprehensive shutdown guidance.
    
    Return a JSON response with:
    {
      "operation": "stop",
      "systemId": "string",
      "status": "success|failed|pending",
      "steps": [
        {
          "step": "string",
          "description": "string",
          "status": "completed|in_progress|pending|failed",
          "duration": "string"
        }
      ],
      "gracefulShutdown": {
        "activeConnections": "number",
        "pendingTasks": "number",
        "dataBackup": "boolean",
        "cleanupRequired": "boolean"
      },
      "recommendations": ["string"],
      "estimatedStopTime": "string"
    }`,
    
    'restart': `You are an expert AI system orchestrator specializing in system restarts and recovery.
    Analyze the system restart request and provide comprehensive restart guidance.
    
    Return a JSON response with:
    {
      "operation": "restart",
      "systemId": "string",
      "status": "success|failed|pending",
      "steps": [
        {
          "step": "string",
          "description": "string",
          "status": "completed|in_progress|pending|failed",
          "duration": "string"
        }
      ],
      "preRestartChecks": {
        "dataIntegrity": "boolean",
        "activeTransactions": "number",
        "systemHealth": "number",
        "dependencies": ["string"]
      },
      "postRestartValidation": {
        "functionalTests": ["string"],
        "performanceTests": ["string"],
        "integrationTests": ["string"]
      },
      "recommendations": ["string"],
      "estimatedRestartTime": "string"
    }`,
    
    'health_check': `You are an expert AI system health monitoring specialist.
    Analyze the system health check request and provide comprehensive health assessment.
    
    Return a JSON response with:
    {
      "operation": "health_check",
      "systemId": "string",
      "overallHealth": "excellent|good|fair|poor|critical",
      "healthScore": "number",
      "components": [
        {
          "component": "string",
          "status": "healthy|warning|critical",
          "metrics": {
            "cpu": "number",
            "memory": "number",
            "latency": "number",
            "throughput": "number"
          },
          "issues": ["string"]
        }
      ],
      "recommendations": [
        {
          "priority": "high|medium|low",
          "action": "string",
          "impact": "string",
          "effort": "string"
        }
      ],
      "alerts": ["string"]
    }`,
    
    'performance_analysis': `You are an expert AI system performance analyst.
    Analyze the system performance data and provide optimization recommendations.
    
    Return a JSON response with:
    {
      "operation": "performance_analysis",
      "systemId": "string",
      "performanceScore": "number",
      "metrics": {
        "throughput": "number",
        "latency": "number",
        "accuracy": "number",
        "resourceUtilization": "number"
      },
      "bottlenecks": [
        {
          "type": "string",
          "severity": "high|medium|low",
          "impact": "string",
          "solution": "string"
        }
      ],
      "optimizations": [
        {
          "area": "string",
          "improvement": "string",
          "expectedGain": "number",
          "effort": "string"
        }
      ],
      "trends": ["string"]
    }`,
    
    'resource_optimization': `You are an expert AI system resource optimization specialist.
    Analyze the system resource usage and provide optimization strategies.
    
    Return a JSON response with:
    {
      "operation": "resource_optimization",
      "systemId": "string",
      "currentUsage": {
        "cpu": "number",
        "memory": "number",
        "storage": "number",
        "network": "number"
      },
      "optimizations": [
        {
          "resource": "string",
          "currentUsage": "number",
          "optimizedUsage": "number",
          "savingsPercentage": "number",
          "implementation": "string"
        }
      ],
      "recommendations": [
        {
          "type": "scaling|optimization|configuration",
          "action": "string",
          "benefit": "string",
          "risk": "string"
        }
      ],
      "estimatedSavings": "number"
    }`
  };

  return prompts[action as keyof typeof prompts] || `You are an expert AI system orchestrator. 
  Analyze the provided system operation request and generate appropriate management guidance in JSON format.`;
}

function getStatusPrompt(type: string): string {
  const prompts = {
    'status': `You are an expert AI system status monitor.
    Generate a comprehensive system status report for all AI systems.
    
    Return a JSON response with:
    {
      "timestamp": "string",
      "overallStatus": "operational|degraded|maintenance|offline",
      "systems": [
        {
          "id": "string",
          "name": "string",
          "status": "active|paused|error|maintenance",
          "performance": "number",
          "uptime": "number",
          "lastCheck": "string"
        }
      ],
      "alerts": [
        {
          "severity": "high|medium|low",
          "message": "string",
          "system": "string",
          "timestamp": "string"
        }
      ],
      "metrics": {
        "totalRequests": "number",
        "averageLatency": "number",
        "errorRate": "number",
        "throughput": "number"
      }
    }`,
    
    'metrics': `You are an expert AI system metrics analyst.
    Generate comprehensive performance metrics for all AI systems.
    
    Return a JSON response with:
    {
      "timestamp": "string",
      "performanceMetrics": {
        "automation": {
          "workflows": "number",
          "efficiency": "number",
          "success_rate": "number"
        },
        "intelligence": {
          "insights": "number",
          "predictions": "number",
          "accuracy": "number"
        },
        "conversational": {
          "conversations": "number",
          "satisfaction": "number",
          "languages": "number"
        },
        "mlops": {
          "models": "number",
          "deployments": "number",
          "experiments": "number"
        }
      },
      "resourceUsage": {
        "cpu": "number",
        "memory": "number",
        "storage": "number",
        "network": "number"
      },
      "trends": ["string"]
    }`,
    
    'health': `You are an expert AI system health assessor.
    Generate a comprehensive health report for all AI systems.
    
    Return a JSON response with:
    {
      "timestamp": "string",
      "overallHealth": "excellent|good|fair|poor|critical",
      "healthScore": "number",
      "systemHealth": [
        {
          "system": "string",
          "health": "excellent|good|fair|poor|critical",
          "score": "number",
          "issues": ["string"],
          "recommendations": ["string"]
        }
      ],
      "criticalIssues": ["string"],
      "recommendations": [
        {
          "priority": "high|medium|low",
          "action": "string",
          "system": "string"
        }
      ]
    }`
  };

  return prompts[type as keyof typeof prompts] || `You are an expert AI system monitor. 
  Generate comprehensive system status information in JSON format.`;
}
