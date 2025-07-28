
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const threadId = searchParams.get("threadId");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID required" }, { status: 400 });
    }

    const posts = await prisma.forumPost.findMany({
      where: {
        threadId,
        isDeleted: false,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        reactions: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { replies: true, reactions: true },
        },
      },
      orderBy: [
        { isAccepted: "desc" },
        { createdAt: "asc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      posts,
      pagination: {
        limit,
        offset,
        total: await prisma.forumPost.count({
          where: { threadId, isDeleted: false },
        }),
      },
    });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      threadId,
      content,
      authorId,
      parentId = null,
      contentType = "markdown",
    } = body;

    if (!threadId || !content || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const post = await prisma.forumPost.create({
      data: {
        threadId,
        content,
        authorId,
        parentId,
        contentType,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        thread: {
          select: { id: true, title: true, forumId: true },
        },
      },
    });

    // Update thread post count and last post info
    await prisma.forumThread.update({
      where: { id: threadId },
      data: {
        postCount: { increment: 1 },
        lastPostAt: new Date(),
        lastPostBy: authorId,
      },
    });

    // Update forum post count and last activity
    await prisma.communityForum.update({
      where: { id: post.thread.forumId },
      data: {
        postCount: { increment: 1 },
        lastActivity: new Date(),
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
