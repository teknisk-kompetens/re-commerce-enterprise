
/**
 * SECURITY EVENTS API
 * API för hantering av säkerhetshändelser och monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import { EnhancedBankIDSecurity } from '@/lib/enhanced-bankid-security';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = "force-dynamic";

/**
 * GET - Hämta säkerhetshändelser
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const dateFrom = searchParams.get('dateFrom') ? 
      new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? 
      new Date(searchParams.get('dateTo')!) : undefined;

    const result = await SecurityEventLogger.getSecurityEvents({
      type,
      category,
      severity,
      dateFrom,
      dateTo,
      tenantId: session.user.tenantId,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      data: result.events,
      total: result.total,
      hasMore: result.hasMore,
      pagination: {
        limit,
        offset,
        total: result.total
      }
    });

  } catch (error) {
    console.error('Security events API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security events' },
      { status: 500 }
    );
  }
}

/**
 * POST - Logga ny säkerhetshändelse
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, severity, description, metadata } = body;

    if (!type || !severity || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: type, severity, description' },
        { status: 400 }
      );
    }

    await SecurityEventLogger.logSecurityEvent({
      type,
      severity,
      description,
      actor: session.user.id,
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: metadata || {},
      tenantId: session.user.tenantId
    });

    return NextResponse.json({
      success: true,
      message: 'Security event logged successfully'
    });

  } catch (error) {
    console.error('Security event logging error:', error);
    return NextResponse.json(
      { error: 'Failed to log security event' },
      { status: 500 }
    );
  }
}
