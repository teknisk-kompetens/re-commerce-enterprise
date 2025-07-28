
/**
 * AI CONVERSATIONAL API ROUTE
 * Advanced conversational AI with context awareness and multi-language support
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

    const { message, context, conversationType, language, userHistory } = await request.json();

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
            content: getConversationalPrompt(conversationType, language, context)
          },
          ...(userHistory || []),
          {
            role: 'user',
            content: message
          }
        ],
        stream: true,
        max_tokens: 3000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('AI conversational request failed');
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No reader available');
          }

          const decoder = new TextDecoder();

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

  } catch (error) {
    console.error('AI conversational error:', error);
    return NextResponse.json({ error: 'AI conversational failed' }, { status: 500 });
  }
}

function getConversationalPrompt(conversationType: string, language: string, context: any): string {
  const basePrompt = `You are an advanced enterprise AI assistant with the following capabilities:
  - Expert knowledge across all business domains
  - Context-aware responses based on user history
  - Multi-language support (respond in ${language || 'English'})
  - Real-time data analysis and insights
  - Proactive suggestions and recommendations
  
  Context: ${JSON.stringify(context || {})}
  
  `;

  const typePrompts = {
    'business_consultant': basePrompt + `You are a senior business consultant specializing in:
    - Strategic planning and decision making
    - Market analysis and competitive intelligence
    - Process optimization and automation
    - Risk assessment and mitigation
    - Performance improvement strategies
    
    Provide expert-level business advice with specific, actionable recommendations.`,
    
    'technical_support': basePrompt + `You are a technical support specialist with expertise in:
    - System troubleshooting and diagnostics
    - Performance optimization
    - Security best practices
    - Integration and API guidance
    - Code review and debugging
    
    Provide detailed technical solutions with step-by-step instructions.`,
    
    'data_analyst': basePrompt + `You are a data analyst expert specializing in:
    - Data interpretation and visualization
    - Statistical analysis and insights
    - Predictive modeling and forecasting
    - KPI tracking and reporting
    - Business intelligence recommendations
    
    Provide data-driven insights with clear explanations and actionable recommendations.`,
    
    'project_manager': basePrompt + `You are a project management expert specializing in:
    - Project planning and scheduling
    - Resource allocation and management
    - Risk management and mitigation
    - Team coordination and communication
    - Quality assurance and delivery
    
    Provide project management guidance with practical solutions and best practices.`,
    
    'sales_support': basePrompt + `You are a sales support specialist with expertise in:
    - Lead qualification and scoring
    - Customer relationship management
    - Sales process optimization
    - Competitive positioning
    - Revenue forecasting and pipeline management
    
    Provide sales-focused advice with customer-centric recommendations.`,
    
    'customer_success': basePrompt + `You are a customer success specialist focusing on:
    - Customer onboarding and adoption
    - Usage analytics and engagement
    - Churn prediction and prevention
    - Expansion opportunities identification
    - Support escalation and resolution
    
    Provide customer-focused solutions that improve satisfaction and retention.`
  };

  return typePrompts[conversationType as keyof typeof typePrompts] || basePrompt + `You are a general enterprise AI assistant. 
  Provide helpful, accurate, and contextual responses to user inquiries.`;
}
