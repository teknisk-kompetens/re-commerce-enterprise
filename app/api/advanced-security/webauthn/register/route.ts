
/**
 * WebAuthn Registration API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedWebAuthnService } from '@/lib/advanced-webauthn-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, username, displayName } = await request.json();

    if (!userId || !username || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const options = await AdvancedWebAuthnService.generateRegistrationOptions(
      userId,
      username,
      displayName
    );

    return NextResponse.json({ options });
  } catch (error) {
    console.error('WebAuthn registration error:', error);
    return NextResponse.json(
      { error: 'Failed to generate registration options' },
      { status: 500 }
    );
  }
}
