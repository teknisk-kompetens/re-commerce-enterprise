
/**
 * WebAuthn Verification API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedWebAuthnService } from '@/lib/advanced-webauthn-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, credential, challenge } = await request.json();

    if (!userId || !credential || !challenge) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const verified = await AdvancedWebAuthnService.verifyRegistration(
      userId,
      credential,
      challenge
    );

    return NextResponse.json({ verified });
  } catch (error) {
    console.error('WebAuthn verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify registration' },
      { status: 500 }
    );
  }
}
