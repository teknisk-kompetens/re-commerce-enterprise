
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get trending searches (most recent popular queries)
    const trendingQueries = await prisma.searchQuery.groupBy({
      by: ['query'],
      _count: {
        query: true
      },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      orderBy: {
        _count: {
          query: 'desc'
        }
      },
      take: limit
    });

    // Get query suggestions based on partial match
    let suggestions: Array<{ query: string; type: string; resultsCount: number }> = [];
    if (query.length > 0) {
      const matchingQueries = await prisma.searchQuery.findMany({
        where: {
          query: {
            contains: query,
            mode: 'insensitive'
          }
        },
        select: {
          query: true,
          resultsCount: true
        },
        distinct: ['query'],
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });

      suggestions = matchingQueries.map(item => ({
        query: item.query,
        type: 'recent' as const,
        resultsCount: item.resultsCount
      }));
    }

    // Transform trending queries
    const trending = trendingQueries.map(item => ({
      query: item.query,
      type: 'trending' as const,
      count: item._count.query
    }));

    return NextResponse.json({
      suggestions,
      trending,
      query
    });

  } catch (error) {
    console.error('Search suggestions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
