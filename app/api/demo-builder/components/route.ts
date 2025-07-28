
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/demo-builder/components
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const highlighted = searchParams.get('highlighted');

    const where: any = {
      isActive: true
    };

    if (category) where.category = category;
    if (type) where.type = type;
    if (highlighted === 'true') where.isHighlighted = true;

    const components = await prisma.enterpriseSystemComponent.findMany({
      where,
      orderBy: [
        { isHighlighted: 'desc' },
        { isPremium: 'desc' },
        { usageCount: 'desc' },
        { rating: 'desc' }
      ]
    });

    // Parse JSON fields
    const formattedComponents = components.map(component => ({
      ...component,
      demoContent: typeof component.demoContent === 'string' 
        ? JSON.parse(component.demoContent) 
        : component.demoContent,
      interactions: typeof component.interactions === 'string' 
        ? JSON.parse(component.interactions) 
        : component.interactions,
      aiPrompts: typeof component.aiPrompts === 'string' 
        ? JSON.parse(component.aiPrompts) 
        : component.aiPrompts
    }));

    return NextResponse.json(formattedComponents);
  } catch (error) {
    console.error('Error fetching enterprise components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enterprise components' },
      { status: 500 }
    );
  }
}

// POST /api/demo-builder/components
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const component = await prisma.enterpriseSystemComponent.create({
      data: {
        ...data,
        demoContent: JSON.stringify(data.demoContent || {}),
        interactions: JSON.stringify(data.interactions || []),
        aiPrompts: JSON.stringify(data.aiPrompts || [])
      }
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error('Error creating enterprise component:', error);
    return NextResponse.json(
      { error: 'Failed to create enterprise component' },
      { status: 500 }
    );
  }
}
