
import { PrismaClient } from '@prisma/client'
import { RBACService } from '../lib/rbac-service'
import { EnterpriseConfig } from '../lib/enterprise-config'
import { FeatureFlagService } from '../lib/feature-flag-service'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Enterprise Seed...')

  try {
    // Initialize system roles and permissions
    console.log('📋 Initializing RBAC system...')
    await RBACService.initializeSystemRoles()

    // Initialize enterprise configuration
    console.log('⚙️ Initializing enterprise configuration...')
    await EnterpriseConfig.initializeDefaults()

    // Initialize feature flags
    console.log('🎯 Initializing feature flags...')
    await FeatureFlagService.initializeDefaults()

    // Get existing tenants
    const tenants = await prisma.tenant.findMany()
    console.log(`📊 Found ${tenants.length} tenants`)

    // For each tenant, create admin user with proper roles
    for (const tenant of tenants) {
      console.log(`🏢 Setting up enterprise features for tenant: ${tenant.name}`)

      // Create admin user if not exists
      const adminEmail = `admin@${tenant.domain}`
      let adminUser = await prisma.user.findUnique({
        where: {
          email_tenantId: {
            email: adminEmail,
            tenantId: tenant.id
          }
        }
      })

      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin123', 12)
        adminUser = await prisma.user.create({
          data: {
            email: adminEmail,
            name: 'Tenant Administrator',
            password: hashedPassword,
            role: 'admin',
            tenantId: tenant.id,
            isActive: true,
            emailVerified: new Date()
          }
        })
        console.log(`👤 Created admin user: ${adminEmail}`)
      }

      // Assign TenantAdmin role
      const tenantAdminRole = await prisma.role.findFirst({
        where: {
          name: 'TenantAdmin',
          OR: [
            { tenantId: tenant.id },
            { tenantId: null, isSystem: true }
          ]
        }
      })

      if (tenantAdminRole) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId_tenantId: {
              userId: adminUser.id,
              roleId: tenantAdminRole.id,
              tenantId: tenant.id
            }
          },
          create: {
            userId: adminUser.id,
            roleId: tenantAdminRole.id,
            tenantId: tenant.id
          },
          update: {}
        })
        console.log(`🔐 Assigned TenantAdmin role to ${adminEmail}`)
      }

      // Create sample manager user
      const managerEmail = `manager@${tenant.domain}`
      let managerUser = await prisma.user.findUnique({
        where: {
          email_tenantId: {
            email: managerEmail,
            tenantId: tenant.id
          }
        }
      })

      if (!managerUser) {
        const hashedPassword = await bcrypt.hash('manager123', 12)
        managerUser = await prisma.user.create({
          data: {
            email: managerEmail,
            name: 'Project Manager',
            password: hashedPassword,
            role: 'manager',
            tenantId: tenant.id,
            isActive: true,
            emailVerified: new Date()
          }
        })
        console.log(`👤 Created manager user: ${managerEmail}`)
      }

      // Assign Manager role
      const managerRole = await prisma.role.findFirst({
        where: {
          name: 'Manager',
          OR: [
            { tenantId: tenant.id },
            { tenantId: null, isSystem: true }
          ]
        }
      })

      if (managerRole) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId_tenantId: {
              userId: managerUser.id,
              roleId: managerRole.id,
              tenantId: tenant.id
            }
          },
          create: {
            userId: managerUser.id,
            roleId: managerRole.id,
            tenantId: tenant.id
          },
          update: {}
        })
        console.log(`🔐 Assigned Manager role to ${managerEmail}`)
      }

      // Update existing john@doe.com user with proper role
      const johnUser = await prisma.user.findUnique({
        where: {
          email_tenantId: {
            email: 'john@doe.com',
            tenantId: tenant.id
          }
        }
      })

      if (johnUser) {
        const userRole = await prisma.role.findFirst({
          where: {
            name: 'User',
            OR: [
              { tenantId: tenant.id },
              { tenantId: null, isSystem: true }
            ]
          }
        })

        if (userRole) {
          await prisma.userRole.upsert({
            where: {
              userId_roleId_tenantId: {
                userId: johnUser.id,
                roleId: userRole.id,
                tenantId: tenant.id
              }
            },
            create: {
              userId: johnUser.id,
              roleId: userRole.id,
              tenantId: tenant.id
            },
            update: {}
          })
          console.log(`🔐 Assigned User role to john@doe.com`)
        }
      }

      // Enable key features for tenant
      const keyFeatures = [
        'auth.password_complexity',
        'auth.session_management',
        'audit.detailed_logging',
        'security.rate_limiting',
        'security.csrf_protection',
        'users.email_verification',
        'users.password_reset',
        'tasks.advanced_filters',
        'tasks.bulk_operations',
        'analytics.usage_tracking',
        'analytics.performance_monitoring',
        'ui.dark_mode'
      ]

      for (const featureKey of keyFeatures) {
        await FeatureFlagService.setTenantFlag(tenant.id, featureKey, true, 100)
      }

      console.log(`✅ Enabled ${keyFeatures.length} key features for ${tenant.name}`)
    }

    // Create system-wide SuperAdmin user
    const superAdminEmail = 'superadmin@system.local'
    let superAdminUser = await prisma.user.findFirst({
      where: {
        email: superAdminEmail
      }
    })

    if (!superAdminUser && tenants.length > 0) {
      const hashedPassword = await bcrypt.hash('superadmin123', 12)
      superAdminUser = await prisma.user.create({
        data: {
          email: superAdminEmail,
          name: 'System Super Administrator',
          password: hashedPassword,
          role: 'admin',
          tenantId: tenants[0].id, // Assign to first tenant
          isActive: true,
          emailVerified: new Date()
        }
      })
      console.log(`👤 Created SuperAdmin user: ${superAdminEmail}`)

      // Assign SuperAdmin role
      const superAdminRole = await prisma.role.findFirst({
        where: {
          name: 'SuperAdmin',
          isSystem: true
        }
      })

      if (superAdminRole) {
        await prisma.userRole.create({
          data: {
            userId: superAdminUser.id,
            roleId: superAdminRole.id,
            tenantId: tenants[0].id
          }
        })
        console.log(`🔐 Assigned SuperAdmin role`)
      }
    }

    // Log initial system events
    await prisma.systemEvent.create({
      data: {
        type: 'SYSTEM',
        severity: 'LOW',
        message: 'Enterprise system initialized successfully',
        details: {
          tenantCount: tenants.length,
          timestamp: new Date().toISOString()
        }
      }
    })

    console.log('🎉 Enterprise seed completed successfully!')
    console.log('')
    console.log('🔐 Test Accounts Created:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 SuperAdmin: superadmin@system.local / superadmin123')
    for (const tenant of tenants) {
      console.log(`📧 ${tenant.name} Admin: admin@${tenant.domain} / admin123`)
      console.log(`📧 ${tenant.name} Manager: manager@${tenant.domain} / manager123`)
    }
    console.log('📧 Test User: john@doe.com / johndoe123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('🎯 Enterprise Features Initialized:')
    console.log('✅ RBAC System with 5 roles and 21 permissions')
    console.log('✅ Enterprise Configuration with 22 settings')
    console.log('✅ Feature Flags with 21 features')
    console.log('✅ Audit Logging System')
    console.log('✅ Rate Limiting & Security')
    console.log('✅ Multi-Factor Authentication (MFA)')
    console.log('✅ User Management & Invitations')
    console.log('✅ Session Management')
    console.log('✅ Performance Monitoring')
    console.log('')

  } catch (error) {
    console.error('❌ Enterprise seed failed:', error)
    throw error
  }
}

main()
  .then(() => {
    console.log('🚀 Enterprise seed completed!')
  })
  .catch((e) => {
    console.error('💥 Enterprise seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
