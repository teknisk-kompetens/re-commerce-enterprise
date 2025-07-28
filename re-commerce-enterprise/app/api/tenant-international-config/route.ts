
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/tenant-international-config - Get complete international configuration for tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Get all international configurations for the tenant
    const [
      languages,
      currencies,
      marketRegions,
      paymentMethods,
      expansionRoadmaps,
      supportTickets,
      analytics
    ] = await Promise.all([
      // Languages configuration
      prisma.tenantLanguage.findMany({
        where: { tenantId },
        include: {
          language: {
            select: {
              id: true,
              code: true,
              name: true,
              nativeName: true,
              isRTL: true,
              completeness: true
            }
          }
        },
        orderBy: [
          { isDefault: 'desc' },
          { priority: 'desc' }
        ]
      }),

      // Currencies configuration
      prisma.tenantCurrency.findMany({
        where: { tenantId },
        include: {
          currency: {
            select: {
              id: true,
              code: true,
              name: true,
              symbol: true,
              exchangeRate: true,
              lastUpdated: true
            }
          }
        },
        orderBy: [
          { isDefault: 'desc' }
        ]
      }),

      // Market regions
      prisma.tenantMarketRegion.findMany({
        where: { tenantId },
        include: {
          marketRegion: {
            select: {
              id: true,
              code: true,
              name: true,
              countries: true,
              language: { select: { code: true, name: true } },
              currency: { select: { code: true, name: true, symbol: true } }
            }
          }
        }
      }),

      // Payment methods
      prisma.tenantPaymentMethod.findMany({
        where: { tenantId },
        include: {
          paymentMethod: {
            select: {
              id: true,
              name: true,
              code: true,
              type: true,
              marketRegion: { select: { name: true, code: true } },
              currency: { select: { code: true, name: true } },
              supportedCurrencies: true
            }
          }
        },
        orderBy: { priority: 'desc' }
      }),

      // Expansion roadmaps
      prisma.expansionRoadmap.findMany({
        where: { tenantId },
        select: {
          id: true,
          targetRegion: true,
          targetCountries: true,
          phase: true,
          status: true,
          progressPercent: true,
          plannedLaunch: true,
          actualLaunch: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Recent support tickets by language/region
      prisma.supportTicket.findMany({
        where: { tenantId },
        select: {
          id: true,
          language: true,
          region: true,
          status: true,
          priority: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // Recent analytics
      prisma.marketAnalytics.findMany({
        where: {
          tenantId,
          timestamp: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        include: {
          marketRegion: {
            select: { code: true, name: true }
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 50
      })
    ]);

    // Calculate configuration status
    const configurationStatus = {
      languages: {
        configured: languages.length,
        default: languages.find(l => l.isDefault)?.language.code || null,
        completeness: languages.reduce((sum, l) => sum + l.completeness, 0) / Math.max(languages.length, 1)
      },
      currencies: {
        configured: currencies.length,
        default: currencies.find(c => c.isDefault)?.currency.code || null,
        totalVolume: 0 // Would be calculated from actual transactions
      },
      markets: {
        configured: marketRegions.length,
        launched: marketRegions.filter(m => m.launchDate).length,
        countriesCovered: [...new Set(marketRegions.flatMap(m => m.marketRegion.countries))].length
      },
      payments: {
        configured: paymentMethods.length,
        active: paymentMethods.filter(p => p.isActive).length,
        types: [...new Set(paymentMethods.map(p => p.paymentMethod.type))]
      },
      expansion: {
        total: expansionRoadmaps.length,
        active: expansionRoadmaps.filter(r => r.status === 'in_progress').length,
        launched: expansionRoadmaps.filter(r => r.status === 'launched').length
      },
      support: {
        multilingual: [...new Set(supportTickets.map(t => t.language))].length,
        regions: [...new Set(supportTickets.filter(t => t.region).map(t => t.region))].length,
        openTickets: supportTickets.filter(t => t.status === 'open').length
      }
    };

    // Generate internationalization score
    const internationalizationScore = {
      languageScore: Math.min(100, (languages.length / 5) * 100), // Max at 5 languages
      marketScore: Math.min(100, (marketRegions.length / 3) * 100), // Max at 3 markets
      paymentScore: Math.min(100, (paymentMethods.length / 10) * 100), // Max at 10 payment methods
      expansionScore: Math.min(100, (expansionRoadmaps.filter(r => r.status === 'launched').length / 2) * 100), // Max at 2 launched markets
      overallScore: 0
    };

    internationalizationScore.overallScore = Math.round(
      (internationalizationScore.languageScore + 
       internationalizationScore.marketScore + 
       internationalizationScore.paymentScore + 
       internationalizationScore.expansionScore) / 4
    );

    return NextResponse.json({
      success: true,
      data: {
        languages,
        currencies,
        marketRegions,
        paymentMethods,
        expansionRoadmaps,
        recentAnalytics: analytics.slice(0, 10)
      },
      configuration: configurationStatus,
      score: internationalizationScore,
      recommendations: generateRecommendations(configurationStatus, internationalizationScore)
    });

  } catch (error) {
    console.error('Error fetching tenant international config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenant international configuration' },
      { status: 500 }
    );
  }
}

// POST /api/tenant-international-config - Initialize international configuration for tenant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      primaryLanguage = 'en',
      primaryCurrency = 'USD',
      primaryMarket,
      setupType = 'basic' // basic, advanced, enterprise
    } = body;

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Initialize based on setup type
    const results = [];

    // 1. Setup primary language
    const language = await prisma.language.findUnique({
      where: { code: primaryLanguage }
    });

    if (language) {
      const tenantLanguage = await prisma.tenantLanguage.upsert({
        where: {
          tenantId_languageId: {
            tenantId,
            languageId: language.id
          }
        },
        update: {
          isDefault: true,
          isActive: true,
          priority: 100
        },
        create: {
          tenantId,
          languageId: language.id,
          isDefault: true,
          isActive: true,
          priority: 100,
          translationStatus: 'incomplete',
          completeness: 0
        }
      });
      results.push({ type: 'language', data: tenantLanguage });
    }

    // 2. Setup primary currency
    const currency = await prisma.currency.findUnique({
      where: { code: primaryCurrency }
    });

    if (currency) {
      const tenantCurrency = await prisma.tenantCurrency.upsert({
        where: {
          tenantId_currencyId: {
            tenantId,
            currencyId: currency.id
          }
        },
        update: {
          isDefault: true,
          isActive: true
        },
        create: {
          tenantId,
          currencyId: currency.id,
          isDefault: true,
          isActive: true,
          markupPercentage: 0,
          roundingRule: 'nearest',
          processingFee: 0
        }
      });
      results.push({ type: 'currency', data: tenantCurrency });
    }

    // 3. Setup primary market region if specified
    if (primaryMarket) {
      const marketRegion = await prisma.marketRegion.findUnique({
        where: { code: primaryMarket }
      });

      if (marketRegion) {
        const tenantMarketRegion = await prisma.tenantMarketRegion.upsert({
          where: {
            tenantId_marketRegionId: {
              tenantId,
              marketRegionId: marketRegion.id
            }
          },
          update: {
            isActive: true,
            launchDate: new Date()
          },
          create: {
            tenantId,
            marketRegionId: marketRegion.id,
            isActive: true,
            launchDate: new Date(),
            customizations: {},
            features: {},
            restrictions: {},
            penetration: 0,
            revenue: 0,
            userCount: 0,
            conversionRate: 0
          }
        });
        results.push({ type: 'market', data: tenantMarketRegion });
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `International configuration initialized with ${setupType} setup`,
      nextSteps: [
        'Configure additional languages for your target markets',
        'Set up payment methods for each region',
        'Create cultural customizations for different markets',
        'Define expansion roadmaps for new markets'
      ]
    }, { status: 201 });

  } catch (error) {
    console.error('Error initializing international config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize international configuration' },
      { status: 500 }
    );
  }
}

// Helper function to generate recommendations
function generateRecommendations(config: any, score: any) {
  const recommendations = [];

  if (config.languages.configured < 3) {
    recommendations.push({
      type: 'language',
      priority: 'high',
      title: 'Add more languages',
      description: 'Consider adding languages for your target markets to improve global reach'
    });
  }

  if (config.markets.configured < 2) {
    recommendations.push({
      type: 'market',
      priority: 'medium',
      title: 'Expand to new markets',
      description: 'Create expansion roadmaps for high-potential international markets'
    });
  }

  if (config.payments.configured < 5) {
    recommendations.push({
      type: 'payment',
      priority: 'high',
      title: 'Add regional payment methods',
      description: 'Integrate popular payment methods for each target region'
    });
  }

  if (score.overallScore < 50) {
    recommendations.push({
      type: 'overall',
      priority: 'critical',
      title: 'Improve international readiness',
      description: 'Your international configuration needs significant improvement for global expansion'
    });
  }

  return recommendations;
}
