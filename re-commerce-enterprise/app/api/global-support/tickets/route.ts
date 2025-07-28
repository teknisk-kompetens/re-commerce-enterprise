
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/global-support/tickets - Get support tickets with international context
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const language = searchParams.get('language');
    const region = searchParams.get('region');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (status) where.status = status;
    if (language) where.language = language;
    if (region) where.region = region;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
              id: true,
              content: true,
              senderType: true,
              senderName: true,
              originalLanguage: true,
              translatedContent: true,
              createdAt: true
            }
          },
          attachments: {
            select: {
              id: true,
              filename: true,
              mimeType: true,
              size: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.supportTicket.count({ where })
    ]);

    // Add time-based calculations
    const enrichedTickets = tickets.map(ticket => {
      const now = new Date();
      const created = new Date(ticket.createdAt);
      const ageMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
      
      const firstResponseOverdue = ticket.firstResponseTime === null && ageMinutes > ticket.firstResponseSLA;
      const resolutionOverdue = ticket.resolvedAt === null && ageMinutes > ticket.resolutionSLA;

      return {
        ...ticket,
        ageMinutes,
        isOverdue: firstResponseOverdue || resolutionOverdue,
        slaStatus: {
          firstResponse: {
            isOverdue: firstResponseOverdue,
            timeRemaining: Math.max(0, ticket.firstResponseSLA - ageMinutes)
          },
          resolution: {
            isOverdue: resolutionOverdue,
            timeRemaining: Math.max(0, ticket.resolutionSLA - ageMinutes)
          }
        }
      };
    });

    // Get ticket statistics
    const stats = await prisma.supportTicket.groupBy({
      by: ['status', 'language', 'region', 'priority'],
      where: { tenantId },
      _count: { id: true }
    });

    const summary = {
      total,
      byStatus: stats.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + s._count.id;
        return acc;
      }, {} as any),
      byLanguage: stats.reduce((acc, s) => {
        acc[s.language] = (acc[s.language] || 0) + s._count.id;
        return acc;
      }, {} as any),
      byRegion: stats.reduce((acc, s) => {
        if (s.region) acc[s.region] = (acc[s.region] || 0) + s._count.id;
        return acc;
      }, {} as any),
      byPriority: stats.reduce((acc, s) => {
        acc[s.priority] = (acc[s.priority] || 0) + s._count.id;
        return acc;
      }, {} as any)
    };

    return NextResponse.json({
      success: true,
      data: enrichedTickets,
      summary,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

// POST /api/global-support/tickets - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      tenantId,
      title,
      description,
      category,
      priority = 'medium',
      language = 'en',
      region,
      timezone,
      customerEmail,
      customerName,
      customerCompany,
      tags = [],
      metadata = {}
    } = body;

    // Validate required fields
    if (!tenantId || !title || !description || !customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID, title, description, and customer email are required' },
        { status: 400 }
      );
    }

    // Generate unique ticket number
    const ticketNumber = `TICK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Set SLA based on priority
    const slaSettings = {
      low: { firstResponse: 480, resolution: 2880 }, // 8 hours, 48 hours
      medium: { firstResponse: 240, resolution: 1440 }, // 4 hours, 24 hours
      high: { firstResponse: 120, resolution: 720 }, // 2 hours, 12 hours
      critical: { firstResponse: 60, resolution: 240 } // 1 hour, 4 hours
    };

    const sla = slaSettings[priority as keyof typeof slaSettings] || slaSettings.medium;

    const ticket = await prisma.supportTicket.create({
      data: {
        tenantId,
        ticketNumber,
        title,
        description,
        category,
        priority,
        language,
        region,
        timezone,
        customerEmail,
        customerName,
        customerCompany,
        status: 'open',
        firstResponseSLA: sla.firstResponse,
        resolutionSLA: sla.resolution,
        tags,
        metadata
      },
      include: {
        messages: true,
        attachments: true
      }
    });

    // Create initial message
    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        content: description,
        senderType: 'customer',
        senderName: customerName || customerEmail,
        senderEmail: customerEmail,
        originalLanguage: language
      }
    });

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/global-support/tickets - Update support ticket
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');
    const action = searchParams.get('action'); // assign, escalate, close, etc.
    
    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    let updateData: any = { ...body };

    // Handle specific actions
    if (action === 'assign') {
      updateData.assignedTo = body.assignedTo;
      updateData.assignedTeam = body.assignedTeam;
      updateData.status = 'in_progress';
    } else if (action === 'escalate') {
      updateData.isEscalated = true;
      updateData.escalationReason = body.escalationReason;
      updateData.priority = 'high';
    } else if (action === 'resolve') {
      updateData.status = 'resolved';
      updateData.resolution = body.resolution;
      updateData.resolvedAt = new Date();
      updateData.resolutionTime = body.resolutionTime;
    } else if (action === 'close') {
      updateData.status = 'closed';
      updateData.closedAt = new Date();
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        attachments: true
      }
    });

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Support ticket updated successfully'
    });

  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update support ticket' },
      { status: 500 }
    );
  }
}
