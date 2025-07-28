
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Brain, 
  Target, 
  Activity, 
  Layers, 
  Settings, 
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  Eye,
  ArrowRight,
  Lightbulb,
  Zap
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface AIPersonalizationOverviewPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AIPersonalizationOverviewPage({ 
  searchParams 
}: AIPersonalizationOverviewPageProps) {
  const userId = searchParams?.userId as string || "user_123";
  const tenantId = searchParams?.tenantId as string || "tenant_123";

  const features = [
    {
      title: "AI-Powered Dashboard",
      description: "Comprehensive personalization overview with AI insights, real-time recommendations, and user behavior analysis.",
      icon: Brain,
      href: `/ai-personalization/dashboard?userId=${userId}&tenantId=${tenantId}`,
      color: "bg-blue-500",
      features: ["Real-time personalization", "AI insights", "Behavior tracking", "Context awareness"]
    },
    {
      title: "Recommendation Engine",
      description: "Advanced AI recommendation system with multiple algorithms, A/B testing, and performance tracking.",
      icon: Target,
      href: `/ai-personalization/recommendations?userId=${userId}&tenantId=${tenantId}`,
      color: "bg-purple-500",
      features: ["Collaborative filtering", "Content-based recommendations", "Hybrid algorithms", "Performance analytics"]
    },
    {
      title: "Behavior Analytics", 
      description: "Deep behavioral analysis with AI-powered insights, pattern recognition, and predictive analytics.",
      icon: Activity,
      href: `/ai-personalization/behavior-analytics?userId=${userId}&tenantId=${tenantId}`,
      color: "bg-green-500",
      features: ["Behavior pattern analysis", "Engagement tracking", "Churn prediction", "AI insights"]
    },
    {
      title: "Dynamic Content Manager",
      description: "AI-powered content personalization with automatic optimization and A/B testing capabilities.",
      icon: Layers,
      href: `/ai-personalization/content-manager?userId=${userId}&tenantId=${tenantId}`,
      color: "bg-indigo-500",
      features: ["Content personalization", "AI optimization", "A/B testing", "Performance tracking"]
    },
    {
      title: "Personalization Settings",
      description: "Comprehensive privacy controls, preference management, and GDPR-compliant data handling.",
      icon: Settings,
      href: `/ai-personalization/settings?userId=${userId}&tenantId=${tenantId}`,
      color: "bg-gray-500",
      features: ["Privacy controls", "Preference management", "Data export", "GDPR compliance"]
    }
  ];

  const stats = [
    { label: "AI Models", value: "8+", icon: Brain, color: "text-blue-600" },
    { label: "Personalization Features", value: "15+", icon: Sparkles, color: "text-purple-600" },
    { label: "Data Points Analyzed", value: "1M+", icon: BarChart3, color: "text-green-600" },
    { label: "User Segments", value: "10+", icon: Users, color: "text-orange-600" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white mb-8">
        <div className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">AI-Powered Personalization</h1>
            <p className="text-xl text-blue-100 mb-6">
              Transform user experiences with intelligent personalization powered by advanced machine learning, 
              real-time behavior analysis, and adaptive content optimization.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 text-white border-white/30">Machine Learning</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Real-time Analytics</Badge>
              <Badge className="bg-white/20 text-white border-white/30">GDPR Compliant</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Enterprise Ready</Badge>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">AI Personalization Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href={feature.href}>
                    <Button className="w-full group-hover:bg-primary/90">
                      <span>Explore Feature</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Technical Capabilities */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>AI & Machine Learning Capabilities</span>
          </CardTitle>
          <CardDescription>
            Advanced AI technologies powering intelligent personalization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-blue-600">Recommendation Algorithms</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Collaborative Filtering</li>
                <li>• Content-Based Filtering</li>
                <li>• Hybrid Recommendations</li>
                <li>• Deep Learning Models</li>
                <li>• Contextual AI</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-green-600">Behavioral Analysis</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Real-time Event Tracking</li>
                <li>• Pattern Recognition</li>
                <li>• Churn Prediction</li>
                <li>• Engagement Scoring</li>
                <li>• Journey Analysis</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-600">Optimization Features</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• A/B Testing Framework</li>
                <li>• Content Optimization</li>
                <li>• Performance Analytics</li>
                <li>• Statistical Analysis</li>
                <li>• Automated Insights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <span>Get Started with AI Personalization</span>
          </CardTitle>
          <CardDescription>
            Quick access to key personalization features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/ai-personalization/dashboard?userId=${userId}&tenantId=${tenantId}`}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="font-medium">View Dashboard</span>
                <span className="text-xs text-gray-600">See personalization overview</span>
              </Button>
            </Link>
            
            <Link href={`/ai-personalization/recommendations?userId=${userId}&tenantId=${tenantId}`}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                <Target className="h-6 w-6 text-purple-600" />
                <span className="font-medium">AI Recommendations</span>
                <span className="text-xs text-gray-600">Get personalized suggestions</span>
              </Button>
            </Link>
            
            <Link href={`/ai-personalization/settings?userId=${userId}&tenantId=${tenantId}`}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                <Settings className="h-6 w-6 text-gray-600" />
                <span className="font-medium">Privacy Settings</span>
                <span className="text-xs text-gray-600">Manage your preferences</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
