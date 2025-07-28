
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const programId = searchParams.get("programId");
    const referrerId = searchParams.get("referrerId");
    const status = searchParams.get("status");
    const qualified = searchParams.get("qualified") === "true";
    const rewarded = searchParams.get("rewarded") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(programId && { programId }),
      ...(referrerId && { referrerId }),
      ...(status && { status }),
      ...(qualified && { qualificationMet: true }),
      ...(rewarded && { referrerRewarded: true })
    };

    const [referrals, total, statusStats, conversionStats] = await Promise.all([
      prisma.referralTracking.findMany({
        where: whereClause,
        orderBy: { referredAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          program: {
            select: {
              name: true,
              rewardType: true,
              rewardAmount: true,
              rewardCurrency: true
            }
          },
          referrer: {
            select: {
              companyName: true,
              industry: true,
              companySize: true
            }
          },
          advocate: {
            select: {
              contactName: true,
              advocacyTier: true,
              advocacyScore: true
            }
          }
        }
      }),
      prisma.referralTracking.count({ where: whereClause }),
      prisma.referralTracking.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: {
          status: true
        }
      }),
      prisma.referralTracking.aggregate({
        where: { tenantId },
        _count: {
          id: true
        },
        _sum: {
          referrerRewardAmount: true,
          refereeRewardAmount: true,
          conversionValue: true
        }
      })
    ]);

    // Convert Decimal fields for referrals
    const serializedReferrals = referrals.map(referral => ({
      ...referral,
      referrerRewardAmount: referral.referrerRewardAmount.toNumber(),
      refereeRewardAmount: referral.refereeRewardAmount.toNumber(),
      conversionValue: referral.conversionValue?.toNumber() || null
    }));

    // Convert Decimal fields for conversion stats
    const serializedConversionStats = {
      ...conversionStats,
      _sum: {
        referrerRewardAmount: conversionStats._sum.referrerRewardAmount?.toNumber() || null,
        refereeRewardAmount: conversionStats._sum.refereeRewardAmount?.toNumber() || null,
        conversionValue: conversionStats._sum.conversionValue?.toNumber() || null
      }
    };

    return NextResponse.json({
      referrals: serializedReferrals,
      statusStats,
      conversionStats: serializedConversionStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching referral tracking:", error);
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
      programId,
      referrerId,
      advocateId,
      referralCode,
      referralLink,
      refereeEmail,
      refereeName,
      refereeCompany,
      source,
      medium,
      campaign
    } = body;

    if (!tenantId || !programId || !referrerId || !refereeEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate referral code if not provided
    const generatedCode = referralCode || `REF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const referral = await prisma.referralTracking.create({
      data: {
        tenantId,
        programId,
        referrerId,
        advocateId,
        referralCode: generatedCode,
        referralLink,
        refereeEmail,
        refereeName,
        refereeCompany,
        source,
        medium,
        campaign,
        status: "sent",
        qualificationMet: false,
        rewardEligible: false,
        referrerRewarded: false,
        refereeRewarded: false,
        emailsSent: 1,
        lastEmailSent: new Date(),
        responseReceived: false
      },
      include: {
        program: true,
        referrer: true,
        advocate: true
      }
    });

    // Convert Decimal fields for response
    const serializedReferral = {
      ...referral,
      referrerRewardAmount: referral.referrerRewardAmount.toNumber(),
      refereeRewardAmount: referral.refereeRewardAmount.toNumber(),
      conversionValue: referral.conversionValue?.toNumber() || null
    };

    return NextResponse.json(serializedReferral, { status: 201 });

  } catch (error) {
    console.error("Error creating referral tracking:", error);
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
        { error: "Referral ID required" },
        { status: 400 }
      );
    }

    // Convert Decimal fields if present
    if (updateData.referrerRewardAmount !== undefined) {
      updateData.referrerRewardAmount = new Decimal(updateData.referrerRewardAmount);
    }
    if (updateData.refereeRewardAmount !== undefined) {
      updateData.refereeRewardAmount = new Decimal(updateData.refereeRewardAmount);
    }
    if (updateData.conversionValue !== undefined) {
      updateData.conversionValue = new Decimal(updateData.conversionValue);
    }

    // Handle status updates with automatic timestamp updates
    if (updateData.status) {
      const now = new Date();
      switch (updateData.status) {
        case "clicked":
          updateData.clickedAt = now;
          break;
        case "signed-up":
          updateData.signedUpAt = now;
          break;
        case "qualified":
          updateData.qualificationMet = true;
          updateData.rewardEligible = true;
          break;
        case "rewarded":
          updateData.referrerRewarded = true;
          updateData.referrerRewardedAt = now;
          break;
      }
    }

    const referral = await prisma.referralTracking.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        program: true,
        referrer: true,
        advocate: true
      }
    });

    // Convert Decimal fields for response
    const serializedReferral = {
      ...referral,
      referrerRewardAmount: referral.referrerRewardAmount.toNumber(),
      refereeRewardAmount: referral.refereeRewardAmount.toNumber(),
      conversionValue: referral.conversionValue?.toNumber() || null
    };

    return NextResponse.json(serializedReferral);

  } catch (error) {
    console.error("Error updating referral tracking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
