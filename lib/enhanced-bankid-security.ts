
/**
 * ENHANCED BANKID SECURITY SYSTEM
 * Förstärkt BankID integration med enterprise-grade säkerhet
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { EnhancedAuthenticationSystem } from '@/lib/enhanced-authentication-system';
import { SecurityEventLogger } from '@/lib/security-event-logger';

export interface BankIDAuthRequest {
  personalNumber: string;
  endUserIp: string;
  requirement?: {
    certificatePolicies?: string[];
    issuerCn?: string;
    cardReader?: 'class1' | 'class2';
    allowFingerprint?: boolean;
  };
  userVisibleData?: string;
  userNonVisibleData?: string;
}

export interface BankIDAuthResponse {
  orderRef: string;
  autoStartToken: string;
  qrStartToken: string;
  qrStartSecret: string;
}

export interface BankIDCollectResponse {
  orderRef: string;
  status: 'pending' | 'failed' | 'complete';
  hintCode?: string;
  completionData?: {
    user: {
      personalNumber: string;
      name: string;
      givenName: string;
      surname: string;
    };
    device: {
      ipAddress: string;
      uhi: string;
    };
    cert: {
      notBefore: string;
      notAfter: string;
    };
    signature: string;
    ocspResponse: string;
  };
}

export interface SecureBankIDSession {
  sessionId: string;
  orderRef: string;
  personalNumber: string;
  status: 'pending' | 'authenticated' | 'failed' | 'expired';
  ipAddress: string;
  userAgent: string;
  deviceFingerprint: string;
  securityLevel: 'standard' | 'high' | 'maximum';
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  attemptCount: number;
  maxAttempts: number;
  requireMFA: boolean;
  tenantId?: string;
  riskScore: number;
  geoLocation?: {
    country: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  threatIntelligence: {
    ipReputation: string;
    behaviorAnalysis: any;
    riskFactors: string[];
  };
}

export class EnhancedBankIDSecurity {
  private static activeSessions = new Map<string, SecureBankIDSession>();
  private static orderRefMap = new Map<string, string>(); // orderRef -> sessionId
  
  private static readonly BANKID_API_URL = process.env.BANKID_API_URL || 'https://appapi2.test.bankid.com/rp/v6.0';
  private static readonly BANKID_CLIENT_CERT = process.env.BANKID_CLIENT_CERT;
  private static readonly BANKID_CLIENT_KEY = process.env.BANKID_CLIENT_KEY;
  private static readonly BANKID_CA_CERT = process.env.BANKID_CA_CERT;

  /**
   * Initiera säker BankID autentisering
   */
  static async initiateSecureBankIDAuth(
    request: NextRequest,
    personalNumber?: string,
    tenantId?: string
  ): Promise<{
    success: boolean;
    sessionId?: string;
    orderRef?: string;
    autoStartToken?: string;
    qrStartToken?: string;
    qrStartSecret?: string;
    error?: string;
  }> {
    try {
      // Säkerhetsvalidering av request
      const securityValidation = await this.validateAuthRequest(request);
      if (!securityValidation.allowed) {
        await SecurityEventLogger.logSecurityEvent({
          type: 'bankid_auth_blocked',
          severity: 'high',
          description: 'BankID authentication blocked due to security validation',
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          metadata: { reason: securityValidation.reason }
        });
        
        return {
          success: false,
          error: 'Authentication blocked due to security policy'
        };
      }

      // Skapa säker session
      const sessionId = crypto.randomUUID();
      const deviceFingerprint = this.generateDeviceFingerprint(request);
      const riskScore = await this.calculateRiskScore(request, personalNumber);
      const geoLocation = await this.getGeoLocation(request.ip || 'unknown');
      const threatIntel = await this.getThreatIntelligence(request.ip || 'unknown');

      // Bestäm säkerhetsnivå baserat på risk
      const securityLevel = this.determineSecurityLevel(riskScore, threatIntel);
      
      // BankID auth request
      const authRequest: BankIDAuthRequest = {
        personalNumber: personalNumber || '',
        endUserIp: request.ip || 'unknown',
        requirement: {
          certificatePolicies: securityLevel === 'maximum' ? ['1.2.752.201.3.1'] : undefined,
          cardReader: securityLevel === 'maximum' ? 'class2' : undefined,
          allowFingerprint: securityLevel !== 'maximum'
        },
        userVisibleData: this.encodeUserVisibleData(`Säker inloggning - Säkerhetsnivå: ${securityLevel}`)
      };

      // Anropa BankID API
      const bankidResponse = await this.callBankIDAPI('/auth', authRequest);
      
      if (!bankidResponse.success) {
        return {
          success: false,
          error: 'BankID service temporarily unavailable'
        };
      }

      // Skapa säker session
      const session: SecureBankIDSession = {
        sessionId,
        orderRef: bankidResponse.data.orderRef,
        personalNumber: personalNumber || '',
        status: 'pending',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        deviceFingerprint,
        securityLevel,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minuter
        lastActivity: new Date(),
        attemptCount: 1,
        maxAttempts: securityLevel === 'maximum' ? 2 : 3,
        requireMFA: securityLevel === 'maximum' || riskScore > 70,
        tenantId,
        riskScore,
        geoLocation,
        threatIntelligence: {
          ipReputation: threatIntel.reputation,
          behaviorAnalysis: threatIntel.behavior,
          riskFactors: threatIntel.riskFactors
        }
      };

      this.activeSessions.set(sessionId, session);
      this.orderRefMap.set(bankidResponse.data.orderRef, sessionId);

      // Logga autentiseringsförsök
      await SecurityEventLogger.logSecurityEvent({
        type: 'bankid_auth_initiated',
        severity: 'info',
        description: 'BankID authentication initiated',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: {
          sessionId,
          orderRef: bankidResponse.data.orderRef,
          securityLevel,
          riskScore,
          tenantId
        }
      });

      return {
        success: true,
        sessionId,
        orderRef: bankidResponse.data.orderRef,
        autoStartToken: bankidResponse.data.autoStartToken,
        qrStartToken: bankidResponse.data.qrStartToken,
        qrStartSecret: bankidResponse.data.qrStartSecret
      };

    } catch (error) {
      console.error('BankID authentication error:', error);
      
      await SecurityEventLogger.logSecurityEvent({
        type: 'bankid_auth_error',
        severity: 'high',
        description: 'BankID authentication system error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });

      return {
        success: false,
        error: 'Authentication system error'
      };
    }
  }

  /**
   * Collecta BankID resultat med säkerhetsvalidering
   */
  static async collectBankIDResult(
    orderRef: string,
    request: NextRequest
  ): Promise<{
    status: 'pending' | 'complete' | 'failed';
    sessionId?: string;
    user?: any;
    jwt?: string;
    requireMFA?: boolean;
    error?: string;
  }> {
    try {
      const sessionId = this.orderRefMap.get(orderRef);
      if (!sessionId) {
        return { status: 'failed', error: 'Invalid order reference' };
      }

      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { status: 'failed', error: 'Session expired' };
      }

      // Kontrollera session giltighet
      if (session.expiresAt < new Date()) {
        this.cleanupSession(sessionId);
        return { status: 'failed', error: 'Session expired' };
      }

      // Uppdatera senaste aktivitet
      session.lastActivity = new Date();

      // Anropa BankID collect
      const collectResponse = await this.callBankIDAPI('/collect', { orderRef });
      
      if (!collectResponse.success) {
        return { status: 'failed', error: 'BankID service error' };
      }

      const result = collectResponse.data as BankIDCollectResponse;

      switch (result.status) {
        case 'pending':
          return { status: 'pending', sessionId };

        case 'complete':
          if (!result.completionData) {
            return { status: 'failed', error: 'Invalid completion data' };
          }

          // Validera autentiseringsresultat
          const validation = await this.validateAuthResult(result, session, request);
          if (!validation.valid) {
            await SecurityEventLogger.logSecurityEvent({
              type: 'bankid_auth_validation_failed',
              severity: 'high',
              description: 'BankID authentication validation failed',
              metadata: { reason: validation.reason, orderRef, sessionId }
            });
            
            return { status: 'failed', error: 'Authentication validation failed' };
          }

          // Skapa eller uppdatera användare
          const user = await this.createOrUpdateUser(result.completionData, session);
          
          // Generera säker JWT token
          const jwtToken = await this.generateSecureJWT(user, session);

          // Uppdatera session status
          session.status = 'authenticated';
          
          // Logga framgångsrik autentisering
          await SecurityEventLogger.logSecurityEvent({
            type: 'bankid_auth_success',
            severity: 'info',
            description: 'BankID authentication successful',
            actor: result.completionData.user.personalNumber,
            metadata: {
              sessionId,
              orderRef,
              personalNumber: result.completionData.user.personalNumber,
              name: result.completionData.user.name,
              securityLevel: session.securityLevel,
              riskScore: session.riskScore
            }
          });

          return {
            status: 'complete',
            sessionId,
            user,
            jwt: jwtToken,
            requireMFA: session.requireMFA
          };

        case 'failed':
          session.attemptCount++;
          
          await SecurityEventLogger.logSecurityEvent({
            type: 'bankid_auth_failed',
            severity: 'medium',
            description: `BankID authentication failed: ${result.hintCode}`,
            metadata: {
              sessionId,
              orderRef,
              hintCode: result.hintCode,
              attemptCount: session.attemptCount
            }
          });

          if (session.attemptCount >= session.maxAttempts) {
            this.cleanupSession(sessionId);
            return { status: 'failed', error: 'Maximum attempts exceeded' };
          }

          return { status: 'failed', error: result.hintCode || 'Authentication failed' };

        default:
          return { status: 'failed', error: 'Unknown status' };
      }

    } catch (error) {
      console.error('BankID collect error:', error);
      return { status: 'failed', error: 'System error' };
    }
  }

  /**
   * Avbryt BankID autentisering
   */
  static async cancelBankIDAuth(orderRef: string): Promise<{ success: boolean }> {
    try {
      const sessionId = this.orderRefMap.get(orderRef);
      if (sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (session) {
          // Anropa BankID cancel
          await this.callBankIDAPI('/cancel', { orderRef });
          
          // Logga avbrytning
          await SecurityEventLogger.logSecurityEvent({
            type: 'bankid_auth_cancelled',
            severity: 'info',
            description: 'BankID authentication cancelled',
            metadata: { sessionId, orderRef }
          });
        }
        
        this.cleanupSession(sessionId);
      }

      return { success: true };
    } catch (error) {
      console.error('BankID cancel error:', error);
      return { success: false };
    }
  }

  /**
   * Validera autentiseringsrequest
   */
  private static async validateAuthRequest(request: NextRequest): Promise<{
    allowed: boolean;
    reason: string;
    riskScore: number;
  }> {
    let riskScore = 0;
    const reasons: string[] = [];

    // IP-validering
    const ipAddress = request.ip || 'unknown';
    if (ipAddress === 'unknown' || ipAddress.startsWith('0.')) {
      riskScore += 30;
      reasons.push('suspicious_ip');
    }

    // User-Agent validering
    const userAgent = request.headers.get('user-agent') || '';
    if (!userAgent || userAgent.length < 10) {
      riskScore += 20;
      reasons.push('minimal_user_agent');
    }

    // Kontrollera mot threat intelligence
    const threatIntel = await this.getThreatIntelligence(ipAddress);
    if (threatIntel.reputation === 'malicious') {
      riskScore += 50;
      reasons.push('malicious_ip');
    }

    // Rate limiting kontroll
    const rateLimitKey = `bankid_auth:${ipAddress}`;
    const recentAttempts = await this.getRecentAuthAttempts(rateLimitKey);
    if (recentAttempts > 5) {
      riskScore += 40;
      reasons.push('rate_limit_exceeded');
    }

    const allowed = riskScore < 80;
    const reason = allowed ? 'validation_passed' : reasons.join(', ');

    return { allowed, reason, riskScore };
  }

  /**
   * Beräkna riskpoäng
   */
  private static async calculateRiskScore(
    request: NextRequest,
    personalNumber?: string
  ): Promise<number> {
    let riskScore = 0;

    // Bas riskpoäng för okänd IP
    const ipAddress = request.ip || 'unknown';
    if (ipAddress === 'unknown') {
      riskScore += 20;
    }

    // Geolokalisering risk
    const geoLocation = await this.getGeoLocation(ipAddress);
    if (geoLocation && geoLocation.country !== 'SE') {
      riskScore += 30; // Höjd risk för utländska IP:er
    }

    // Threat intelligence
    const threatIntel = await this.getThreatIntelligence(ipAddress);
    switch (threatIntel.reputation) {
      case 'malicious': riskScore += 50; break;
      case 'suspicious': riskScore += 30; break;
      case 'unknown': riskScore += 10; break;
    }

    // Beteendeanalys (om personnummer angivet)
    if (personalNumber) {
      const behaviorRisk = await this.analyzeBehaviorRisk(personalNumber, request);
      riskScore += behaviorRisk;
    }

    return Math.min(riskScore, 100); // Max 100
  }

  /**
   * Bestäm säkerhetsnivå
   */
  private static determineSecurityLevel(
    riskScore: number,
    threatIntel: any
  ): 'standard' | 'high' | 'maximum' {
    if (riskScore >= 70 || threatIntel.reputation === 'malicious') {
      return 'maximum';
    } else if (riskScore >= 40 || threatIntel.reputation === 'suspicious') {
      return 'high';
    }
    return 'standard';
  }

  /**
   * Validera autentiseringsresultat
   */
  private static async validateAuthResult(
    result: BankIDCollectResponse,
    session: SecureBankIDSession,
    request: NextRequest
  ): Promise<{ valid: boolean; reason?: string }> {
    if (!result.completionData) {
      return { valid: false, reason: 'missing_completion_data' };
    }

    // Validera IP-adress
    if (result.completionData.device.ipAddress !== session.ipAddress) {
      return { valid: false, reason: 'ip_address_mismatch' };
    }

    // Validera personnummer (om angivet)
    if (session.personalNumber && 
        result.completionData.user.personalNumber !== session.personalNumber) {
      return { valid: false, reason: 'personal_number_mismatch' };
    }

    // Validera certifikat giltighet
    const certNotAfter = new Date(result.completionData.cert.notAfter);
    if (certNotAfter < new Date()) {
      return { valid: false, reason: 'certificate_expired' };
    }

    // Validera OCSP-svar (förenklat)
    if (!result.completionData.ocspResponse) {
      return { valid: false, reason: 'missing_ocsp_response' };
    }

    return { valid: true };
  }

  /**
   * Skapa eller uppdatera användare
   */
  private static async createOrUpdateUser(
    completionData: any,
    session: SecureBankIDSession
  ): Promise<any> {
    const { personalNumber, name, givenName, surname } = completionData.user;

    try {
      // Hitta eller skapa användare
      let user = await prisma.user.findFirst({
        where: { email: `${personalNumber}@bankid.se` },
        include: { tenant: true }
      });

      if (!user) {
        // Skapa ny användare
        let tenant;
        if (session.tenantId) {
          tenant = await prisma.tenant.findUnique({
            where: { id: session.tenantId }
          });
        }

        if (!tenant) {
          // Skapa default tenant om ingen angiven
          tenant = await prisma.tenant.findFirst({
            where: { domain: 'default' }
          });
        }

        if (!tenant) {
          throw new Error('No valid tenant found');
        }

        user = await prisma.user.create({
          data: {
            email: `${personalNumber}@bankid.se`,
            name,
            password: null, // BankID-användare har inget lösenord
            role: 'user',
            tenantId: tenant.id,
            isActive: true
          },
          include: { tenant: true }
        });
      } else {
        // Uppdatera befintlig användare
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name,
            updatedAt: new Date()
          },
          include: { tenant: true }
        });
      }

      return user;
    } catch (error) {
      console.error('User creation/update error:', error);
      throw error;
    }
  }

  /**
   * Generera säker JWT token
   */
  private static async generateSecureJWT(user: any, session: SecureBankIDSession): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      sessionId: session.sessionId,
      securityLevel: session.securityLevel,
      authMethod: 'bankid',
      riskScore: session.riskScore,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (session.securityLevel === 'maximum' ? 3600 : 7200), // 1-2 timmar
      jti: crypto.randomUUID() // JWT ID för revocation
    };

    const secret = process.env.JWT_SECRET || 'default-secret';
    return jwt.sign(payload, secret, { algorithm: 'HS256' });
  }

  /**
   * Anropa BankID API
   */
  private static async callBankIDAPI(endpoint: string, data: any): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // I produktion skulle detta använda riktiga BankID API-anrop med klientcertifikat
      // För demo returnerar vi mockade svar
      const mockResponse = this.getMockBankIDResponse(endpoint, data);
      return { success: true, data: mockResponse };
    } catch (error) {
      console.error('BankID API error:', error);
      return { success: false, error: 'API call failed' };
    }
  }

  /**
   * Mock BankID svar för demonstration
   */
  private static getMockBankIDResponse(endpoint: string, data: any): any {
    const orderRef = crypto.randomUUID();
    
    switch (endpoint) {
      case '/auth':
        return {
          orderRef,
          autoStartToken: crypto.randomUUID(),
          qrStartToken: crypto.randomUUID(),
          qrStartSecret: crypto.randomBytes(16).toString('hex')
        };
      
      case '/collect':
        // Mock collect response - i produktion skulle detta vara dynamiskt
        return {
          orderRef: data.orderRef,
          status: 'complete',
          completionData: {
            user: {
              personalNumber: '198001011234',
              name: 'Test Testsson',
              givenName: 'Test',
              surname: 'Testsson'
            },
            device: {
              ipAddress: '192.168.1.1',
              uhi: 'mock-uhi'
            },
            cert: {
              notBefore: new Date().toISOString(),
              notAfter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            },
            signature: 'mock-signature',
            ocspResponse: 'mock-ocsp-response'
          }
        };
      
      default:
        return {};
    }
  }

  /**
   * Kodning av användarvisible data
   */
  private static encodeUserVisibleData(text: string): string {
    return Buffer.from(text, 'utf8').toString('base64');
  }

  /**
   * Generera device fingerprint
   */
  private static generateDeviceFingerprint(request: NextRequest): string {
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    
    const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}`;
    return crypto.createHash('sha256').update(fingerprint).digest('hex');
  }

  /**
   * Hämta geolokalisering (mock)
   */
  private static async getGeoLocation(ipAddress: string): Promise<any> {
    // Mock implementation - i produktion använda riktig geolocation service
    return {
      country: 'SE',
      city: 'Stockholm',
      coordinates: { lat: 59.3293, lng: 18.0686 }
    };
  }

  /**
   * Hämta threat intelligence (mock)
   */
  private static async getThreatIntelligence(ipAddress: string): Promise<any> {
    // Mock implementation - i produktion använda riktig threat intelligence
    return {
      reputation: 'clean',
      behavior: { isAnomalous: false },
      riskFactors: []
    };
  }

  /**
   * Analys av beteenderisk
   */
  private static async analyzeBehaviorRisk(
    personalNumber: string,
    request: NextRequest
  ): Promise<number> {
    // Mock implementation - i produktion använda ML-baserad beteendeanalys
    return 0;
  }

  /**
   * Hämta senaste autentiseringsförsök
   */
  private static async getRecentAuthAttempts(key: string): Promise<number> {
    // Mock implementation - i produktion använda Redis eller databas
    return 0;
  }

  /**
   * Rensa session
   */
  private static cleanupSession(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      this.orderRefMap.delete(session.orderRef);
      this.activeSessions.delete(sessionId);
    }
  }

  /**
   * Hämta aktiv session
   */
  static getActiveSession(sessionId: string): SecureBankIDSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Validera JWT token
   */
  static validateJWT(token: string): { valid: boolean; payload?: any } {
    try {
      const secret = process.env.JWT_SECRET || 'default-secret';
      const payload = jwt.verify(token, secret) as any;
      
      // Kontrollera att sessionen fortfarande är aktiv
      if (payload.sessionId) {
        const session = this.activeSessions.get(payload.sessionId);
        if (!session || session.status !== 'authenticated') {
          return { valid: false };
        }
      }

      return { valid: true, payload };
    } catch (error) {
      console.error('JWT validation error:', error);
      return { valid: false };
    }
  }

  /**
   * Rensa utgångna sessioner (körs periodiskt)
   */
  static cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.expiresAt < now) {
        this.cleanupSession(sessionId);
      }
    }
  }
}

// Starta periodisk rensning av utgångna sessioner
setInterval(() => {
  EnhancedBankIDSecurity.cleanupExpiredSessions();
}, 60000); // Varje minut
