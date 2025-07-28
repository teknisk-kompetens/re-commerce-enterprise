
/**
 * GDPR CONSENT API
 * API för hantering av användarmedgivanden enligt GDPR
 */

import { NextRequest, NextResponse } from 'next/server';
import { GDPRComplianceSystem } from '@/lib/gdpr-compliance-system';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export const dynamic = "force-dynamic";

/**
 * POST - Registrera medgivande
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      consentType,
      purpose,
      legalBasis,
      consentText,
      version,
      expiresAt
    } = body;

    if (!consentType || !purpose || !legalBasis || !consentText || !version) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await GDPRComplianceSystem.recordConsent({
      userId: session.user.id,
      tenantId: session.user.tenantId,
      consentType,
      purpose,
      legalBasis,
      status: 'given',
      consentText,
      version,
      givenAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      consentId: result.consentId,
      message: 'Consent recorded successfully'
    });

  } catch (error) {
    console.error('GDPR consent API error:', error);
    return NextResponse.json(
      { error: 'Failed to record consent' },
      { status: 500 }
    );
  }
}

/**
 * GET - Hämta medgivanden för användare
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const consentType = searchParams.get('type') || undefined;

    const consents = await GDPRComplianceSystem.checkConsentStatus(
      session.user.id,
      session.user.tenantId,
      consentType
    );

    return NextResponse.json({
      success: true,
      data: consents
    });

  } catch (error) {
    console.error('GDPR consent fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consents' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Dra tillbaka medgivande
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { consentType, reason } = body;

    if (!consentType) {
      return NextResponse.json(
        { error: 'Missing consentType' },
        { status: 400 }
      );
    }

    const result = await GDPRComplianceSystem.withdrawConsent(
      session.user.id,
      session.user.tenantId,
      consentType,
      reason
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Logga återkallelse
    await SecurityEventLogger.logSecurityEvent({
      type: 'gdpr_consent_withdrawn',
      severity: 'info',
      description: `User withdrew consent for ${consentType}`,
      actor: session.user.id,
      metadata: {
        consentType,
        reason,
        tenantId: session.user.tenantId
      },
      tenantId: session.user.tenantId
    });

    return NextResponse.json({
      success: true,
      message: 'Consent withdrawn successfully'
    });

  } catch (error) {
    console.error('GDPR consent withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw consent' },
      { status: 500 }
    );
  }
}
