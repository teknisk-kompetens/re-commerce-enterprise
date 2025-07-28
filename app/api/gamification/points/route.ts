
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const currency = searchParams.get("currency");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Gamification profile not found" }, { status: 404 });
    }

    const whereClause: any = { profileId: profile.id };
    if (currency) {
      whereClause.currency = currency;
    }

    const transactions = await prisma.pointTransaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.pointTransaction.count({
      where: whereClause,
    });

    // Calculate balance by currency
    const balances = await prisma.pointTransaction.groupBy({
      by: ["currency"],
      where: { profileId: profile.id },
      _sum: {
        amount: true,
      },
    });

    const balancesByCurrency = balances.reduce((acc: any, item) => {
      acc[item.currency] = item._sum.amount || 0;
      return acc;
    }, {});

    return NextResponse.json({
      transactions,
      balances: balancesByCurrency,
      pagination: {
        limit,
        offset,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Points fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch point transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      tenantId,
      currency,
      amount,
      type = "earned",
      source,
      sourceId,
      description,
      multiplier = 1.0,
    } = body;

    if (!userId || !tenantId || !currency || !amount || !source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Gamification profile not found" }, { status: 404 });
    }

    // Get current balance
    const currentBalance = await getCurrentBalance(profile.id, currency);
    const finalAmount = Math.round(amount * multiplier);
    const newBalance = type === "spent" ? currentBalance - finalAmount : currentBalance + finalAmount;

    // Validate sufficient balance for spending
    if (type === "spent" && newBalance < 0) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Create point transaction
    const transaction = await prisma.pointTransaction.create({
      data: {
        profileId: profile.id,
        type,
        currency,
        amount: type === "spent" ? -finalAmount : finalAmount,
        previousBalance: currentBalance,
        newBalance,
        source,
        sourceId,
        description,
        baseAmount: amount,
        multiplier,
      },
    });

    // Update profile balance
    await updateProfileBalance(profile.id, currency, newBalance);

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("Point transaction error:", error);
    return NextResponse.json(
      { error: "Failed to create point transaction" },
      { status: 500 }
    );
  }
}

async function getCurrentBalance(profileId: string, currency: string): Promise<number> {
  const result = await prisma.pointTransaction.aggregate({
    where: {
      profileId,
      currency,
    },
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
}

async function updateProfileBalance(profileId: string, currency: string, newBalance: number) {
  const updateData: any = {};
  
  switch (currency) {
    case "xp":
      updateData.experiencePoints = newBalance;
      updateData.totalXPEarned = { increment: newBalance > 0 ? newBalance : 0 };
      break;
    case "coins":
      updateData.gamificationCoins = newBalance;
      break;
    case "gems":
      updateData.premiumGems = newBalance;
      break;
    case "reputation":
      updateData.reputationPoints = newBalance;
      break;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.gamificationProfile.update({
      where: { id: profileId },
      data: updateData,
    });
  }
}
