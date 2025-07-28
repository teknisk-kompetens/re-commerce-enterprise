
/**
 * BANKID AUTHENTICATION API
 * Säker BankID autentisering med förstärkt säkerhet
 */

import { NextRequest, NextResponse } from 'next/server';
import { EnhancedBankIDSecurity } from '@/lib/enhanced-bankid-security';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import { rateLimiter, RateLimitPresets } from '@/lib/rate-limiter';

export const dynamic = "force-dynamic";

/**
 * POST - Initiera BankID autentisering
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting för BankID auth
    const rateLimitResult = await rateLimiter.checkHybridLimit({
      identifier: request.ip || 'unknown',
      endpoint: '/api/bankid/auth',
      ...RateLimitPresets.AUTH_LOGIN,
      type: 'ip'
    });

    if (!rateLimitResult.success) {
      await SecurityEventLogger.logSecurityEvent({
        type: 'bankid_auth_rate_limited',
        severity: 'medium',
        description: 'BankID authentication rate limit exceeded',
        ipAddress: request.ip || 'unknown',
        metadata: { 
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.reset
        }
      });

      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '300'
          }
        }
      );
    }

    const body = await request.json();
    const { personalNumber, tenantId } = body;

    // Validera personalNumber format (optional)
    if (personalNumber && !/^\d{10,12}$/.test(personalNumber.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid personal number format' },
        { status: 400 }
      );
    }

    // Initiera BankID autentisering
    const result = await EnhancedBankIDSecurity.initiateSecureBankIDAuth(
      request,
      personalNumber,
      tenantId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Returnera auth tokens (orderRef döljs från client av säkerhetsskäl)
    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      autoStartToken: result.autoStartToken,
      qrStartToken: result.qrStartToken,
      qrStartSecret: result.qrStartSecret,
      message: 'BankID authentication initiated'
    });

  } catch (error) {
    console.error('BankID auth API error:', error);
    
    await SecurityEventLogger.logSecurityEvent({
      type: 'bankid_auth_api_error',
      severity: 'high',
      description: 'BankID authentication API error',
      ipAddress: request.ip || 'unknown',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    });

    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable' },
      { status: 503 }
    );
  }
}
