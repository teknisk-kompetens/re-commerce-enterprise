

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const creatorId = searchParams.get("creatorId");
    const subscriberId = searchParams.get("subscriberId");
    const status = searchParams.get("status");
    const tier = searchParams.get("tier");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {};
    if (creatorId) whereClause.creatorId = creatorId;
    if (subscriberId) whereClause.subscriberId = subscriberId;
    if (status) whereClause.status = status;
    if (tier) whereClause.tier = tier;

    const subscriptions = await prisma.creatorSubscription.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        subscriber: {
          select: { id: true, name: true, email: true },
        },
        creatorProfile: {
          select: { 
            displayName: true, 
            tier: true, 
            verificationLevel: true,
            specialties: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      subscriptions,
      pagination: {
        limit,
        offset,
        total: await prisma.creatorSubscription.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "create_subscription":
        const {
          creatorId,
          subscriberId,
          subscriptionType = "basic",
          tier = "basic",
          monthlyPrice,
          yearlyPrice,
          benefits = [],
          discountApplied = 0,
        } = body;

        // Check if subscription already exists
        const existingSubscription = await prisma.creatorSubscription.findUnique({
          where: {
            creatorId_subscriberId: {
              creatorId,
              subscriberId,
            },
          },
        });

        if (existingSubscription && existingSubscription.status === "active") {
          return NextResponse.json(
            { error: "Active subscription already exists" },
            { status: 400 }
          );
        }

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // Default to monthly

        const nextPayment = new Date(endDate);

        const subscription = await prisma.creatorSubscription.create({
          data: {
            creatorId,
            subscriberId,
            subscriptionType,
            tier,
            monthlyPrice,
            yearlyPrice,
            benefits,
            discountApplied,
            startDate,
            endDate,
            nextPayment,
            paymentMethod: "credit_card", // Default
            tenantId: body.tenantId,
          },
          include: {
            creator: {
              select: { id: true, name: true },
            },
            subscriber: {
              select: { id: true, name: true },
            },
          },
        });

        // Update creator profile metrics
        await prisma.creatorProfile.update({
          where: { userId: creatorId },
          data: {
            followers: { increment: 1 },
          },
        });

        return NextResponse.json({ subscription });

      case "update_subscription":
        const { subscriptionId, updateData } = body;
        
        const updatedSubscription = await prisma.creatorSubscription.update({
          where: { id: subscriptionId },
          data: updateData,
          include: {
            creator: {
              select: { id: true, name: true },
            },
            subscriber: {
              select: { id: true, name: true },
            },
          },
        });

        return NextResponse.json({ subscription: updatedSubscription });

      case "cancel_subscription":
        const { subscriptionId: cancelId, reason } = body;
        
        const cancelledSubscription = await prisma.creatorSubscription.update({
          where: { id: cancelId },
          data: {
            status: "cancelled",
            endDate: new Date(),
            autoRenew: false,
          },
        });

        // Update creator profile metrics
        await prisma.creatorProfile.update({
          where: { userId: cancelledSubscription.creatorId },
          data: {
            followers: { decrement: 1 },
          },
        });

        return NextResponse.json({ subscription: cancelledSubscription });

      case "renew_subscription":
        const { subscriptionId: renewId } = body;
        
        const subscriptionToRenew = await prisma.creatorSubscription.findUnique({
          where: { id: renewId },
        });

        if (!subscriptionToRenew) {
          return NextResponse.json(
            { error: "Subscription not found" },
            { status: 404 }
          );
        }

        const newEndDate = new Date(subscriptionToRenew.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        const newNextPayment = new Date(newEndDate);

        const renewedSubscription = await prisma.creatorSubscription.update({
          where: { id: renewId },
          data: {
            status: "active",
            endDate: newEndDate,
            lastPayment: new Date(),
            nextPayment: newNextPayment,
            totalPaid: { increment: subscriptionToRenew.monthlyPrice },
            accessCount: { increment: 1 },
            lastAccessed: new Date(),
          },
        });

        return NextResponse.json({ subscription: renewedSubscription });

      case "get_subscription_analytics":
        const { creatorId: analyticsCreatorId } = body;
        
        const analytics = await getSubscriptionAnalytics(analyticsCreatorId);
        return NextResponse.json({ analytics });

      case "get_creator_tiers":
        const tiers = getCreatorTiers();
        return NextResponse.json({ tiers });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Subscription operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform subscription operation" },
      { status: 500 }
    );
  }
}

async function getSubscriptionAnalytics(creatorId: string) {
  const [
    activeSubscriptions,
    totalRevenue,
    monthlyRevenue,
    subscriptionTrends,
    tierDistribution,
  ] = await Promise.all([
    // Active subscriptions count
    prisma.creatorSubscription.count({
      where: { creatorId, status: "active" },
    }),

    // Total subscription revenue
    prisma.creatorSubscription.aggregate({
      where: { creatorId, status: { in: ["active", "expired"] } },
      _sum: { totalPaid: true },
    }),

    // Current month revenue
    prisma.creatorSubscription.aggregate({
      where: {
        creatorId,
        status: "active",
        lastPayment: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { monthlyPrice: true },
    }),

    // Subscription trends (last 6 months)
    prisma.creatorSubscription.groupBy({
      by: ["createdAt"],
      where: {
        creatorId,
        createdAt: {
          gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        },
      },
      _count: true,
    }),

    // Tier distribution
    prisma.creatorSubscription.groupBy({
      by: ["tier"],
      where: { creatorId, status: "active" },
      _count: true,
    }),
  ]);

  return {
    activeSubscriptions,
    totalRevenue: totalRevenue._sum.totalPaid ?? 0,
    monthlyRevenue: monthlyRevenue._sum.monthlyPrice ?? 0,
    subscriptionTrends,
    tierDistribution,
    churnRate: await calculateChurnRate(creatorId),
    averageLifetime: await calculateAverageLifetime(creatorId),
  };
}

async function calculateChurnRate(creatorId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const [activeStart, cancelled] = await Promise.all([
    prisma.creatorSubscription.count({
      where: {
        creatorId,
        startDate: { lte: thirtyDaysAgo },
        status: { in: ["active", "cancelled"] },
      },
    }),
    prisma.creatorSubscription.count({
      where: {
        creatorId,
        status: "cancelled",
        updatedAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  return activeStart > 0 ? (cancelled / activeStart) * 100 : 0;
}

async function calculateAverageLifetime(creatorId: string) {
  const completedSubscriptions = await prisma.creatorSubscription.findMany({
    where: {
      creatorId,
      status: { in: ["cancelled", "expired"] },
    },
    select: { startDate: true, endDate: true },
  });

  if (completedSubscriptions.length === 0) return 0;

  const totalDays = completedSubscriptions.reduce((sum, sub) => {
    const diffTime = Math.abs(sub.endDate.getTime() - sub.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  return totalDays / completedSubscriptions.length;
}

function getCreatorTiers() {
  return {
    basic: {
      name: "Basic",
      monthlyPrice: 9.99,
      benefits: [
        "Access to basic creator content",
        "Community access",
        "Monthly newsletter",
      ],
      features: {
        exclusiveAccess: false,
        earlyAccess: false,
        directSupport: false,
      },
    },
    premium: {
      name: "Premium",
      monthlyPrice: 19.99,
      benefits: [
        "All Basic benefits",
        "Premium content access",
        "Early access to new releases",
        "Priority support",
      ],
      features: {
        exclusiveAccess: true,
        earlyAccess: true,
        directSupport: false,
      },
    },
    exclusive: {
      name: "Exclusive",
      monthlyPrice: 49.99,
      benefits: [
        "All Premium benefits",
        "Exclusive content and tutorials",
        "Direct messaging with creator",
        "Custom requests",
        "1-on-1 sessions",
      ],
      features: {
        exclusiveAccess: true,
        earlyAccess: true,
        directSupport: true,
      },
    },
  };
}

