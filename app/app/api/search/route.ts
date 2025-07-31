
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AI_CONSCIOUSNESSES } from '@/lib/consciousness-data';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query, 
      filters = {}, 
      page = 1, 
      limit = 10,
      aiAssistance = false,
      consciousnessId 
    } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Base search conditions
    const whereConditions: any = {
      status: 'ACTIVE',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } }
      ]
    };

    // Apply filters
    if (filters.type && filters.type.length > 0) {
      whereConditions.type = { in: filters.type };
    }

    if (filters.category && filters.category.length > 0) {
      whereConditions.category = {
        slug: { in: filters.category }
      };
    }

    if (filters.tags && filters.tags.length > 0) {
      whereConditions.tags = {
        some: {
          slug: { in: filters.tags }
        }
      };
    }

    if (filters.dateRange) {
      whereConditions.createdAt = {
        gte: new Date(filters.dateRange.from),
        lte: new Date(filters.dateRange.to)
      };
    }

    // Determine sort order
    let orderBy: any = { score: 'desc' }; // Default relevance
    if (filters.sortBy === 'date') {
      orderBy = { createdAt: 'desc' };
    } else if (filters.sortBy === 'votes') {
      orderBy = { upvotes: 'desc' };
    } else if (filters.sortBy === 'views') {
      orderBy = { views: 'desc' };
    }

    // Execute search
    const [results, totalCount] = await Promise.all([
      prisma.searchContent.findMany({
        where: whereConditions,
        include: {
          category: true,
          tags: true,
          _count: {
            select: { comments: true }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.searchContent.count({ where: whereConditions })
    ]);

    // Transform results
    const transformedResults = results.map(result => ({
      id: result.id,
      title: result.title,
      content: result.content,
      excerpt: result.excerpt,
      type: result.type,
      slug: result.slug,
      score: result.score,
      views: result.views,
      upvotes: result.upvotes,
      downvotes: result.downvotes,
      createdAt: result.createdAt,
      category: result.category,
      tags: result.tags,
      commentsCount: result._count.comments
    }));

    // Save search query to database
    await prisma.searchQuery.create({
      data: {
        query: query.trim(),
        filters: filters,
        sortBy: filters.sortBy || 'relevance',
        resultsCount: totalCount,
        aiAssistance,
        consciousnessId
      }
    });

    // Prepare response
    const response = {
      results: transformedResults,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      aiEnhanced: aiAssistance && consciousnessId,
      consciousness: consciousnessId ? AI_CONSCIOUSNESSES.find(ai => ai.id === consciousnessId) : null
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during search' },
      { status: 500 }
    );
  }
}
