
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const advocateId = searchParams.get("advocateId");
    const rewardType = searchParams.get("rewardType");
    const rewardCategory = searchParams.get("rewardCategory");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(advocateId && { advocateId }),
      ...(rewardType && { rewardType }),
      ...(rewardCategory && { rewardCategory }),
      ...(status && { status })
    };

    const [rewards, total, rewardStats, categoryStats] = await Promise.all([
      prisma.advocateReward.findMany({
        where: whereClause,
        orderBy: { triggerDate: "desc" },
        take: limit,
        skip: offset,
        include: {
          advocate: {
            select: {
              contactName: true,
              advocacyTier: true,
              customer: {
                select: {
                  companyName: true,
                  industry: true
                }
              }
            }
          }
        }
      }),
      prisma.advocateReward.count({ where: whereClause }),
      prisma.advocateReward.aggregate({
        where: { tenantId },
        _sum: {
          points: true,
          monetaryValue: true
        },
        _count: {
          id: true
        }
      }),
      prisma.advocateReward.groupBy({
        by: ["rewardCategory", "status"],
        where: { tenantId },
        _count: {
          rewardCategory: true
        },
        _sum: {
          monetaryValue: true
        }
      })
    ]);

    // Convert Decimal fields for rewards
    const serializedRewards = rewards.map(reward => ({
      ...reward,
      monetaryValue: reward.monetaryValue?.toNumber() || null
    }));

    // Convert Decimal fields for stats
    const serializedRewardStats = {
      ...rewardStats,
      _sum: {
        points: rewardStats._sum.points || null,
        monetaryValue: rewardStats._sum.monetaryValue?.toNumber() || null
      }
    };

    const serializedCategoryStats = categoryStats.map(stat => ({
      ...stat,
      _sum: {
        monetaryValue: stat._sum.monetaryValue?.toNumber() || null
      }
    }));

    return NextResponse.json({
      rewards: serializedRewards,
      rewardStats: serializedRewardStats,
      categoryStats: serializedCategoryStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching advocate rewards:", error);
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
    const body = await request.json();
    const {
      tenantId,
      advocateId,
      rewardType,
      rewardCategory,
      points,
      monetaryValue,
      currency,
      description,
      triggerActivity,
      activityId,
      deliveryMethod,
      deliveryDetails,
      expiresAt,
      isPublic,
      announcement
    } = body;

    if (!tenantId || !advocateId || !rewardType || !rewardCategory || !description || !triggerActivity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reward = await prisma.advocateReward.create({
      data: {
        tenantId,
        advocateId,
        rewardType,
        rewardCategory,
        points,
        monetaryValue: monetaryValue ? new Decimal(monetaryValue) : null,
        currency: currency || "USD",
        description,
        triggerActivity,
        triggerDate: new Date(),
        activityId,
        status: "pending",
        deliveryMethod,
        deliveryDetails: deliveryDetails || {},
        deliveryStatus: "pending",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        public: isPublic || false,
        announcement
      },
      include: {
        advocate: {
          include: {
            customer: true
          }
        }
      }
    });

    // Update advocate's total rewards and activity count
    await prisma.customerAdvocate.update({
      where: { id: advocateId },
      data: {
        totalRewardsEarned: {
          increment: monetaryValue ? new Decimal(monetaryValue) : 0
        },
        activitiesCount: {
          increment: 1
        },
        recognitionsCount: {
          increment: 1
        },
        lastActivityAt: new Date()
      }
    });

    // Convert Decimal fields for response
    const serializedReward = {
      ...reward,
      monetaryValue: reward.monetaryValue?.toNumber() || null
    };

    return NextResponse.json(serializedReward, { status: 201 });

  } catch (error) {
    console.error("Error creating advocate reward:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Reward ID required" },
        { status: 400 }
      );
    }

    // Convert monetary value to Decimal if present
    if (updateData.monetaryValue !== undefined) {
      updateData.monetaryValue = updateData.monetaryValue ? new Decimal(updateData.monetaryValue) : null;
    }

    // Convert date strings to Date objects if present
    if (updateData.expiresAt) {
      updateData.expiresAt = new Date(updateData.expiresAt);
    }

    // Handle status updates with automatic timestamp updates
    if (updateData.status) {
      const now = new Date();
      switch (updateData.status) {
        case "approved":
          updateData.approvedAt = now;
          break;
        case "issued":
          updateData.issuedAt = now;
          break;
        case "claimed":
          updateData.claimedAt = now;
          break;
      }
    }

    // Handle public announcement
    if (updateData.public && updateData.announcement && !updateData.announcedAt) {
      updateData.announcedAt = new Date();
    }

    const reward = await prisma.advocateReward.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        advocate: {
          include: {
            customer: true
          }
        }
      }
    });

    // Convert Decimal fields for response
    const serializedReward = {
      ...reward,
      monetaryValue: reward.monetaryValue?.toNumber() || null
    };

    return NextResponse.json(serializedReward);

  } catch (error) {
    console.error("Error updating advocate reward:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
