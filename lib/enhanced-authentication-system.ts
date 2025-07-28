
/**
 * ENHANCED AUTHENTICATION SYSTEM
 * Multi-factor authentication with biometric support and advanced security
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ZeroTrustSecurityEngine } from '@/lib/zero-trust-security';

export interface MFAChallenge {
  id: string;
  userId: string;
  type: 'totp' | 'sms' | 'email' | 'biometric' | 'hardware_key';
  challenge: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  metadata?: Record<string, any>;
}

export interface BiometricData {
  type: 'fingerprint' | 'face' | 'voice' | 'iris';
  template: string; // Encrypted biometric template
  confidence: number;
  deviceId: string;
  enrolled: Date;
  lastUsed: Date;
}

export interface DeviceTrust {
  deviceId: string;
  userId: string;
  trusted: boolean;
  fingerprint: string;
  platform: string;
  browser: string;
  location: string;
  firstSeen: Date;
  lastSeen: Date;
  riskScore: number;
  certificateHash?: string;
}

export interface AuthenticationResult {
  success: boolean;
  userId?: string;
  sessionId?: string;
  requiresMFA: boolean;
  mfaMethods: string[];
  trustLevel: 'low' | 'medium' | 'high' | 'verified';
  restrictions: string[];
  expiresAt: Date;
  securityContext: any;
}

export interface SessionSecurity {
  sessionId: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  riskScore: number;
  trustLevel: string;
  mfaVerified: boolean;
  biometricVerified: boolean;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  geoLocation?: any;
}

export class EnhancedAuthenticationSystem {
  private static mfaChallenges = new Map<string, MFAChallenge>();
  private static deviceTrustCache = new Map<string, DeviceTrust>();
  private static activeSessions = new Map<string, SessionSecurity>();

  /**
   * Authenticate user with enhanced security
   */
  static async authenticateUser(
    email: string,
    password: string,
    request: NextRequest
  ): Promise<AuthenticationResult> {
    try {
      // Basic credential validation
      const user = await prisma.user.findFirst({
        where: { email },
        include: { tenant: true }
      });

      if (!user?.password) {
        return {
          success: false,
          requiresMFA: false,
          mfaMethods: [],
          trustLevel: 'low',
          restrictions: [],
          expiresAt: new Date(),
          securityContext: null
        };
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        await this.logFailedAttempt(email, request);
        return {
          success: false,
          requiresMFA: false,
          mfaMethods: [],
          trustLevel: 'low',
          restrictions: [],
          expiresAt: new Date(),
          securityContext: null
        };
      }

      // Evaluate security context
      const securityContext = await ZeroTrustSecurityEngine.evaluateSecurityContext(request);
      
      // Check device trust
      const deviceTrust = await this.evaluateDeviceTrust(request, user.id);
      
      // Determine if MFA is required
      const requiresMFA = this.shouldRequireMFA(securityContext, deviceTrust, user);
      
      // Determine available MFA methods
      const mfaMethods = await this.getAvailableMFAMethods(user.id);
      
      // Calculate trust level
      const trustLevel = this.calculateTrustLevel(securityContext, deviceTrust, requiresMFA);
      
      // Create secure session
      const sessionId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + this.getSessionDuration(trustLevel) * 60 * 1000);
      
      const sessionSecurity: SessionSecurity = {
        sessionId,
        userId: user.id,
        deviceId: deviceTrust.deviceId,
        ipAddress: securityContext.ipAddress,
        userAgent: securityContext.userAgent,
        riskScore: securityContext.riskScore,
        trustLevel,
        mfaVerified: !requiresMFA,
        biometricVerified: false,
        createdAt: new Date(),
        expiresAt,
        lastActivity: new Date(),
        geoLocation: securityContext.geoLocation
      };

      this.activeSessions.set(sessionId, sessionSecurity);

      // Log successful authentication
      await this.logSuccessfulAuth(user.id, request, securityContext);

      return {
        success: true,
        userId: user.id,
        sessionId,
        requiresMFA,
        mfaMethods,
        trustLevel,
        restrictions: this.getSecurityRestrictions(securityContext),
        expiresAt,
        securityContext
      };

    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        requiresMFA: false,
        mfaMethods: [],
        trustLevel: 'low',
        restrictions: [],
        expiresAt: new Date(),
        securityContext: null
      };
    }
  }

  /**
   * Initiate MFA challenge
   */
  static async initiateMFAChallenge(
    userId: string,
    method: string,
    request: NextRequest
  ): Promise<{ challengeId: string; challenge: string } | null> {
    try {
      const challengeId = crypto.randomUUID();
      const challenge = this.generateMFAChallenge(method);
      
      const mfaChallenge: MFAChallenge = {
        id: challengeId,
        userId,
        type: method as any,
        challenge,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        verified: false,
        attempts: 0,
        metadata: {
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      };

      this.mfaChallenges.set(challengeId, mfaChallenge);

      // Send challenge via appropriate channel
      await this.sendMFAChallenge(userId, method, challenge);

      return { challengeId, challenge };

    } catch (error) {
      console.error('MFA challenge error:', error);
      return null;
    }
  }

  /**
   * Verify MFA challenge
   */
  static async verifyMFAChallenge(
    challengeId: string,
    response: string,
    request: NextRequest
  ): Promise<{ verified: boolean; trustLevel?: string }> {
    try {
      const challenge = this.mfaChallenges.get(challengeId);
      if (!challenge) {
        return { verified: false };
      }

      if (challenge.expiresAt < new Date()) {
        this.mfaChallenges.delete(challengeId);
        return { verified: false };
      }

      challenge.attempts++;

      const verified = await this.validateMFAResponse(challenge, response);
      
      if (verified) {
        challenge.verified = true;
        
        // Update session MFA status
        const sessions = Array.from(this.activeSessions.values());
        const userSession = sessions.find(s => s.userId === challenge.userId);
        if (userSession) {
          userSession.mfaVerified = true;
          userSession.trustLevel = 'high';
        }

        // Log successful MFA
        await this.logMFASuccess(challenge.userId, challenge.type, request);

        return { verified: true, trustLevel: 'high' };
      }

      // Check for too many attempts
      if (challenge.attempts >= 3) {
        this.mfaChallenges.delete(challengeId);
        await this.logMFAFailure(challenge.userId, challenge.type, request);
      }

      return { verified: false };

    } catch (error) {
      console.error('MFA verification error:', error);
      return { verified: false };
    }
  }

  /**
   * Enroll biometric authentication
   */
  static async enrollBiometric(
    userId: string,
    biometricType: string,
    biometricData: string,
    deviceId: string
  ): Promise<{ success: boolean; templateId?: string }> {
    try {
      // Encrypt biometric template
      const templateId = crypto.randomUUID();
      const encryptedTemplate = await this.encryptBiometricTemplate(biometricData);
      
      const biometric: BiometricData = {
        type: biometricType as any,
        template: encryptedTemplate,
        confidence: 0.95,
        deviceId,
        enrolled: new Date(),
        lastUsed: new Date()
      };

      // Store in database
      await prisma.userBiometric.create({
        data: {
          id: templateId,
          userId,
          type: biometricType,
          template: encryptedTemplate,
          deviceId,
          enrolled: new Date(),
          active: true
        }
      });

      return { success: true, templateId };

    } catch (error) {
      console.error('Biometric enrollment error:', error);
      return { success: false };
    }
  }

  /**
   * Verify biometric authentication
   */
  static async verifyBiometric(
    userId: string,
    biometricType: string,
    biometricData: string,
    deviceId: string
  ): Promise<{ verified: boolean; confidence: number }> {
    try {
      // Get enrolled biometrics
      const enrolledBiometrics = await prisma.userBiometric.findMany({
        where: {
          userId,
          type: biometricType,
          deviceId,
          active: true
        }
      });

      if (enrolledBiometrics.length === 0) {
        return { verified: false, confidence: 0 };
      }

      // Verify against enrolled templates
      let highestConfidence = 0;
      let verified = false;

      for (const enrolled of enrolledBiometrics) {
        const confidence = await this.compareBiometricTemplates(
          biometricData,
          enrolled.template
        );

        if (confidence > highestConfidence) {
          highestConfidence = confidence;
        }

        if (confidence >= 0.8) { // 80% confidence threshold
          verified = true;
          
          // Update last used
          await prisma.userBiometric.update({
            where: { id: enrolled.id },
            data: { lastUsed: new Date() }
          });
        }
      }

      return { verified, confidence: highestConfidence };

    } catch (error) {
      console.error('Biometric verification error:', error);
      return { verified: false, confidence: 0 };
    }
  }

  /**
   * Evaluate device trust
   */
  private static async evaluateDeviceTrust(
    request: NextRequest,
    userId: string
  ): Promise<DeviceTrust> {
    const deviceId = this.generateDeviceFingerprint(request);
    
    let deviceTrust = this.deviceTrustCache.get(deviceId);
    if (!deviceTrust) {
      // Check database
      const dbDevice = await prisma.trustedDevice.findFirst({
        where: { deviceId, userId }
      });

      if (dbDevice) {
        deviceTrust = {
          deviceId: dbDevice.deviceId,
          userId: dbDevice.userId,
          trusted: dbDevice.trusted,
          fingerprint: dbDevice.fingerprint,
          platform: dbDevice.platform,
          browser: dbDevice.browser,
          location: dbDevice.location,
          firstSeen: dbDevice.firstSeen,
          lastSeen: dbDevice.lastSeen,
          riskScore: dbDevice.riskScore,
          certificateHash: dbDevice.certificateHash ?? undefined
        };
      } else {
        // New device
        deviceTrust = {
          deviceId,
          userId,
          trusted: false,
          fingerprint: this.generateDeviceFingerprint(request),
          platform: this.extractPlatform(request),
          browser: this.extractBrowser(request),
          location: request.ip || 'unknown',
          firstSeen: new Date(),
          lastSeen: new Date(),
          riskScore: 50, // Neutral for new devices
          certificateHash: undefined
        };

        // Store new device
        await prisma.trustedDevice.create({
          data: {
            deviceId,
            userId,
            trusted: false,
            fingerprint: deviceTrust.fingerprint,
            platform: deviceTrust.platform,
            browser: deviceTrust.browser,
            location: deviceTrust.location,
            firstSeen: deviceTrust.firstSeen,
            lastSeen: deviceTrust.lastSeen,
            riskScore: deviceTrust.riskScore
          }
        });
      }

      this.deviceTrustCache.set(deviceId, deviceTrust!);
    }

    return deviceTrust!;
  }

  /**
   * Determine if MFA is required
   */
  private static shouldRequireMFA(
    securityContext: any,
    deviceTrust: DeviceTrust,
    user: any
  ): boolean {
    // High risk always requires MFA
    if (securityContext.riskLevel === 'high' || securityContext.riskLevel === 'critical') {
      return true;
    }

    // Untrusted devices require MFA
    if (!deviceTrust.trusted) {
      return true;
    }

    // Admin users always require MFA
    if (user.role === 'admin') {
      return true;
    }

    // Geographic anomalies require MFA
    if (securityContext.geoLocation && 
        securityContext.threatIntelligence.behaviorAnalysis.isAnomalous) {
      return true;
    }

    return false;
  }

  /**
   * Get available MFA methods for user
   */
  private static async getAvailableMFAMethods(userId: string): Promise<string[]> {
    const methods: string[] = [];
    
    // Check enrolled MFA methods
    const userMFA = await prisma.userMFA.findMany({
      where: { userId, active: true }
    });

    for (const mfa of userMFA) {
      methods.push(mfa.method);
    }

    // Always available methods
    methods.push('email');
    
    return methods;
  }

  /**
   * Calculate trust level
   */
  private static calculateTrustLevel(
    securityContext: any,
    deviceTrust: DeviceTrust,
    requiresMFA: boolean
  ): 'low' | 'medium' | 'high' | 'verified' {
    if (securityContext.riskLevel === 'critical') return 'low';
    if (securityContext.riskLevel === 'high') return 'low';
    if (!deviceTrust.trusted) return 'low';
    if (requiresMFA) return 'medium';
    if (deviceTrust.trusted && securityContext.riskLevel === 'minimal') return 'high';
    return 'medium';
  }

  /**
   * Get session duration based on trust level
   */
  private static getSessionDuration(trustLevel: string): number {
    switch (trustLevel) {
      case 'low': return 15;
      case 'medium': return 60;
      case 'high': return 240;
      case 'verified': return 480;
      default: return 30;
    }
  }

  /**
   * Get security restrictions
   */
  private static getSecurityRestrictions(securityContext: any): string[] {
    const restrictions: string[] = [];
    
    if (securityContext.riskLevel === 'high') {
      restrictions.push('limited_api_access');
      restrictions.push('enhanced_monitoring');
    }
    
    if (securityContext.riskLevel === 'medium') {
      restrictions.push('rate_limiting');
    }
    
    return restrictions;
  }

  /**
   * Generate MFA challenge
   */
  private static generateMFAChallenge(method: string): string {
    switch (method) {
      case 'totp':
        return crypto.randomInt(100000, 999999).toString();
      case 'sms':
      case 'email':
        return crypto.randomInt(100000, 999999).toString();
      case 'hardware_key':
        return crypto.randomUUID();
      default:
        return crypto.randomInt(100000, 999999).toString();
    }
  }

  /**
   * Send MFA challenge
   */
  private static async sendMFAChallenge(
    userId: string,
    method: string,
    challenge: string
  ): Promise<void> {
    // Implementation would integrate with SMS, email, or push notification services
    console.log(`MFA Challenge for user ${userId} via ${method}: ${challenge}`);
  }

  /**
   * Validate MFA response
   */
  private static async validateMFAResponse(
    challenge: MFAChallenge,
    response: string
  ): Promise<boolean> {
    switch (challenge.type) {
      case 'totp':
      case 'sms':
      case 'email':
        return challenge.challenge === response;
      case 'hardware_key':
        return await this.validateHardwareKey(challenge.challenge, response);
      default:
        return false;
    }
  }

  /**
   * Validate hardware key
   */
  private static async validateHardwareKey(
    challenge: string,
    response: string
  ): Promise<boolean> {
    // Implementation would validate WebAuthn response
    return true; // Mock validation
  }

  /**
   * Encrypt biometric template
   */
  private static async encryptBiometricTemplate(template: string): Promise<string> {
    const key = process.env.BIOMETRIC_ENCRYPTION_KEY || 'default-key';
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(template, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Compare biometric templates
   */
  private static async compareBiometricTemplates(
    template1: string,
    encryptedTemplate2: string
  ): Promise<number> {
    try {
      const key = process.env.BIOMETRIC_ENCRYPTION_KEY || 'default-key';
      const decipher = crypto.createDecipher('aes-256-cbc', key);
      let template2 = decipher.update(encryptedTemplate2, 'hex', 'utf8');
      template2 += decipher.final('utf8');
      
      // Mock biometric comparison - in production, use specialized biometric SDK
      const similarity = template1 === template2 ? 1.0 : 0.5;
      return similarity;
      
    } catch (error) {
      console.error('Biometric comparison error:', error);
      return 0;
    }
  }

  /**
   * Generate device fingerprint
   */
  private static generateDeviceFingerprint(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    
    const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}`;
    return crypto.createHash('sha256').update(fingerprint).digest('hex');
  }

  /**
   * Extract platform from request
   */
  private static extractPlatform(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'unknown';
  }

  /**
   * Extract browser from request
   */
  private static extractBrowser(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'unknown';
  }

  /**
   * Log failed authentication attempt
   */
  private static async logFailedAttempt(email: string, request: NextRequest): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          source: 'authentication_system',
          type: 'authentication_failed',
          category: 'authentication',
          severity: 'medium',
          description: `Failed login attempt for ${email}`,
          actor: email,
          target: 'login_endpoint',
          outcome: 'failure',
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
          metadata: {
            email,
            endpoint: request.url
          }
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Log successful authentication
   */
  private static async logSuccessfulAuth(
    userId: string,
    request: NextRequest,
    securityContext: any
  ): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          source: 'authentication_system',
          type: 'authentication_success',
          category: 'authentication',
          severity: 'info',
          description: `Successful login for user ${userId}`,
          actor: userId,
          target: 'login_endpoint',
          outcome: 'success',
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
          metadata: {
            userId,
            riskScore: securityContext.riskScore,
            riskLevel: securityContext.riskLevel
          }
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Log MFA success
   */
  private static async logMFASuccess(
    userId: string,
    method: string,
    request: NextRequest
  ): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          source: 'mfa_system',
          type: 'mfa_success',
          category: 'authentication',
          severity: 'info',
          description: `MFA verification successful for user ${userId}`,
          actor: userId,
          target: 'mfa_endpoint',
          outcome: 'success',
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
          metadata: {
            userId,
            method
          }
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Log MFA failure
   */
  private static async logMFAFailure(
    userId: string,
    method: string,
    request: NextRequest
  ): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          source: 'mfa_system',
          type: 'mfa_failed',
          category: 'authentication',
          severity: 'high',
          description: `MFA verification failed for user ${userId}`,
          actor: userId,
          target: 'mfa_endpoint',
          outcome: 'failure',
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date(),
          metadata: {
            userId,
            method
          }
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Get active session
   */
  static getActiveSession(sessionId: string): SessionSecurity | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Invalidate session
   */
  static invalidateSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  /**
   * Get all active sessions for user
   */
  static getUserSessions(userId: string): SessionSecurity[] {
    return Array.from(this.activeSessions.values()).filter(s => s.userId === userId);
  }

  /**
   * Update session activity
   */
  static updateSessionActivity(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }
}
