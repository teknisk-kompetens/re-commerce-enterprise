
/**
 * BANKID COLLECT API
 * Collecta BankID autentiseringsresultat
 */

import { NextRequest, NextResponse } from 'next/server';
import { EnhancedBankIDSecurity } from '@/lib/enhanced-bankid-security';
import { SecurityEventLogger } from '@/lib/security-event-logger';

export const dynamic = "force-dynamic";

/**
 * POST - Collecta BankID resultat
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    // Hämta session för att få orderRef
    const session = EnhancedBankIDSecurity.getActiveSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 400 }
      );
    }

    // Collecta resultat
    const result = await EnhancedBankIDSecurity.collectBankIDResult(
      session.orderRef,
      request
    );

    if (result.status === 'failed') {
      return NextResponse.json({
        success: false,
        status: 'failed',
        error: result.error
      });
    }

    if (result.status === 'pending') {
      return NextResponse.json({
        success: true,
        status: 'pending',
        message: 'Authentication in progress'
      });
    }

    if (result.status === 'complete') {
      // Framgångsrik autentisering
      const response = {
        success: true,
        status: 'complete',
        user: {
          id: result.user?.id,
          email: result.user?.email,
          name: result.user?.name,
          tenantId: result.user?.tenantId
        },
        jwt: result.jwt,
        requireMFA: result.requireMFA,
        message: 'Authentication successful'
      };

      // Sätt JWT token som httpOnly cookie
      const cookieOptions = [
        'httpOnly',
        'secure=' + (process.env.NODE_ENV === 'production'),
        'sameSite=strict',
        'path=/',
        'maxAge=7200' // 2 timmar
      ];

      return NextResponse.json(response, {
        headers: {
          'Set-Cookie': `auth-token=${result.jwt}; ${cookieOptions.join('; ')}`
        }
      });
    }

    return NextResponse.json(
      { error: 'Unknown status' },
      { status: 500 }
    );

  } catch (error) {
    console.error('BankID collect API error:', error);
    
    await SecurityEventLogger.logSecurityEvent({
      type: 'bankid_collect_api_error',
      severity: 'high',
      description: 'BankID collect API error',
      ipAddress: request.ip || 'unknown',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });

    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
