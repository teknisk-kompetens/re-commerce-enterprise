
import { NextRequest, NextResponse } from 'next/server';
import { 
  searchEngine, 
  getSuggestions, 
  searchByCategory, 
  searchByType, 
  SearchableItem 
} from '@/lib/search-index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const type = searchParams.get('type') as SearchableItem['type'] | null;
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    let results;

    if (category) {
      results = searchByCategory(query, category);
    } else if (type) {
      results = searchByType(query, type);
    } else {
      results = getSuggestions(query, limit);
    }

    return NextResponse.json({
      query,
      results: results.slice(0, limit),
      total: results.length,
      category,
      type
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { queries } = body;

    if (!Array.isArray(queries)) {
      return NextResponse.json(
        { error: 'Queries must be an array' },
        { status: 400 }
      );
    }

    const results = queries.map(({ query, category, type, limit = 10 }) => {
      if (!query) return { query, results: [], error: 'Query is required' };

      try {
        let searchResults;
        
        if (category) {
          searchResults = searchByCategory(query, category);
        } else if (type) {
          searchResults = searchByType(query, type);
        } else {
          searchResults = getSuggestions(query, limit);
        }

        return {
          query,
          results: searchResults.slice(0, limit),
          total: searchResults.length,
          category,
          type
        };
      } catch (error) {
        return {
          query,
          results: [],
          error: 'Search failed'
        };
      }
    });

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Batch search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
