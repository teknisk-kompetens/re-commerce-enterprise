
/**
 * Advanced Security Seed Script
 * Populates the database with comprehensive advanced security data
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Seeding advanced security data...')

  // Create test tenant
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'advanced-security.local' },
    update: {},
    create: {
      name: 'Advanced Security Enterprise',
      domain: 'advanced-security.local',
      settings: {
        securityLevel: 'maximum',
        features: ['webauthn', 'biometrics', 'ai_threat_intel', 'quantum_crypto', 'orchestration']
      }
    }
  })

  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@security.local' },
      update: {},
      create: {
        email: 'admin@security.local',
        name: 'Security Admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        tenantId: tenant.id
      }
    }),
    prisma.user.upsert({
      where: { email: 'analyst@security.local' },
      update: {},
      create: {
        email: 'analyst@security.local',
        name: 'Security Analyst',
        password: await bcrypt.hash('analyst123', 10),
        role: 'analyst',
        tenantId: tenant.id
      }
    }),
    prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        name: 'John Doe',
        password: await bcrypt.hash('johndoe123', 10),
        role: 'admin',
        tenantId: tenant.id
      }
    })
  ])

  // Seed WebAuthn credentials
  console.log('📱 Seeding WebAuthn credentials...')
  await prisma.webAuthnCredential.createMany({
    data: [
      {
        userId: users[0].id,
        credentialId: 'cred_001_security_key',
        publicKey: 'pk_001_webauthn_security_key_base64',
        counter: BigInt(1),
        deviceType: 'roaming',
        transports: ['usb', 'nfc'],
        attestation: {
          format: 'packed',
          statement: 'attestation_statement'
        },
        name: 'YubiKey 5 NFC',
        active: true
      },
      {
        userId: users[1].id,
        credentialId: 'cred_002_platform_auth',
        publicKey: 'pk_002_platform_authenticator_base64',
        counter: BigInt(5),
        deviceType: 'platform',
        transports: ['internal'],
        attestation: {
          format: 'none',
          statement: 'none'
        },
        name: 'Windows Hello',
        active: true
      },
      {
        userId: users[2].id,
        credentialId: 'cred_003_mobile_auth',
        publicKey: 'pk_003_mobile_authenticator_base64',
        counter: BigInt(12),
        deviceType: 'roaming',
        transports: ['ble', 'usb'],
        attestation: {
          format: 'android-safetynet',
          statement: 'safetynet_statement'
        },
        name: 'Phone Authenticator',
        active: true
      }
    ]
  })

  // Seed biometric profiles
  console.log('👤 Seeding biometric profiles...')
  await prisma.biometricProfile.createMany({
    data: [
      {
        userId: users[0].id,
        type: 'fingerprint',
        template: 'encrypted_fingerprint_template_001',
        deviceId: 'device_001',
        confidence: 0.95,
        usageCount: 247,
        active: true,
        metadata: {
          enrollmentDate: new Date('2024-01-15'),
          qualityScore: 94.7,
          sensorType: 'capacitive'
        }
      },
      {
        userId: users[0].id,
        type: 'face',
        template: 'encrypted_face_template_001',
        deviceId: 'device_001',
        confidence: 0.92,
        usageCount: 156,
        active: true,
        metadata: {
          enrollmentDate: new Date('2024-01-16'),
          qualityScore: 89.2,
          sensorType: 'infrared'
        }
      },
      {
        userId: users[1].id,
        type: 'voice',
        template: 'encrypted_voice_template_001',
        deviceId: 'device_002',
        confidence: 0.88,
        usageCount: 89,
        active: true,
        metadata: {
          enrollmentDate: new Date('2024-01-20'),
          qualityScore: 85.4,
          sensorType: 'microphone'
        }
      }
    ]
  })

  // Seed behavioral profiles
  console.log('🧠 Seeding behavioral profiles...')
  await prisma.behavioralProfile.createMany({
    data: [
      {
        userId: users[0].id,
        keystrokeDynamics: {
          dwellTime: [120, 135, 142, 118, 156],
          flightTime: [85, 92, 78, 104, 88],
          typingSpeed: 85.7,
          rhythmPattern: [0.8, 0.9, 0.85, 0.92, 0.78]
        },
        mouseDynamics: {
          movementSpeed: [1.2, 1.4, 1.1, 1.3, 1.5],
          acceleration: [0.8, 0.9, 0.7, 0.85, 0.95],
          clickPattern: [250, 280, 235, 290, 245]
        },
        navigationPattern: {
          pageSequence: ['/dashboard', '/security', '/analytics', '/reports'],
          timeOnPage: [120, 300, 180, 240],
          interactionRate: 0.85
        },
        riskScore: 15.2,
        confidence: 0.89,
        learningPhase: false
      },
      {
        userId: users[1].id,
        keystrokeDynamics: {
          dwellTime: [95, 102, 89, 108, 98],
          flightTime: [72, 78, 65, 85, 69],
          typingSpeed: 72.3,
          rhythmPattern: [0.75, 0.82, 0.78, 0.85, 0.73]
        },
        mouseDynamics: {
          movementSpeed: [0.9, 1.1, 0.8, 1.0, 1.2],
          acceleration: [0.6, 0.7, 0.5, 0.65, 0.8],
          clickPattern: [220, 240, 210, 250, 225]
        },
        navigationPattern: {
          pageSequence: ['/threats', '/intelligence', '/hunt', '/analysis'],
          timeOnPage: [180, 420, 300, 360],
          interactionRate: 0.92
        },
        riskScore: 8.7,
        confidence: 0.94,
        learningPhase: false
      }
    ]
  })

  // Seed threat intelligence feeds
  console.log('🎯 Seeding threat intelligence feeds...')
  const threatFeeds = await Promise.all([
    prisma.threatIntelligenceFeed.create({
      data: {
        name: 'MISP Global Threat Intelligence',
        provider: 'MISP Community',
        type: 'open_source',
        url: 'https://misp.global/feeds/threat-intel',
        format: 'json',
        updateFrequency: 60,
        active: true,
        reliability: 0.85,
        metadata: {
          description: 'Global threat intelligence from MISP community',
          categories: ['malware', 'phishing', 'apt']
        }
      }
    }),
    prisma.threatIntelligenceFeed.create({
      data: {
        name: 'Commercial Threat Feed',
        provider: 'ThreatStream',
        type: 'commercial',
        url: 'https://api.threatstream.com/v2/intelligence/',
        format: 'stix',
        updateFrequency: 30,
        active: true,
        reliability: 0.95,
        metadata: {
          description: 'Commercial threat intelligence with high fidelity',
          categories: ['apt', 'malware', 'c2', 'phishing']
        }
      }
    })
  ])

  // Seed threat indicators
  console.log('🚨 Seeding threat indicators...')
  await prisma.threatIndicator.createMany({
    data: [
      {
        feedId: threatFeeds[0].id,
        type: 'ip',
        value: '192.168.1.100',
        severity: 'high',
        confidence: 0.92,
        tags: ['malware', 'c2', 'apt29'],
        description: 'Known APT29 command and control server'
      },
      {
        feedId: threatFeeds[0].id,
        type: 'domain',
        value: 'malicious-domain.com',
        severity: 'critical',
        confidence: 0.98,
        tags: ['phishing', 'credential_theft'],
        description: 'Phishing domain targeting financial institutions'
      },
      {
        feedId: threatFeeds[1].id,
        type: 'hash',
        value: 'a1b2c3d4e5f6789012345678901234567890abcd',
        severity: 'medium',
        confidence: 0.87,
        tags: ['malware', 'trojan', 'banking'],
        description: 'Banking trojan malware hash'
      },
      {
        feedId: threatFeeds[1].id,
        type: 'url',
        value: 'https://suspicious-site.net/download/payload.exe',
        severity: 'high',
        confidence: 0.91,
        tags: ['malware', 'payload', 'download'],
        description: 'Malware payload download URL'
      }
    ]
  })

  // Seed threat events
  console.log('⚡ Seeding threat events...')
  await prisma.threatEvent.createMany({
    data: [
      {
        eventId: 'event_001',
        type: 'malware_detection',
        severity: 'high',
        source: '10.0.1.25',
        destination: '192.168.1.100',
        protocol: 'HTTPS',
        description: 'Malware communication detected to known C2 server',
        status: 'investigating',
        assignedTo: users[1].id,
        riskScore: 85.7,
        aiAnalysis: {
          confidence: 0.94,
          category: 'apt',
          recommendations: ['isolate_host', 'analyze_traffic', 'hunt_lateral_movement']
        }
      },
      {
        eventId: 'event_002',
        type: 'phishing_attempt',
        severity: 'medium',
        source: 'email_gateway',
        destination: 'user@company.com',
        protocol: 'SMTP',
        description: 'Phishing email with malicious attachment blocked',
        status: 'contained',
        riskScore: 62.3,
        aiAnalysis: {
          confidence: 0.89,
          category: 'phishing',
          recommendations: ['user_training', 'email_analysis', 'threat_hunting']
        }
      },
      {
        eventId: 'event_003',
        type: 'behavioral_anomaly',
        severity: 'low',
        source: 'user_behavior_system',
        destination: 'user_account_123',
        description: 'Unusual login pattern detected for user account',
        status: 'active',
        riskScore: 35.1,
        aiAnalysis: {
          confidence: 0.76,
          category: 'insider_threat',
          recommendations: ['verify_identity', 'monitor_activity', 'additional_auth']
        }
      }
    ]
  })

  // Seed APT campaigns
  console.log('🎭 Seeding APT campaigns...')
  await prisma.aPTCampaign.createMany({
    data: [
      {
        name: 'APT29 - Cozy Bear',
        description: 'Russian state-sponsored cyber espionage group',
        threatActor: 'SVR (Foreign Intelligence Service)',
        tactics: ['Initial Access', 'Persistence', 'Credential Access', 'Lateral Movement'],
        techniques: ['T1566.001', 'T1053.005', 'T1003.001', 'T1021.001'],
        indicators: ['192.168.1.100', 'malicious-domain.com'],
        victims: ['government', 'healthcare', 'technology'],
        attribution: 'Russia',
        confidence: 0.95,
        status: 'active',
        aiPrediction: {
          nextTargets: ['energy', 'telecommunications'],
          likelihood: 0.87,
          timeframe: '30_days'
        }
      },
      {
        name: 'APT28 - Fancy Bear',
        description: 'Russian military intelligence cyber operations',
        threatActor: 'GRU (Main Intelligence Directorate)',
        tactics: ['Reconnaissance', 'Initial Access', 'Execution', 'Persistence'],
        techniques: ['T1589.002', 'T1566.002', 'T1204.002', 'T1547.001'],
        indicators: ['fancy-bear-c2.net', 'gru-malware.exe'],
        victims: ['government', 'military', 'think_tanks'],
        attribution: 'Russia',
        confidence: 0.92,
        status: 'dormant',
        aiPrediction: {
          nextTargets: ['defense', 'political'],
          likelihood: 0.73,
          timeframe: '60_days'
        }
      }
    ]
  })

  // Seed network segments
  console.log('🌐 Seeding network segments...')
  const networkSegments = await Promise.all([
    prisma.networkSegment.create({
      data: {
        name: 'Production Network',
        description: 'Production servers and services',
        type: 'production',
        cidr: '10.0.0.0/24',
        vlanId: 100,
        trustLevel: 90,
        policies: [
          { name: 'strict_firewall', enabled: true },
          { name: 'intrusion_detection', enabled: true },
          { name: 'traffic_monitoring', enabled: true }
        ],
        endpoints: ['10.0.0.10', '10.0.0.20', '10.0.0.30'],
        monitoring: true,
        isolation: false
      }
    }),
    prisma.networkSegment.create({
      data: {
        name: 'DMZ Network',
        description: 'Demilitarized zone for external-facing services',
        type: 'dmz',
        cidr: '172.16.0.0/24',
        vlanId: 200,
        trustLevel: 50,
        policies: [
          { name: 'web_application_firewall', enabled: true },
          { name: 'ddos_protection', enabled: true },
          { name: 'content_filtering', enabled: true }
        ],
        endpoints: ['172.16.0.10', '172.16.0.20'],
        monitoring: true,
        isolation: true
      }
    })
  ])

  // Seed device profiles
  console.log('💻 Seeding device profiles...')
  await prisma.deviceProfile.createMany({
    data: [
      {
        deviceId: 'device_001_laptop',
        name: 'Security Admin Laptop',
        type: 'laptop',
        os: 'Windows 11',
        version: '22H2',
        manufacturer: 'Dell',
        model: 'Latitude 7420',
        macAddress: '00:11:22:33:44:55',
        ipAddress: '10.0.0.15',
        segmentId: networkSegments[0].id,
        trustScore: 95.7,
        riskLevel: 'low',
        enrolled: true,
        compliance: {
          encryption: true,
          antivirus: true,
          firewall: true,
          updates: true
        },
        vulnerabilities: [],
        certificates: [
          { name: 'Device Certificate', issuer: 'Internal CA', expires: '2025-12-31' }
        ]
      },
      {
        deviceId: 'device_002_server',
        name: 'Web Server 01',
        type: 'server',
        os: 'Ubuntu Server',
        version: '22.04 LTS',
        manufacturer: 'HP',
        model: 'ProLiant DL380',
        macAddress: '00:22:33:44:55:66',
        ipAddress: '172.16.0.10',
        segmentId: networkSegments[1].id,
        trustScore: 88.3,
        riskLevel: 'medium',
        enrolled: true,
        compliance: {
          patching: true,
          hardening: true,
          monitoring: true,
          logging: true
        },
        vulnerabilities: [
          { cve: 'CVE-2023-12345', severity: 'medium', patched: false }
        ],
        certificates: [
          { name: 'SSL Certificate', issuer: 'Let\'s Encrypt', expires: '2024-06-15' }
        ]
      }
    ]
  })

  // Seed cryptographic keys
  console.log('🔐 Seeding cryptographic keys...')
  await prisma.cryptographicKey.createMany({
    data: [
      {
        keyId: 'key_001_quantum_resistant',
        type: 'quantum_resistant',
        algorithm: 'Kyber768',
        keySize: 768,
        purpose: 'encryption',
        scope: 'system',
        encryptedKey: 'encrypted_quantum_key_001',
        publicKey: 'public_quantum_key_001',
        status: 'active',
        usageCount: 1247,
        metadata: {
          quantumResistant: true,
          algorithm: 'Kyber768',
          keySize: 768,
          purpose: 'encryption',
          created: new Date()
        }
      },
      {
        keyId: 'key_002_homomorphic',
        type: 'homomorphic',
        algorithm: 'BFV',
        keySize: 2048,
        purpose: 'computation',
        scope: 'tenant',
        encryptedKey: 'encrypted_homomorphic_key_001',
        publicKey: 'public_homomorphic_key_001',
        status: 'active',
        usageCount: 567,
        metadata: {
          homomorphic: true,
          scheme: 'BFV',
          operationsSupported: ['add', 'multiply', 'subtract']
        }
      }
    ]
  })

  // Seed data classifications
  console.log('📊 Seeding data classifications...')
  await prisma.dataClassification.createMany({
    data: [
      {
        dataId: 'data_001_user_pii',
        classification: 'confidential',
        sensitivity: 'high',
        categories: ['pii', 'personal'],
        retentionDays: 2555, // 7 years
        encryptionReq: true,
        accessControl: {
          roles: ['admin', 'data_protection_officer'],
          permissions: ['read', 'audit']
        },
        complianceReq: ['gdpr', 'ccpa'],
        aiClassified: true,
        confidence: 0.94
      },
      {
        dataId: 'data_002_financial_records',
        classification: 'restricted',
        sensitivity: 'critical',
        categories: ['financial', 'sensitive'],
        retentionDays: 3650, // 10 years
        encryptionReq: true,
        accessControl: {
          roles: ['financial_admin', 'auditor'],
          permissions: ['read', 'audit', 'report']
        },
        complianceReq: ['sox', 'pci_dss'],
        aiClassified: true,
        confidence: 0.97
      }
    ]
  })

  // Seed security playbooks
  console.log('📋 Seeding security playbooks...')
  const securityPlaybooks = await Promise.all([
    prisma.securityPlaybook.create({
      data: {
        name: 'Malware Incident Response',
        description: 'Automated response to malware detection events',
        type: 'incident_response',
        severity: 'high',
        triggers: [
          { type: 'event', condition: 'malware_detected', enabled: true },
          { type: 'threshold', condition: 'risk_score > 80', enabled: true }
        ],
        actions: [
          { name: 'isolate_host', type: 'containment', automation: 'fully_automated' },
          { name: 'collect_evidence', type: 'investigation', automation: 'semi_automated' },
          { name: 'notify_team', type: 'notification', automation: 'fully_automated' },
          { name: 'analyze_malware', type: 'analysis', automation: 'manual' }
        ],
        conditions: [
          { expression: 'confidence > 0.8', parameters: { threshold: 0.8 } },
          { expression: 'severity in [high, critical]', parameters: { levels: ['high', 'critical'] } }
        ],
        automationLevel: 'semi_automated',
        active: true,
        version: '2.1',
        aiEnhanced: true,
        successRate: 0.947,
        avgExecutionTime: 180,
        createdBy: users[0].id
      }
    }),
    prisma.securityPlaybook.create({
      data: {
        name: 'Phishing Email Response',
        description: 'Automated response to phishing email detection',
        type: 'incident_response',
        severity: 'medium',
        triggers: [
          { type: 'event', condition: 'phishing_detected', enabled: true },
          { type: 'manual', condition: 'analyst_trigger', enabled: true }
        ],
        actions: [
          { name: 'quarantine_email', type: 'containment', automation: 'fully_automated' },
          { name: 'extract_indicators', type: 'analysis', automation: 'fully_automated' },
          { name: 'user_notification', type: 'notification', automation: 'fully_automated' },
          { name: 'security_training', type: 'remediation', automation: 'manual' }
        ],
        conditions: [
          { expression: 'email_classification = phishing', parameters: { classification: 'phishing' } }
        ],
        automationLevel: 'fully_automated',
        active: true,
        version: '1.5',
        aiEnhanced: true,
        successRate: 0.923,
        avgExecutionTime: 45,
        createdBy: users[1].id
      }
    })
  ])

  // Seed security incidents
  console.log('🚨 Seeding security incidents...')
  await prisma.securityIncident.createMany({
    data: [
      {
        incidentId: 'INC-2024-001',
        title: 'APT29 Malware Detection',
        description: 'Suspected APT29 malware detected on production server',
        type: 'malware',
        severity: 'high',
        status: 'investigating',
        assignedTo: users[1].id,
        reportedBy: users[0].id,
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        impact: 'medium',
        affectedSystems: ['server-01', 'workstation-05'],
        timeline: [
          { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), event: 'Initial detection' },
          { timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), event: 'Containment initiated' },
          { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), event: 'Investigation started' }
        ],
        artifacts: [
          { type: 'file_hash', value: 'a1b2c3d4e5f6789012345678901234567890abcd' },
          { type: 'ip_address', value: '192.168.1.100' },
          { type: 'registry_key', value: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run' }
        ],
        riskScore: 85.7,
        aiAnalysis: {
          confidence: 0.94,
          attribution: 'APT29',
          recommendations: ['isolate_systems', 'threat_hunting', 'incident_response']
        }
      },
      {
        incidentId: 'INC-2024-002',
        title: 'Phishing Campaign Detected',
        description: 'Large-scale phishing campaign targeting user credentials',
        type: 'phishing',
        severity: 'medium',
        status: 'contained',
        assignedTo: users[1].id,
        reportedBy: users[0].id,
        detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        containedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        impact: 'low',
        affectedSystems: ['email_system', 'web_proxy'],
        timeline: [
          { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), event: 'Phishing emails detected' },
          { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), event: 'Emails quarantined' },
          { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), event: 'Threat contained' }
        ],
        artifacts: [
          { type: 'email_hash', value: 'phishing_email_hash_001' },
          { type: 'url', value: 'https://phishing-site.com/login' },
          { type: 'domain', value: 'phishing-site.com' }
        ],
        riskScore: 62.3,
        aiAnalysis: {
          confidence: 0.89,
          attribution: 'Unknown',
          recommendations: ['user_training', 'email_security', 'monitoring']
        }
      }
    ]
  })

  // Seed compliance frameworks
  console.log('📜 Seeding compliance frameworks...')
  const complianceFrameworks = await Promise.all([
    prisma.complianceFramework.create({
      data: {
        name: 'SOC 2 Type II',
        version: '2017',
        type: 'industry',
        description: 'Service Organization Control 2 Type II framework',
        requirements: [
          { id: 'CC6.1', name: 'Security Policies', category: 'security' },
          { id: 'CC6.2', name: 'Access Controls', category: 'security' },
          { id: 'CC6.3', name: 'System Monitoring', category: 'monitoring' }
        ],
        controls: [
          { id: 'CTRL-001', name: 'Password Policy', requirement: 'CC6.1' },
          { id: 'CTRL-002', name: 'Multi-Factor Authentication', requirement: 'CC6.2' },
          { id: 'CTRL-003', name: 'Security Monitoring', requirement: 'CC6.3' }
        ],
        active: true,
        mandatory: true
      }
    }),
    prisma.complianceFramework.create({
      data: {
        name: 'ISO 27001',
        version: '2013',
        type: 'international',
        description: 'Information Security Management System standard',
        requirements: [
          { id: 'A.9.1', name: 'Access Control Policy', category: 'access_control' },
          { id: 'A.12.1', name: 'Operational Procedures', category: 'operations' },
          { id: 'A.16.1', name: 'Incident Management', category: 'incident_response' }
        ],
        controls: [
          { id: 'ISO-001', name: 'Access Control Matrix', requirement: 'A.9.1' },
          { id: 'ISO-002', name: 'Change Management', requirement: 'A.12.1' },
          { id: 'ISO-003', name: 'Incident Response Plan', requirement: 'A.16.1' }
        ],
        active: true,
        mandatory: false
      }
    })
  ])

  // Seed compliance assessments
  console.log('✅ Seeding compliance assessments...')
  await prisma.complianceAssessment.createMany({
    data: [
      {
        frameworkId: complianceFrameworks[0].id,
        assessmentId: 'ASSESS-SOC2-2024-001',
        type: 'automated',
        status: 'completed',
        scope: {
          systems: ['production', 'dmz'],
          controls: ['CTRL-001', 'CTRL-002', 'CTRL-003'],
          timeframe: '2024-01-01 to 2024-03-31'
        },
        findings: [
          { control: 'CTRL-001', status: 'compliant', evidence: 'Password policy implemented' },
          { control: 'CTRL-002', status: 'compliant', evidence: 'MFA enabled for all users' },
          { control: 'CTRL-003', status: 'non_compliant', evidence: 'Monitoring gaps identified' }
        ],
        score: 0.867,
        riskLevel: 'low',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        assessor: users[0].id,
        evidence: [
          { type: 'document', name: 'Password Policy v2.1', path: '/evidence/password_policy.pdf' },
          { type: 'screenshot', name: 'MFA Configuration', path: '/evidence/mfa_config.png' }
        ],
        remediation: [
          { finding: 'CTRL-003', action: 'Implement comprehensive monitoring', deadline: '2024-06-30' }
        ],
        aiAnalysis: {
          confidence: 0.92,
          recommendations: ['enhance_monitoring', 'regular_reviews', 'automation_improvement']
        }
      }
    ]
  })

  // Seed security metrics
  console.log('📈 Seeding security metrics...')
  const currentTime = new Date()
  const metrics = []
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(currentTime.getTime() - i * 60 * 60 * 1000)
    
    metrics.push(
      {
        metricId: `metric_threats_${i}`,
        name: 'Active Threats',
        type: 'gauge',
        category: 'threats',
        value: Math.floor(Math.random() * 50) + 10,
        timestamp,
        dimensions: { severity: 'high', source: 'threat_detection' },
        aiPrediction: { trend: 'increasing', confidence: 0.8 }
      },
      {
        metricId: `metric_incidents_${i}`,
        name: 'Security Incidents',
        type: 'counter',
        category: 'incidents',
        value: Math.floor(Math.random() * 10) + 2,
        timestamp,
        dimensions: { status: 'open', type: 'security' },
        aiPrediction: { trend: 'stable', confidence: 0.7 }
      },
      {
        metricId: `metric_compliance_${i}`,
        name: 'Compliance Score',
        type: 'gauge',
        category: 'compliance',
        value: Math.random() * 20 + 80,
        timestamp,
        dimensions: { framework: 'SOC2', assessment: 'automated' },
        aiPrediction: { trend: 'improving', confidence: 0.85 }
      }
    )
  }

  await prisma.securityMetric.createMany({
    data: metrics
  })

  // Seed security dashboards
  console.log('📊 Seeding security dashboards...')
  await prisma.securityDashboard.createMany({
    data: [
      {
        name: 'Executive Security Dashboard',
        description: 'High-level security metrics for executives',
        type: 'executive',
        layout: {
          columns: 3,
          rows: 2,
          responsive: true
        },
        widgets: [
          { type: 'metric', name: 'Security Score', position: { x: 0, y: 0 } },
          { type: 'chart', name: 'Threat Timeline', position: { x: 1, y: 0 } },
          { type: 'alert', name: 'Critical Alerts', position: { x: 2, y: 0 } },
          { type: 'compliance', name: 'Compliance Status', position: { x: 0, y: 1 } },
          { type: 'incidents', name: 'Active Incidents', position: { x: 1, y: 1 } },
          { type: 'ai', name: 'AI Recommendations', position: { x: 2, y: 1 } }
        ],
        filters: {
          timeRange: '24h',
          severity: ['high', 'critical'],
          category: ['security', 'compliance']
        },
        refreshRate: 300,
        access: {
          roles: ['admin', 'executive'],
          permissions: ['read', 'export']
        },
        active: true,
        createdBy: users[0].id
      },
      {
        name: 'Security Operations Center',
        description: 'Operational dashboard for security analysts',
        type: 'operational',
        layout: {
          columns: 4,
          rows: 3,
          responsive: true
        },
        widgets: [
          { type: 'threats', name: 'Live Threat Feed', position: { x: 0, y: 0 } },
          { type: 'incidents', name: 'Incident Queue', position: { x: 1, y: 0 } },
          { type: 'hunting', name: 'Threat Hunting', position: { x: 2, y: 0 } },
          { type: 'intelligence', name: 'Threat Intelligence', position: { x: 3, y: 0 } }
        ],
        filters: {
          timeRange: '1h',
          severity: ['all'],
          category: ['threats', 'incidents', 'intelligence']
        },
        refreshRate: 60,
        access: {
          roles: ['admin', 'analyst', 'operator'],
          permissions: ['read', 'update', 'investigate']
        },
        active: true,
        createdBy: users[1].id
      }
    ]
  })

  console.log('✅ Advanced security data seeding completed!')
  
  // Print summary
  console.log('\n📊 Seeding Summary:')
  console.log(`- Users: ${users.length}`)
  console.log(`- WebAuthn Credentials: 3`)
  console.log(`- Biometric Profiles: 3`)
  console.log(`- Behavioral Profiles: 2`)
  console.log(`- Threat Intelligence Feeds: 2`)
  console.log(`- Threat Indicators: 4`)
  console.log(`- Threat Events: 3`)
  console.log(`- APT Campaigns: 2`)
  console.log(`- Network Segments: 2`)
  console.log(`- Device Profiles: 2`)
  console.log(`- Cryptographic Keys: 2`)
  console.log(`- Security Playbooks: 2`)
  console.log(`- Security Incidents: 2`)
  console.log(`- Compliance Frameworks: 2`)
  console.log(`- Security Metrics: ${metrics.length}`)
  console.log(`- Security Dashboards: 2`)
}

main()
  .catch((e) => {
    console.error('Error seeding advanced security data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
