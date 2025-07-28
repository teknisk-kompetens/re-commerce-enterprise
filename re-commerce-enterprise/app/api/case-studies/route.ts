
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const company_size = searchParams.get('company_size');
    const solution_type = searchParams.get('solution_type');

    // Mock case studies data
    const caseStudies = [
      {
        id: 'cs-001',
        title: 'Global Retailer Increases Revenue by 127% with AI-Powered Analytics',
        company: {
          name: 'TechMart Global',
          industry: 'retail',
          size: 'enterprise',
          employees: 25000,
          revenue: '$8.5B',
          headquarters: 'New York, USA'
        },
        challenge: {
          summary: 'Fragmented data across 500+ stores, manual inventory management, and limited customer insights were constraining growth.',
          painPoints: [
            'Inventory stockouts costing $2.3M monthly',
            'Manual reporting taking 40 hours per week',
            'Customer data silos preventing personalization',
            'Delayed decision-making due to data latency'
          ]
        },
        solution: {
          modules: ['Advanced Analytics', 'AI Insights', 'Inventory Optimization', 'Customer Intelligence'],
          implementation_time: '6 weeks',
          key_features: [
            'Real-time inventory tracking across all locations',
            'Predictive demand forecasting',
            'Customer behavior analytics',
            'Automated reordering system',
            'Personalized marketing campaigns'
          ]
        },
        results: {
          timeline: '12 months',
          metrics: [
            { metric: 'Revenue Growth', value: '+127%', description: 'Year-over-year increase' },
            { metric: 'Inventory Costs', value: '-34%', description: 'Reduced carrying costs' },
            { metric: 'Customer Satisfaction', value: '+42%', description: 'NPS score improvement' },
            { metric: 'Operational Efficiency', value: '+78%', description: 'Process automation' },
            { metric: 'Time to Market', value: '-56%', description: 'New product launches' }
          ],
          roi: {
            investment: 890000,
            annual_savings: 3200000,
            payback_period: 3.3, // months
            three_year_roi: 847 // percentage
          }
        },
        testimonial: {
          quote: "Re-Commerce Enterprise transformed our operations completely. The AI-powered insights have revolutionized how we manage inventory and understand our customers. The ROI exceeded our expectations within the first quarter.",
          author: "Jennifer Martinez",
          title: "Chief Operations Officer",
          photo: "/api/placeholder/64/64"
        },
        featured_image: "/api/placeholder/800/400",
        created_at: new Date('2024-01-15'),
        tags: ['retail', 'ai-analytics', 'inventory-management', 'customer-intelligence']
      },
      {
        id: 'cs-002',
        title: 'Healthcare Network Achieves 99.9% Compliance with Automated Workflows',
        company: {
          name: 'MedCare Systems',
          industry: 'healthcare',
          size: 'enterprise',
          employees: 15000,
          revenue: '$3.2B',
          headquarters: 'Chicago, USA'
        },
        challenge: {
          summary: 'Complex regulatory requirements, manual compliance tracking, and fragmented patient data across 50 facilities.',
          painPoints: [
            'HIPAA compliance audit failures',
            'Manual documentation consuming 30% of staff time',
            'Patient data inconsistencies affecting care quality',
            'Regulatory reporting delays and errors'
          ]
        },
        solution: {
          modules: ['Compliance Suite', 'Workflow Automation', 'Data Governance', 'Security Center'],
          implementation_time: '8 weeks',
          key_features: [
            'HIPAA-compliant data handling',
            'Automated compliance monitoring',
            'Patient data unification',
            'Audit trail tracking',
            'Real-time reporting dashboards'
          ]
        },
        results: {
          timeline: '18 months',
          metrics: [
            { metric: 'Compliance Score', value: '99.9%', description: 'Regulatory adherence' },
            { metric: 'Documentation Time', value: '-67%', description: 'Reduced manual work' },
            { metric: 'Patient Satisfaction', value: '+38%', description: 'Improved care quality' },
            { metric: 'Audit Preparation', value: '-89%', description: 'Time reduction' },
            { metric: 'Data Accuracy', value: '+94%', description: 'Error reduction' }
          ],
          roi: {
            investment: 1200000,
            annual_savings: 2800000,
            payback_period: 5.1,
            three_year_roi: 600
          }
        },
        testimonial: {
          quote: "The compliance automation has been a game-changer. We've eliminated manual processes that were error-prone and time-consuming. Our audit scores have never been better.",
          author: "Dr. Robert Chen",
          title: "Chief Medical Officer",
          photo: "/api/placeholder/64/64"
        },
        featured_image: "/api/placeholder/800/400",
        created_at: new Date('2024-01-10'),
        tags: ['healthcare', 'compliance', 'automation', 'data-governance']
      },
      {
        id: 'cs-003',
        title: 'Financial Services Firm Reduces Risk by 73% with AI-Powered Monitoring',
        company: {
          name: 'Capital Trust Bank',
          industry: 'finance',
          size: 'enterprise',
          employees: 8500,
          revenue: '$2.1B',
          headquarters: 'London, UK'
        },
        challenge: {
          summary: 'Increasing fraud losses, manual risk assessment processes, and regulatory pressure for real-time monitoring.',
          painPoints: [
            'Fraud losses of $5.2M annually',
            'Manual risk assessments taking 3-5 days',
            'Limited real-time transaction monitoring',
            'Regulatory reporting inefficiencies'
          ]
        },
        solution: {
          modules: ['Risk Management', 'Fraud Detection', 'Real-time Analytics', 'Regulatory Reporting'],
          implementation_time: '10 weeks',
          key_features: [
            'Real-time fraud detection algorithms',
            'Automated risk scoring',
            'Transaction monitoring dashboard',
            'Regulatory compliance automation',
            'Customer behavior analytics'
          ]
        },
        results: {
          timeline: '15 months',
          metrics: [
            { metric: 'Fraud Reduction', value: '-73%', description: 'Prevented losses' },
            { metric: 'Risk Assessment Speed', value: '+89%', description: 'Faster decisions' },
            { metric: 'False Positives', value: '-45%', description: 'Improved accuracy' },
            { metric: 'Compliance Costs', value: '-52%', description: 'Operational savings' },
            { metric: 'Customer Experience', value: '+31%', description: 'Reduced friction' }
          ],
          roi: {
            investment: 1500000,
            annual_savings: 4100000,
            payback_period: 4.4,
            three_year_roi: 720
          }
        },
        testimonial: {
          quote: "The AI-powered risk management has transformed our operations. We're now detecting fraud in real-time and making risk decisions in minutes instead of days.",
          author: "Sarah Williams",
          title: "Head of Risk Management",
          photo: "/api/placeholder/64/64"
        },
        featured_image: "/api/placeholder/800/400",
        created_at: new Date('2024-01-08'),
        tags: ['finance', 'risk-management', 'fraud-detection', 'ai-monitoring']
      },
      {
        id: 'cs-004',
        title: 'Manufacturing Giant Optimizes Supply Chain with Predictive Analytics',
        company: {
          name: 'Industrial Solutions Corp',
          industry: 'manufacturing',
          size: 'enterprise',
          employees: 32000,
          revenue: '$12.3B',
          headquarters: 'Detroit, USA'
        },
        challenge: {
          summary: 'Supply chain disruptions, unpredictable maintenance costs, and quality control issues across 75 facilities worldwide.',
          painPoints: [
            'Unplanned downtime costing $3.1M monthly',
            'Supply chain visibility gaps',
            'Quality defects affecting customer satisfaction',
            'Manual maintenance scheduling inefficiencies'
          ]
        },
        solution: {
          modules: ['Supply Chain Analytics', 'Predictive Maintenance', 'Quality Control', 'IoT Integration'],
          implementation_time: '12 weeks',
          key_features: [
            'IoT sensor integration',
            'Predictive maintenance algorithms',
            'Supply chain visibility dashboard',
            'Quality control automation',
            'Production optimization'
          ]
        },
        results: {
          timeline: '24 months',
          metrics: [
            { metric: 'Unplanned Downtime', value: '-67%', description: 'Reduced outages' },
            { metric: 'Maintenance Costs', value: '-41%', description: 'Predictive approach' },
            { metric: 'Quality Score', value: '+58%', description: 'Defect reduction' },
            { metric: 'Supply Chain Efficiency', value: '+44%', description: 'Optimized logistics' },
            { metric: 'Overall Equipment Effectiveness', value: '+36%', description: 'Production improvement' }
          ],
          roi: {
            investment: 2800000,
            annual_savings: 6200000,
            payback_period: 5.4,
            three_year_roi: 564
          }
        },
        testimonial: {
          quote: "The predictive analytics have revolutionized our manufacturing operations. We're now preventing equipment failures before they happen and optimizing our entire supply chain.",
          author: "Michael Thompson",
          title: "VP of Manufacturing Operations",
          photo: "/api/placeholder/64/64"
        },
        featured_image: "/api/placeholder/800/400", 
        created_at: new Date('2024-01-05'),
        tags: ['manufacturing', 'predictive-analytics', 'supply-chain', 'iot-integration']
      }
    ];

    // Filter case studies based on query parameters
    let filteredCaseStudies = caseStudies;

    if (industry && industry !== 'all') {
      filteredCaseStudies = filteredCaseStudies.filter(cs => cs.company.industry === industry);
    }

    if (company_size && company_size !== 'all') {
      filteredCaseStudies = filteredCaseStudies.filter(cs => cs.company.size === company_size);
    }

    const response = {
      case_studies: filteredCaseStudies,
      meta: {
        total: filteredCaseStudies.length,
        industries: [...new Set(caseStudies.map(cs => cs.company.industry))],
        company_sizes: [...new Set(caseStudies.map(cs => cs.company.size))],
        solution_types: [...new Set(caseStudies.flatMap(cs => cs.solution.modules))]
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Case studies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}
