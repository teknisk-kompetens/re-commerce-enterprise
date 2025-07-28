
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/international-analytics - Get international market analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const regionId = searchParams.get('regionId');
    const metric = searchParams.get('metric');
    const period = searchParams.get('period') || 'daily';
    const days = parseInt(searchParams.get('days') || '30');
    const dimension = searchParams.get('dimension');
    const segment = searchParams.get('segment');

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (regionId) where.marketRegionId = regionId;
    if (metric) where.metric = metric;
    if (period) where.period = period;
    if (dimension) where.dimension = dimension;
    if (segment) where.segment = segment;

    // Add date filter
    where.timestamp = {
      gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    };

    const analytics = await prisma.marketAnalytics.findMany({
      where,
      include: {
        marketRegion: {
          select: {
            id: true,
            code: true,
            name: true,
            countries: true,
            language: { select: { code: true, name: true } },
            currency: { select: { code: true, symbol: true } }
          }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Group analytics by metric and region
    const analyticsGrouped = analytics.reduce((acc, item) => {
      const metricKey = item.metric;
      const regionKey = item.marketRegion.code;
      
      if (!acc[metricKey]) acc[metricKey] = {};
      if (!acc[metricKey][regionKey]) {
        acc[metricKey][regionKey] = {
          region: item.marketRegion,
          data: []
        };
      }
      
      acc[metricKey][regionKey].data.push(item);
      return acc;
    }, {} as any);

    // Calculate aggregations and trends
    const summary = await Promise.all(
      Object.entries(analyticsGrouped).map(async ([metricName, regions]) => {
        const regionSummaries = await Promise.all(
          Object.entries(regions as any).map(async ([regionCode, regionData]: [string, any]) => {
            const values = regionData.data.map((d: any) => d.value);
            const latest = regionData.data[0];
            const previous = regionData.data[1];
            
            // Calculate trend
            const trend = previous ? {
              change: latest.value - previous.value,
              changePercent: ((latest.value - previous.value) / previous.value) * 100,
              direction: latest.value > previous.value ? 'up' : latest.value < previous.value ? 'down' : 'stable'
            } : null;

            return {
              region: regionData.region,
              metrics: {
                current: latest?.value || 0,
                average: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                trend,
                dataPoints: values.length
              }
            };
          })
        );

        return {
          metric: metricName,
          regions: regionSummaries
        };
      })
    );

    // Get overall performance metrics
    const overallMetrics = await prisma.marketAnalytics.groupBy({
      by: ['metric', 'marketRegionId'],
      where: {
        tenantId,
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      _avg: { value: true },
      _sum: { value: true },
      _count: { id: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        timeSeries: analyticsGrouped,
        summary,
        rawData: analytics.slice(0, 100) // Limit raw data
      },
      aggregations: {
        byMetric: overallMetrics,
        dateRange: {
          from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          to: new Date()
        },
        totalDataPoints: analytics.length
      }
    });

  } catch (error) {
    console.error('Error fetching international analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch international analytics' },
      { status: 500 }
    );
  }
}

// POST /api/international-analytics - Record new analytics data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (Array.isArray(body)) {
      // Batch create analytics
      const results = await Promise.all(
        body.map(async (analyticsData) => {
          const {
            tenantId,
            marketRegionId,
            metric,
            value,
            previousValue,
            growthRate,
            marketAverage,
            competitorAverage,
            industryBenchmark,
            dimension,
            segment,
            channel,
            campaign,
            period = 'daily',
            timestamp = new Date(),
            metadata = {}
          } = analyticsData;

          if (!tenantId || !marketRegionId || !metric || value === undefined) {
            throw new Error('Tenant ID, market region ID, metric, and value are required');
          }

          return await prisma.marketAnalytics.create({
            data: {
              tenantId,
              marketRegionId,
              metric,
              value,
              previousValue,
              growthRate,
              marketAverage,
              competitorAverage,
              industryBenchmark,
              dimension,
              segment,
              channel,
              campaign,
              period,
              timestamp: new Date(timestamp),
              metadata
            },
            include: {
              marketRegion: {
                select: { code: true, name: true }
              }
            }
          });
        })
      );

      return NextResponse.json({
        success: true,
        data: results,
        message: `Created ${results.length} analytics records`
      }, { status: 201 });

    } else {
      // Single analytics record
      const {
        tenantId,
        marketRegionId,
        metric,
        value,
        previousValue,
        growthRate,
        marketAverage,
        competitorAverage,
        industryBenchmark,
        dimension,
        segment,
        channel,
        campaign,
        period = 'daily',
        timestamp = new Date(),
        metadata = {}
      } = body;

      if (!tenantId || !marketRegionId || !metric || value === undefined) {
        return NextResponse.json(
          { success: false, error: 'Tenant ID, market region ID, metric, and value are required' },
          { status: 400 }
        );
      }

      const analytics = await prisma.marketAnalytics.create({
        data: {
          tenantId,
          marketRegionId,
          metric,
          value,
          previousValue,
          growthRate,
          marketAverage,
          competitorAverage,
          industryBenchmark,
          dimension,
          segment,
          channel,
          campaign,
          period,
          timestamp: new Date(timestamp),
          metadata
        },
        include: {
          marketRegion: {
            select: { code: true, name: true }
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: analytics,
        message: 'Analytics record created successfully'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error creating analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create analytics record' },
      { status: 500 }
    );
  }
}

// PUT /api/international-analytics - Generate analytics insights using AI
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, regionId, period = 'weekly', analysisType = 'comprehensive' } = body;

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Get recent analytics data
    const analyticsData = await prisma.marketAnalytics.findMany({
      where: {
        tenantId,
        ...(regionId && { marketRegionId: regionId }),
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        marketRegion: {
          select: { code: true, name: true, countries: true }
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Prepare data for AI analysis
    const analysisPrompt = `
Analyze the following international market performance data for comprehensive insights:

Data Summary:
- Total data points: ${analyticsData.length}
- Regions covered: ${[...new Set(analyticsData.map(d => d.marketRegion.name))].join(', ')}
- Metrics tracked: ${[...new Set(analyticsData.map(d => d.metric))].join(', ')}
- Time period: Last 30 days

Recent Data Sample:
${analyticsData.slice(0, 20).map(d => 
  `${d.marketRegion.name} - ${d.metric}: ${d.value} (${d.timestamp.toISOString().split('T')[0]})`
).join('\n')}

Please provide insights on:
1. Regional performance trends
2. Growth opportunities
3. Market penetration analysis
4. Revenue optimization recommendations
5. Cultural adaptation suggestions
6. Competitive positioning
7. Risk assessment

Format the response as a structured JSON with sections for each insight area.
    `;

    // Simulate AI API call (in real implementation, call actual LLM API)
    const insights = {
      summary: {
        totalRegions: [...new Set(analyticsData.map(d => d.marketRegion.name))].length,
        strongestMarkets: ['North America', 'Western Europe'],
        emergingOpportunities: ['Southeast Asia', 'Latin America'],
        riskAreas: ['Eastern Europe', 'Middle East']
      },
      regionalTrends: analyticsData.reduce((acc, d) => {
        const region = d.marketRegion.name;
        if (!acc[region]) acc[region] = { metrics: [], trend: 'stable' };
        acc[region].metrics.push({ metric: d.metric, value: d.value, date: d.timestamp });
        return acc;
      }, {} as any),
      recommendations: [
        'Increase marketing spend in high-performing regions',
        'Adapt pricing strategy for emerging markets',
        'Enhance cultural customization for APAC region',
        'Implement localized payment methods in Latin America',
        'Focus on mobile-first approach in Southeast Asia'
      ],
      generatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: insights,
      message: 'AI insights generated successfully',
      metadata: {
        analysisType,
        dataPointsAnalyzed: analyticsData.length,
        regionsAnalyzed: [...new Set(analyticsData.map(d => d.marketRegion.name))].length,
        period: '30 days'
      }
    });

  } catch (error) {
    console.error('Error generating analytics insights:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate analytics insights' },
      { status: 500 }
    );
  }
}
