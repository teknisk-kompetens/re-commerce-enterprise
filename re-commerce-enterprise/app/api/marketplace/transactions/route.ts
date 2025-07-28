
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "buyer" or "seller"
    const status = searchParams.get("status");
    const itemType = searchParams.get("itemType");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!userId || !type) {
      return NextResponse.json(
        { error: "User ID and type required" },
        { status: 400 }
      );
    }

    const whereClause: any = {
      ...(type === "buyer" ? { buyerId: userId } : { sellerId: userId }),
      ...(status && { status }),
      ...(itemType && { itemType }),
    };

    const transactions = await prisma.marketplaceTransaction.findMany({
      where: whereClause,
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      transactions,
      pagination: {
        limit,
        offset,
        total: await prisma.marketplaceTransaction.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Transactions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      buyerId,
      sellerId,
      itemType,
      itemId,
      amount,
      currency = "USD",
      type = "purchase",
      paymentMethod,
      licenseType = "standard",
    } = body;

    if (!buyerId || !sellerId || !itemType || !itemId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await prisma.marketplaceTransaction.create({
      data: {
        buyerId,
        sellerId,
        itemType,
        itemId,
        amount,
        currency,
        type,
        paymentMethod,
        licenseType,
        status: "pending",
      },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Calculate revenue share (80% to creator, 20% platform fee)
    const platformFeeRate = 0.2;
    const platformFee = amount * platformFeeRate;
    const creatorShare = amount - platformFee;

    // Create revenue share record
    await prisma.revenueShare.create({
      data: {
        creatorId: sellerId,
        itemType,
        itemId,
        transactionId: transaction.id,
        grossAmount: amount,
        platformFee,
        creatorShare,
        currency,
        period: new Date().toISOString().slice(0, 7), // YYYY-MM format
        paymentStatus: "pending",
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
