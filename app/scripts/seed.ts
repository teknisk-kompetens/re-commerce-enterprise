
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo company
  const demoCompany = await prisma.company.upsert({
    where: { domain: 'demo.com' },
    update: {},
    create: {
      name: 'Demo Corporation',
      domain: 'demo.com',
      plan: 'ENTERPRISE',
      isActive: true
    }
  });

  // Create demo users
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      companyId: demoCompany.id
    }
  });

  // Create additional demo users
  const users = [
    {
      email: 'sarah.chen@demo.com',
      name: 'Dr. Sarah Chen',
      role: 'ENTERPRISE' as const,
      companyId: demoCompany.id
    },
    {
      email: 'marcus.johnson@demo.com',
      name: 'Marcus Johnson',
      role: 'ADMIN' as const,
      companyId: demoCompany.id
    },
    {
      email: 'elena.rodriguez@demo.com',
      name: 'Elena Rodriguez',
      role: 'USER' as const,
      companyId: demoCompany.id
    }
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword
      }
    });
  }

  // Create categories
  const categories = [
    {
      name: 'Technology',
      slug: 'technology',
      description: 'AI, machine learning, software development, and tech trends',
      color: '#3B82F6',
      icon: 'Cpu'
    },
    {
      name: 'Leadership',
      slug: 'leadership',
      description: 'Management, team building, and organizational development',
      color: '#EF4444',
      icon: 'Users'
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'UX/UI design, visual design, and design thinking',
      color: '#8B5CF6',
      icon: 'Palette'
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Strategy, operations, finance, and business development',
      color: '#10B981',
      icon: 'TrendingUp'
    },
    {
      name: 'Innovation',
      slug: 'innovation',
      description: 'New ideas, emerging technologies, and disruptive trends',
      color: '#F59E0B',
      icon: 'Lightbulb'
    }
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData
    });
    createdCategories.push(category);
  }

  // Create tags
  const tags = [
    { name: 'AI', slug: 'ai', color: '#8B5CF6' },
    { name: 'Machine Learning', slug: 'machine-learning', color: '#3B82F6' },
    { name: 'Enterprise', slug: 'enterprise', color: '#10B981' },
    { name: 'Strategy', slug: 'strategy', color: '#F59E0B' },
    { name: 'Remote Work', slug: 'remote-work', color: '#06B6D4' },
    { name: 'Management', slug: 'management', color: '#84CC16' },
    { name: 'Productivity', slug: 'productivity', color: '#F97316' },
    { name: 'UX Design', slug: 'ux-design', color: '#EC4899' },
    { name: 'Trends', slug: 'trends', color: '#14B8A6' },
    { name: 'Innovation', slug: 'innovation', color: '#F59E0B' },
    { name: 'Digital Transformation', slug: 'digital-transformation', color: '#6366F1' },
    { name: 'Data Analytics', slug: 'data-analytics', color: '#8B5CF6' },
    { name: 'Customer Experience', slug: 'customer-experience', color: '#EC4899' },
    { name: 'Sustainability', slug: 'sustainability', color: '#10B981' },
    { name: 'Automation', slug: 'automation', color: '#F97316' }
  ];

  const createdTags = [];
  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: {
        ...tagData,
        usageCount: Math.floor(Math.random() * 500) + 50
      }
    });
    createdTags.push(tag);
  }

  // Create sample search content
  const searchContent = [
    {
      title: 'Implementing AI in Enterprise: A Complete Guide',
      content: `Artificial Intelligence implementation in enterprise environments requires careful planning, stakeholder buy-in, and a strategic approach. This comprehensive guide covers everything from initial assessment to full deployment.

      Key considerations include:
      - Data readiness and quality assessment
      - Infrastructure requirements and scalability
      - Team training and change management
      - Compliance and security protocols
      - ROI measurement and success metrics

      The implementation process typically follows these phases:
      1. Discovery and Assessment
      2. Pilot Project Development
      3. Proof of Concept Validation
      4. Scaled Implementation
      5. Monitoring and Optimization

      Organizations that succeed in AI implementation often share common characteristics: strong leadership support, data-driven culture, and willingness to iterate and learn from failures.`,
      excerpt: 'A comprehensive guide covering AI implementation strategies, tools selection, and best practices for enterprise environments.',
      type: 'ARTICLE' as const,
      slug: 'implementing-ai-enterprise-guide',
      categoryId: createdCategories.find(c => c.slug === 'technology')?.id,
      views: 2456,
      upvotes: 189,
      downvotes: 12,
      score: 95.5
    },
    {
      title: 'Remote Team Management: Best Practices for 2024',
      content: `Remote team management has evolved significantly since the pandemic. Modern leaders need new skills and approaches to maintain productivity, culture, and employee engagement.

      Essential practices include:
      - Establishing clear communication protocols
      - Using the right collaboration tools
      - Maintaining regular one-on-ones
      - Creating virtual team bonding activities
      - Setting clear expectations and deliverables

      Communication is the cornerstone of remote team success. Teams that communicate effectively show 25% higher productivity and 50% better retention rates.

      Tools that make a difference:
      - Slack or Microsoft Teams for instant communication
      - Zoom or Google Meet for video conferences
      - Asana or Monday for project management
      - Miro for collaborative brainstorming
      - Time tracking tools for productivity insights

      The future of remote work is hybrid, requiring leaders to be flexible and adaptive to changing needs.`,
      excerpt: 'Explore proven strategies and tools for effective remote team management in the modern workplace.',
      type: 'DISCUSSION' as const,
      slug: 'remote-team-management-2024',
      categoryId: createdCategories.find(c => c.slug === 'leadership')?.id,
      views: 1834,
      upvotes: 142,
      downvotes: 8,
      score: 87.2
    },
    {
      title: 'UX Design Trends That Will Shape 2024',
      content: `User experience design continues to evolve rapidly, driven by new technologies, changing user behaviors, and accessibility requirements. Here are the key trends shaping digital experiences in 2024.

      Major trends include:
      - AI-powered personalization
      - Voice user interfaces
      - Sustainable design practices
      - Inclusive and accessible design
      - Micro-interactions and animations
      - Dark mode optimization
      - Mobile-first responsive design

      AI integration is revolutionizing UX design. Smart interfaces that adapt to user behavior and preferences are becoming the norm, not the exception.

      Sustainability in design means:
      - Optimizing for performance and energy efficiency
      - Reducing digital waste
      - Choosing eco-friendly hosting solutions
      - Designing for device longevity

      Accessibility is no longer optional. Designs must work for users with disabilities, following WCAG guidelines and considering diverse needs from the start.`,
      excerpt: 'Discover the UX design trends that will define digital experiences in 2024.',
      type: 'TUTORIAL' as const,
      slug: 'ux-design-trends-2024',
      categoryId: createdCategories.find(c => c.slug === 'design')?.id,
      views: 1567,
      upvotes: 124,
      downvotes: 5,
      score: 82.8
    },
    {
      title: 'Digital Transformation Strategy: A CEO\'s Perspective',
      content: `Digital transformation is not just about technology—it's about reimagining business models, processes, and customer experiences for the digital age.

      Key components of successful digital transformation:
      - Leadership commitment and vision
      - Customer-centric approach
      - Data-driven decision making
      - Agile methodology adoption
      - Employee upskilling and reskilling
      - Technology infrastructure modernization

      Common pitfalls to avoid:
      - Focusing only on technology without considering culture
      - Lack of clear strategy and goals
      - Insufficient change management
      - Underestimating the time and resources required
      - Ignoring cybersecurity implications

      Success metrics should include both quantitative measures (ROI, efficiency gains) and qualitative improvements (customer satisfaction, employee engagement).

      The journey is ongoing—digital transformation is not a destination but a continuous evolution.`,
      excerpt: 'Strategic insights on leading digital transformation initiatives from executive leadership perspective.',
      type: 'ARTICLE' as const,
      slug: 'digital-transformation-ceo-perspective',
      categoryId: createdCategories.find(c => c.slug === 'business')?.id,
      views: 2103,
      upvotes: 167,
      downvotes: 9,
      score: 91.3
    },
    {
      title: 'Sustainable Business Practices: Beyond Greenwashing',
      content: `True sustainability goes beyond marketing buzzwords. Companies need authentic, measurable approaches to environmental and social responsibility.

      Authentic sustainability practices:
      - Transparent reporting and metrics
      - Supply chain responsibility
      - Employee wellbeing programs
      - Community impact initiatives
      - Circular economy principles
      - Carbon footprint reduction

      Implementation strategies:
      1. Conduct sustainability audit
      2. Set measurable goals and timelines
      3. Engage stakeholders in the process
      4. Invest in sustainable technologies
      5. Regular monitoring and reporting
      6. Continuous improvement mindset

      Benefits extend beyond compliance:
      - Enhanced brand reputation
      - Employee attraction and retention
      - Cost savings through efficiency
      - Risk mitigation
      - Access to sustainable finance options

      The business case for sustainability is stronger than ever, with consumers and investors demanding accountability.`,
      excerpt: 'Learn how to implement authentic sustainable business practices that go beyond marketing.',
      type: 'ARTICLE' as const,
      slug: 'sustainable-business-practices-guide',
      categoryId: createdCategories.find(c => c.slug === 'business')?.id,
      views: 1445,
      upvotes: 98,
      downvotes: 7,
      score: 79.4
    }
  ];

  const createdContent = [];
  for (const contentData of searchContent) {
    const content = await prisma.searchContent.create({
      data: {
        ...contentData,
        publishedAt: new Date()
      }
    });
    createdContent.push(content);
  }

  // Connect tags to content
  const contentTagConnections = [
    { contentIndex: 0, tagSlugs: ['ai', 'enterprise', 'strategy', 'digital-transformation'] },
    { contentIndex: 1, tagSlugs: ['remote-work', 'management', 'productivity'] },
    { contentIndex: 2, tagSlugs: ['ux-design', 'trends', 'innovation'] },
    { contentIndex: 3, tagSlugs: ['digital-transformation', 'strategy', 'enterprise'] },
    { contentIndex: 4, tagSlugs: ['sustainability', 'enterprise', 'strategy'] }
  ];

  for (const connection of contentTagConnections) {
    const content = createdContent[connection.contentIndex];
    const tagIds = createdTags
      .filter(tag => connection.tagSlugs.includes(tag.slug))
      .map(tag => ({ id: tag.id }));

    await prisma.searchContent.update({
      where: { id: content.id },
      data: {
        tags: {
          connect: tagIds
        }
      }
    });
  }

  // Create some sample search queries
  const sampleQueries = [
    'AI implementation strategies',
    'remote team management',
    'sustainable business practices',
    'UX design principles',
    'digital transformation',
    'customer experience optimization',
    'data analytics tools',
    'innovation management'
  ];

  for (const query of sampleQueries) {
    await prisma.searchQuery.create({
      data: {
        query,
        resultsCount: Math.floor(Math.random() * 50) + 10,
        aiAssistance: Math.random() > 0.5,
        consciousnessId: Math.random() > 0.5 ? ['vera', 'luna', 'axel'][Math.floor(Math.random() * 3)] : null
      }
    });
  }

  // Update category content counts
  for (const category of createdCategories) {
    const count = await prisma.searchContent.count({
      where: { categoryId: category.id }
    });
    await prisma.category.update({
      where: { id: category.id },
      data: { contentCount: count }
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`🏢 Created company: ${demoCompany.name}`);
  console.log(`👤 Created ${users.length + 1} users`);
  console.log(`📁 Created ${createdCategories.length} categories`);
  console.log(`🏷️ Created ${createdTags.length} tags`);
  console.log(`📝 Created ${createdContent.length} content items`);
  console.log(`🔍 Created ${sampleQueries.length} search queries`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
