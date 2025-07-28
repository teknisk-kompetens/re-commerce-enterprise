

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tier = searchParams.get("tier");
    const verificationLevel = searchParams.get("verificationLevel");
    const featured = searchParams.get("featured");
    const sortBy = searchParams.get("sortBy") ?? "rating";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = { programStatus: "active" };
    if (userId) whereClause.userId = userId;
    if (tier) whereClause.tier = tier;
    if (verificationLevel) whereClause.verificationLevel = verificationLevel;
    if (featured === "true") whereClause.featured = true;

    let orderBy: any = { rating: "desc" };
    switch (sortBy) {
      case "earnings":
        orderBy = { lifetimeEarnings: "desc" };
        break;
      case "followers":
        orderBy = { followers: "desc" };
        break;
      case "recent":
        orderBy = { createdAt: "desc" };
        break;
      case "trust":
        orderBy = { trustScore: "desc" };
        break;
    }

    const profiles = await prisma.creatorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        subscriptions: {
          where: { status: "active" },
          take: 5,
          include: {
            subscriber: {
              select: { id: true, name: true },
            },
          },
        },
        royalties: {
          where: { status: "paid" },
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        payouts: {
          where: { status: "paid" },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            subscriptions: true,
            royalties: true,
            payouts: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    // Enhance profiles with additional metrics
    const enhancedProfiles = await Promise.all(profiles.map(async (profile) => {
      // Calculate monthly earnings
      const currentMonth = new Date().toISOString().substring(0, 7);
      const monthlyEarnings = await prisma.creatorPayout.aggregate({
        where: {
          creatorId: profile.userId,
          period: currentMonth,
          status: "paid",
        },
        _sum: { netAmount: true },
      });

      // Get recent marketplace items created
      const [recentWidgets, recentTemplates] = await Promise.all([
        prisma.marketplaceWidget.findMany({
          where: { creatorId: profile.userId },
          take: 3,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, category: true, rating: true },
        }),
        prisma.marketplaceTemplate.findMany({
          where: { creatorId: profile.userId },
          take: 3,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, category: true, rating: true },
        }),
      ]);

      return {
        ...profile,
        monthlyEarnings: monthlyEarnings._sum.netAmount ?? 0,
        recentItems: [...recentWidgets, ...recentTemplates],
        performanceScore: calculatePerformanceScore(profile),
      };
    }));

    return NextResponse.json({
      profiles: enhancedProfiles,
      pagination: {
        limit,
        offset,
        total: await prisma.creatorProfile.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch creator profiles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    switch (action) {
      case "create_profile":
        const {
          displayName,
          bio,
          specialties = [],
          website,
          portfolio = [],
          royaltyRate = 0.05,
        } = body;

        // Check if profile already exists
        const existingProfile = await prisma.creatorProfile.findUnique({
          where: { userId },
        });

        if (existingProfile) {
          return NextResponse.json(
            { error: "Creator profile already exists" },
            { status: 400 }
          );
        }

        const profile = await prisma.creatorProfile.create({
          data: {
            userId,
            displayName,
            bio,
            specialties,
            website,
            portfolio,
            royaltyRate,
            tenantId: body.tenantId,
          },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        });

        return NextResponse.json({ profile });

      case "update_profile":
        const updateData: any = {};
        const allowedFields = [
          "displayName", "bio", "specialties", "website", "portfolio",
          "royaltyRate", "autoRoyalty", "publicProfile", "allowMessages"
        ];

        allowedFields.forEach(field => {
          if (body[field] !== undefined) {
            updateData[field] = body[field];
          }
        });

        const updatedProfile = await prisma.creatorProfile.update({
          where: { userId },
          data: updateData,
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        });

        return NextResponse.json({ profile: updatedProfile });

      case "update_tier":
        const { newTier } = body;
        
        const tierRequirements = getTierRequirements(newTier);
        const currentProfile = await prisma.creatorProfile.findUnique({
          where: { userId },
        });

        if (!currentProfile) {
          return NextResponse.json(
            { error: "Creator profile not found" },
            { status: 404 }
          );
        }

        // Check if user meets tier requirements
        const meetsRequirements = checkTierRequirements(currentProfile, tierRequirements);
        
        if (!meetsRequirements.eligible) {
          return NextResponse.json(
            { error: "Does not meet tier requirements", requirements: meetsRequirements },
            { status: 400 }
          );
        }

        const tierUpdatedProfile = await prisma.creatorProfile.update({
          where: { userId },
          data: {
            tier: newTier,
            tierBenefits: tierRequirements.benefits,
            nextTierProgress: 0, // Reset progress
          },
        });

        return NextResponse.json({ profile: tierUpdatedProfile });

      case "feature_profile":
        const { duration = 30 } = body; // Days
        
        const featuredUntil = new Date();
        featuredUntil.setDate(featuredUntil.getDate() + duration);

        const featuredProfile = await prisma.creatorProfile.update({
          where: { userId },
          data: {
            featured: true,
            featuredUntil,
          },
        });

        return NextResponse.json({ profile: featuredProfile });

      case "verify_creator":
        const { verificationLevel } = body;
        
        const verifiedProfile = await prisma.creatorProfile.update({
          where: { userId },
          data: {
            verificationLevel,
            trustScore: Math.min(currentProfile.trustScore + 0.2, 5.0),
          },
        });

        return NextResponse.json({ profile: verifiedProfile });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Creator profile operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform creator profile operation" },
      { status: 500 }
    );
  }
}

function calculatePerformanceScore(profile: any): number {
  const weights = {
    rating: 0.3,
    trustScore: 0.2,
    lifetimeEarnings: 0.2,
    followers: 0.1,
    itemsSold: 0.1,
    reviewCount: 0.1,
  };

  const normalized = {
    rating: Math.min(profile.rating / 5, 1),
    trustScore: Math.min(profile.trustScore / 5, 1),
    lifetimeEarnings: Math.min(profile.lifetimeEarnings / 10000, 1),
    followers: Math.min(profile.followers / 1000, 1),
    itemsSold: Math.min(profile.itemsSold / 100, 1),
    reviewCount: Math.min(profile.reviewCount / 50, 1),
  };

  return Object.entries(weights).reduce(
    (score, [key, weight]) => score + (normalized[key] * weight),
    0
  ) * 100;
}

function getTierRequirements(tier: string) {
  const requirements = {
    creator: {
      minEarnings: 0,
      minRating: 0,
      minSales: 0,
      benefits: { basicSupport: true },
    },
    pro: {
      minEarnings: 1000,
      minRating: 4.0,
      minSales: 10,
      benefits: { prioritySupport: true, advancedAnalytics: true },
    },
    expert: {
      minEarnings: 5000,
      minRating: 4.5,
      minSales: 50,
      benefits: { dedicatedSupport: true, customBranding: true, lowerFees: true },
    },
    master: {
      minEarnings: 20000,
      minRating: 4.8,
      minSales: 200,
      benefits: { allFeatures: true, partnerProgram: true, noFees: true },
    },
  };

  return requirements[tier] || requirements.creator;
}

function checkTierRequirements(profile: any, requirements: any) {
  const checks = {
    earnings: profile.lifetimeEarnings >= requirements.minEarnings,
    rating: profile.rating >= requirements.minRating,
    sales: profile.itemsSold >= requirements.minSales,
  };

  return {
    eligible: Object.values(checks).every(Boolean),
    checks,
    requirements,
  };
}

