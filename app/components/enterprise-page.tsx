
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  Globe,
  Lock,
  Headphones,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function EnterprisePage() {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with advanced encryption, SSO integration, and granular permissions',
      benefits: ['GDPR Compliant', 'ISO 27001 Certified', 'Advanced Encryption', 'Audit Logs']
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Sub-second search results with 99.9% uptime and global CDN distribution',
      benefits: ['< 0.5s Response Time', '99.9% Uptime SLA', 'Global CDN', 'Auto Scaling']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Advanced team features with role-based access, shared workspaces, and real-time collaboration',
      benefits: ['Role-Based Access', 'Team Workspaces', 'Real-time Sync', 'Activity Tracking']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights with custom dashboards, usage analytics, and ROI tracking',
      benefits: ['Custom Dashboards', 'Usage Analytics', 'ROI Tracking', 'Export Reports']
    },
    {
      icon: Globe,
      title: 'Multi-tenant Architecture',
      description: 'Isolated environments for different departments with centralized management',
      benefits: ['Department Isolation', 'Centralized Admin', 'Custom Branding', 'White Label']
    },
    {
      icon: Headphones,
      title: 'Premium Support',
      description: '24/7 dedicated support with SLA guarantee, onboarding, and success management',
      benefits: ['24/7 Support', 'Dedicated CSM', 'Priority Response', 'Onboarding']
    }
  ];

  const plans = [
    {
      name: 'Professional',
      price: '€49',
      period: 'per user/month',
      description: 'Perfect for growing teams',
      features: [
        'Advanced AI Search',
        'Up to 50 users',
        'Basic analytics',
        'Email support',
        'API access',
        'Standard security'
      ],
      popular: false
    },
    {
      name: 'Enterprise',
      price: '€99',
      period: 'per user/month',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'Unlimited users',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Advanced security',
        'Dedicated CSM'
      ],
      popular: true
    },
    {
      name: 'Custom',
      price: 'Contact us',
      period: 'for pricing',
      description: 'Tailored for your needs',
      features: [
        'Everything in Enterprise',
        'Custom deployment',
        'On-premise options',
        'White label solution',
        'Custom AI training',
        'SLA guarantees'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      quote: "Mr. RE:commerce transformed how our 500+ person organization finds and shares knowledge. Search times reduced by 80%.",
      author: "Sarah Johnson",
      title: "CTO",
      company: "TechCorp International"
    },
    {
      quote: "The AI assistants understand our business context perfectly. It's like having domain experts available 24/7.",
      author: "Michael Chen",
      title: "Head of Operations",
      company: "Global Solutions Ltd"
    },
    {
      quote: "Implementation was seamless and the analytics help us understand how knowledge flows through our organization.",
      author: "Elena Rodriguez",
      title: "Chief Knowledge Officer",
      company: "Innovation Partners"
    }
  ];

  const integrations = [
    'Microsoft 365', 'Google Workspace', 'Slack', 'Salesforce', 
    'Confluence', 'Jira', 'SharePoint', 'Notion', 'Dropbox', 
    'Box', 'AWS', 'Azure', 'ServiceNow', 'Zendesk'
  ];

  return (
    <div className="py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Enterprise-Ready{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Intelligent Search
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Empower your organization with AI-driven search, advanced analytics, 
              and enterprise-grade security. Scale knowledge discovery across thousands of users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
            <p className="text-lg text-muted-foreground">
              Built for scale, security, and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Flexible plans that scale with your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="py-4">
                      <div className="text-4xl font-bold">{plan.price}</div>
                      <div className="text-muted-foreground">{plan.period}</div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full mb-6" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.name === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground">
              Trusted by leading organizations worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}, {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Integrations */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-lg text-muted-foreground">
              Connect with your existing tools and workflows
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                {integration}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Enterprise Search?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of organizations using Mr. RE:commerce to unlock 
                the power of intelligent search and AI-driven insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8">
                  Start 30-Day Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Book a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
