
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    // Clear existing data (in correct order due to foreign key constraints)
    console.log('🧹 Clearing existing data...')
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.category.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
    await prisma.tenant.deleteMany()
    
    console.log('✅ Database cleared successfully')

    // Create Tenants
    console.log('🏢 Creating tenants...')
    
    const tenant1 = await prisma.tenant.create({
      data: {
        name: 'Acme Corporation',
        domain: 'acme.localhost',
        subdomain: 'acme',
        plan: 'enterprise',
        maxUsers: 1000,
        settings: {
          theme: 'corporate',
          features: ['tasks', 'projects', 'analytics'],
        },
        branding: {
          primaryColor: '#3b82f6',
          logo: '/logos/acme.png',
        },
      },
    })

    const tenant2 = await prisma.tenant.create({
      data: {
        name: 'TechStart AB',
        domain: 'techstart.localhost',
        subdomain: 'techstart',
        plan: 'pro',
        maxUsers: 500,
        settings: {
          theme: 'modern',
          features: ['tasks', 'projects'],
        },
        branding: {
          primaryColor: '#10b981',
          logo: '/logos/techstart.png',
        },
      },
    })

    const tenant3 = await prisma.tenant.create({
      data: {
        name: 'Demo Company',
        domain: 'localhost',
        subdomain: 'demo',
        plan: 'basic',
        maxUsers: 100,
        settings: {
          theme: 'default',
          features: ['tasks'],
        },
        branding: {
          primaryColor: '#8b5cf6',
          logo: '/logos/demo.png',
        },
      },
    })

    console.log('✅ Tenants created successfully')

    // Create Users for each tenant
    console.log('👥 Creating users...')
    
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Acme Corporation Users
    const acmeAdmin = await prisma.user.create({
      data: {
        email: 'admin@acme.com',
        name: 'John Admin',
        password: hashedPassword,
        role: 'admin',
        tenantId: tenant1.id,
        profile: {
          department: 'IT',
          position: 'System Administrator',
        },
      },
    })

    const acmeUser1 = await prisma.user.create({
      data: {
        email: 'alice@acme.com',
        name: 'Alice Johnson',
        password: hashedPassword,
        role: 'user',
        tenantId: tenant1.id,
        profile: {
          department: 'Marketing',
          position: 'Marketing Manager',
        },
      },
    })

    const acmeUser2 = await prisma.user.create({
      data: {
        email: 'bob@acme.com',
        name: 'Bob Smith',
        password: hashedPassword,
        role: 'user',
        tenantId: tenant1.id,
        profile: {
          department: 'Development',
          position: 'Senior Developer',
        },
      },
    })

    // TechStart AB Users
    const techStartAdmin = await prisma.user.create({
      data: {
        email: 'admin@techstart.se',
        name: 'Erik Andersson',
        password: hashedPassword,
        role: 'admin',
        tenantId: tenant2.id,
        profile: {
          department: 'Management',
          position: 'CEO',
        },
      },
    })

    const techStartUser1 = await prisma.user.create({
      data: {
        email: 'maria@techstart.se',
        name: 'Maria Larsson',
        password: hashedPassword,
        role: 'user',
        tenantId: tenant2.id,
        profile: {
          department: 'Development',
          position: 'Frontend Developer',
        },
      },
    })

    // Demo Company Users
    const demoAdmin = await prisma.user.create({
      data: {
        email: 'admin@demo.com',
        name: 'Demo Admin',
        password: hashedPassword,
        role: 'admin',
        tenantId: tenant3.id,
        profile: {
          department: 'General',
          position: 'Administrator',
        },
      },
    })

    const demoUser1 = await prisma.user.create({
      data: {
        email: 'user@demo.com',
        name: 'Demo User',
        password: hashedPassword,
        role: 'user',
        tenantId: tenant3.id,
        profile: {
          department: 'General',
          position: 'User',
        },
      },
    })

    console.log('✅ Users created successfully')

    // Create Categories for each tenant
    console.log('📂 Creating categories...')
    
    // Acme Corporation Categories
    const acmeWorkCategory = await prisma.category.create({
      data: {
        name: 'Work',
        color: '#3b82f6',
        isDefault: true,
        tenantId: tenant1.id,
      },
    })

    const acmePersonalCategory = await prisma.category.create({
      data: {
        name: 'Personal',
        color: '#10b981',
        tenantId: tenant1.id,
      },
    })

    const acmeUrgentCategory = await prisma.category.create({
      data: {
        name: 'Urgent',
        color: '#ef4444',
        tenantId: tenant1.id,
      },
    })

    // TechStart AB Categories
    const techStartDevCategory = await prisma.category.create({
      data: {
        name: 'Development',
        color: '#8b5cf6',
        isDefault: true,
        tenantId: tenant2.id,
      },
    })

    const techStartMeetingCategory = await prisma.category.create({
      data: {
        name: 'Meetings',
        color: '#f59e0b',
        tenantId: tenant2.id,
      },
    })

    // Demo Company Categories
    const demoGeneralCategory = await prisma.category.create({
      data: {
        name: 'General',
        color: '#6b7280',
        isDefault: true,
        tenantId: tenant3.id,
      },
    })

    console.log('✅ Categories created successfully')

    // Create Projects for each tenant
    console.log('📋 Creating projects...')
    
    // Acme Corporation Projects
    const acmeProject1 = await prisma.project.create({
      data: {
        name: 'Website Redesign',
        description: 'Complete overhaul of company website',
        color: '#3b82f6',
        tenantId: tenant1.id,
        ownerId: acmeAdmin.id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
      },
    })

    const acmeProject2 = await prisma.project.create({
      data: {
        name: 'Marketing Campaign Q1',
        description: 'Launch new marketing campaign for Q1',
        color: '#10b981',
        tenantId: tenant1.id,
        ownerId: acmeUser1.id,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-31'),
      },
    })

    // TechStart AB Projects
    const techStartProject1 = await prisma.project.create({
      data: {
        name: 'Mobile App Development',
        description: 'Develop new mobile application',
        color: '#8b5cf6',
        tenantId: tenant2.id,
        ownerId: techStartAdmin.id,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
      },
    })

    console.log('✅ Projects created successfully')

    // Create Tasks for each tenant
    console.log('📝 Creating tasks...')
    
    // Acme Corporation Tasks
    const acmeTasks = [
      {
        title: 'Review website mockups',
        description: 'Review and approve new website design mockups',
        priority: 'high',
        completed: false,
        userId: acmeAdmin.id,
        tenantId: tenant1.id,
        categoryId: acmeWorkCategory.id,
        projectId: acmeProject1.id,
        tags: ['design', 'review'],
        dueDate: new Date('2024-02-15'),
      },
      {
        title: 'Prepare marketing materials',
        description: 'Create brochures and flyers for new campaign',
        priority: 'medium',
        completed: false,
        userId: acmeUser1.id,
        tenantId: tenant1.id,
        categoryId: acmeWorkCategory.id,
        projectId: acmeProject2.id,
        tags: ['marketing', 'design'],
        dueDate: new Date('2024-02-20'),
      },
      {
        title: 'Code review for login feature',
        description: 'Review pull request for new login functionality',
        priority: 'urgent',
        completed: true,
        userId: acmeUser2.id,
        tenantId: tenant1.id,
        categoryId: acmeUrgentCategory.id,
        projectId: acmeProject1.id,
        tags: ['code', 'review', 'security'],
        dueDate: new Date('2024-02-10'),
      },
      {
        title: 'Team meeting preparation',
        description: 'Prepare agenda and materials for monthly team meeting',
        priority: 'medium',
        completed: false,
        userId: acmeAdmin.id,
        tenantId: tenant1.id,
        categoryId: acmePersonalCategory.id,
        tags: ['meeting', 'agenda'],
        dueDate: new Date('2024-02-25'),
      },
    ]

    // TechStart AB Tasks
    const techStartTasks = [
      {
        title: 'API endpoint development',
        description: 'Develop REST API endpoints for mobile app',
        priority: 'high',
        completed: false,
        userId: techStartUser1.id,
        tenantId: tenant2.id,
        categoryId: techStartDevCategory.id,
        projectId: techStartProject1.id,
        tags: ['api', 'backend'],
        dueDate: new Date('2024-03-01'),
      },
      {
        title: 'Client presentation',
        description: 'Prepare presentation for client meeting',
        priority: 'medium',
        completed: false,
        userId: techStartAdmin.id,
        tenantId: tenant2.id,
        categoryId: techStartMeetingCategory.id,
        tags: ['presentation', 'client'],
        dueDate: new Date('2024-02-18'),
      },
      {
        title: 'Database schema design',
        description: 'Design database schema for new application',
        priority: 'high',
        completed: true,
        userId: techStartUser1.id,
        tenantId: tenant2.id,
        categoryId: techStartDevCategory.id,
        projectId: techStartProject1.id,
        tags: ['database', 'schema'],
        dueDate: new Date('2024-02-05'),
      },
    ]

    // Demo Company Tasks
    const demoTasks = [
      {
        title: 'Setup demo environment',
        description: 'Configure demo environment for new users',
        priority: 'medium',
        completed: false,
        userId: demoAdmin.id,
        tenantId: tenant3.id,
        categoryId: demoGeneralCategory.id,
        tags: ['demo', 'setup'],
        dueDate: new Date('2024-02-28'),
      },
      {
        title: 'Create sample data',
        description: 'Generate sample data for demonstration',
        priority: 'low',
        completed: true,
        userId: demoUser1.id,
        tenantId: tenant3.id,
        categoryId: demoGeneralCategory.id,
        tags: ['sample', 'data'],
        dueDate: new Date('2024-02-12'),
      },
    ]

    // Insert all tasks
    await prisma.task.createMany({
      data: [...acmeTasks, ...techStartTasks, ...demoTasks],
    })

    console.log('✅ Tasks created successfully')

    // Display summary
    console.log('\n🎉 Database seeding completed!')
    console.log('\n📊 Summary:')
    console.log(`- Tenants: ${await prisma.tenant.count()}`)
    console.log(`- Users: ${await prisma.user.count()}`)
    console.log(`- Categories: ${await prisma.category.count()}`)
    console.log(`- Projects: ${await prisma.project.count()}`)
    console.log(`- Tasks: ${await prisma.task.count()}`)

    console.log('\n🔑 Test Credentials:')
    console.log('Acme Corporation (subdomain: acme):')
    console.log('  - admin@acme.com / password123')
    console.log('  - alice@acme.com / password123')
    console.log('  - bob@acme.com / password123')
    console.log('\nTechStart AB (subdomain: techstart):')
    console.log('  - admin@techstart.se / password123')
    console.log('  - maria@techstart.se / password123')
    console.log('\nDemo Company (subdomain: demo):')
    console.log('  - admin@demo.com / password123')
    console.log('  - user@demo.com / password123')

    console.log('\n🌐 Access URLs:')
    console.log('- http://localhost:3000 (will resolve to demo tenant)')
    console.log('- http://acme.localhost:3000 (Acme Corporation)')
    console.log('- http://techstart.localhost:3000 (TechStart AB)')
    console.log('- http://demo.localhost:3000 (Demo Company)')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  })
