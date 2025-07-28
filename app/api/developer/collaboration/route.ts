
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "projects", "code_shares", "mentorships"
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!userId || !type) {
      return NextResponse.json(
        { error: "User ID and type required" },
        { status: 400 }
      );
    }

    // Get developer profile
    const developerProfile = await prisma.developerProfile.findUnique({
      where: { userId },
    });

    if (!developerProfile) {
      return NextResponse.json(
        { error: "Developer profile not found" },
        { status: 404 }
      );
    }

    let data: any = {};

    switch (type) {
      case "projects":
        const projects = await prisma.collaborativeProject.findMany({
          where: {
            OR: [
              { ownerId: developerProfile.id },
              {
                collaborators: {
                  some: { developerId: developerProfile.id },
                },
              },
            ],
          },
          include: {
            owner: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            collaborators: {
              include: {
                developer: {
                  include: {
                    user: {
                      select: { id: true, name: true },
                    },
                  },
                },
              },
            },
            _count: {
              select: { collaborators: true, codeReviews: true },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          skip: offset,
        });
        data = { projects };
        break;

      case "code_shares":
        const codeShares = await prisma.codeShare.findMany({
          where: { creatorId: developerProfile.id },
          include: {
            creator: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            _count: {
              select: { comments: true, likes: true, forks: true },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          skip: offset,
        });
        data = { codeShares };
        break;

      case "mentorships":
        const mentorships = await prisma.developerMentorship.findMany({
          where: {
            OR: [
              { mentorId: developerProfile.id },
              { menteeId: developerProfile.id },
            ],
          },
          include: {
            mentor: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            mentee: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          skip: offset,
        });
        data = { mentorships };
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Developer collaboration fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaboration data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, ...data } = body;

    if (!type || !userId) {
      return NextResponse.json(
        { error: "Type and user ID required" },
        { status: 400 }
      );
    }

    // Get or create developer profile
    let developerProfile = await prisma.developerProfile.findUnique({
      where: { userId },
    });

    if (!developerProfile) {
      developerProfile = await prisma.developerProfile.create({
        data: { userId },
      });
    }

    let result: any = {};

    switch (type) {
      case "project":
        const {
          name,
          description,
          slug,
          category,
          repositoryUrl,
          technologies = [],
          tags = [],
          visibility = "public",
        } = data;

        if (!name || !slug || !category) {
          return NextResponse.json(
            { error: "Missing required project fields" },
            { status: 400 }
          );
        }

        result.project = await prisma.collaborativeProject.create({
          data: {
            name,
            description,
            slug,
            category,
            ownerId: developerProfile.id,
            repositoryUrl,
            technologies,
            tags,
            visibility,
          },
          include: {
            owner: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        });
        break;

      case "code_share":
        const {
          title,
          description: codeDescription,
          slug: codeSlug,
          language,
          framework,
          code,
          category: codeCategory = "snippet",
          tags: codeTags = [],
          visibility: codeVisibility = "public",
        } = data;

        if (!title || !codeSlug || !language || !code) {
          return NextResponse.json(
            { error: "Missing required code share fields" },
            { status: 400 }
          );
        }

        result.codeShare = await prisma.codeShare.create({
          data: {
            title,
            description: codeDescription,
            slug: codeSlug,
            creatorId: developerProfile.id,
            language,
            framework,
            code,
            category: codeCategory,
            tags: codeTags,
            visibility: codeVisibility,
          },
          include: {
            creator: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        });
        break;

      case "mentorship_request":
        const { mentorId, focus = [], goals, duration } = data;

        if (!mentorId) {
          return NextResponse.json(
            { error: "Mentor ID required" },
            { status: 400 }
          );
        }

        result.mentorship = await prisma.developerMentorship.create({
          data: {
            mentorId,
            menteeId: developerProfile.id,
            focus,
            goals,
            duration,
            status: "pending",
          },
          include: {
            mentor: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            mentee: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Developer collaboration creation error:", error);
    return NextResponse.json(
      { error: "Failed to create collaboration item" },
      { status: 500 }
    );
  }
}
