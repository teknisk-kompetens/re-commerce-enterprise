
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enterprise System Components - The building blocks for demos
const enterpriseComponents = [
  // AI & Intelligence Category
  {
    name: 'ai-studio',
    title: 'AI Studio',
    description: 'AI automation and intelligence platform with advanced machine learning capabilities',
    category: 'ai',
    type: 'dashboard',
    icon: 'Brain',
    color: 'bg-purple-500',
    href: '/ai-studio',
    demoContent: {
      metrics: {
        modelsDeployed: 45,
        accuracy: 94.2,
        processingSpeed: '2.3ms',
        dataProcessed: '12.4TB'
      },
      features: ['Auto ML', 'Neural Networks', 'Deep Learning', 'Model Deployment'],
      useCases: ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision', 'Anomaly Detection']
    },
    interactions: [
      {
        name: 'deploy-model',
        type: 'button',
        method: 'POST',
        endpoint: '/api/ai-studio/deploy',
        payload: { modelId: 'ml-model-001', environment: 'production' }
      },
      {
        name: 'run-analysis',
        type: 'form',
        method: 'POST',
        endpoint: '/api/ai-analytics',
        payload: { dataset: 'customer-data', algorithm: 'neural-network' }
      }
    ],
    aiPrompts: [
      'Generate AI insights for {industry} sector focusing on {painPoints}',
      'Create machine learning recommendations for {role} in {company}',
      'Explain AI capabilities relevant to {focusAreas}'
    ],
    isHighlighted: true,
    isPremium: true
  },
  {
    name: 'ai-analytics',
    title: 'AI Analytics',
    description: 'AI-powered business analytics with predictive insights and intelligent recommendations',
    category: 'ai',
    type: 'dashboard',
    icon: 'TrendingUp',
    color: 'bg-purple-600',
    href: '/ai-analytics',
    demoContent: {
      insights: ['Revenue will increase by 23% next quarter', 'Customer churn risk: 15 high-value customers'],
      predictions: { accuracy: 89.5, confidence: 94.2 },
      recommendations: ['Optimize pricing strategy', 'Implement retention campaign']
    },
    interactions: [
      {
        name: 'generate-insights',
        type: 'api_call',
        method: 'GET',
        endpoint: '/api/ai-insights'
      }
    ],
    aiPrompts: [
      'Generate business insights for {industry} companies with focus on {focusAreas}',
      'Create predictive analytics relevant to {role} responsibilities'
    ]
  },
  {
    name: 'intelligent-bi',
    title: 'Intelligent BI',
    description: 'AI-powered business intelligence with natural language queries and automated insights',
    category: 'ai',
    type: 'dashboard',
    icon: 'Gauge',
    color: 'bg-purple-700',
    href: '/intelligent-bi',
    demoContent: {
      queries: ['Show revenue trends by region', 'Which products have declining sales?'],
      visualizations: ['Smart Charts', 'Predictive Dashboards', 'Interactive Reports'],
      automation: ['Scheduled Reports', 'Alert Systems', 'Data Refreshing']
    },
    interactions: [
      {
        name: 'natural-query',
        type: 'form',
        method: 'POST',
        endpoint: '/api/intelligent-bi/query',
        payload: { query: 'Show me revenue trends for the last 6 months' }
      }
    ],
    aiPrompts: [
      'Create BI insights for {industry} focusing on {painPoints}',
      'Generate intelligent reports for {role} in {company}'
    ]
  },

  // Security & Performance Category
  {
    name: 'security-center',
    title: 'Security Center',
    description: 'Enterprise security monitoring with AI-powered threat detection and response',
    category: 'security',
    type: 'dashboard',
    icon: 'Shield',
    color: 'bg-red-500',
    href: '/security-center',
    demoContent: {
      threats: { detected: 847, mitigated: 834, pending: 13 },
      compliance: { score: 98.5, frameworks: ['SOX', 'GDPR', 'HIPAA'] },
      features: ['Real-time Monitoring', 'Threat Intelligence', 'Incident Response', 'Compliance Tracking']
    },
    interactions: [
      {
        name: 'threat-analysis',
        type: 'simulation',
        method: 'GET',
        endpoint: '/api/security/threats'
      },
      {
        name: 'compliance-check',
        type: 'button',
        method: 'POST',
        endpoint: '/api/security/compliance'
      }
    ],
    aiPrompts: [
      'Explain security measures for {industry} sector addressing {painPoints}',
      'Create security recommendations for {role} in {company}'
    ],
    isHighlighted: true
  },
  {
    name: 'performance-center',
    title: 'Performance Center',
    description: 'Real-time performance optimization with intelligent scaling and monitoring',
    category: 'security',
    type: 'dashboard',
    icon: 'Zap',
    color: 'bg-yellow-500',
    href: '/performance-center',
    demoContent: {
      metrics: { uptime: 99.97, responseTime: '45ms', throughput: '1.2M req/min' },
      optimizations: ['Auto-scaling', 'Load Balancing', 'Caching', 'CDN'],
      monitoring: ['Real-time Alerts', 'Performance Analytics', 'Capacity Planning']
    },
    interactions: [
      {
        name: 'optimize-performance',
        type: 'button',
        method: 'POST',
        endpoint: '/api/performance/optimize'
      }
    ],
    aiPrompts: [
      'Generate performance insights for {industry} systems',
      'Create optimization recommendations for {role}'
    ]
  },

  // Analytics & Operations Category
  {
    name: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Comprehensive business intelligence and reporting with real-time data visualization',
    category: 'analytics',
    type: 'dashboard',
    icon: 'BarChart3',
    color: 'bg-blue-500',
    href: '/analytics',
    demoContent: {
      kpis: { revenue: 12.4, growth: 8.3, customers: 45600, retention: 94.2 },
      reports: ['Revenue Analysis', 'Customer Insights', 'Market Trends', 'Operational Metrics'],
      visualizations: ['Interactive Charts', 'Real-time Dashboards', 'Custom Reports']
    },
    interactions: [
      {
        name: 'generate-report',
        type: 'form',
        method: 'POST',
        endpoint: '/api/analytics/reports'
      },
      {
        name: 'export-data',
        type: 'button',
        method: 'GET',
        endpoint: '/api/analytics/export'
      }
    ],
    aiPrompts: [
      'Create analytics insights for {industry} focusing on {focusAreas}',
      'Generate business reports relevant to {role} responsibilities'
    ]
  },
  {
    name: 'widget-factory',
    title: 'Widget Factory',
    description: 'Advanced widget creation workspace with drag-and-drop functionality and AI assistance',
    category: 'operations',
    type: 'workspace',
    icon: 'Palette',
    color: 'bg-green-500',
    href: '/widget-factory',
    demoContent: {
      widgets: ['Charts', 'Forms', 'Dashboards', 'Reports', 'Integrations'],
      templates: 47,
      collaborators: 12,
      features: ['Drag & Drop', 'AI Assistant', 'Real-time Collaboration', 'Version Control']
    },
    interactions: [
      {
        name: 'create-widget',
        type: 'form',
        method: 'POST',
        endpoint: '/api/widget-factory/create'
      },
      {
        name: 'ai-generate',
        type: 'button',
        method: 'POST',
        endpoint: '/api/widget-factory/ai-generate'
      }
    ],
    aiPrompts: [
      'Suggest widget designs for {industry} use cases',
      'Create custom widgets for {role} workflow optimization'
    ],
    isHighlighted: true,
    isPremium: true
  },

  // Integration Category
  {
    name: 'integrations-hub',
    title: 'Integrations Hub',
    description: 'Comprehensive API and system integrations with enterprise connectors',
    category: 'integration',
    type: 'integration',
    icon: 'Plug',
    color: 'bg-indigo-500',
    href: '/integrations-hub',
    demoContent: {
      integrations: { active: 23, pending: 3, available: 150 },
      systems: ['Salesforce', 'SAP', 'Microsoft 365', 'AWS', 'Google Cloud'],
      features: ['Real-time Sync', 'Data Mapping', 'Error Handling', 'Monitoring']
    },
    interactions: [
      {
        name: 'connect-system',
        type: 'form',
        method: 'POST',
        endpoint: '/api/integrations/connect'
      },
      {
        name: 'sync-data',
        type: 'button',
        method: 'POST',
        endpoint: '/api/integrations/sync'
      }
    ],
    aiPrompts: [
      'Recommend integrations for {industry} companies',
      'Suggest system connections for {role} efficiency'
    ]
  },

  // Management & Governance Category
  {
    name: 'executive-dashboard',
    title: 'Executive Dashboard',
    description: 'Executive-level insights with strategic KPIs and predictive analytics',
    category: 'management',
    type: 'dashboard',
    icon: 'Crown',
    color: 'bg-purple-800',
    href: '/executive-dashboard',
    demoContent: {
      kpis: { revenue: 145.2, profit: 23.8, growth: 12.5, marketShare: 8.9 },
      insights: ['Market expansion opportunity', 'Operational efficiency gains', 'Strategic partnerships'],
      forecasts: { nextQuarter: 15.3, yearEnd: 167.8 }
    },
    interactions: [
      {
        name: 'strategic-analysis',
        type: 'api_call',
        method: 'GET',
        endpoint: '/api/executive/insights'
      }
    ],
    aiPrompts: [
      'Generate executive insights for {industry} leadership',
      'Create strategic recommendations for {company} growth'
    ],
    isPremium: true
  },
  {
    name: 'governance-center',
    title: 'Governance Center',
    description: 'Comprehensive compliance and governance management with automated reporting',
    category: 'management',
    type: 'dashboard',
    icon: 'Globe',
    color: 'bg-gray-600',
    href: '/governance-center',
    demoContent: {
      compliance: { overall: 96.8, frameworks: 8, audits: 24 },
      policies: { active: 156, pending: 7, violations: 2 },
      reporting: ['Automated Reports', 'Audit Trails', 'Risk Assessment', 'Policy Management']
    },
    interactions: [
      {
        name: 'compliance-report',
        type: 'button',
        method: 'GET',
        endpoint: '/api/governance/compliance'
      }
    ],
    aiPrompts: [
      'Explain governance requirements for {industry}',
      'Create compliance strategies for {role} responsibilities'
    ]
  }
];

// Default Demo Profiles
const demoProfiles = [
  {
    name: 'Deutsche Bank Enterprise Demo',
    description: 'Comprehensive enterprise platform demonstration tailored for Deutsche Bank executives and stakeholders',
    type: 'template',
    industry: 'banking',
    targetRole: 'executive',
    painPoints: [
      'Digital transformation complexity',
      'Regulatory compliance burden',
      'Operational efficiency',
      'Customer experience modernization',
      'Risk management automation'
    ],
    focusAreas: [
      'AI-powered analytics',
      'Security and compliance',
      'Process automation',
      'Real-time insights',
      'Enterprise integration'
    ],
    duration: 20,
    interactive: true,
    autoPlay: false,
    personalization: {
      industry: 'banking',
      regulations: ['GDPR', 'Basel III', 'MiFID II'],
      priorities: ['efficiency', 'compliance', 'innovation']
    },
    slides: [
      {
        id: 'intro',
        title: 'Welcome to Re-Commerce Enterprise',
        content: 'Transform your banking operations with AI-powered enterprise solutions',
        components: ['executive-dashboard', 'ai-analytics'],
        duration: 3
      },
      {
        id: 'ai-capabilities',
        title: 'AI & Intelligence Platform',
        content: 'Leverage advanced AI for predictive analytics and automated decision-making',
        components: ['ai-studio', 'intelligent-bi'],
        duration: 4
      },
      {
        id: 'security-compliance',
        title: 'Security & Compliance',
        content: 'Enterprise-grade security with automated compliance monitoring',
        components: ['security-center', 'governance-center'],
        duration: 4
      },
      {
        id: 'operations-integration',
        title: 'Operations & Integration',
        content: 'Streamline operations with intelligent automation and seamless integrations',
        components: ['widget-factory', 'integrations-hub', 'performance-center'],
        duration: 5
      },
      {
        id: 'analytics-insights',
        title: 'Analytics & Insights',
        content: 'Real-time business intelligence with predictive insights',
        components: ['analytics-dashboard', 'ai-analytics'],
        duration: 4
      }
    ],
    workflows: [],
    isActive: true,
    isTemplate: true,
    createdBy: 'system',
    tenantId: 'default'
  },
  {
    name: 'Executive Overview Demo',
    description: 'High-level platform overview for C-suite executives across industries',
    type: 'default',
    industry: 'general',
    targetRole: 'executive',
    painPoints: [
      'Strategic decision-making',
      'Operational visibility',
      'Digital transformation',
      'Competitive advantage',
      'ROI optimization'
    ],
    focusAreas: [
      'Strategic insights',
      'Performance optimization',
      'Innovation enablement',
      'Risk mitigation',
      'Growth opportunities'
    ],
    duration: 15,
    interactive: true,
    autoPlay: false,
    personalization: {},
    slides: [
      {
        id: 'executive-intro',
        title: 'Enterprise Platform Overview',
        content: 'Comprehensive enterprise solution for digital transformation',
        components: ['executive-dashboard'],
        duration: 3
      },
      {
        id: 'key-capabilities',
        title: 'Key Capabilities',
        content: 'AI, Security, Analytics, and Integration capabilities',
        components: ['ai-studio', 'security-center', 'analytics-dashboard'],
        duration: 5
      },
      {
        id: 'business-value',
        title: 'Business Value',
        content: 'Measurable impact on efficiency, security, and growth',
        components: ['performance-center', 'governance-center'],
        duration: 4
      },
      {
        id: 'next-steps',
        title: 'Implementation Roadmap',
        content: 'Strategic approach to platform adoption and scaling',
        components: ['integrations-hub'],
        duration: 3
      }
    ],
    workflows: [],
    isActive: true,
    isTemplate: true,
    createdBy: 'system',
    tenantId: 'default'
  },
  {
    name: 'Technical Deep Dive Demo',
    description: 'Detailed technical demonstration for developers and technical teams',
    type: 'default',
    industry: 'technology',
    targetRole: 'developer',
    painPoints: [
      'Technical complexity',
      'Integration challenges',
      'Development velocity',
      'System reliability',
      'Scalability concerns'
    ],
    focusAreas: [
      'API capabilities',
      'Development tools',
      'System integration',
      'Performance optimization',
      'Security implementation'
    ],
    duration: 25,
    interactive: true,
    autoPlay: false,
    personalization: {},
    slides: [
      {
        id: 'tech-intro',
        title: 'Technical Architecture Overview',
        content: 'Comprehensive technical platform capabilities',
        components: ['integrations-hub'],
        duration: 3
      },
      {
        id: 'development-tools',
        title: 'Development Tools',
        content: 'Advanced tools for rapid development and deployment',
        components: ['widget-factory', 'ai-studio'],
        duration: 6
      },
      {
        id: 'integration-apis',
        title: 'Integration & APIs',
        content: 'Comprehensive API ecosystem and system integrations',
        components: ['integrations-hub', 'performance-center'],
        duration: 8
      },
      {
        id: 'security-architecture',
        title: 'Security Architecture',
        content: 'Enterprise-grade security implementation',
        components: ['security-center', 'governance-center'],
        duration: 5
      },
      {
        id: 'monitoring-analytics',
        title: 'Monitoring & Analytics',
        content: 'Real-time monitoring and advanced analytics capabilities',
        components: ['analytics-dashboard', 'performance-center'],
        duration: 3
      }
    ],
    workflows: [],
    isActive: true,
    isTemplate: true,
    createdBy: 'system',
    tenantId: 'default'
  }
];

// Interactive Elements
const interactiveElements = [
  {
    componentId: 'ai-studio',
    name: 'Deploy AI Model',
    type: 'button',
    method: 'POST',
    endpoint: '/api/ai-studio/deploy',
    payload: { modelType: 'neural-network', environment: 'production' },
    responseTemplate: { status: 'success', modelId: 'ml-{timestamp}', deploymentTime: '45s' },
    aiPrompt: 'Explain AI model deployment benefits for {industry} sector',
    personalize: true
  },
  {
    componentId: 'security-center',
    name: 'Run Security Scan',
    type: 'simulation',
    method: 'GET',
    endpoint: '/api/security/scan',
    payload: {},
    responseTemplate: { threats: 0, vulnerabilities: 0, score: 98.5 },
    aiPrompt: 'Generate security insights for {company} infrastructure',
    personalize: true
  },
  {
    componentId: 'analytics-dashboard',
    name: 'Generate Custom Report',
    type: 'form',
    method: 'POST',
    endpoint: '/api/analytics/custom-report',
    payload: { dateRange: '30d', metrics: ['revenue', 'growth'], format: 'pdf' },
    responseTemplate: { reportId: 'rpt-{timestamp}', status: 'generated', downloadUrl: '/reports/{reportId}' },
    aiPrompt: 'Create custom analytics report for {role} in {industry}',
    personalize: true
  },
  {
    componentId: 'integrations-hub',
    name: 'Connect New System',
    type: 'form',
    method: 'POST',
    endpoint: '/api/integrations/connect',
    payload: { system: 'salesforce', credentials: 'encrypted', syncFrequency: 'realtime' },
    responseTemplate: { connectionId: 'conn-{timestamp}', status: 'connected', syncStatus: 'active' },
    aiPrompt: 'Recommend integration strategy for {industry} operations',
    personalize: true
  },
  {
    componentId: 'widget-factory',
    name: 'Create Widget with AI',
    type: 'form',
    method: 'POST',
    endpoint: '/api/widget-factory/ai-create',
    payload: { description: 'dashboard widget for {industry}', type: 'chart', data: 'revenue-trends' },
    responseTemplate: { widgetId: 'wgt-{timestamp}', status: 'created', previewUrl: '/widgets/{widgetId}/preview' },
    aiPrompt: 'Design widget for {role} workflow in {industry}',
    personalize: true
  }
];

async function seedDemoBuilder() {
  try {
    console.log('🌱 Seeding Interactive Demo Builder...');

    // Clear existing data
    await prisma.demoInteractiveElement.deleteMany();
    await prisma.demoExecution.deleteMany();
    await prisma.demoAnalytics.deleteMany();
    await prisma.demoWorkflow.deleteMany();
    await prisma.demoProfile.deleteMany();
    await prisma.enterpriseSystemComponent.deleteMany();
    await prisma.userPersonalizationProfile.deleteMany();

    console.log('📦 Seeding Enterprise System Components...');
    // Seed Enterprise System Components
    for (const component of enterpriseComponents) {
      await prisma.enterpriseSystemComponent.create({
        data: {
          ...component,
          demoContent: component.demoContent as any,
          interactions: component.interactions as any,
          aiPrompts: component.aiPrompts as any,
          usageCount: Math.floor(Math.random() * 100),
          rating: 4.0 + Math.random() * 1.0,
          isActive: true,
          isHighlighted: component.isHighlighted || false,
          isPremium: component.isPremium || false
        }
      });
    }

    console.log('🎯 Seeding Demo Profiles...');
    // Seed Demo Profiles
    for (const profile of demoProfiles) {
      await prisma.demoProfile.create({
        data: {
          ...profile,
          painPoints: profile.painPoints as any,
          focusAreas: profile.focusAreas as any,
          personalization: profile.personalization as any,
          slides: profile.slides as any,
          workflows: profile.workflows as any,
          popularity: Math.floor(Math.random() * 50),
          lastUsed: new Date()
        }
      });
    }

    console.log('🔧 Seeding Interactive Elements...');
    // Seed Interactive Elements
    for (const element of interactiveElements) {
      await prisma.demoInteractiveElement.create({
        data: {
          ...element,
          payload: element.payload as any,
          responseTemplate: element.responseTemplate as any,
          triggerConditions: {} as any,
          responseVariations: [] as any,
          isActive: true
        }
      });
    }

    console.log('👤 Creating Sample User Personalization Profiles...');
    // Sample User Personalization Profiles
    const sampleProfiles = [
      {
        sessionId: 'session-deutsche-bank-exec',
        industry: 'banking',
        role: 'executive',
        company: 'Deutsche Bank',
        companySize: 'enterprise' as const,
        experience: 'expert' as const,
        painPoints: ['regulatory-compliance', 'digital-transformation', 'operational-efficiency'],
        focusAreas: ['ai-analytics', 'risk-management', 'customer-experience'],
        interests: ['innovation', 'automation', 'compliance'],
        previousDemos: [],
        preferences: { language: 'en', theme: 'professional', pace: 'moderate' },
        learningStyle: 'analytical' as const,
        aiProfile: { sophistication: 'high', technicalDepth: 'medium' },
        confidence: 0.95
      },
      {
        sessionId: 'session-tech-manager',
        industry: 'technology',
        role: 'manager',
        company: 'TechCorp',
        companySize: 'sme' as const,
        experience: 'intermediate' as const,
        painPoints: ['scalability', 'integration-complexity', 'team-productivity'],
        focusAreas: ['development-tools', 'api-integration', 'performance-monitoring'],
        interests: ['automation', 'developer-experience', 'system-integration'],
        previousDemos: [],
        preferences: { language: 'en', theme: 'modern', pace: 'fast' },
        learningStyle: 'hands-on' as const,
        aiProfile: { sophistication: 'high', technicalDepth: 'high' },
        confidence: 0.88
      }
    ];

    for (const profile of sampleProfiles) {
      await prisma.userPersonalizationProfile.create({
        data: {
          ...profile,
          painPoints: profile.painPoints as any,
          focusAreas: profile.focusAreas as any,
          interests: profile.interests as any,
          previousDemos: profile.previousDemos as any,
          preferences: profile.preferences as any,
          aiProfile: profile.aiProfile as any
        }
      });
    }

    console.log('✅ Demo Builder seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   • ${enterpriseComponents.length} Enterprise System Components`);
    console.log(`   • ${demoProfiles.length} Demo Profiles`);
    console.log(`   • ${interactiveElements.length} Interactive Elements`);
    console.log(`   • ${sampleProfiles.length} Sample User Profiles`);
    
  } catch (error) {
    console.error('❌ Error seeding demo builder:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedDemoBuilder()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDemoBuilder };
