
import { NextRequest, NextResponse } from 'next/server';
import { AI_CONSCIOUSNESSES } from '@/lib/consciousness-data';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, consciousnessId, searchResults } = body;

    if (!query || !consciousnessId) {
      return NextResponse.json(
        { error: 'Query and consciousness ID are required' },
        { status: 400 }
      );
    }

    const consciousness = AI_CONSCIOUSNESSES.find(ai => ai.id === consciousnessId);
    if (!consciousness) {
      return NextResponse.json(
        { error: 'Invalid consciousness ID' },
        { status: 400 }
      );
    }

    // Create system prompt based on consciousness
    const systemPrompt = `You are ${consciousness.name}, ${consciousness.title}.

    Your personality: ${consciousness.personality}
    Your specializations: ${consciousness.specialty.join(', ')}
    Search specialization: ${consciousness.searchSpecialization}

    The user searched for: "${query}"

    Here are the search results found:
    ${searchResults?.map((result: any, index: number) => 
      `${index + 1}. ${result.title}
      Type: ${result.type}
      Summary: ${result.excerpt || result.content.substring(0, 200)}
      Category: ${result.category?.name || 'Uncategorized'}
      Score: ${result.upvotes - result.downvotes} votes, ${result.views} views
      `
    ).join('\n') || 'No specific results to analyze.'}

    Your role is to:
    1. Analyze the search results in the context of your expertise
    2. Provide insights and recommendations based on your specialization
    3. Suggest ways to refine the search or explore related topics
    4. Share your unique perspective on the content found
    5. Be helpful, engaging, and true to your personality

    Respond in Swedish, as this is a Swedish platform. Keep your response conversational but informative.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Hjälp mig förstå och navigera dessa sökresultat för "${query}". Vad är dina insikter och rekommendationer?` }
    ];

    // Call LLM API
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        stream: true,
        max_tokens: 1500,
        temperature: consciousness.id === 'axel' ? 0.3 : consciousness.id === 'luna' ? 0.8 : 0.6
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) throw new Error('No response body');

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
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
    console.error('AI Assist API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during AI assistance' },
      { status: 500 }
    );
  }
}
