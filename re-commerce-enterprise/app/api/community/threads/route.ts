
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forumId = searchParams.get("forumId");
    const status = searchParams.get("status") ?? "open";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!forumId) {
      return NextResponse.json({ error: "Forum ID required" }, { status: 400 });
    }

    const threads = await prisma.forumThread.findMany({
      where: {
        forumId,
        status,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        posts: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { posts: true },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { lastPostAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      threads,
      pagination: {
        limit,
        offset,
        total: await prisma.forumThread.count({
          where: { forumId, status },
        }),
      },
    });
  } catch (error) {
    console.error("Threads fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      forumId,
      title,
      slug,
      content,
      authorId,
      category,
      tags = [],
      priority = "normal",
    } = body;

    if (!forumId || !title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const thread = await prisma.forumThread.create({
      data: {
        forumId,
        title,
        slug,
        content,
        authorId,
        category,
        tags,
        priority,
        postCount: 1,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        forum: {
          select: { id: true, name: true },
        },
      },
    });

    // Update forum post count and last activity
    await prisma.communityForum.update({
      where: { id: forumId },
      data: {
        postCount: { increment: 1 },
        lastActivity: new Date(),
      },
    });

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    console.error("Thread creation error:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
