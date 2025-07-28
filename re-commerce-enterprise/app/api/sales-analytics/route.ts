
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    const segment = searchParams.get('segment') || 'all';

    // Mock sales analytics data
    const salesAnalytics = {
      overview: {
        totalLeads: 2847,
        qualifiedLeads: 1523,
        conversionRate: 34.2,
        averageDealSize: 127500,
        salesCycle: 42, // days
        monthlyGrowth: 18.5
      },
      demographics: {
        industries: [
          { name: 'Retail & E-commerce', percentage: 28.5, deals: 145 },
          { name: 'Healthcare', percentage: 22.1, deals: 112 },
          { name: 'Financial Services', percentage: 18.7, deals: 95 },
          { name: 'Manufacturing', percentage: 15.3, deals: 78 },
          { name: 'Technology', percentage: 10.2, deals: 52 },
          { name: 'Other', percentage: 5.2, deals: 26 }
        ],
        companySize: [
          { size: 'Enterprise (1000+)', percentage: 45.2, avgDeal: 185000 },
          { size: 'Mid-market (100-999)', percentage: 32.8, avgDeal: 98000 },
          { size: 'SMB (10-99)', percentage: 18.4, avgDeal: 45000 },
          { size: 'Startup (<10)', percentage: 3.6, avgDeal: 22000 }
        ]
      },
      performance: {
        pipelineStages: [
          { stage: 'Lead', count: 2847, value: 142350000 },
          { stage: 'Qualified', count: 1523, value: 98430000 },
          { stage: 'Demo Scheduled', count: 945, value: 67890000 },
          { stage: 'Proposal', count: 524, value: 42120000 },
          { stage: 'Negotiation', count: 298, value: 28750000 },
          { stage: 'Closed Won', count: 156, value: 19890000 }
        ],
        topSalesReps: [
          { name: 'Sarah Chen', deals: 23, revenue: 2940000, conversionRate: 42.1 },
          { name: 'Michael Rodriguez', deals: 19, revenue: 2435000, conversionRate: 38.7 },
          { name: 'Emily Johnson', deals: 21, revenue: 2180000, conversionRate: 36.2 },
          { name: 'David Kim', deals: 17, revenue: 1950000, conversionRate: 33.8 },
          { name: 'Lisa Thompson', deals: 15, revenue: 1720000, conversionRate: 31.5 }
        ]
      },
      trends: {
        monthlyRevenue: [
          { month: 'Jan', revenue: 1850000, deals: 12 },
          { month: 'Feb', revenue: 2100000, deals: 15 },
          { month: 'Mar', revenue: 2450000, deals: 18 },
          { month: 'Apr', revenue: 2780000, deals: 21 },
          { month: 'May', revenue: 3120000, deals: 24 },
          { month: 'Jun', revenue: 3650000, deals: 28 }
        ],
        demoMetrics: {
          totalDemos: 1247,
          completionRate: 78.5,
          averageScore: 8.3,
          topScenarios: [
            { scenario: 'Retail Analytics', demos: 289, avgScore: 8.7 },
            { scenario: 'Healthcare Compliance', demos: 234, avgScore: 8.4 },
            { scenario: 'Financial Risk', demos: 198, avgScore: 8.2 },
            { scenario: 'Manufacturing Ops', demos: 167, avgScore: 7.9 }
          ]
        }
      }
    };

    return NextResponse.json(salesAnalytics);
  } catch (error) {
    console.error('Sales analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales analytics' }, { status: 500 });
  }
}
