
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const status = searchParams.get("status") ?? "published";
    const difficulty = searchParams.get("difficulty");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      status,
      ...(category && { category }),
      ...(difficulty && { difficulty }),
    };

    const articles = await prisma.knowledgeArticle.findMany({
      where: whereClause,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { comments: true, bookmarks: true },
        },
      },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      articles,
      pagination: {
        limit,
        offset,
        total: await prisma.knowledgeArticle.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Knowledge articles fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      title,
      slug,
      content,
      excerpt,
      authorId,
      category = "general",
      difficulty = "beginner",
      tags = [],
      estimatedReadTime,
    } = body;

    if (!tenantId || !title || !slug || !content || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const article = await prisma.knowledgeArticle.create({
      data: {
        tenantId,
        title,
        slug,
        content,
        excerpt,
        authorId,
        category,
        difficulty,
        tags,
        estimatedReadTime,
        status: "draft",
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Article creation error:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
