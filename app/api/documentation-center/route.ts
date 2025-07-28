
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'user-guide' | 'api' | 'developer' | 'admin' | 'troubleshooting';
  icon: string;
  articles: DocumentationArticle[];
  lastUpdated: Date;
}

interface DocumentationArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  lastUpdated: Date;
  author: string;
  views: number;
  helpful: number;
  rating: number;
}

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  category: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  examples: APIExample[];
  authentication: boolean;
  rateLimit: string;
  deprecated: boolean;
}

interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: any;
  validation?: string;
}

interface APIResponse {
  status: number;
  description: string;
  schema: any;
  example: any;
}

interface APIExample {
  title: string;
  description: string;
  request: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
  };
}

interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  views: number;
  likes: number;
  transcript?: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'question' | 'integration' | 'performance' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  assignee?: string;
  requester: string;
  createdAt: Date;
  updatedAt: Date;
  comments: TicketComment[];
}

interface TicketComment {
  id: string;
  content: string;
  author: string;
  isInternal: boolean;
  createdAt: Date;
  attachments?: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  lastUpdated: Date;
}

// Mock documentation data
const generateDocumentationSections = (): DocumentationSection[] => {
  return [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide to get you up and running',
      category: 'getting-started',
      icon: 'rocket',
      lastUpdated: new Date(),
      articles: [
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          content: `# Quick Start Guide

Welcome to Re:Commerce Enterprise! This guide will help you get started with the platform in just a few minutes.

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Administrator access to your organization
- Valid enterprise subscription

## Step 1: Initial Setup

1. **Access the Platform**: Navigate to your enterprise dashboard
2. **Complete Onboarding**: Follow the enterprise onboarding wizard
3. **Configure Users**: Set up your team members and roles
4. **Enable Features**: Activate the enterprise features you need

## Step 2: Core Configuration

### Global Deployment
- Configure your deployment regions
- Set up multi-region architecture
- Enable CDN and edge computing

### Security Setup
- Configure authentication methods
- Set up role-based access control
- Enable security monitoring

### AI Analytics
- Enable AI-powered insights
- Configure predictive analytics
- Set up automated reporting

## Step 3: Integration

### API Configuration
- Generate API keys
- Configure webhooks
- Set up data synchronization

### Enterprise Systems
- Connect to your existing systems
- Configure data flows
- Set up automated workflows

## Next Steps

Once you've completed the initial setup, explore these advanced features:

- **Advanced Analytics**: Deep dive into business intelligence
- **Custom Integrations**: Build custom connectors
- **Automation Workflows**: Create automated business processes
- **Advanced Security**: Implement zero-trust architecture

## Support

Need help? Our enterprise support team is available 24/7:
- Email: support@re-commerce-enterprise.com
- Phone: +1-800-ENTERPRISE
- Chat: Available in the platform

Ready to get started? [Begin Setup →](/onboarding)`,
          category: 'getting-started',
          tags: ['setup', 'onboarding', 'basics'],
          difficulty: 'beginner',
          estimatedTime: 10,
          lastUpdated: new Date(),
          author: 'Re:Commerce Team',
          views: 15420,
          helpful: 1420,
          rating: 4.8
        },
        {
          id: 'platform-overview',
          title: 'Platform Overview',
          content: `# Platform Overview

Re:Commerce Enterprise is a comprehensive business platform that integrates all aspects of your enterprise operations.

## Core Modules

### 1. Global Deployment & Architecture
- Multi-region deployment orchestration
- Cross-region failover systems
- CDN and edge computing
- International localization

### 2. AI & Advanced Analytics
- AI-powered business intelligence
- Predictive analytics and forecasting
- Machine learning operations
- Real-time data processing

### 3. Security & Compliance
- Zero-trust security architecture
- Advanced threat detection
- Compliance automation
- Enterprise governance

### 4. Performance & Optimization
- Real-time performance monitoring
- Auto-scaling infrastructure
- Performance optimization
- Resource management

### 5. Enterprise Integration
- API gateway and management
- Workflow automation
- Third-party integrations
- Custom development tools

## Key Features

- **Unified Dashboard**: Single pane of glass for all operations
- **Role-Based Access**: Granular permissions and security
- **Real-Time Monitoring**: Live system health and performance
- **Automated Workflows**: Streamlined business processes
- **Enterprise Support**: Dedicated support team

## Architecture

The platform is built on a modern, scalable architecture:

- **Microservices**: Independently deployable services
- **Cloud-Native**: Designed for cloud environments
- **Event-Driven**: Real-time event processing
- **API-First**: Everything accessible via APIs

## Getting Started

1. Complete the [Enterprise Onboarding](/onboarding)
2. Configure your [Security Settings](/security-center)
3. Set up [Global Deployment](/dashboard)
4. Enable [AI Analytics](/ai-analytics)
5. Configure [Integrations](/integrations-hub)

## Support Resources

- **Documentation**: Comprehensive guides and tutorials
- **API Reference**: Complete API documentation
- **Video Tutorials**: Step-by-step video guides
- **Community**: Connect with other enterprise users
- **Support**: 24/7 enterprise support team`,
          category: 'getting-started',
          tags: ['overview', 'architecture', 'features'],
          difficulty: 'beginner',
          estimatedTime: 15,
          lastUpdated: new Date(),
          author: 'Re:Commerce Team',
          views: 12340,
          helpful: 1120,
          rating: 4.7
        }
      ]
    },
    {
      id: 'user-guide',
      title: 'User Guide',
      description: 'Comprehensive user documentation',
      category: 'user-guide',
      icon: 'book',
      lastUpdated: new Date(),
      articles: [
        {
          id: 'dashboard-guide',
          title: 'Dashboard Guide',
          content: `# Dashboard Guide

The unified dashboard provides a comprehensive view of your enterprise operations.

## Dashboard Layout

### Header
- **Navigation**: Access to all major modules
- **Notifications**: Real-time alerts and updates
- **User Menu**: Profile and settings
- **Global Search**: Search across all systems

### Main Content
- **Overview Cards**: Key metrics and KPIs
- **System Status**: Health monitoring
- **Recent Activity**: Latest system events
- **Quick Actions**: Common tasks

### Sidebar
- **Module Navigation**: Quick access to features
- **System Health**: Real-time status
- **Recent Items**: Recently viewed content

## Key Features

### Real-Time Monitoring
- System health indicators
- Performance metrics
- Security alerts
- User activity

### Customizable Widgets
- Add/remove widgets
- Resize and reorder
- Custom data sources
- Personalized views

### Global Search
- Search across all modules
- Filter by content type
- Recent searches
- Saved searches

## Navigation

### Main Menu
- **Home**: Overview dashboard
- **Analytics**: Business intelligence
- **Security**: Security center
- **Performance**: Performance monitoring
- **Integrations**: Integration hub

### Breadcrumbs
- Current location
- Navigation history
- Quick navigation

### Contextual Actions
- Module-specific actions
- Bulk operations
- Export/import

## Personalization

### Themes
- Light/dark mode
- Custom color schemes
- Accessibility options

### Layout
- Widget arrangement
- Panel visibility
- Default views

### Preferences
- Notification settings
- Language preferences
- Time zone configuration

## Mobile Support

The dashboard is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized layouts
- Offline capabilities
- Push notifications

## Keyboard Shortcuts

- **Ctrl+K**: Global search
- **Ctrl+D**: Dashboard
- **Ctrl+A**: Analytics
- **Ctrl+S**: Security center
- **Ctrl+P**: Performance
- **Ctrl+I**: Integrations

## Tips and Best Practices

1. **Customize Your Dashboard**: Arrange widgets based on your workflow
2. **Use Keyboard Shortcuts**: Improve efficiency with hotkeys
3. **Set Up Alerts**: Configure notifications for important events
4. **Regular Health Checks**: Monitor system status regularly
5. **Stay Updated**: Check for new features and updates

## Troubleshooting

### Common Issues
- **Slow Loading**: Check network connection and system performance
- **Missing Data**: Verify data source connections
- **Permission Errors**: Check user roles and permissions
- **Widget Errors**: Refresh the dashboard or contact support

### Getting Help
- **Help Center**: Built-in help documentation
- **Support Chat**: Real-time assistance
- **Video Tutorials**: Step-by-step guides
- **Community Forums**: Connect with other users`,
          category: 'user-guide',
          tags: ['dashboard', 'navigation', 'interface'],
          difficulty: 'beginner',
          estimatedTime: 20,
          lastUpdated: new Date(),
          author: 'Re:Commerce Team',
          views: 8920,
          helpful: 820,
          rating: 4.6
        }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Complete API documentation',
      category: 'api',
      icon: 'code',
      lastUpdated: new Date(),
      articles: [
        {
          id: 'api-authentication',
          title: 'API Authentication',
          content: `# API Authentication

All API requests must be authenticated using API keys or OAuth tokens.

## API Keys

### Creating API Keys
1. Navigate to **Settings** → **API Keys**
2. Click **Create New API Key**
3. Configure permissions and expiration
4. Copy the API key securely

### Using API Keys
Include the API key in the request header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.re-commerce-enterprise.com/v1/endpoint
\`\`\`

## OAuth Authentication

### Authorization Flow
1. **Authorization Request**: Redirect user to authorization server
2. **User Consent**: User grants permission
3. **Authorization Code**: Receive authorization code
4. **Token Exchange**: Exchange code for access token
5. **API Access**: Use access token for API calls

### Example Flow

#### 1. Authorization Request
\`\`\`
GET /oauth/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=read:analytics+write:config
\`\`\`

#### 2. Token Exchange
\`\`\`bash
curl -X POST https://api.re-commerce-enterprise.com/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "code": "AUTHORIZATION_CODE",
    "redirect_uri": "YOUR_REDIRECT_URI"
  }'
\`\`\`

#### 3. API Request
\`\`\`bash
curl -H "Authorization: Bearer ACCESS_TOKEN" \\
  https://api.re-commerce-enterprise.com/v1/analytics
\`\`\`

## Rate Limiting

### Limits
- **Standard**: 1000 requests per hour
- **Premium**: 5000 requests per hour
- **Enterprise**: 10000 requests per hour

### Headers
- **X-RateLimit-Limit**: Request limit
- **X-RateLimit-Remaining**: Remaining requests
- **X-RateLimit-Reset**: Reset time

### Handling Rate Limits
\`\`\`javascript
if (response.status === 429) {
  const resetTime = response.headers['X-RateLimit-Reset'];
  const waitTime = resetTime - Date.now();
  setTimeout(() => retryRequest(), waitTime);
}
\`\`\`

## Error Handling

### HTTP Status Codes
- **200**: Success
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **429**: Rate Limited
- **500**: Internal Server Error

### Error Response Format
\`\`\`json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
\`\`\`

## Best Practices

1. **Secure Storage**: Store API keys securely
2. **Minimal Permissions**: Use least privilege principle
3. **Rate Limiting**: Implement exponential backoff
4. **Error Handling**: Handle all error responses
5. **Logging**: Log API requests for debugging
6. **Monitoring**: Monitor API usage and performance

## SDKs and Libraries

### Official SDKs
- **JavaScript/Node.js**: \`npm install @re-commerce/sdk\`
- **Python**: \`pip install re-commerce-sdk\`
- **Go**: \`go get github.com/re-commerce/go-sdk\`
- **Java**: Maven dependency available

### Community Libraries
- **PHP**: Community-maintained
- **Ruby**: Community-maintained
- **C#**: Community-maintained

## Support

For API support:
- **Documentation**: Complete API reference
- **Support Portal**: Submit tickets
- **Developer Forum**: Community discussions
- **Status Page**: API status and incidents`,
          category: 'api',
          tags: ['api', 'authentication', 'security'],
          difficulty: 'intermediate',
          estimatedTime: 25,
          lastUpdated: new Date(),
          author: 'Re:Commerce Team',
          views: 6540,
          helpful: 650,
          rating: 4.9
        }
      ]
    }
  ];
};

const generateAPIEndpoints = (): APIEndpoint[] => {
  return [
    {
      id: 'global-deployment',
      method: 'GET',
      path: '/api/global-deployment',
      description: 'Retrieve global deployment information',
      category: 'deployment',
      authentication: true,
      rateLimit: '1000/hour',
      deprecated: false,
      parameters: [
        {
          name: 'region',
          type: 'string',
          required: false,
          description: 'Filter by deployment region',
          example: 'us-east-1',
          validation: 'Valid AWS region'
        },
        {
          name: 'status',
          type: 'string',
          required: false,
          description: 'Filter by deployment status',
          example: 'active',
          validation: 'One of: active, pending, failed'
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Maximum number of results',
          example: 50,
          validation: 'Integer between 1 and 100'
        }
      ],
      responses: [
        {
          status: 200,
          description: 'Successful response',
          schema: {
            type: 'object',
            properties: {
              deployments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    region: { type: 'string' },
                    status: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' }
                  }
                }
              },
              total: { type: 'number' }
            }
          },
          example: {
            deployments: [
              {
                id: 'deploy-123',
                region: 'us-east-1',
                status: 'active',
                createdAt: '2023-01-01T00:00:00Z'
              }
            ],
            total: 1
          }
        },
        {
          status: 401,
          description: 'Unauthorized',
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          },
          example: {
            error: {
              code: 'UNAUTHORIZED',
              message: 'Invalid or missing API key'
            }
          }
        }
      ],
      examples: [
        {
          title: 'Basic Request',
          description: 'Get all deployments',
          request: {
            method: 'GET',
            url: '/api/global-deployment',
            headers: {
              'Authorization': 'Bearer YOUR_API_KEY'
            }
          },
          response: {
            status: 200,
            body: {
              deployments: [
                {
                  id: 'deploy-123',
                  region: 'us-east-1',
                  status: 'active',
                  createdAt: '2023-01-01T00:00:00Z'
                }
              ],
              total: 1
            }
          }
        },
        {
          title: 'Filtered Request',
          description: 'Get deployments for specific region',
          request: {
            method: 'GET',
            url: '/api/global-deployment?region=us-east-1&status=active',
            headers: {
              'Authorization': 'Bearer YOUR_API_KEY'
            }
          },
          response: {
            status: 200,
            body: {
              deployments: [
                {
                  id: 'deploy-123',
                  region: 'us-east-1',
                  status: 'active',
                  createdAt: '2023-01-01T00:00:00Z'
                }
              ],
              total: 1
            }
          }
        }
      ]
    },
    {
      id: 'ai-analytics',
      method: 'POST',
      path: '/api/ai-analytics',
      description: 'Generate AI-powered analytics insights',
      category: 'analytics',
      authentication: true,
      rateLimit: '100/hour',
      deprecated: false,
      parameters: [
        {
          name: 'type',
          type: 'string',
          required: true,
          description: 'Type of analysis to perform',
          example: 'predictive',
          validation: 'One of: predictive, anomaly, optimization, recommendations'
        },
        {
          name: 'data',
          type: 'object',
          required: true,
          description: 'Data for analysis',
          example: { revenue: 100000, users: 1000 },
          validation: 'Valid JSON object'
        },
        {
          name: 'timeframe',
          type: 'string',
          required: false,
          description: 'Analysis timeframe',
          example: '30d',
          validation: 'Format: {number}{unit} where unit is d, w, m, y'
        }
      ],
      responses: [
        {
          status: 200,
          description: 'Analysis completed successfully',
          schema: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              insights: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    metric: { type: 'string' },
                    value: { type: 'number' },
                    confidence: { type: 'number' },
                    recommendation: { type: 'string' }
                  }
                }
              },
              generatedAt: { type: 'string', format: 'date-time' }
            }
          },
          example: {
            type: 'predictive',
            insights: [
              {
                metric: 'revenue_forecast',
                value: 120000,
                confidence: 0.85,
                recommendation: 'Revenue is expected to grow by 20% next month'
              }
            ],
            generatedAt: '2023-01-01T00:00:00Z'
          }
        },
        {
          status: 400,
          description: 'Invalid request',
          schema: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                  details: { type: 'object' }
                }
              }
            }
          },
          example: {
            error: {
              code: 'INVALID_REQUEST',
              message: 'Missing required parameter: type',
              details: {
                field: 'type',
                issue: 'Required field is missing'
              }
            }
          }
        }
      ],
      examples: [
        {
          title: 'Predictive Analysis',
          description: 'Generate predictive insights',
          request: {
            method: 'POST',
            url: '/api/ai-analytics',
            headers: {
              'Authorization': 'Bearer YOUR_API_KEY',
              'Content-Type': 'application/json'
            },
            body: {
              type: 'predictive',
              data: {
                revenue: 100000,
                users: 1000,
                conversion: 0.05
              },
              timeframe: '30d'
            }
          },
          response: {
            status: 200,
            body: {
              type: 'predictive',
              insights: [
                {
                  metric: 'revenue_forecast',
                  value: 120000,
                  confidence: 0.85,
                  recommendation: 'Revenue is expected to grow by 20% next month'
                }
              ],
              generatedAt: '2023-01-01T00:00:00Z'
            }
          }
        }
      ]
    }
  ];
};

const generateTutorialVideos = (): TutorialVideo[] => {
  return [
    {
      id: 'getting-started-video',
      title: 'Getting Started with Re:Commerce Enterprise',
      description: 'Complete walkthrough of the platform setup and basic configuration',
      duration: 900, // 15 minutes
      thumbnail: 'https://cdn.boldbi.com/wp/blogs/best-marketing/website-analytics-dashboard.png',
      videoUrl: 'https://video.re-commerce-enterprise.com/getting-started',
      category: 'getting-started',
      difficulty: 'beginner',
      tags: ['setup', 'onboarding', 'basics'],
      views: 25430,
      likes: 2150,
      transcript: 'Welcome to Re:Commerce Enterprise. In this video, we\'ll walk through the complete setup process...'
    },
    {
      id: 'ai-analytics-tutorial',
      title: 'AI Analytics Deep Dive',
      description: 'Learn how to leverage AI-powered analytics for business insights',
      duration: 1200, // 20 minutes
      thumbnail: 'https://www.slideteam.net/media/catalog/product/cache/1280x720/a/r/artificial_intelligence_dashboard_showing_hyperautomation_industry_report_slide01.jpg',
      videoUrl: 'https://video.re-commerce-enterprise.com/ai-analytics',
      category: 'analytics',
      difficulty: 'intermediate',
      tags: ['ai', 'analytics', 'insights'],
      views: 18920,
      likes: 1670,
      transcript: 'AI Analytics provides powerful insights into your business data...'
    },
    {
      id: 'security-setup',
      title: 'Advanced Security Configuration',
      description: 'Complete guide to setting up enterprise-grade security',
      duration: 1800, // 30 minutes
      thumbnail: 'https://thumbs.dreamstime.com/z/data-analytics-network-monitoring-visuals-advanced-cybersecurity-dashboard-encryption-shield-highlighting-digital-309252111.jpg?w=992',
      videoUrl: 'https://video.re-commerce-enterprise.com/security-setup',
      category: 'security',
      difficulty: 'advanced',
      tags: ['security', 'compliance', 'configuration'],
      views: 12340,
      likes: 1120,
      transcript: 'Security is paramount in enterprise environments...'
    }
  ];
};

const generateFAQs = (): FAQ[] => {
  return [
    {
      id: 'faq-1',
      question: 'How do I get started with Re:Commerce Enterprise?',
      answer: 'Getting started is easy! First, complete the enterprise onboarding process, then configure your basic settings, add your team members, and enable the features you need. Our Quick Start Guide provides step-by-step instructions.',
      category: 'getting-started',
      tags: ['onboarding', 'setup', 'basics'],
      views: 15420,
      helpful: 1420,
      lastUpdated: new Date()
    },
    {
      id: 'faq-2',
      question: 'What are the system requirements?',
      answer: 'Re:Commerce Enterprise is a cloud-based platform that works with any modern web browser. For optimal performance, we recommend Chrome, Firefox, Safari, or Edge. No software installation is required.',
      category: 'technical',
      tags: ['requirements', 'browser', 'performance'],
      views: 12340,
      helpful: 1120,
      lastUpdated: new Date()
    },
    {
      id: 'faq-3',
      question: 'How do I integrate with existing systems?',
      answer: 'Re:Commerce Enterprise provides comprehensive integration capabilities through our API gateway, pre-built connectors, and custom integration tools. Visit the Integration Hub to configure connections to your existing systems.',
      category: 'integration',
      tags: ['api', 'integration', 'connectors'],
      views: 9870,
      helpful: 890,
      lastUpdated: new Date()
    },
    {
      id: 'faq-4',
      question: 'What security measures are in place?',
      answer: 'We implement enterprise-grade security including zero-trust architecture, multi-factor authentication, end-to-end encryption, compliance monitoring, and 24/7 security operations center. All data is encrypted at rest and in transit.',
      category: 'security',
      tags: ['security', 'compliance', 'encryption'],
      views: 8760,
      helpful: 820,
      lastUpdated: new Date()
    },
    {
      id: 'faq-5',
      question: 'How does pricing work?',
      answer: 'Re:Commerce Enterprise offers flexible pricing based on your needs. Contact our sales team for a custom quote based on your user count, feature requirements, and deployment preferences.',
      category: 'billing',
      tags: ['pricing', 'billing', 'subscription'],
      views: 11230,
      helpful: 1050,
      lastUpdated: new Date()
    }
  ];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let response: any = {};

    if (type === 'all' || type === 'sections') {
      let sections = generateDocumentationSections();
      
      if (category) {
        sections = sections.filter(section => section.category === category);
      }
      
      if (search) {
        sections = sections.filter(section => 
          section.title.toLowerCase().includes(search.toLowerCase()) ||
          section.description.toLowerCase().includes(search.toLowerCase()) ||
          section.articles.some(article => 
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.content.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
      
      response.sections = sections;
    }

    if (type === 'all' || type === 'api') {
      response.apiEndpoints = generateAPIEndpoints();
    }

    if (type === 'all' || type === 'videos') {
      response.tutorialVideos = generateTutorialVideos();
    }

    if (type === 'all' || type === 'faq') {
      let faqs = generateFAQs();
      
      if (category) {
        faqs = faqs.filter(faq => faq.category === category);
      }
      
      if (search) {
        faqs = faqs.filter(faq => 
          faq.question.toLowerCase().includes(search.toLowerCase()) ||
          faq.answer.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      response.faqs = faqs;
    }

    if (type === 'all' || type === 'stats') {
      const sections = generateDocumentationSections();
      const totalArticles = sections.reduce((sum, section) => sum + section.articles.length, 0);
      const totalViews = sections.reduce((sum, section) => 
        sum + section.articles.reduce((articleSum, article) => articleSum + article.views, 0), 0
      );
      const totalHelpful = sections.reduce((sum, section) => 
        sum + section.articles.reduce((articleSum, article) => articleSum + article.helpful, 0), 0
      );

      response.stats = {
        totalSections: sections.length,
        totalArticles,
        totalViews,
        totalHelpful,
        totalAPIEndpoints: generateAPIEndpoints().length,
        totalVideos: generateTutorialVideos().length,
        totalFAQs: generateFAQs().length
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Documentation API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documentation data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, articleId, helpful, rating, feedback } = body;

    if (action === 'helpful') {
      // Update helpful count
      return NextResponse.json({ 
        message: 'Feedback recorded',
        helpful: true 
      });
    }

    if (action === 'rate') {
      // Update rating
      return NextResponse.json({ 
        message: 'Rating recorded',
        rating: rating 
      });
    }

    if (action === 'feedback') {
      // Store feedback
      return NextResponse.json({ 
        message: 'Feedback submitted successfully',
        feedbackId: `feedback-${Date.now()}`
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Documentation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
