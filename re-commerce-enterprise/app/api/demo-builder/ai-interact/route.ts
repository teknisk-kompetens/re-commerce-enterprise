
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// POST /api/demo-builder/ai-interact
export async function POST(request: NextRequest) {
  try {
    const { component, userPersonalization, interactionType, context } = await request.json();

    // Prepare AI prompt for component interaction
    const prompt = `
You are an AI assistant for an enterprise demo system. A ${userPersonalization.role} at ${userPersonalization.company || 'an organization'} in the ${userPersonalization.industry} industry just interacted with the "${component.title}" component.

Component Details:
- Name: ${component.title}
- Description: ${component.description}
- Category: ${component.category}
- Type: ${component.type}

User Profile:
- Industry: ${userPersonalization.industry}
- Role: ${userPersonalization.role}
- Company: ${userPersonalization.company || 'Not specified'}
- Pain Points: ${userPersonalization.painPoints?.join(', ') || 'None specified'}
- Focus Areas: ${userPersonalization.focusAreas?.join(', ') || 'None specified'}

Interaction Type: ${interactionType}
Context: ${JSON.stringify(context || {})}

Based on this interaction, provide:
1. A relevant, personalized response explaining the component's value
2. Industry-specific benefits
3. Role-appropriate insights
4. Suggested next steps

Respond with a JSON object:
{
  "response": "personalized explanation of component value",
  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
  "insights": ["insight 1", "insight 2"],
  "nextSteps": ["next step 1", "next step 2"],
  "relevanceScore": 0.9,
  "industry_examples": ["example 1", "example 2"]
}

Keep responses concise but informative, focused on practical value for their specific context.
`;

    // Call LLM API
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
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    try {
      const interactionResult = JSON.parse(content);
      
      return NextResponse.json({
        ...interactionResult,
        timestamp: new Date().toISOString(),
        componentId: component.id,
        userProfileId: userPersonalization.id,
        interactionType
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback response
      return NextResponse.json({
        response: `The ${component.title} offers significant value for ${userPersonalization.industry} organizations, particularly in addressing ${userPersonalization.painPoints?.[0] || 'operational challenges'}.`,
        benefits: [
          `Streamlines ${userPersonalization.role} workflows`,
          `Addresses ${userPersonalization.industry} compliance requirements`,
          'Improves operational efficiency'
        ],
        insights: [
          `Particularly relevant for ${userPersonalization.companySize || 'enterprise'} scale`,
          `Aligns with ${userPersonalization.focusAreas?.[0] || 'process optimization'} priorities`
        ],
        nextSteps: [
          'Explore integration options',
          'Review implementation timeline'
        ],
        relevanceScore: 0.8,
        industry_examples: [
          `${userPersonalization.industry} use case example`,
          `Best practices for ${userPersonalization.role} adoption`
        ]
      });
    }

  } catch (error) {
    console.error('Error in AI interaction:', error);
    return NextResponse.json(
      { error: 'Failed to process AI interaction' },
      { status: 500 }
    );
  }
}
