
import { prisma } from '../lib/db'
import bcrypt from 'bcryptjs'

async function seedDAG2Data() {
  console.log('🌱 Starting DAG 2 data seeding...')

  try {
    // Get existing tenants
    const tenants = await prisma.tenant.findMany()
    console.log(`Found ${tenants.length} tenants`)

    if (tenants.length === 0) {
      console.log('No tenants found. Please run the main seed script first.')
      return
    }

    // Seed additional analytics data
    console.log('📊 Seeding analytics data...')
    for (const tenant of tenants) {
      // Generate sample analytics data for the last 30 days
      const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date
      })

      // Get users for this tenant
      const users = await prisma.user.findMany({
        where: { tenantId: tenant.id }
      })

      for (const date of dates) {
        // User activity metrics
        for (const user of users) {
          await prisma.analytics.create({
            data: {
              tenantId: tenant.id,
              userId: user.id,
              metric: 'user_activity',
              value: Math.floor(Math.random() * 10) + 1,
              timestamp: date,
              metadata: {
                sessionDuration: Math.floor(Math.random() * 3600) + 600
              }
            }
          })
        }

        // Daily task completion metrics
        await prisma.analytics.create({
          data: {
            tenantId: tenant.id,
            metric: 'tasks_completed',
            value: Math.floor(Math.random() * 15) + 5,
            timestamp: date,
            metadata: {
              totalTasks: Math.floor(Math.random() * 20) + 10
            }
          }
        })

        // Project progress metrics
        await prisma.analytics.create({
          data: {
            tenantId: tenant.id,
            metric: 'project_progress',
            value: Math.floor(Math.random() * 100),
            timestamp: date,
            metadata: {
              projectCount: Math.floor(Math.random() * 5) + 1
            }
          }
        })
      }
    }

    // Seed workflow templates
    console.log('🔄 Seeding workflow templates...')
    for (const tenant of tenants) {
      const owner = await prisma.user.findFirst({
        where: { tenantId: tenant.id, role: 'admin' }
      })

      if (owner) {
        const workflowTemplates = [
          {
            name: 'Task Approval Workflow',
            description: 'Automated task approval process with multiple stages',
            definition: {
              nodes: [
                { id: '1', type: 'start', data: { label: 'Start' }, position: { x: 100, y: 100 } },
                { id: '2', type: 'task', data: { label: 'Review Task' }, position: { x: 300, y: 100 } },
                { id: '3', type: 'decision', data: { label: 'Approve?' }, position: { x: 500, y: 100 } },
                { id: '4', type: 'end', data: { label: 'Approved' }, position: { x: 700, y: 50 } },
                { id: '5', type: 'end', data: { label: 'Rejected' }, position: { x: 700, y: 150 } }
              ],
              edges: [
                { id: 'e1-2', source: '1', target: '2' },
                { id: 'e2-3', source: '2', target: '3' },
                { id: 'e3-4', source: '3', target: '4', data: { condition: 'approved' } },
                { id: 'e3-5', source: '3', target: '5', data: { condition: 'rejected' } }
              ]
            },
            isTemplate: true,
            createdBy: owner.id,
            tenantId: tenant.id
          },
          {
            name: 'User Onboarding Flow',
            description: 'Complete new user onboarding process',
            definition: {
              nodes: [
                { id: '1', type: 'start', data: { label: 'New User' }, position: { x: 100, y: 100 } },
                { id: '2', type: 'task', data: { label: 'Send Welcome Email' }, position: { x: 300, y: 100 } },
                { id: '3', type: 'task', data: { label: 'Setup Profile' }, position: { x: 500, y: 100 } },
                { id: '4', type: 'task', data: { label: 'Assign Training' }, position: { x: 700, y: 100 } },
                { id: '5', type: 'end', data: { label: 'Complete' }, position: { x: 900, y: 100 } }
              ],
              edges: [
                { id: 'e1-2', source: '1', target: '2' },
                { id: 'e2-3', source: '2', target: '3' },
                { id: 'e3-4', source: '3', target: '4' },
                { id: 'e4-5', source: '4', target: '5' }
              ]
            },
            isTemplate: true,
            createdBy: owner.id,
            tenantId: tenant.id
          },
          {
            name: 'Project Launch Checklist',
            description: 'Comprehensive project launch workflow',
            definition: {
              nodes: [
                { id: '1', type: 'start', data: { label: 'Project Ready' }, position: { x: 100, y: 100 } },
                { id: '2', type: 'task', data: { label: 'Security Review' }, position: { x: 300, y: 100 } },
                { id: '3', type: 'task', data: { label: 'Performance Test' }, position: { x: 500, y: 100 } },
                { id: '4', type: 'task', data: { label: 'Deploy to Staging' }, position: { x: 700, y: 100 } },
                { id: '5', type: 'decision', data: { label: 'Ready for Production?' }, position: { x: 900, y: 100 } },
                { id: '6', type: 'task', data: { label: 'Deploy to Production' }, position: { x: 1100, y: 50 } },
                { id: '7', type: 'task', data: { label: 'Fix Issues' }, position: { x: 1100, y: 150 } },
                { id: '8', type: 'end', data: { label: 'Launched' }, position: { x: 1300, y: 100 } }
              ],
              edges: [
                { id: 'e1-2', source: '1', target: '2' },
                { id: 'e2-3', source: '2', target: '3' },
                { id: 'e3-4', source: '3', target: '4' },
                { id: 'e4-5', source: '4', target: '5' },
                { id: 'e5-6', source: '5', target: '6', data: { condition: 'yes' } },
                { id: 'e5-7', source: '5', target: '7', data: { condition: 'no' } },
                { id: 'e6-8', source: '6', target: '8' },
                { id: 'e7-4', source: '7', target: '4' }
              ]
            },
            isTemplate: true,
            createdBy: owner.id,
            tenantId: tenant.id
          }
        ]

        for (const template of workflowTemplates) {
          await prisma.workflow.create({
            data: template
          })
        }
      }
    }

    // Seed sample notifications
    console.log('🔔 Seeding notifications...')
    for (const tenant of tenants) {
      const users = await prisma.user.findMany({
        where: { tenantId: tenant.id }
      })

      for (const user of users) {
        // Create sample notifications
        const notifications = [
          {
            title: 'Welcome to the Platform!',
            message: 'Your account has been successfully created. Start exploring the features.',
            type: 'success',
            tenantId: tenant.id,
            userId: user.id,
            isRead: false
          },
          {
            title: 'New Task Assigned',
            message: 'You have been assigned a new task in Project Alpha.',
            type: 'task',
            tenantId: tenant.id,
            userId: user.id,
            isRead: Math.random() > 0.5
          },
          {
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur tonight from 2-4 AM.',
            type: 'system',
            tenantId: tenant.id,
            userId: user.id,
            isRead: Math.random() > 0.3
          },
          {
            title: 'Monthly Report Available',
            message: 'Your monthly analytics report is ready for review.',
            type: 'info',
            tenantId: tenant.id,
            userId: user.id,
            isRead: Math.random() > 0.7
          }
        ]

        for (const notification of notifications) {
          await prisma.notification.create({
            data: notification
          })
        }
      }
    }

    // Seed activity feed
    console.log('📝 Seeding activity feed...')
    for (const tenant of tenants) {
      const users = await prisma.user.findMany({
        where: { tenantId: tenant.id }
      })

      const projects = await prisma.project.findMany({
        where: { tenantId: tenant.id }
      })

      const tasks = await prisma.task.findMany({
        where: { tenantId: tenant.id },
        take: 5
      })

      // Create sample activities
      for (const user of users) {
        // User activities
        await prisma.activityFeed.create({
          data: {
            tenantId: tenant.id,
            userId: user.id,
            action: 'joined',
            entity: 'user',
            entityId: user.id,
            description: `${user.name || user.email} joined the team`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
          }
        })

        // Task activities
        for (const task of tasks.slice(0, 2)) {
          await prisma.activityFeed.create({
            data: {
              tenantId: tenant.id,
              userId: user.id,
              action: Math.random() > 0.5 ? 'created' : 'updated',
              entity: 'task',
              entityId: task.id,
              description: `${Math.random() > 0.5 ? 'Created' : 'Updated'} task "${task.title}"`,
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000))
            }
          })
        }

        // Project activities
        for (const project of projects.slice(0, 1)) {
          await prisma.activityFeed.create({
            data: {
              tenantId: tenant.id,
              userId: user.id,
              action: 'created',
              entity: 'project',
              entityId: project.id,
              description: `Created project "${project.name}"`,
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
            }
          })
        }
      }
    }

    // Seed sample webhooks
    console.log('🔗 Seeding webhooks...')
    for (const tenant of tenants) {
      const admin = await prisma.user.findFirst({
        where: { tenantId: tenant.id, role: 'admin' }
      })

      if (admin) {
        const webhooks = [
          {
            name: 'Slack Integration',
            url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
            events: ['task.created', 'task.completed', 'project.created'],
            tenantId: tenant.id,
            createdBy: admin.id,
            isActive: false // Inactive since it's a demo URL
          },
          {
            name: 'Email Notifications',
            url: 'https://api.example.com/notifications',
            events: ['user.created', 'task.assigned', 'project.completed'],
            tenantId: tenant.id,
            createdBy: admin.id,
            isActive: false
          },
          {
            name: 'Analytics Webhook',
            url: 'https://analytics.example.com/webhook',
            events: ['task.completed', 'user.activity', 'project.progress'],
            tenantId: tenant.id,
            createdBy: admin.id,
            isActive: false
          }
        ]

        for (const webhook of webhooks) {
          await prisma.webhook.create({
            data: webhook
          })
        }
      }
    }

    console.log('✅ DAG 2 data seeding completed successfully!')
    console.log('📊 Seeded:')
    console.log('  - Analytics data for 30 days')
    console.log('  - 3 workflow templates per tenant')
    console.log('  - Sample notifications for all users')
    console.log('  - Activity feed entries')
    console.log('  - Sample webhook configurations')

  } catch (error) {
    console.error('❌ Error seeding DAG 2 data:', error)
    throw error
  }
}

// Run the seeding
seedDAG2Data()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
