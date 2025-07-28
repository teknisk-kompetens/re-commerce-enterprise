
/**
 * ENHANCED SECURITY MIDDLEWARE
 * Enterprise-grade säkerhetsmiddleware med avancerat skydd
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import { rateLimiter, RateLimitPresets } from '@/lib/rate-limiter';
import { EnhancedBankIDSecurity } from '@/lib/enhanced-bankid-security';
import crypto from 'crypto';

export interface SecurityValidationResult {
  allowed: boolean;
  reason: string;
  riskScore: number;
  restrictions: string[];
  headers: Record<string, string>;
  mitigationActions: string[];
}

export interface ThreatDetectionResult {
  isThreat: boolean;
  threatType: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  recommendedAction: 'allow' | 'block' | 'monitor' | 'challenge';
}

export interface RequestFingerprint {
  id: string;
  ipAddress: string;
  userAgent: string;
  acceptLanguage: string;
  acceptEncoding: string;
  contentType?: string;
  origin?: string;
  referer?: string;
  timestamp: Date;
  riskFactors: string[];
}

export class EnhancedSecurityMiddleware {
  private static blockedIPs = new Set<string>();
  private static suspiciousIPs = new Map<string, { count: number; lastSeen: Date }>();
  private static requestFingerprints = new Map<string, RequestFingerprint>();
  
  // Threat intelligence indicators
  private static readonly MALICIOUS_USER_AGENTS = [
    /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zap/i,
    /burpsuite/i, /w3af/i, /skipfish/i, /wpscan/i,
    /dirbuster/i, /gobuster/i, /ffuf/i
  ];

  private static readonly SUSPICIOUS_PATTERNS = [
    /\.\.\//g, // Directory traversal
    /<script/i, // XSS attempts
    /union\s+select/i, // SQL injection
    /exec\(/i, // Code injection
    /eval\(/i, // Code injection
    /javascript:/i, // JavaScript protocol
    /vbscript:/i, // VBScript protocol
    /data:/i, // Data protocol
  ];

  private static readonly BLOCKED_EXTENSIONS = [
    '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py',
    '.sh', '.bat', '.cmd', '.exe', '.dll'
  ];

  /**
   * Huvudsaklig säkerhetsvalidering
   */
  static async validateRequest(request: NextRequest): Promise<SecurityValidationResult> {
    try {
      const startTime = Date.now();
      let riskScore = 0;
      const restrictions: string[] = [];
      const mitigationActions: string[] = [];
      const securityHeaders: Record<string, string> = {};

      // Extrahera request information
      const requestInfo = this.extractRequestInfo(request);
      
      // 1. IP-baserad validering
      const ipValidation = await this.validateIPAddress(requestInfo.ipAddress);
      riskScore += ipValidation.riskScore;
      if (ipValidation.blocked) {
        return this.createBlockedResponse('IP_BLOCKED', ipValidation.reason, 100);
      }

      // 2. Rate limiting kontroll
      const rateLimitResult = await this.checkRateLimit(request, requestInfo);
      if (!rateLimitResult.allowed) {
        return this.createBlockedResponse('RATE_LIMITED', rateLimitResult.reason, 80);
      }
      riskScore += rateLimitResult.riskScore;

      // 3. User-Agent analys
      const uaValidation = this.validateUserAgent(requestInfo.userAgent);
      riskScore += uaValidation.riskScore;
      mitigationActions.push(...uaValidation.actions);

      // 4. Request payload validering
      const payloadValidation = await this.validateRequestPayload(request);
      riskScore += payloadValidation.riskScore;
      if (payloadValidation.blocked) {
        return this.createBlockedResponse('MALICIOUS_PAYLOAD', payloadValidation.reason, 90);
      }

      // 5. Threat detection
      const threatDetection = await this.detectThreats(request, requestInfo);
      if (threatDetection.isThreat && threatDetection.recommendedAction === 'block') {
        return this.createBlockedResponse('THREAT_DETECTED', threatDetection.threatType.join(', '), 95);
      }
      riskScore += this.getThreatRiskScore(threatDetection);

      // 6. Behavioral analysis
      const behaviorAnalysis = await this.analyzeBehavior(requestInfo);
      riskScore += behaviorAnalysis.riskScore;
      restrictions.push(...behaviorAnalysis.restrictions);

      // 7. Geolocation validation
      const geoValidation = await this.validateGeolocation(requestInfo.ipAddress);
      riskScore += geoValidation.riskScore;
      if (geoValidation.blocked) {
        restrictions.push('geo_restricted');
      }

      // 8. TLS/SSL validation
      const tlsValidation = this.validateTLS(request);
      riskScore += tlsValidation.riskScore;
      restrictions.push(...tlsValidation.restrictions);

      // 9. Content-Type validation
      const contentTypeValidation = this.validateContentType(request);
      riskScore += contentTypeValidation.riskScore;

      // 10. Security headers
      securityHeaders.push(...this.generateSecurityHeaders(request, riskScore));

      // Slutlig riskbedömning
      const finalRiskScore = Math.min(riskScore, 100);
      const allowed = finalRiskScore < 70 && !restrictions.includes('blocked');

      // Logga säkerhetshändelse
      await this.logSecurityValidation(request, {
        allowed,
        riskScore: finalRiskScore,
        restrictions,
        processingTime: Date.now() - startTime
      });

      return {
        allowed,
        reason: allowed ? 'Request validated successfully' : 'High risk request blocked',
        riskScore: finalRiskScore,
        restrictions,
        headers: securityHeaders,
        mitigationActions
      };

    } catch (error) {
      console.error('Security validation error:', error);
      
      await SecurityEventLogger.logSecurityEvent({
        type: 'security_middleware_error',
        severity: 'high',
        description: 'Security middleware validation error',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      });

      return {
        allowed: false,
        reason: 'Security validation failed',
        riskScore: 100,
        restrictions: ['validation_error'],
        headers: {},
        mitigationActions: ['block_request']
      };
    }
  }

  /**
   * Extrahera request information
   */
  private static extractRequestInfo(request: NextRequest): RequestFingerprint {
    const ipAddress = request.ip || 
                     request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const contentType = request.headers.get('content-type') || '';
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';

    const fingerprint: RequestFingerprint = {
      id: crypto.randomUUID(),
      ipAddress,
      userAgent,
      acceptLanguage,
      acceptEncoding,
      contentType,
      origin,
      referer,
      timestamp: new Date(),
      riskFactors: []
    };

    // Identifiera riskfaktorer
    if (!userAgent) fingerprint.riskFactors.push('missing_user_agent');
    if (ipAddress === 'unknown') fingerprint.riskFactors.push('unknown_ip');
    if (!acceptLanguage) fingerprint.riskFactors.push('missing_accept_language');
    if (userAgent.length < 20) fingerprint.riskFactors.push('short_user_agent');

    return fingerprint;
  }

  /**
   * Validera IP-adress
   */
  private static async validateIPAddress(ipAddress: string): Promise<{
    blocked: boolean;
    riskScore: number;
    reason: string;
  }> {
    // Kontrollera blockeringslista
    if (this.blockedIPs.has(ipAddress)) {
      return { blocked: true, riskScore: 100, reason: 'IP address is blocked' };
    }

    let riskScore = 0;
    let reason = '';

    // Kontrollera för ogiltiga IP-adresser
    if (ipAddress === 'unknown' || !ipAddress) {
      riskScore += 30;
      reason = 'Unknown IP address';
    }

    // Kontrollera för lokala/privata IP:er i produktion
    if (this.isPrivateOrLocalIP(ipAddress)) {
      riskScore += 20;
      reason = 'Private or local IP address';
    }

    // Kontrollera threat intelligence (mock implementation)
    const threatIntel = await this.checkThreatIntelligence(ipAddress);
    if (threatIntel.isMalicious) {
      this.blockedIPs.add(ipAddress);
      return { blocked: true, riskScore: 100, reason: 'IP flagged as malicious' };
    }

    riskScore += threatIntel.riskScore;
    if (threatIntel.reputation === 'suspicious') {
      reason = 'IP has suspicious reputation';
    }

    return { blocked: false, riskScore, reason };
  }

  /**
   * Kontrollera rate limiting
   */
  private static async checkRateLimit(
    request: NextRequest,
    requestInfo: RequestFingerprint
  ): Promise<{ allowed: boolean; riskScore: number; reason: string }> {
    const pathname = new URL(request.url).pathname;
    const method = request.method;
    
    // Olika rate limits för olika endpoints
    let rateLimitConfig;
    
    if (pathname.startsWith('/api/auth/')) {
      rateLimitConfig = RateLimitPresets.AUTH_LOGIN;
    } else if (pathname.startsWith('/api/') && method === 'POST') {
      rateLimitConfig = RateLimitPresets.API_WRITE;
    } else if (pathname.startsWith('/api/') && method === 'DELETE') {
      rateLimitConfig = RateLimitPresets.API_DELETE;
    } else if (pathname.startsWith('/api/')) {
      rateLimitConfig = RateLimitPresets.API_READ;
    } else {
      rateLimitConfig = RateLimitPresets.PUBLIC_API;
    }

    // Använd IP som identifierare
    const result = await rateLimiter.checkHybridLimit({
      identifier: requestInfo.ipAddress,
      endpoint: pathname,
      ...rateLimitConfig,
      type: 'ip'
    });

    let riskScore = 0;
    if (!result.success) {
      riskScore = 50;
    } else if (result.remaining < 5) {
      riskScore = 20; // Nära gränsen
    }

    return {
      allowed: result.success,
      riskScore,
      reason: result.success ? 'Rate limit ok' : 'Rate limit exceeded'
    };
  }

  /**
   * Validera User-Agent
   */
  private static validateUserAgent(userAgent: string): {
    riskScore: number;
    actions: string[];
  } {
    let riskScore = 0;
    const actions: string[] = [];

    // Kontrollera för malicious user agents
    for (const pattern of this.MALICIOUS_USER_AGENTS) {
      if (pattern.test(userAgent)) {
        riskScore += 50;
        actions.push('malicious_user_agent_detected');
        break;
      }
    }

    // Kontrollera för misstänkta patterns
    if (!userAgent || userAgent.length < 10) {
      riskScore += 30;
      actions.push('minimal_user_agent');
    }

    // Kontrollera för vanliga bots (inte nödvändivis malicious)
    const botPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i];
    for (const pattern of botPatterns) {
      if (pattern.test(userAgent)) {
        riskScore += 15;
        actions.push('bot_detected');
        break;
      }
    }

    return { riskScore, actions };
  }

  /**
   * Validera request payload
   */
  private static async validateRequestPayload(request: NextRequest): Promise<{
    blocked: boolean;
    riskScore: number;
    reason: string;
  }> {
    let riskScore = 0;
    let blocked = false;
    let reason = '';

    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const query = url.search;

      // Kontrollera för blocked file extensions
      for (const ext of this.BLOCKED_EXTENSIONS) {
        if (pathname.endsWith(ext)) {
          return { blocked: true, riskScore: 100, reason: `Blocked file extension: ${ext}` };
        }
      }

      // Kontrollera URL och query parameters
      const fullUrl = pathname + query;
      for (const pattern of this.SUSPICIOUS_PATTERNS) {
        if (pattern.test(fullUrl)) {
          riskScore += 40;
          reason = 'Suspicious pattern detected in URL';
        }
      }

      // Kontrollera POST/PUT body om det finns
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        try {
          const clonedRequest = request.clone();
          const body = await clonedRequest.text();
          
          if (body) {
            // Kontrollera body för suspicious patterns
            for (const pattern of this.SUSPICIOUS_PATTERNS) {
              if (pattern.test(body)) {
                riskScore += 50;
                reason = 'Suspicious pattern detected in request body';
              }
            }

            // Kontrollera body size
            if (body.length > 10 * 1024 * 1024) { // 10MB
              riskScore += 30;
              reason = 'Unusually large request body';
            }
          }
        } catch (error) {
          // Kan inte läsa body, fortsätt ändå
        }
      }

      return { blocked, riskScore, reason };

    } catch (error) {
      console.error('Payload validation error:', error);
      return { blocked: false, riskScore: 10, reason: 'Payload validation error' };
    }
  }

  /**
   * Upptäck hot
   */
  private static async detectThreats(
    request: NextRequest,
    requestInfo: RequestFingerprint
  ): Promise<ThreatDetectionResult> {
    const threats: string[] = [];
    const indicators: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // SQL Injection detection
    const url = request.url;
    const sqlPatterns = [
      /union\s+select/i,
      /select\s+\*\s+from/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /update\s+.*\s+set/i,
      /delete\s+from/i
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(url)) {
        threats.push('sql_injection');
        indicators.push('SQL injection pattern in URL');
        severity = 'high';
      }
    }

    // XSS detection
    const xssPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /document\.cookie/i,
      /window\.location/i
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(url)) {
        threats.push('xss');
        indicators.push('XSS pattern detected');
        severity = severity === 'critical' ? 'critical' : 'high';
      }
    }

    // Directory traversal
    if (/\.\.\//.test(url)) {
      threats.push('directory_traversal');
      indicators.push('Directory traversal attempt');
      severity = severity === 'critical' ? 'critical' : 'medium';
    }

    // Command injection
    const cmdPatterns = [
      /;\s*(ls|cat|wget|curl|nc|netcat)/i,
      /\|\s*(ls|cat|wget|curl|nc|netcat)/i,
      /`.*`/,
      /\$\(.*\)/
    ];

    for (const pattern of cmdPatterns) {
      if (pattern.test(url)) {
        threats.push('command_injection');
        indicators.push('Command injection pattern');
        severity = 'critical';
      }
    }

    // Automated scanning detection
    if (this.MALICIOUS_USER_AGENTS.some(pattern => pattern.test(requestInfo.userAgent))) {
      threats.push('automated_scanning');
      indicators.push('Malicious user agent detected');
      severity = severity === 'critical' ? 'critical' : 'medium';
    }

    // Brute force detection
    const suspiciousIP = this.suspiciousIPs.get(requestInfo.ipAddress);
    if (suspiciousIP && suspiciousIP.count > 50) {
      threats.push('brute_force');
      indicators.push('High request frequency from IP');
      severity = severity === 'critical' ? 'critical' : 'high';
    }

    // Bestäm rekommenderad åtgärd
    let recommendedAction: 'allow' | 'block' | 'monitor' | 'challenge' = 'allow';
    
    if (severity === 'critical') {
      recommendedAction = 'block';
    } else if (severity === 'high') {
      recommendedAction = 'challenge';
    } else if (severity === 'medium') {
      recommendedAction = 'monitor';
    }

    return {
      isThreat: threats.length > 0,
      threatType: threats,
      severity,
      indicators,
      recommendedAction
    };
  }

  /**
   * Analysera beteende
   */
  private static async analyzeBehavior(requestInfo: RequestFingerprint): Promise<{
    riskScore: number;
    restrictions: string[];
  }> {
    let riskScore = 0;
    const restrictions: string[] = [];

    // Uppdatera request frequency tracking
    const existing = this.suspiciousIPs.get(requestInfo.ipAddress);
    if (existing) {
      existing.count++;
      existing.lastSeen = new Date();
      
      // Kontrollera för onormal frekvens
      if (existing.count > 100) {
        riskScore += 40;
        restrictions.push('high_frequency_requests');
      }
    } else {
      this.suspiciousIPs.set(requestInfo.ipAddress, {
        count: 1,
        lastSeen: new Date()
      });
    }

    // Analysera request patterns
    const fingerprint = `${requestInfo.userAgent}|${requestInfo.acceptLanguage}|${requestInfo.acceptEncoding}`;
    const existingFingerprint = this.requestFingerprints.get(fingerprint);
    
    if (existingFingerprint) {
      // Same fingerprint from different IP could indicate distributed attack
      if (existingFingerprint.ipAddress !== requestInfo.ipAddress) {
        riskScore += 20;
        restrictions.push('distributed_request_pattern');
      }
    } else {
      this.requestFingerprints.set(fingerprint, requestInfo);
    }

    return { riskScore, restrictions };
  }

  /**
   * Validera geolokalisering
   */
  private static async validateGeolocation(ipAddress: string): Promise<{
    blocked: boolean;
    riskScore: number;
  }> {
    try {
      // Mock geolocation - i produktion använda riktig geolocation service
      const geoData = await this.getGeolocation(ipAddress);
      
      let riskScore = 0;
      let blocked = false;

      // Kontrollera blocked countries
      const blockedCountries = ['CN', 'RU', 'KP']; // Exempel
      if (geoData && blockedCountries.includes(geoData.country)) {
        blocked = true;
        riskScore = 90;
      }

      // Höjd risk för vissa länder
      const highRiskCountries = ['IR', 'SY'];
      if (geoData && highRiskCountries.includes(geoData.country)) {
        riskScore = 60;
      }

      return { blocked, riskScore };

    } catch (error) {
      // Om geolocation misslyckas, fortsätt med låg risk
      return { blocked: false, riskScore: 5 };
    }
  }

  /**
   * Validera TLS/SSL
   */
  private static validateTLS(request: NextRequest): {
    riskScore: number;
    restrictions: string[];
  } {
    let riskScore = 0;
    const restrictions: string[] = [];

    const protocol = new URL(request.url).protocol;
    
    // Kräv HTTPS i produktion
    if (protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      riskScore += 50;
      restrictions.push('insecure_connection');
    }

    return { riskScore, restrictions };
  }

  /**
   * Validera Content-Type
   */
  private static validateContentType(request: NextRequest): {
    riskScore: number;
  } {
    let riskScore = 0;
    const contentType = request.headers.get('content-type');

    // Kontrollera för misstänkta content types
    if (contentType) {
      const suspiciousTypes = [
        'application/x-msdownload',
        'application/x-executable',
        'application/x-msdos-program'
      ];

      if (suspiciousTypes.some(type => contentType.includes(type))) {
        riskScore += 40;
      }
    }

    return { riskScore };
  }

  /**
   * Generera säkerhetsheaders
   */
  private static generateSecurityHeaders(
    request: NextRequest,
    riskScore: number
  ): Record<string, string> {
    const headers: Record<string, string> = {};

    // Grundläggande säkerhetsheaders
    headers['X-Content-Type-Options'] = 'nosniff';
    headers['X-Frame-Options'] = 'DENY';
    headers['X-XSS-Protection'] = '1; mode=block';
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()';

    // Striktare CSP för högre risk
    if (riskScore > 50) {
      headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;";
    } else {
      headers['Content-Security-Policy'] = "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:;";
    }

    // HSTS för HTTPS
    if (new URL(request.url).protocol === 'https:') {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    return headers;
  }

  /**
   * Skapa blockerat svar
   */
  private static createBlockedResponse(
    type: string,
    reason: string,
    riskScore: number
  ): SecurityValidationResult {
    return {
      allowed: false,
      reason,
      riskScore,
      restrictions: ['blocked'],
      headers: {
        'X-Security-Block-Type': type,
        'X-Security-Block-Reason': reason
      },
      mitigationActions: ['block_request', 'log_incident']
    };
  }

  /**
   * Beräkna threat risk score
   */
  private static getThreatRiskScore(threat: ThreatDetectionResult): number {
    if (!threat.isThreat) return 0;

    switch (threat.severity) {
      case 'critical': return 70;
      case 'high': return 50;
      case 'medium': return 30;
      case 'low': return 15;
      default: return 0;
    }
  }

  /**
   * Kontrollera om IP är privat eller lokal
   */
  private static isPrivateOrLocalIP(ip: string): boolean {
    if (!ip || ip === 'unknown') return false;

    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^localhost$/i
    ];

    return privateRanges.some(range => range.test(ip));
  }

  /**
   * Kontrollera threat intelligence (mock)
   */
  private static async checkThreatIntelligence(ipAddress: string): Promise<{
    isMalicious: boolean;
    reputation: 'clean' | 'suspicious' | 'malicious';
    riskScore: number;
  }> {
    // Mock implementation - i produktion integrera med threat intelligence feeds
    const mockMaliciousIPs = ['192.168.1.666', '10.0.0.666'];
    const mockSuspiciousIPs = ['192.168.1.999'];

    if (mockMaliciousIPs.includes(ipAddress)) {
      return { isMalicious: true, reputation: 'malicious', riskScore: 80 };
    }

    if (mockSuspiciousIPs.includes(ipAddress)) {
      return { isMalicious: false, reputation: 'suspicious', riskScore: 40 };
    }

    return { isMalicious: false, reputation: 'clean', riskScore: 0 };
  }

  /**
   * Hämta geolocation (mock)
   */
  private static async getGeolocation(ipAddress: string): Promise<{ country: string; city: string } | null> {
    // Mock implementation - i produktion använda riktig geolocation service
    if (ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('127.')) {
      return { country: 'SE', city: 'Stockholm' }; // Local IPs default to Sweden
    }
    
    return { country: 'SE', city: 'Stockholm' };
  }

  /**
   * Logga säkerhetsvalidering
   */
  private static async logSecurityValidation(
    request: NextRequest,
    result: {
      allowed: boolean;
      riskScore: number;
      restrictions: string[];
      processingTime: number;
    }
  ): Promise<void> {
    try {
      const severity = result.allowed ? 'info' : 'medium';
      const type = result.allowed ? 'security_validation_passed' : 'security_validation_blocked';

      await SecurityEventLogger.logSecurityEvent({
        type,
        severity,
        description: `Security validation ${result.allowed ? 'passed' : 'blocked'}`,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        metadata: {
          riskScore: result.riskScore,
          restrictions: result.restrictions,
          processingTime: result.processingTime,
          method: request.method,
          url: request.url
        }
      });

    } catch (error) {
      console.error('Failed to log security validation:', error);
    }
  }

  /**
   * Rensa gamla fingerprints och tracking data
   */
  static cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 timmar

    // Rensa gamla suspicious IPs
    for (const [ip, data] of this.suspiciousIPs.entries()) {
      if (now - data.lastSeen.getTime() > maxAge) {
        this.suspiciousIPs.delete(ip);
      }
    }

    // Rensa gamla fingerprints
    for (const [fingerprint, data] of this.requestFingerprints.entries()) {
      if (now - data.timestamp.getTime() > maxAge) {
        this.requestFingerprints.delete(fingerprint);
      }
    }
  }

  /**
   * Lägg till IP i blockeringslista
   */
  static blockIP(ipAddress: string): void {
    this.blockedIPs.add(ipAddress);
  }

  /**
   * Ta bort IP från blockeringslista
   */
  static unblockIP(ipAddress: string): void {
    this.blockedIPs.delete(ipAddress);
  }

  /**
   * Hämta blockerade IPs
   */
  static getBlockedIPs(): string[] {
    return Array.from(this.blockedIPs);
  }

  /**
   * Hämta misstänkta IPs
   */
  static getSuspiciousIPs(): Array<{ ip: string; count: number; lastSeen: Date }> {
    return Array.from(this.suspiciousIPs.entries()).map(([ip, data]) => ({
      ip,
      count: data.count,
      lastSeen: data.lastSeen
    }));
  }
}

// Periodisk rensning av gamla data
setInterval(() => {
  EnhancedSecurityMiddleware.cleanup();
}, 60 * 60 * 1000); // Varje timme
