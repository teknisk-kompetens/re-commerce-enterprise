
/**
 * AI CONTENT GENERATION API ROUTE
 * Generates various types of content using AI
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

    const { contentType, requirements, streamResponse } = await request.json();

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
            content: getContentPrompt(contentType)
          },
          {
            role: 'user',
            content: JSON.stringify(requirements)
          }
        ],
        stream: streamResponse || false,
        max_tokens: 3000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('AI content generation request failed');
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
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('AI content generation error:', error);
    return NextResponse.json({ error: 'AI content generation failed' }, { status: 500 });
  }
}

function getContentPrompt(contentType: string): string {
  const prompts = {
    'business_report': `You are an expert business report writer with AI capabilities.
    Generate comprehensive, professional business reports based on the provided requirements.
    
    Format your response as a complete business report with:
    - Executive Summary
    - Key Findings
    - Detailed Analysis
    - Recommendations
    - Conclusion
    
    Use professional language, clear structure, and include relevant data insights.`,
    
    'marketing_content': `You are an expert marketing content creator with AI capabilities.
    Generate compelling marketing content based on the provided requirements.
    
    Create content that is:
    - Engaging and persuasive
    - Targeted to the specified audience
    - Optimized for the chosen platform
    - Aligned with brand voice and objectives
    
    Include headlines, body content, and call-to-action elements.`,
    
    'technical_documentation': `You are an expert technical writer with AI capabilities.
    Generate comprehensive technical documentation based on the provided requirements.
    
    Create documentation that is:
    - Clear and well-structured
    - Technically accurate
    - Easy to follow
    - Properly formatted
    
    Include step-by-step instructions, code examples, and troubleshooting guides.`,
    
    'presentation_content': `You are an expert presentation content creator with AI capabilities.
    Generate compelling presentation content based on the provided requirements.
    
    Create content with:
    - Clear slide structure
    - Engaging headlines
    - Concise bullet points
    - Supporting details
    - Visual content suggestions
    
    Format for maximum impact and clarity.`,
    
    'email_templates': `You are an expert email marketing specialist with AI capabilities.
    Generate effective email templates based on the provided requirements.
    
    Create emails that are:
    - Professional and engaging
    - Personalized to the audience
    - Optimized for conversions
    - Mobile-friendly
    
    Include subject lines, preheaders, and body content.`,
    
    'social_media': `You are an expert social media content creator with AI capabilities.
    Generate engaging social media content based on the provided requirements.
    
    Create content that is:
    - Platform-optimized
    - Engaging and shareable
    - On-brand
    - Includes relevant hashtags
    
    Adapt tone and format for the specific platform.`
  };

  return prompts[contentType as keyof typeof prompts] || `You are an expert content creator. 
  Generate high-quality content based on the provided requirements.`;
}
