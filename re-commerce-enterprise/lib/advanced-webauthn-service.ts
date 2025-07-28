
/**
 * ADVANCED WEBAUTHN SERVICE
 * Passwordless authentication with WebAuthn/FIDO2 and advanced biometrics
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export interface WebAuthnCredential {
  id: string;
  userId: string;
  credentialId: string;
  publicKey: string;
  counter: bigint;
  deviceType: 'platform' | 'roaming';
  transports: string[];
  attestation: any;
  name: string;
  lastUsed: Date;
  active: boolean;
}

export interface WebAuthnRegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    alg: number;
    type: string;
  }>;
  authenticatorSelection: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    userVerification: 'required' | 'preferred' | 'discouraged';
    residentKey: 'required' | 'preferred' | 'discouraged';
  };
  timeout: number;
  attestation: 'none' | 'indirect' | 'direct';
}

export interface WebAuthnAuthenticationOptions {
  challenge: string;
  rpId: string;
  allowCredentials: Array<{
    id: string;
    type: 'public-key';
    transports: string[];
  }>;
  userVerification: 'required' | 'preferred' | 'discouraged';
  timeout: number;
}

export interface BiometricAuthResult {
  success: boolean;
  confidence: number;
  biometricType: 'fingerprint' | 'face' | 'voice' | 'behavioral';
  matchScore: number;
  deviceId: string;
  continuousAuth: boolean;
  riskScore: number;
}

export class AdvancedWebAuthnService {
  private static readonly CHALLENGE_LENGTH = 32;
  private static readonly TIMEOUT = 60000; // 60 seconds

  /**
   * Generate WebAuthn registration options
   */
  static async generateRegistrationOptions(
    userId: string,
    username: string,
    displayName: string
  ): Promise<WebAuthnRegistrationOptions> {
    try {
      const challenge = crypto.randomBytes(this.CHALLENGE_LENGTH).toString('base64url');
      
      // Store challenge temporarily (in production, use Redis or similar)
      await prisma.user.update({
        where: { id: userId },
        data: {
          // Store challenge in user metadata temporarily
          // In production, use a separate challenge storage
        }
      });

      const options: WebAuthnRegistrationOptions = {
        challenge,
        rp: {
          name: 'Behemoth Enterprise Security',
          id: 'localhost', // In production, use actual domain
        },
        user: {
          id: userId,
          name: username,
          displayName,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: this.TIMEOUT,
        attestation: 'direct',
      };

      return options;
    } catch (error) {
      console.error('Error generating WebAuthn registration options:', error);
      throw new Error('Failed to generate registration options');
    }
  }

  /**
   * Verify WebAuthn registration
   */
  static async verifyRegistration(
    userId: string,
    credential: any,
    challenge: string
  ): Promise<boolean> {
    try {
      // Verify the credential (simplified for demo)
      // In production, use @simplewebauthn/server or similar
      
      const webauthnCredential = await prisma.webAuthnCredential.create({
        data: {
          userId,
          credentialId: credential.id,
          publicKey: credential.publicKey,
          counter: BigInt(credential.counter || 0),
          deviceType: credential.deviceType || 'platform',
          transports: credential.transports || ['internal'],
          attestation: credential.attestation || {},
          name: credential.name || 'Security Key',
          active: true,
        },
      });

      // Update user's passwordless capability
      await prisma.user.update({
        where: { id: userId },
        data: {
          // Mark user as having passwordless auth
        }
      });

      return true;
    } catch (error) {
      console.error('Error verifying WebAuthn registration:', error);
      return false;
    }
  }

  /**
   * Generate authentication options
   */
  static async generateAuthenticationOptions(
    userId?: string
  ): Promise<WebAuthnAuthenticationOptions> {
    try {
      const challenge = crypto.randomBytes(this.CHALLENGE_LENGTH).toString('base64url');
      
      let allowCredentials: Array<{
        id: string;
        type: 'public-key';
        transports: string[];
      }> = [];

      if (userId) {
        const credentials = await prisma.webAuthnCredential.findMany({
          where: { userId, active: true },
          select: { credentialId: true, transports: true },
        });

        allowCredentials = credentials.map(cred => ({
          id: cred.credentialId,
          type: 'public-key' as const,
          transports: cred.transports,
        }));
      }

      const options: WebAuthnAuthenticationOptions = {
        challenge,
        rpId: 'localhost', // In production, use actual domain
        allowCredentials,
        userVerification: 'required',
        timeout: this.TIMEOUT,
      };

      return options;
    } catch (error) {
      console.error('Error generating WebAuthn authentication options:', error);
      throw new Error('Failed to generate authentication options');
    }
  }

  /**
   * Verify WebAuthn authentication
   */
  static async verifyAuthentication(
    credentialId: string,
    signature: any,
    challenge: string
  ): Promise<{ success: boolean; userId?: string }> {
    try {
      const credential = await prisma.webAuthnCredential.findUnique({
        where: { credentialId },
        include: { user: true },
      });

      if (!credential || !credential.active) {
        return { success: false };
      }

      // Verify signature (simplified for demo)
      // In production, use proper WebAuthn verification
      
      // Update counter and last used
      await prisma.webAuthnCredential.update({
        where: { id: credential.id },
        data: {
          counter: credential.counter + BigInt(1),
          lastUsed: new Date(),
        },
      });

      return { success: true, userId: credential.userId };
    } catch (error) {
      console.error('Error verifying WebAuthn authentication:', error);
      return { success: false };
    }
  }

  /**
   * Perform biometric authentication
   */
  static async authenticateBiometric(
    userId: string,
    biometricData: any,
    biometricType: 'fingerprint' | 'face' | 'voice'
  ): Promise<BiometricAuthResult> {
    try {
      const profile = await prisma.biometricProfile.findFirst({
        where: { userId, type: biometricType, active: true },
      });

      if (!profile) {
        return {
          success: false,
          confidence: 0,
          biometricType,
          matchScore: 0,
          deviceId: 'unknown',
          continuousAuth: false,
          riskScore: 100,
        };
      }

      // Simulate biometric matching (in production, use actual biometric SDK)
      const matchScore = Math.random() * 100;
      const confidence = matchScore > 80 ? matchScore : 0;
      const success = confidence > 80;

      // Update usage statistics
      await prisma.biometricProfile.update({
        where: { id: profile.id },
        data: {
          lastUsed: new Date(),
          usageCount: profile.usageCount + 1,
          confidence: confidence,
        },
      });

      return {
        success,
        confidence,
        biometricType,
        matchScore,
        deviceId: profile.deviceId,
        continuousAuth: success && confidence > 95,
        riskScore: success ? 10 : 90,
      };
    } catch (error) {
      console.error('Error authenticating biometric:', error);
      return {
        success: false,
        confidence: 0,
        biometricType,
        matchScore: 0,
        deviceId: 'unknown',
        continuousAuth: false,
        riskScore: 100,
      };
    }
  }

  /**
   * Enroll biometric profile
   */
  static async enrollBiometric(
    userId: string,
    biometricType: 'fingerprint' | 'face' | 'voice',
    template: string,
    deviceId: string
  ): Promise<boolean> {
    try {
      await prisma.biometricProfile.create({
        data: {
          userId,
          type: biometricType,
          template: template, // Should be encrypted in production
          deviceId,
          confidence: 0,
          active: true,
          metadata: {
            enrollmentDate: new Date(),
            enrollmentDevice: deviceId,
            qualityScore: Math.random() * 100,
          },
        },
      });

      return true;
    } catch (error) {
      console.error('Error enrolling biometric:', error);
      return false;
    }
  }

  /**
   * Get user's authentication methods
   */
  static async getUserAuthMethods(userId: string) {
    try {
      const [webauthnCredentials, biometricProfiles, mfaDevices] = await Promise.all([
        prisma.webAuthnCredential.findMany({
          where: { userId, active: true },
          select: { id: true, name: true, deviceType: true, lastUsed: true },
        }),
        prisma.biometricProfile.findMany({
          where: { userId, active: true },
          select: { id: true, type: true, deviceId: true, lastUsed: true, confidence: true },
        }),
        prisma.userMFA.findMany({
          where: { userId, active: true },
          select: { id: true, method: true, verified: true },
        }),
      ]);

      return {
        webauthn: webauthnCredentials,
        biometric: biometricProfiles,
        mfa: mfaDevices,
        passwordless: webauthnCredentials.length > 0,
        multiModal: biometricProfiles.length > 1,
      };
    } catch (error) {
      console.error('Error getting user auth methods:', error);
      return {
        webauthn: [],
        biometric: [],
        mfa: [],
        passwordless: false,
        multiModal: false,
      };
    }
  }
}
