
/**
 * NATURAL LANGUAGE ANALYTICS API
 * Plain English to analytics queries using LLM
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

    const { query, context } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Stream the LLM response for natural language analytics
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert data analyst that converts natural language queries into structured analytics results. 

The user will ask questions about their business data in plain English. You should:
1. Understand the intent and data requirements
2. Generate appropriate visualizations and insights
3. Provide actionable recommendations
4. Return results in a structured format

Available data context: ${context || 'General business analytics data including revenue, customers, conversion rates, user behavior, and system metrics'}

Always respond with detailed analytics insights, not just raw data. Include:
- Key findings and insights
- Data visualizations suggestions
- Actionable recommendations
- Confidence levels for predictions
- Relevant context and explanations

Focus on providing business value and actionable insights.`
          },
          {
            role: 'user',
            content: `Analyze this query: "${query}"

Please provide comprehensive analytics insights including:
1. Key metrics and findings
2. Visualization recommendations
3. Business implications
4. Actionable next steps
5. Any relevant predictions or forecasts

Format your response to be clear, structured, and actionable for business decision-making.`
          }
        ],
        stream: true,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate analytics insights');
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.error(new Error('No response body'));
            return;
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
          console.error('Natural language analytics streaming error:', error);
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
    console.error('Natural language analytics error:', error);
    return NextResponse.json({ error: 'Analytics query failed' }, { status: 500 });
  }
}
