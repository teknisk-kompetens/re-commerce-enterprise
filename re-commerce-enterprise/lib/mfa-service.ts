
import { prisma } from './db'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import crypto from 'crypto'

export class MFAService {
  /**
   * Generate MFA secret for user
   */
  static generateSecret(userEmail: string, tenantName: string): string {
    return authenticator.generateSecret()
  }

  /**
   * Generate QR code for MFA setup
   */
  static async generateQRCode(secret: string, userEmail: string, tenantName: string): Promise<string> {
    const service = `${tenantName} (Enterprise)`
    const otpauth = authenticator.keyuri(userEmail, service, secret)
    return await QRCode.toDataURL(otpauth)
  }

  /**
   * Verify TOTP token
   */
  static verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret })
  }

  /**
   * Enable MFA for user
   */
  static async enableMFA(userId: string, secret: string, token: string): Promise<boolean> {
    // Verify the token first
    if (!this.verifyToken(token, secret)) {
      return false
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes()

    // Update user with MFA settings
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaSecret: secret,
        mfaBackupCodes: backupCodes
      }
    })

    return true
  }

  /**
   * Disable MFA for user
   */
  static async disableMFA(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: []
      }
    })
  }

  /**
   * Verify MFA for user
   */
  static async verifyMFA(userId: string, token: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        mfaSecret: true,
        mfaBackupCodes: true,
        mfaEnabled: true
      }
    })

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return false
    }

    // Try TOTP first
    if (this.verifyToken(token, user.mfaSecret)) {
      return true
    }

    // Try backup codes
    if (user.mfaBackupCodes.includes(token)) {
      // Remove used backup code
      const updatedCodes = user.mfaBackupCodes.filter((code: any) => code !== token)
      await prisma.user.update({
        where: { id: userId },
        data: { mfaBackupCodes: updatedCodes }
      })
      return true
    }

    return false
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count = 8): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase())
    }
    return codes
  }

  /**
   * Regenerate backup codes
   */
  static async regenerateBackupCodes(userId: string): Promise<string[]> {
    const backupCodes = this.generateBackupCodes()
    
    await prisma.user.update({
      where: { id: userId },
      data: { mfaBackupCodes: backupCodes }
    })

    return backupCodes
  }

  /**
   * Get remaining backup codes count
   */
  static async getBackupCodesCount(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaBackupCodes: true }
    })

    return user?.mfaBackupCodes.length || 0
  }
}
