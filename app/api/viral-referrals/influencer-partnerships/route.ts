
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const tier = searchParams.get("tier");
    const partnershipType = searchParams.get("partnershipType");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(status && { status }),
      ...(tier && { tier }),
      ...(partnershipType && { partnershipType })
    };

    const [partnerships, totalCount, performanceStats, campaignStats] = await Promise.all([
      prisma.influencerPartnership.findMany({
        where: whereClause,
        include: {
          influencer: {
            select: {
              name: true,
              email: true
            }
          },
          campaigns: {
            select: {
              id: true,
              name: true,
              status: true,
              actualReach: true,
              actualConversions: true,
              actualRevenue: true,
              roi: true
            },
            orderBy: { createdAt: "desc" },
            take: 3
          },
          analytics: {
            where: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            },
            orderBy: { date: "desc" },
            take: 1,
            select: {
              reach: true,
              engagements: true,
              conversions: true,
              revenue: true,
              roi: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset
      }),
      prisma.influencerPartnership.count({ where: whereClause }),
      prisma.influencerPartnership.aggregate({
        where: whereClause,
        _sum: {
          totalReach: true,
          totalEngagements: true,
          conversions: true,
          revenue: true
        },
        _avg: {
          engagementRate: true,
          commissionRate: true
        }
      }),
      prisma.influencerCampaign.groupBy({
        by: ["status"],
        where: {
          tenantId,
          partnership: {
            ...whereClause
          }
        },
        _count: {
          status: true
        }
      })
    ]);

    // Convert BigInt fields for JSON serialization
    const serializedPartnerships = partnerships.map(partnership => ({
      ...partnership,
      totalReach: partnership.totalReach.toString(),
      campaigns: partnership.campaigns?.map(campaign => ({
        ...campaign,
        actualReach: campaign.actualReach.toString()
      })),
      analytics: partnership.analytics?.map(analytic => ({
        ...analytic,
        reach: analytic.reach.toString()
      }))
    }));

    const serializedPerformanceStats = {
      ...performanceStats,
      _sum: {
        ...performanceStats._sum,
        totalReach: performanceStats._sum.totalReach?.toString() || "0"
      }
    };

    return NextResponse.json({
      partnerships: serializedPartnerships,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      performanceStats: serializedPerformanceStats,
      campaignStats,
      summary: {
        totalPartnerships: totalCount,
        activePartnerships: partnerships.filter(p => p.status === "active").length,
        totalReach: performanceStats._sum.totalReach?.toString() || "0",
        averageEngagementRate: performanceStats._avg.engagementRate || 0,
        totalRevenue: performanceStats._sum.revenue || 0,
        averageROI: calculateAverageROI(partnerships)
      }
    });

  } catch (error) {
    console.error("Error fetching influencer partnerships:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "create_partnership":
        return await createPartnership(data, session.user.id);
        
      case "find_influencers":
        return await findInfluencers(data);
        
      case "negotiate_terms":
        return await negotiateTerms(data);
        
      case "evaluate_performance":
        return await evaluatePerformance(data);
        
      case "bulk_outreach":
        return await bulkOutreach(data, session.user.id);
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error processing influencer partnership request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function createPartnership(data: any, userId: string) {
  const {
    tenantId,
    influencerId,
    partnershipType,
    tier,
    primaryPlatform,
    followersCount,
    engagementRate,
    compensationType,
    compensationAmount,
    commissionRate,
    contentRequirements,
    deliverables,
    timeline,
    startDate,
    endDate,
    exclusivityPeriod
  } = data;

  if (!tenantId || !influencerId || !partnershipType || !startDate) {
    throw new Error("Missing required fields");
  }

  // Verify influencer exists
  const influencer = await prisma.user.findUnique({
    where: { id: influencerId },
    select: { id: true, name: true, email: true }
  });

  if (!influencer) {
    throw new Error("Influencer not found");
  }

  // Check for existing active partnership
  const existingPartnership = await prisma.influencerPartnership.findFirst({
    where: {
      tenantId,
      influencerId,
      status: { in: ["pending", "active"] }
    }
  });

  if (existingPartnership) {
    throw new Error("Active partnership already exists with this influencer");
  }

  const partnership = await prisma.influencerPartnership.create({
    data: {
      tenantId,
      influencerId,
      partnershipType,
      status: "pending",
      tier: tier || "micro",
      primaryPlatform,
      followersCount: followersCount || 0,
      engagementRate: engagementRate || 0.0,
      audienceReach: Math.floor((followersCount || 0) * (engagementRate || 0.03)),
      compensationType: compensationType || "commission",
      compensationAmount: compensationAmount || 0.0,
      commissionRate: commissionRate || 0.1,
      contentRequirements: contentRequirements || {},
      deliverables: deliverables || {},
      timeline: timeline || {},
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      exclusivityPeriod: exclusivityPeriod || null,
      contentCreated: 0,
      totalReach: BigInt(0),
      totalEngagements: 0,
      conversions: 0,
      revenue: 0.0
    },
    include: {
      influencer: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  // Generate partnership contract/agreement
  const contract = await generatePartnershipContract(partnership);

  // Send notification to influencer
  await sendPartnershipInvitation(partnership);

  // Convert BigInt for JSON serialization
  const serializedPartnership = {
    ...partnership,
    totalReach: partnership.totalReach.toString()
  };

  return {
    success: true,
    partnership: serializedPartnership,
    contract,
    nextSteps: [
      "Influencer will receive partnership invitation",
      "Review and approval process will begin",
      "Contract negotiation if needed",
      "Partnership activation upon agreement"
    ]
  };
}

async function findInfluencers(data: any) {
  const {
    tenantId,
    niche,
    platform,
    minFollowers = 1000,
    maxFollowers = 1000000,
    minEngagementRate = 0.01,
    location,
    audienceAge,
    audienceGender,
    budget,
    campaignType
  } = data;

  // Simulate influencer discovery algorithm
  const influencers = await discoverInfluencers({
    niche,
    platform,
    minFollowers,
    maxFollowers,
    minEngagementRate,
    location,
    audienceAge,
    audienceGender,
    budget,
    campaignType
  });

  // Calculate compatibility scores
  const scoredInfluencers = influencers.map(influencer => ({
    ...influencer,
    compatibilityScore: calculateCompatibilityScore(influencer, data),
    estimatedCost: estimatePartnershipCost(influencer, campaignType, budget),
    audienceMatch: calculateAudienceMatch(influencer, data),
    riskAssessment: assessPartnershipRisk(influencer)
  }));

  // Sort by compatibility score
  scoredInfluencers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return {
    success: true,
    influencers: scoredInfluencers.slice(0, 20),
    searchCriteria: data,
    totalFound: scoredInfluencers.length,
    summary: {
      averageFollowers: calculateAverageFollowers(scoredInfluencers),
      averageEngagementRate: calculateAverageEngagementRate(scoredInfluencers),
      topPlatforms: getTopPlatforms(scoredInfluencers),
      budgetRange: getBudgetRange(scoredInfluencers)
    }
  };
}

async function negotiateTerms(data: any) {
  const {
    partnershipId,
    proposedTerms,
    negotiationRound = 1,
    counterOffer = false
  } = data;

  if (!partnershipId || !proposedTerms) {
    throw new Error("Missing required fields");
  }

  const partnership = await prisma.influencerPartnership.findUnique({
    where: { id: partnershipId },
    include: {
      influencer: {
        select: { name: true, email: true }
      }
    }
  });

  if (!partnership) {
    throw new Error("Partnership not found");
  }

  // Analyze proposed terms
  const termAnalysis = analyzeProposedTerms(proposedTerms, partnership);
  
  // Generate counter-proposal if needed
  const negotiationResponse = await generateNegotiationResponse(
    proposedTerms,
    partnership,
    negotiationRound,
    counterOffer
  );

  // Update partnership with new terms if accepted
  if (negotiationResponse.accepted) {
    await prisma.influencerPartnership.update({
      where: { id: partnershipId },
      data: {
        compensationAmount: proposedTerms.compensationAmount || partnership.compensationAmount,
        commissionRate: proposedTerms.commissionRate || partnership.commissionRate,
        contentRequirements: proposedTerms.contentRequirements || partnership.contentRequirements,
        deliverables: proposedTerms.deliverables || partnership.deliverables,
        timeline: proposedTerms.timeline || partnership.timeline,
        status: "active"
      }
    });
  }

  return {
    success: true,
    negotiationResponse,
    termAnalysis,
    currentRound: negotiationRound,
    partnership: partnership,
    nextSteps: negotiationResponse.accepted 
      ? ["Partnership activated", "Begin campaign planning"]
      : ["Review counter-proposal", "Continue negotiation"]
  };
}

async function evaluatePerformance(data: any) {
  const { partnershipId, campaignId, metrics } = data;

  if (!partnershipId) {
    throw new Error("Partnership ID required");
  }

  const partnership = await prisma.influencerPartnership.findUnique({
    where: { id: partnershipId },
    include: {
      campaigns: {
        include: {
          content: true
        }
      },
      analytics: {
        orderBy: { date: "desc" },
        take: 30 // Last 30 records
      },
      content: true
    }
  });

  if (!partnership) {
    throw new Error("Partnership not found");
  }

  // Calculate performance metrics
  const performanceMetrics = calculatePerformanceMetrics(partnership);
  
  // Generate insights and recommendations
  const insights = generatePerformanceInsights(partnership, performanceMetrics);
  
  // Calculate ROI and cost effectiveness
  const financialAnalysis = calculateFinancialAnalysis(partnership);
  
  // Benchmark against industry standards
  const benchmarks = await getBenchmarks(partnership.tier, partnership.primaryPlatform);

  return {
    success: true,
    partnership: {
      ...partnership,
      totalReach: partnership.totalReach.toString()
    },
    performanceMetrics,
    insights,
    financialAnalysis,
    benchmarks,
    recommendations: generatePerformanceRecommendations(performanceMetrics, benchmarks)
  };
}

async function bulkOutreach(data: any, userId: string) {
  const {
    tenantId,
    influencerIds,
    campaignTemplate,
    personalizedMessages = true,
    scheduledSend = false,
    sendAt
  } = data;

  if (!tenantId || !influencerIds || !Array.isArray(influencerIds)) {
    throw new Error("Missing required fields");
  }

  const outreachResults = [];
  const errors = [];

  for (const influencerId of influencerIds) {
    try {
      // Create preliminary partnership record
      const partnership = await prisma.influencerPartnership.create({
        data: {
          tenantId,
          influencerId,
          partnershipType: "collaboration",
          status: "pending",
          tier: "micro", // Default tier
          primaryPlatform: "youtube", // Default platform
          followersCount: 0,
          engagementRate: 0.0,
          audienceReach: 0,
          compensationType: "commission",
          compensationAmount: 0.0,
          commissionRate: 0.1,
          startDate: new Date(),
          contentCreated: 0,
          totalReach: BigInt(0),
          totalEngagements: 0,
          conversions: 0,
          revenue: 0.0
        }
      });

      // Generate personalized outreach message
      const message = personalizedMessages 
        ? await generatePersonalizedOutreach(influencerId, campaignTemplate)
        : campaignTemplate.defaultMessage;

      // Schedule or send outreach
      const outreachResult = scheduledSend
        ? await scheduleOutreach(partnership.id, message, new Date(sendAt))
        : await sendOutreach(partnership.id, message);

      outreachResults.push({
        influencerId,
        partnershipId: partnership.id,
        success: true,
        ...outreachResult
      });

    } catch (error) {
      errors.push({
        influencerId,
        error: error.message
      });
    }
  }

  return {
    success: true,
    outreached: outreachResults.length,
    errors: errors.length,
    results: outreachResults,
    errors,
    campaign: {
      totalInfluencers: influencerIds.length,
      successRate: (outreachResults.length / influencerIds.length) * 100,
      estimatedResponseRate: 0.15, // 15% typical response rate
      estimatedPartnerships: Math.floor(outreachResults.length * 0.05) // 5% conversion rate
    }
  };
}

// Helper functions
function calculateAverageROI(partnerships: any[]) {
  const partnershipsWithROI = partnerships.filter(p => p.analytics && p.analytics.length > 0);
  if (partnershipsWithROI.length === 0) return 0;
  
  const totalROI = partnershipsWithROI.reduce((sum, p) => {
    const latestAnalytics = p.analytics[0];
    return sum + (latestAnalytics?.roi || 0);
  }, 0);
  
  return totalROI / partnershipsWithROI.length;
}

async function generatePartnershipContract(partnership: any) {
  // Generate partnership contract based on terms
  return {
    contractId: `CONTRACT_${partnership.id}`,
    terms: {
      compensation: `${partnership.compensationType}: ${partnership.compensationAmount || partnership.commissionRate}`,
      duration: `${partnership.startDate} to ${partnership.endDate || "ongoing"}`,
      deliverables: partnership.deliverables,
      exclusivity: partnership.exclusivityPeriod ? `${partnership.exclusivityPeriod} days` : "Non-exclusive"
    },
    clauses: [
      "Content must align with brand guidelines",
      "Performance metrics will be tracked and reported",
      "Payment terms: Net 30 days",
      "Either party may terminate with 30 days notice"
    ],
    generatedAt: new Date()
  };
}

async function sendPartnershipInvitation(partnership: any) {
  // Send partnership invitation to influencer
  // This would integrate with email service in production
  return {
    sent: true,
    method: "email",
    recipient: partnership.influencer.email,
    template: "partnership_invitation",
    sentAt: new Date()
  };
}

async function discoverInfluencers(criteria: any) {
  // Simulate influencer discovery
  // In production, this would integrate with influencer databases and social media APIs
  const mockInfluencers = Array.from({ length: 50 }, (_, i) => ({
    id: `influencer_${i + 1}`,
    name: `Influencer ${i + 1}`,
    platform: criteria.platform || "youtube",
    followers: Math.floor(Math.random() * (criteria.maxFollowers - criteria.minFollowers)) + criteria.minFollowers,
    engagementRate: Math.random() * 0.1 + criteria.minEngagementRate,
    niche: criteria.niche || "technology",
    location: criteria.location || "global",
    averageViews: Math.floor(Math.random() * 100000),
    contentQuality: Math.random() * 5 + 5, // 5-10 scale
    audienceDemographics: {
      age: { "18-24": 20, "25-34": 40, "35-44": 25, "45+": 15 },
      gender: { male: 60, female: 40 },
      location: { US: 50, Europe: 30, Other: 20 }
    },
    previousBrandCollaborations: Math.floor(Math.random() * 20),
    rating: Math.random() * 2 + 3 // 3-5 rating
  }));

  return mockInfluencers;
}

function calculateCompatibilityScore(influencer: any, criteria: any) {
  let score = 0;
  
  // Follower count match (0-25 points)
  const followerRatio = influencer.followers / criteria.maxFollowers;
  score += Math.min(followerRatio * 25, 25);
  
  // Engagement rate (0-25 points)
  score += (influencer.engagementRate / 0.1) * 25;
  
  // Niche match (0-20 points)
  if (influencer.niche === criteria.niche) score += 20;
  
  // Content quality (0-15 points)
  score += (influencer.contentQuality / 10) * 15;
  
  // Previous collaborations (0-15 points)
  score += Math.min((influencer.previousBrandCollaborations / 10) * 15, 15);
  
  return Math.min(score, 100);
}

function estimatePartnershipCost(influencer: any, campaignType: string, budget: number) {
  const baseCost = influencer.followers * 0.01; // $0.01 per follower
  const engagementMultiplier = 1 + influencer.engagementRate * 10;
  const campaignMultiplier = campaignType === "long_term" ? 0.8 : 1.0;
  
  return Math.min(baseCost * engagementMultiplier * campaignMultiplier, budget * 0.3);
}

function calculateAudienceMatch(influencer: any, criteria: any) {
  let match = 0;
  
  if (criteria.audienceAge) {
    const ageMatch = influencer.audienceDemographics.age[criteria.audienceAge] || 0;
    match += ageMatch;
  }
  
  if (criteria.audienceGender) {
    const genderMatch = influencer.audienceDemographics.gender[criteria.audienceGender] || 0;
    match += genderMatch;
  }
  
  if (criteria.location) {
    const locationMatch = influencer.audienceDemographics.location[criteria.location] || 0;
    match += locationMatch;
  }
  
  return Math.min(match / 3, 100); // Average and cap at 100%
}

function assessPartnershipRisk(influencer: any) {
  let risk = 0;
  
  // Low engagement rate increases risk
  if (influencer.engagementRate < 0.02) risk += 30;
  
  // Too many previous collaborations might indicate over-commercialization
  if (influencer.previousBrandCollaborations > 15) risk += 20;
  
  // Low content quality increases risk
  if (influencer.contentQuality < 6) risk += 25;
  
  // Low rating increases risk
  if (influencer.rating < 4) risk += 25;
  
  return Math.min(risk, 100);
}

function analyzeProposedTerms(proposedTerms: any, partnership: any) {
  const analysis = {
    compensation: "acceptable",
    timeline: "reasonable",
    deliverables: "fair",
    risk: "low"
  };

  // Analyze compensation
  if (proposedTerms.compensationAmount > partnership.compensationAmount * 1.5) {
    analysis.compensation = "high";
  } else if (proposedTerms.compensationAmount < partnership.compensationAmount * 0.8) {
    analysis.compensation = "low";
  }

  // Analyze timeline
  if (proposedTerms.timeline?.duration > 180) { // More than 6 months
    analysis.timeline = "long";
  } else if (proposedTerms.timeline?.duration < 30) { // Less than 1 month
    analysis.timeline = "short";
  }

  return analysis;
}

async function generateNegotiationResponse(
  proposedTerms: any,
  partnership: any,
  round: number,
  counterOffer: boolean
) {
  // Simulate negotiation logic
  const acceptanceProbability = Math.max(0.1, 0.8 - (round * 0.2));
  const accepted = Math.random() < acceptanceProbability;

  if (accepted) {
    return {
      accepted: true,
      message: "Terms accepted. Partnership agreement finalized.",
      finalTerms: proposedTerms
    };
  } else {
    return {
      accepted: false,
      message: "Counter-proposal submitted with modified terms.",
      counterProposal: {
        compensationAmount: proposedTerms.compensationAmount * 0.9,
        timeline: proposedTerms.timeline,
        additionalRequirements: ["Brand exclusivity in niche", "Performance bonus structure"]
      },
      negotiationContinues: true
    };
  }
}

function calculatePerformanceMetrics(partnership: any) {
  const totalReach = Number(partnership.totalReach);
  const totalEngagements = partnership.totalEngagements;
  const conversions = partnership.conversions;
  const revenue = partnership.revenue;

  return {
    reach: totalReach,
    engagements: totalEngagements,
    conversions,
    revenue,
    engagementRate: totalReach > 0 ? totalEngagements / totalReach : 0,
    conversionRate: totalEngagements > 0 ? conversions / totalEngagements : 0,
    revenuePerConversion: conversions > 0 ? revenue / conversions : 0,
    costPerAcquisition: conversions > 0 ? partnership.compensationAmount / conversions : 0,
    roi: partnership.compensationAmount > 0 ? ((revenue - partnership.compensationAmount) / partnership.compensationAmount) * 100 : 0
  };
}

function generatePerformanceInsights(partnership: any, metrics: any) {
  const insights = [];

  if (metrics.engagementRate > 0.05) {
    insights.push({
      type: "positive",
      message: "Excellent engagement rate above industry average",
      impact: "high"
    });
  }

  if (metrics.roi > 300) {
    insights.push({
      type: "positive",
      message: "Outstanding ROI performance",
      impact: "high"
    });
  }

  if (metrics.conversionRate < 0.01) {
    insights.push({
      type: "warning",
      message: "Low conversion rate - consider optimizing call-to-action",
      impact: "medium"
    });
  }

  return insights;
}

function calculateFinancialAnalysis(partnership: any) {
  const totalInvestment = partnership.compensationAmount;
  const totalRevenue = partnership.revenue;
  const profit = totalRevenue - totalInvestment;
  const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;

  return {
    investment: totalInvestment,
    revenue: totalRevenue,
    profit,
    roi,
    paybackPeriod: calculatePaybackPeriod(partnership),
    costEffectiveness: partnership.conversions > 0 ? totalInvestment / partnership.conversions : 0
  };
}

async function getBenchmarks(tier: string, platform: string) {
  // Industry benchmarks by tier and platform
  const benchmarks: any = {
    nano: { engagementRate: 0.08, cpm: 50, conversionRate: 0.02 },
    micro: { engagementRate: 0.06, cpm: 100, conversionRate: 0.015 },
    macro: { engagementRate: 0.04, cpm: 200, conversionRate: 0.01 },
    mega: { engagementRate: 0.02, cpm: 500, conversionRate: 0.008 }
  };

  return benchmarks[tier] || benchmarks.micro;
}

function generatePerformanceRecommendations(metrics: any, benchmarks: any) {
  const recommendations = [];

  if (metrics.engagementRate < benchmarks.engagementRate) {
    recommendations.push({
      priority: "high",
      category: "engagement",
      message: "Improve content quality and audience targeting to increase engagement",
      expectedImpact: "20-30% engagement improvement"
    });
  }

  if (metrics.conversionRate < benchmarks.conversionRate) {
    recommendations.push({
      priority: "medium",
      category: "conversion",
      message: "Optimize call-to-action and landing page experience",
      expectedImpact: "15-25% conversion improvement"
    });
  }

  return recommendations;
}

async function generatePersonalizedOutreach(influencerId: string, template: any) {
  // Generate personalized outreach message
  const influencer = await prisma.user.findUnique({
    where: { id: influencerId },
    select: { name: true }
  });

  return template.defaultMessage.replace("{{name}}", influencer?.name || "");
}

async function scheduleOutreach(partnershipId: string, message: string, sendAt: Date) {
  // Schedule outreach for future sending
  return {
    scheduled: true,
    sendAt,
    message,
    status: "scheduled"
  };
}

async function sendOutreach(partnershipId: string, message: string) {
  // Send immediate outreach
  return {
    sent: true,
    sentAt: new Date(),
    message,
    status: "sent"
  };
}

// Additional helper functions
function calculateAverageFollowers(influencers: any[]) {
  return influencers.reduce((sum, inf) => sum + inf.followers, 0) / influencers.length;
}

function calculateAverageEngagementRate(influencers: any[]) {
  return influencers.reduce((sum, inf) => sum + inf.engagementRate, 0) / influencers.length;
}

function getTopPlatforms(influencers: any[]) {
  const platformCounts: any = {};
  influencers.forEach(inf => {
    platformCounts[inf.platform] = (platformCounts[inf.platform] || 0) + 1;
  });
  
  return Object.entries(platformCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([platform, count]) => ({ platform, count }));
}

function getBudgetRange(influencers: any[]) {
  const costs = influencers.map(inf => inf.estimatedCost);
  return {
    min: Math.min(...costs),
    max: Math.max(...costs),
    average: costs.reduce((sum, cost) => sum + cost, 0) / costs.length
  };
}

function calculatePaybackPeriod(partnership: any) {
  // Calculate how long it takes to recover investment
  const monthlyRevenue = partnership.revenue / 12; // Assume annual revenue spread over 12 months
  return monthlyRevenue > 0 ? partnership.compensationAmount / monthlyRevenue : Infinity;
}
