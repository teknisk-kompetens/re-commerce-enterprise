
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      tenantId,
      rewardItemId,
      quantity = 1,
    } = body;

    if (!userId || !tenantId || !rewardItemId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user's gamification profile
    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Gamification profile not found" }, { status: 404 });
    }

    // Get reward item
    const rewardItem = await prisma.rewardItem.findUnique({
      where: { id: rewardItemId },
      include: {
        redemptions: {
          where: { profileId: profile.id },
        },
      },
    });

    if (!rewardItem) {
      return NextResponse.json({ error: "Reward item not found" }, { status: 404 });
    }

    // Validate redemption eligibility
    const validationResult = await validateRedemption(profile, rewardItem, quantity);
    if (!validationResult.valid) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 });
    }

    // Calculate total cost
    const cost = rewardItem.cost as any;
    const totalCost: any = {};
    for (const [currency, amount] of Object.entries(cost)) {
      if (typeof amount === "number") {
        totalCost[currency] = amount * quantity;
      }
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct costs from user balance
      for (const [currency, amount] of Object.entries(totalCost)) {
        if (typeof amount === "number") {
          await tx.pointTransaction.create({
            data: {
              profileId: profile.id,
              type: "spent",
              currency,
              amount: -amount,
              previousBalance: 0, // Will be calculated
              newBalance: 0, // Will be calculated
              source: "reward_redemption",
              sourceId: rewardItemId,
              description: `Redeemed: ${rewardItem.name} x${quantity}`,
              baseAmount: amount,
            },
          });

          // Update profile balance
          await updateProfileBalance(tx, profile.id, currency, -amount);
        }
      }

      // Create redemption record
      const redemption = await tx.rewardRedemption.create({
        data: {
          profileId: profile.id,
          rewardItemId,
          quantity,
          totalCost,
          status: "pending",
          deliveryMethod: "instant",
          remainingUses: rewardItem.type === "consumable" ? quantity : null,
        },
      });

      // Update reward item stats
      await tx.rewardItem.update({
        where: { id: rewardItemId },
        data: {
          totalPurchases: { increment: quantity },
          stock: rewardItem.stock ? { decrement: quantity } : undefined,
          totalRevenue: {
            // Merge with existing revenue
            set: mergeRevenue(rewardItem.totalRevenue as any, totalCost),
          },
        },
      });

      // Process instant fulfillment
      if (rewardItem.type === "digital" || rewardItem.category === "premium_features") {
        await tx.rewardRedemption.update({
          where: { id: redemption.id },
          data: {
            status: "fulfilled",
            fulfilledAt: new Date(),
          },
        });
      }

      return redemption;
    });

    return NextResponse.json({ 
      redemption: result,
      success: true,
      message: `Successfully redeemed ${rewardItem.name} x${quantity}`,
    });
  } catch (error) {
    console.error("Reward redemption error:", error);
    return NextResponse.json(
      { error: "Failed to redeem reward" },
      { status: 500 }
    );
  }
}

async function validateRedemption(profile: any, rewardItem: any, quantity: number) {
  // Check if item is active
  if (!rewardItem.isActive) {
    return { valid: false, error: "Reward item is not available" };
  }

  // Check availability window
  const now = new Date();
  if (rewardItem.availableFrom && rewardItem.availableFrom > now) {
    return { valid: false, error: "Reward item is not yet available" };
  }
  if (rewardItem.availableUntil && rewardItem.availableUntil < now) {
    return { valid: false, error: "Reward item is no longer available" };
  }

  // Check level requirement
  if (rewardItem.levelRequirement > profile.currentLevel) {
    return { valid: false, error: `Requires level ${rewardItem.levelRequirement}` };
  }

  // Check tier requirement
  if (rewardItem.tierRequirement && rewardItem.tierRequirement !== profile.currentTier) {
    return { valid: false, error: `Requires ${rewardItem.tierRequirement} tier` };
  }

  // Check stock
  if (rewardItem.stock !== null && rewardItem.stock < quantity) {
    return { valid: false, error: "Insufficient stock" };
  }

  // Check max per user
  if (rewardItem.maxPerUser) {
    const userRedemptions = rewardItem.redemptions.reduce((total: number, redemption: any) => {
      return total + redemption.quantity;
    }, 0);
    
    if (userRedemptions + quantity > rewardItem.maxPerUser) {
      return { valid: false, error: "Purchase limit exceeded" };
    }
  }

  // Check balance for each currency
  const cost = rewardItem.cost as any;
  for (const [currency, amount] of Object.entries(cost)) {
    if (typeof amount === "number") {
      const totalCost = amount * quantity;
      let userBalance = 0;
      
      switch (currency) {
        case "coins":
          userBalance = profile.gamificationCoins;
          break;
        case "gems":
          userBalance = profile.premiumGems;
          break;
        case "xp":
          userBalance = profile.experiencePoints;
          break;
        case "reputation":
          userBalance = profile.reputationPoints;
          break;
      }
      
      if (userBalance < totalCost) {
        return { valid: false, error: `Insufficient ${currency} (need ${totalCost}, have ${userBalance})` };
      }
    }
  }

  return { valid: true };
}

async function updateProfileBalance(tx: any, profileId: string, currency: string, amount: number) {
  const updateData: any = {};
  
  switch (currency) {
    case "coins":
      updateData.gamificationCoins = { increment: amount };
      break;
    case "gems":
      updateData.premiumGems = { increment: amount };
      break;
    case "xp":
      updateData.experiencePoints = { increment: amount };
      break;
    case "reputation":
      updateData.reputationPoints = { increment: amount };
      break;
  }

  if (Object.keys(updateData).length > 0) {
    await tx.gamificationProfile.update({
      where: { id: profileId },
      data: updateData,
    });
  }
}

function mergeRevenue(existingRevenue: any, newRevenue: any) {
  const merged = { ...existingRevenue };
  for (const [currency, amount] of Object.entries(newRevenue)) {
    if (typeof amount === "number") {
      merged[currency] = (merged[currency] || 0) + amount;
    }
  }
  return merged;
}
