
/**
 * WIDGET FACTORY API - COLLABORATION
 * API endpoints for real-time collaboration, sessions, and user presence
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBehemothApiRoute } from '@/lib/behemoth-api-gateway';

export const dynamic = 'force-dynamic';

// GET /api/widget-factory/collaboration/sessions - List collaboration sessions
async function getSessions(context: any) {
  try {
    const { searchParams } = context;
    const canvasId = searchParams.get('canvasId');
    const active = searchParams.get('active') === 'true';

    // Simulate collaboration sessions
    const sessions = [
      {
        id: 'session-1',
        canvasId: 'canvas-1',
        participants: [
          {
            userId: 'user-1',
            userName: 'Alice Johnson',
            userEmail: 'alice@example.com',
            role: 'owner',
            joinedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            lastSeen: new Date(),
            isOnline: true,
            cursor: {
              position: { x: 150, y: 200 },
              color: '#3B82F6',
              visible: true,
            },
            presence: {
              status: 'active',
              activity: 'editing widget',
            },
          },
          {
            userId: 'user-2',
            userName: 'Bob Smith',
            userEmail: 'bob@example.com',
            role: 'editor',
            joinedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
            lastSeen: new Date(),
            isOnline: true,
            cursor: {
              position: { x: 300, y: 150 },
              color: '#10B981',
              visible: true,
            },
            presence: {
              status: 'active',
              activity: 'browsing widgets',
            },
          },
        ],
        state: 'active',
        created: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        lastActivity: new Date(),
        settings: {
          allowAnonymous: false,
          maxParticipants: 10,
          recordSession: true,
          enableChat: true,
        },
      },
    ];

    // Apply filters
    let filteredSessions = sessions;
    
    if (canvasId) {
      filteredSessions = filteredSessions.filter(s => s.canvasId === canvasId);
    }

    if (active) {
      filteredSessions = filteredSessions.filter(s => s.state === 'active');
    }

    return NextResponse.json({
      sessions: filteredSessions,
      total: filteredSessions.length,
    });
  } catch (error) {
    console.error('Error fetching collaboration sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// POST /api/widget-factory/collaboration/sessions - Create collaboration session
async function createSession(context: any) {
  try {
    const { body } = context;
    const { canvasId, settings } = body;

    if (!canvasId) {
      return NextResponse.json(
        { error: 'Canvas ID is required' },
        { status: 400 }
      );
    }

    const session = {
      id: crypto.randomUUID(),
      canvasId,
      participants: [
        {
          userId: context.user?.id || 'anonymous',
          userName: context.user?.name || 'Anonymous User',
          userEmail: context.user?.email || '',
          role: 'owner',
          joinedAt: new Date(),
          lastSeen: new Date(),
          isOnline: true,
          cursor: {
            position: { x: 0, y: 0 },
            color: '#3B82F6',
            visible: true,
          },
          presence: {
            status: 'active',
            activity: 'joined session',
          },
        },
      ],
      operations: [],
      state: 'active',
      created: new Date(),
      lastActivity: new Date(),
      settings: {
        allowAnonymous: false,
        maxParticipants: 10,
        recordSession: true,
        enableChat: true,
        permissions: {
          defaultRole: 'editor',
          allowRoleChange: true,
          allowInvites: true,
          allowScreenSharing: false,
          allowFileSharing: false,
          maxViewers: 20,
          maxEditors: 5,
        },
        ...settings,
      },
    };

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating collaboration session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

// POST /api/widget-factory/collaboration/sessions/[id]/join - Join collaboration session
async function joinSession(context: any) {
  try {
    const { pathParams, body } = context;
    const sessionId = pathParams.id;
    const { userName, userEmail } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Simulate joining session
    const participant = {
      userId: context.user?.id || crypto.randomUUID(),
      userName: userName || context.user?.name || 'Anonymous User',
      userEmail: userEmail || context.user?.email || '',
      role: 'editor',
      joinedAt: new Date(),
      lastSeen: new Date(),
      isOnline: true,
      cursor: {
        position: { x: 0, y: 0 },
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
        visible: true,
      },
      presence: {
        status: 'active',
        activity: 'joined session',
      },
    };

    return NextResponse.json({
      success: true,
      participant,
      sessionId,
    });
  } catch (error) {
    console.error('Error joining collaboration session:', error);
    return NextResponse.json(
      { error: 'Failed to join session' },
      { status: 500 }
    );
  }
}

// POST /api/widget-factory/collaboration/operations - Apply collaborative operation
async function applyOperation(context: any) {
  try {
    const { body } = context;
    const { sessionId, operation } = body;

    if (!sessionId || !operation) {
      return NextResponse.json(
        { error: 'Session ID and operation are required' },
        { status: 400 }
      );
    }

    // Simulate operation application
    const appliedOperation = {
      id: crypto.randomUUID(),
      sessionId,
      userId: context.user?.id || 'anonymous',
      timestamp: new Date(),
      type: operation.type,
      target: operation.target,
      operation: operation.operation,
      transform: {
        baseVersion: 0,
        dependencies: [],
        conflicts: [],
        transformed: false,
        transformations: [],
      },
      state: 'applied',
      acknowledgments: [],
      rejections: [],
    };

    return NextResponse.json({
      success: true,
      operation: appliedOperation,
    });
  } catch (error) {
    console.error('Error applying collaborative operation:', error);
    return NextResponse.json(
      { error: 'Failed to apply operation' },
      { status: 500 }
    );
  }
}

export const GET = createBehemothApiRoute(
  {
    requireAuth: false,
    enableMetrics: true,
    allowCors: true,
  },
  getSessions
);

export const POST = createBehemothApiRoute(
  {
    requireAuth: true,
    enableMetrics: true,
    enableAudit: true,
    allowCors: true,
  },
  createSession
);
