
/**
 * WebAuthn Authentication API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedWebAuthnService } from '@/lib/advanced-webauthn-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { credentialId, signature, challenge } = await request.json();

    if (!credentialId || !signature || !challenge) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await AdvancedWebAuthnService.verifyAuthentication(
      credentialId,
      signature,
      challenge
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('WebAuthn authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    );
  }
}
