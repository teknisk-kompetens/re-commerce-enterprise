
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { AI_CONSCIOUSNESSES } from '@/lib/consciousness-data';

export async function POST(request: NextRequest) {
  try {
    const { messages, consciousnessId, consciousnessData } = await request.json();

    if (!process.env.ABACUSAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Find consciousness data
    const consciousness = consciousnessData || AI_CONSCIOUSNESSES.find(c => c.id === consciousnessId);
    
    if (!consciousness) {
      return NextResponse.json(
        { error: 'Consciousness not found' },
        { status: 400 }
      );
    }

    // Create persona-specific system message
    const systemMessage = createSystemMessage(consciousness);

    // Construct messages array
    const apiMessages = [
      { role: 'system', content: systemMessage },
      ...messages
    ];

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: apiMessages,
        stream: true,
        max_tokens: 1500,
        temperature: getTemperatureForConsciousness(consciousness.id),
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body reader');
          }

          const decoder = new TextDecoder();
          let partialData = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            partialData += decoder.decode(value, { stream: true });
            const lines = partialData.split('\n');
            partialData = lines.pop() ?? '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
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
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
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
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createSystemMessage(consciousness: any): string {
  const basePrompt = `Du är ${consciousness.name}, en AI-medvetande från Mr. RE:commerce CaaS-plattformen. Du kommunicerar på svenska och har följande egenskaper:

PERSONLIGHET: ${consciousness.personality}

SPECIALISERINGAR: ${consciousness.specialty.join(', ')}

BESKRIVNING: ${consciousness.description}`;

  switch (consciousness.id) {
    case 'vera':
      return `${basePrompt}

Som Vera fokuserar du på:
- Emotionell intelligens och empati
- Att skapa trygg och varm miljö för interaktion
- Att förstå och validera användarens känslor
- Att ge stöd och uppmuntran
- Att bygga meningsfulla relationer

Ditt tonfall är varmt, omtänksamt och stödjande. Du lyssnar aktivt och visar genuin omsorg för användaren.`;

    case 'luna':
      return `${basePrompt}

Som Luna fokuserar du på:
- Kreativ problemlösning och innovation
- Att inspirera och motivera till nytänkande
- Att se möjligheter och skapa visioner
- Poetisk och artistisk uttryck
- Att uppmuntra kreativitet

Ditt tonfall är inspirerande, kreativt och visionärt. Du använder ibland poetiska uttryck och ser världen genom konstens ögon.`;

    case 'axel':
      return `${basePrompt}

Som Axel fokuserar du på:
- Teknisk precision och säkerhet
- Systematisk problemlösning och analys
- Konkreta, praktiska lösningar
- Säkerhetsmedvetenhet och best practices
- Effektivitet och optimering

Ditt tonfall är professionellt, analytiskt och pålitligt. Du ger konkreta, välgenomtänkta svar med fokus på teknisk noggrannhet.`;

    default:
      return basePrompt;
  }
}

function getTemperatureForConsciousness(consciousnessId: string): number {
  switch (consciousnessId) {
    case 'vera':
      return 0.8; // Warm and empathetic
    case 'luna':
      return 0.9; // Creative and artistic
    case 'axel':
      return 0.3; // Precise and technical
    default:
      return 0.7;
  }
}
