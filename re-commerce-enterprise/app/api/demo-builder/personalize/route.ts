
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// POST /api/demo-builder/personalize
export async function POST(request: NextRequest) {
  try {
    const { userProfile, demoProfile, currentSlide, context } = await request.json();

    // Prepare AI prompt for personalization
    const prompt = `
You are an enterprise demo personalization AI. Create personalized content for a ${userProfile.industry} ${userProfile.role} at ${userProfile.company || 'their organization'}.

User Profile:
- Industry: ${userProfile.industry}
- Role: ${userProfile.role}
- Company: ${userProfile.company || 'Not specified'}
- Pain Points: ${userProfile.painPoints?.join(', ') || 'None specified'}
- Focus Areas: ${userProfile.focusAreas?.join(', ') || 'None specified'}
- Experience Level: ${userProfile.experience || 'intermediate'}

Demo Profile:
- Name: ${demoProfile.name}
- Industry: ${demoProfile.industry}
- Target Role: ${demoProfile.targetRole}
- Duration: ${demoProfile.duration} minutes

Current Context: ${currentSlide || 'General personalization'}

Please provide personalized content that:
1. Addresses their specific pain points
2. Uses industry-relevant examples
3. Speaks to their role and responsibilities
4. Includes specific benefits for their industry

Respond with a JSON object containing:
{
  "personalizedContent": {
    "title": "personalized slide title",
    "description": "personalized description",
    "content": "personalized main content",
    "insights": ["insight 1", "insight 2", "insight 3"],
    "examples": ["example 1", "example 2"]
  },
  "adaptations": {
    "focusArea": "primary focus based on user profile",
    "tone": "appropriate tone for role",
    "examples": "industry-specific examples"
  },
  "confidence": 0.85,
  "reasoning": "Brief explanation of personalization approach",
  "suggestions": ["suggestion 1", "suggestion 2"]
}
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
        max_tokens: 2000,
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
      const personalizationResult = JSON.parse(content);
      
      return NextResponse.json({
        ...personalizationResult,
        timestamp: new Date().toISOString(),
        userProfileId: userProfile.id,
        demoProfileId: demoProfile.id
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback response
      return NextResponse.json({
        personalizedContent: {
          title: demoProfile.name,
          description: `Tailored for ${userProfile.industry} professionals`,
          content: `This demo showcases enterprise solutions specifically relevant to ${userProfile.industry} organizations like ${userProfile.company || 'yours'}.`,
          insights: [
            `Addresses key ${userProfile.industry} challenges`,
            `Optimized for ${userProfile.role} responsibilities`,
            `Demonstrates ROI for your organization`
          ]
        },
        adaptations: {
          focusArea: userProfile.focusAreas?.[0] || 'general efficiency',
          tone: 'professional',
          examples: `${userProfile.industry}-specific`
        },
        confidence: 0.7,
        reasoning: 'Fallback personalization based on user profile data',
        suggestions: [
          'Consider industry-specific customizations',
          'Focus on role-relevant features'
        ]
      });
    }

  } catch (error) {
    console.error('Error in personalization:', error);
    return NextResponse.json(
      { error: 'Failed to personalize content' },
      { status: 500 }
    );
  }
}
