
/**
 * Biometric Authentication API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedWebAuthnService } from '@/lib/advanced-webauthn-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, biometricData, biometricType } = await request.json();

    if (!userId || !biometricData || !biometricType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await AdvancedWebAuthnService.authenticateBiometric(
      userId,
      biometricData,
      biometricType
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate biometric' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, biometricType, template, deviceId } = await request.json();

    if (!userId || !biometricType || !template || !deviceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const enrolled = await AdvancedWebAuthnService.enrollBiometric(
      userId,
      biometricType,
      template,
      deviceId
    );

    return NextResponse.json({ enrolled });
  } catch (error) {
    console.error('Biometric enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll biometric' },
      { status: 500 }
    );
  }
}
