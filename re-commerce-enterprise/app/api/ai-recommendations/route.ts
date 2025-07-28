
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context, dataPoints, analysisType = "optimization" } = body;

    // Streaming LLM request for AI recommendations
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
            content: `You are an AI business analyst providing enterprise recommendations. Analyze the provided data and context to generate actionable insights and recommendations. Focus on ${analysisType} opportunities.`
          },
          {
            role: 'user',
            content: `Context: ${context}
            
Data Points: ${JSON.stringify(dataPoints)}

Please provide specific, actionable recommendations based on this data. Include:
1. Key insights from the data
2. Specific recommendations with expected impact
3. Implementation priority (high/medium/low)
4. Estimated effort required
5. Success metrics to track

Format your response as clear, concise bullet points.`
          }
        ],
        stream: true,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    // Stream the response back to client
    const encoder = new TextEncoder();
    const stream = response.body;

    if (!stream) {
      throw new Error('No response stream available');
    }

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = stream.getReader();
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
          controller.close();
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
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
