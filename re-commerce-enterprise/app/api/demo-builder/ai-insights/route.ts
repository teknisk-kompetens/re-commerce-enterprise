
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// POST /api/demo-builder/ai-insights
export async function POST(request: NextRequest) {
  try {
    const { userProfile, demoProfile, context } = await request.json();

    // Prepare AI prompt for insights generation
    const prompt = `
You are an enterprise AI consultant analyzing a user profile for demo personalization insights.

User Profile:
- Industry: ${userProfile.industry}
- Role: ${userProfile.role}
- Company: ${userProfile.company || 'Not specified'}
- Company Size: ${userProfile.companySize || 'Not specified'}
- Experience: ${userProfile.experience || 'intermediate'}
- Pain Points: ${userProfile.painPoints?.join(', ') || 'None specified'}
- Focus Areas: ${userProfile.focusAreas?.join(', ') || 'None specified'}
- Learning Style: ${userProfile.learningStyle || 'visual'}

Demo Profile:
- Name: ${demoProfile.name}
- Industry: ${demoProfile.industry}
- Target Role: ${demoProfile.targetRole}
- Duration: ${demoProfile.duration} minutes
- Pain Points Addressed: ${demoProfile.painPoints?.join(', ') || 'None specified'}
- Focus Areas: ${demoProfile.focusAreas?.join(', ') || 'None specified'}

Context: ${context?.focusArea || 'General analysis'}

Generate actionable insights for personalizing this demo experience. Consider:
1. Industry-specific relevance
2. Role-appropriate depth and focus
3. Pain point alignment
4. Learning style preferences
5. Company size considerations

Respond with a JSON object:
{
  "insights": [
    "insight about demo relevance",
    "insight about personalization opportunities", 
    "insight about content focus",
    "insight about presentation style",
    "insight about industry examples"
  ],
  "confidence": 0.9,
  "recommendations": [
    "specific recommendation 1",
    "specific recommendation 2"
  ],
  "focusAreas": ["area1", "area2", "area3"],
  "personalizationOpportunities": {
    "content": "content personalization suggestions",
    "examples": "example personalization suggestions",
    "flow": "flow personalization suggestions"
  }
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
        max_tokens: 1500,
        temperature: 0.8
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
      const insights = JSON.parse(content);
      
      return NextResponse.json({
        ...insights,
        timestamp: new Date().toISOString(),
        userProfileId: userProfile.id,
        demoProfileId: demoProfile.id
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback insights
      return NextResponse.json({
        insights: [
          `This demo aligns well with ${userProfile.industry} industry needs`,
          `Content should be tailored for ${userProfile.role} responsibilities`,
          `Focus on ${userProfile.painPoints?.[0] || 'operational efficiency'} pain points`,
          `Use ${userProfile.learningStyle || 'visual'} learning approach`,
          `Consider ${userProfile.companySize || 'enterprise'} scale examples`
        ],
        confidence: 0.7,
        recommendations: [
          'Customize examples for industry context',
          'Adjust technical depth for role level'
        ],
        focusAreas: userProfile.focusAreas?.slice(0, 3) || ['efficiency', 'automation', 'insights'],
        personalizationOpportunities: {
          content: 'Industry-specific use cases and benefits',
          examples: `${userProfile.industry} sector examples`,
          flow: 'Role-appropriate information hierarchy'
        }
      });
    }

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    );
  }
}
