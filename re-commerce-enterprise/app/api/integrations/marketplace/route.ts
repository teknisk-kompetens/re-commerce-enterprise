
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get marketplace apps with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'published';
    const sortBy = searchParams.get('sortBy') || 'downloads';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    const whereClause = {
      status,
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as any } },
          { description: { contains: search, mode: 'insensitive' as any } },
          { publisher: { contains: search, mode: 'insensitive' as any } }
        ]
      })
    };

    // Sort options
    const orderBy = (() => {
      switch (sortBy) {
        case 'rating': return { rating: 'desc' as any };
        case 'newest': return { createdAt: 'desc' as any };
        case 'name': return { name: 'asc' as any };
        case 'downloads':
        default: return { downloads: 'desc' as any };
      }
    })();

    const [apps, total, categories] = await Promise.all([
      prisma.marketplaceApp.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit
      }),
      prisma.marketplaceApp.count({ where: whereClause }),
      prisma.marketplaceApp.groupBy({
        by: ['category'],
        where: { status: 'published' },
        _count: true
      })
    ]);

    // Calculate additional metrics (simplified for demo)
    const appsWithMetrics = apps.map(app => {
      return {
        ...app,
        metrics: {
          activeInstalls: Math.floor(app.downloads * 0.3), // Mock: 30% of downloads are active
          totalReviews: app.reviews,
          totalInstalls: app.downloads,
          currentRevenue: Math.floor(app.downloads * 2.5), // Mock revenue calculation
          avgRating: app.rating,
          recentReviews: [] // Mock empty recent reviews
        }
      };
    });

    return NextResponse.json({
      apps: appsWithMetrics,
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        category,
        search,
        status,
        sortBy
      }
    });

  } catch (error) {
    console.error('Error fetching marketplace apps:', error);
    return NextResponse.json({ error: 'Failed to fetch marketplace apps' }, { status: 500 });
  }
}

// Submit new app to marketplace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      category, 
      publisher, 
      version, 
      logo, 
      screenshots,
      pricing,
      features,
      requirements,
      config,
      permissions
    } = body;

    if (!name || !description || !category || !publisher || !version) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, description, category, publisher, version' 
      }, { status: 400 });
    }

    // Validate category
    const validCategories = ['integration', 'automation', 'analytics', 'security', 'productivity', 'marketing', 'ecommerce'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Create app submission
    const app = await prisma.marketplaceApp.create({
      data: {
        name,
        description,
        category,
        publisher,
        version,
        logo,
        screenshots: screenshots || [],
        pricing: pricing || { type: 'free', price: 0 },
        features: features || [],
        requirements: requirements || {},
        config: config || {},
        permissions: permissions || [],
        status: 'pending' // Requires approval
      },
      include: {
        _count: {
          select: {
            reviewRecords: true,
            installations: true
          }
        }
      }
    });

    return NextResponse.json({ app }, { status: 201 });

  } catch (error) {
    console.error('Error creating marketplace app:', error);
    return NextResponse.json({ error: 'Failed to create marketplace app' }, { status: 500 });
  }
}

// Update marketplace app
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      name, 
      description, 
      version, 
      logo, 
      screenshots,
      pricing,
      features,
      requirements,
      config,
      permissions,
      status
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'App ID required' }, { status: 400 });
    }

    const app = await prisma.marketplaceApp.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(version && { version }),
        ...(logo && { logo }),
        ...(screenshots && { screenshots }),
        ...(pricing && { pricing }),
        ...(features && { features }),
        ...(requirements && { requirements }),
        ...(config && { config }),
        ...(permissions && { permissions }),
        ...(status && { status })
      },
      include: {
        reviewRecords: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            reviewRecords: true,
            installations: true
          }
        }
      }
    });

    return NextResponse.json({ app });

  } catch (error) {
    console.error('Error updating marketplace app:', error);
    return NextResponse.json({ error: 'Failed to update marketplace app' }, { status: 500 });
  }
}
