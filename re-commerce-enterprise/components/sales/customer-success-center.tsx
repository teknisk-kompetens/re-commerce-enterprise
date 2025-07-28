
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  User, 
  Search, 
  Filter, 
  Star, 
  ThumbsUp, 
  Download, 
  Share2, 
  Video, 
  FileText, 
  Headphones, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowRight,
  Lightbulb,
  Target,
  Award,
  Users,
  Zap,
  Shield,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Button } from '@/components/ui/button-enhanced';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive' | 'checklist';
  duration: number; // minutes
  completed: boolean;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: Date;
  updated_at: Date;
  category: string;
  assigned_to?: string;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful_votes: number;
  created_at: Date;
  updated_at: Date;
  author: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful_count: number;
  views: number;
}

export function CustomerSuccessCenter() {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [showTicketForm, setShowTicketForm] = useState(false);

  const [onboardingSteps] = useState<OnboardingStep[]>([
    {
      id: '1',
      title: 'Welcome to Re-Commerce Enterprise',
      description: 'Get started with your new platform in under 10 minutes',
      type: 'video',
      duration: 8,
      completed: true,
      category: 'getting-started',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Setting up Your Dashboard',
      description: 'Customize your workspace and configure key metrics',
      type: 'interactive',
      duration: 15,
      completed: true,
      category: 'configuration',
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: 'Understanding Analytics',
      description: 'Learn to interpret your business intelligence data',
      type: 'article',
      duration: 12,
      completed: false,
      category: 'analytics',
      difficulty: 'intermediate'
    },
    {
      id: '4',
      title: 'Security Best Practices',
      description: 'Configure enterprise-grade security settings',
      type: 'checklist',
      duration: 20,
      completed: false,
      category: 'security',
      difficulty: 'advanced'
    },
    {
      id: '5',
      title: 'API Integration Guide',
      description: 'Connect your existing systems seamlessly',
      type: 'article',
      duration: 25,
      completed: false,
      category: 'integration',
      difficulty: 'advanced'
    }
  ]);

  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: 'T001',
      subject: 'Dashboard loading slowly',
      status: 'in-progress',
      priority: 'medium',
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-21'),
      category: 'performance',
      assigned_to: 'Technical Support'
    },
    {
      id: 'T002',
      subject: 'Unable to export reports',
      status: 'resolved',
      priority: 'high',
      created_at: new Date('2024-01-18'),
      updated_at: new Date('2024-01-19'),
      category: 'features',
      assigned_to: 'Sarah Johnson'
    }
  ]);

  const [knowledgeBase] = useState<KnowledgeArticle[]>([
    {
      id: 'KB001',
      title: 'How to Create Custom Dashboards',
      content: 'Step-by-step guide to building personalized dashboards...',
      category: 'dashboards',
      tags: ['dashboard', 'customization', 'getting-started'],
      views: 1247,
      helpful_votes: 89,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-15'),
      author: 'Product Team'
    },
    {
      id: 'KB002',
      title: 'Advanced Analytics Features',
      content: 'Explore advanced analytics capabilities including...',
      category: 'analytics',
      tags: ['analytics', 'reporting', 'advanced'],
      views: 892,
      helpful_votes: 67,
      created_at: new Date('2023-12-15'),
      updated_at: new Date('2024-01-10'),
      author: 'Analytics Team'
    }
  ]);

  const [faqs] = useState<FAQ[]>([
    {
      id: 'FAQ001',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click on the "Forgot Password" link on the login page...',
      category: 'account',
      helpful_count: 145,
      views: 2341
    },
    {
      id: 'FAQ002',
      question: 'Can I export data in different formats?',
      answer: 'Yes, our platform supports exporting data in CSV, Excel, PDF, and JSON formats...',
      category: 'data-export',
      helpful_count: 98,
      views: 1876
    },
    {
      id: 'FAQ003',
      question: 'How do I invite team members?',
      answer: 'Navigate to Settings > Team Management and click "Invite Member"...',
      category: 'team-management',
      helpful_count: 76,
      views: 1542
    }
  ]);

  useEffect(() => {
    const completedSteps = onboardingSteps.filter(step => step.completed).length;
    const progressPercentage = (completedSteps / onboardingSteps.length) * 100;
    setOnboardingProgress(progressPercentage);
  }, [onboardingSteps]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'interactive': return Zap;
      case 'checklist': return CheckCircle2;
      default: return BookOpen;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in-progress': return 'outline';
      case 'resolved': return 'default';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'outline';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
              Customer Success Center
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Everything you need to succeed with Re-Commerce Enterprise. From onboarding guides 
              to expert support, we're here to help you achieve your goals.
            </p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { 
              title: 'Onboarding Progress', 
              value: `${Math.round(onboardingProgress)}%`, 
              icon: Target, 
              color: 'primary' 
            },
            { 
              title: 'Knowledge Articles', 
              value: knowledgeBase.length.toString(), 
              icon: BookOpen, 
              color: 'success' 
            },
            { 
              title: 'Active Tickets', 
              value: supportTickets.filter(t => t.status !== 'closed').length.toString(), 
              icon: MessageSquare, 
              color: 'warning' 
            },
            { 
              title: 'Success Score', 
              value: '92%', 
              icon: Award, 
              color: 'success' 
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.title}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding" className="space-y-8">
            {/* Progress Overview */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Your Onboarding Journey</span>
                  </div>
                  <Badge variant="secondary">
                    {onboardingSteps.filter(s => s.completed).length} of {onboardingSteps.length} completed
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round(onboardingProgress)}%</span>
                  </div>
                  <Progress value={onboardingProgress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {onboardingSteps.map((step, index) => {
                    const TypeIcon = getTypeIcon(step.type);
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          variant={step.completed ? 'success' : 'default'}
                          interactive
                          className="h-full"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <TypeIcon className="h-4 w-4" />
                                <Badge variant={step.difficulty === 'beginner' ? 'default' : step.difficulty === 'intermediate' ? 'outline' : 'destructive'}>
                                  {step.difficulty}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-neutral-600">
                                <Clock className="h-3 w-3" />
                                <span>{step.duration}min</span>
                              </div>
                            </div>
                            
                            <h4 className="font-semibold mb-2">{step.title}</h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                              {step.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              {step.completed ? (
                                <div className="flex items-center text-success-600">
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  <span className="text-sm font-medium">Completed</span>
                                </div>
                              ) : (
                                <Button size="sm" className="w-full">
                                  <Play className="h-4 w-4 mr-2" />
                                  Start
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Schedule Onboarding Call</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Get personalized guidance from our success team
                  </p>
                  <Button className="w-full">
                    Book Meeting
                  </Button>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-success-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Join Community</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Connect with other customers and share best practices
                  </p>
                  <Button variant="outline" className="w-full">
                    Join Now
                  </Button>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-6 w-6 text-warning-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Quick Start Guide</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Download our comprehensive quick start PDF
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-8">
            {/* Search and Filter */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        placeholder="Search knowledge base..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="getting-started">Getting Started</SelectItem>
                      <SelectItem value="dashboards">Dashboards</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {knowledgeBase.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" interactive className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight mb-2">
                            {article.title}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-neutral-600">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{article.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{article.helpful_votes}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{article.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3">
                        {article.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-neutral-600">
                          By {article.author}
                        </div>
                        <Button size="sm">
                          Read More
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-8">
            {/* Support Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Create Ticket',
                  description: 'Get help from our support team',
                  icon: MessageSquare,
                  color: 'primary',
                  action: () => setShowTicketForm(true)
                },
                {
                  title: 'Schedule Call',
                  description: 'Book a call with our experts',
                  icon: Phone,
                  color: 'success'
                },
                {
                  title: 'Live Chat',
                  description: 'Chat with support now',
                  icon: Headphones,
                  color: 'warning'
                },
                {
                  title: 'Email Support',
                  description: 'Send us an email',
                  icon: Mail,
                  color: 'error'
                }
              ].map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" interactive onClick={option.action}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 bg-${option.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <option.icon className={`h-6 w-6 text-${option.color}-600`} />
                      </div>
                      <h3 className="font-semibold mb-2">{option.title}</h3>
                      <p className="text-sm text-neutral-600">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Existing Tickets */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{ticket.subject}</h4>
                            <Badge variant={getStatusColor(ticket.status) as any}>
                              {ticket.status}
                            </Badge>
                            <Badge variant={getPriorityColor(ticket.priority) as any}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-neutral-600">
                            <span>#{ticket.id}</span>
                            <span>{ticket.category}</span>
                            <span>Created {ticket.created_at.toLocaleDateString()}</span>
                            {ticket.assigned_to && (
                              <span>Assigned to {ticket.assigned_to}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Form Modal */}
            <AnimatePresence>
              {showTicketForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                  onClick={() => setShowTicketForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="Brief description of your issue" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="general">General Question</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Please provide detailed information about your issue..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <Button 
                        onClick={() => setShowTicketForm(false)}
                        className="flex-1"
                      >
                        Submit Ticket
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowTicketForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold flex-1 pr-4">
                          {faq.question}
                        </h3>
                        <Badge variant="outline">{faq.category}</Badge>
                      </div>
                      
                      <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                        {faq.answer}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-neutral-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{faq.helpful_count} helpful</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{faq.views} views</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Was this helpful?
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Video Tutorials',
                  description: 'Step-by-step video guides',
                  icon: Video,
                  count: 24,
                  color: 'primary'
                },
                {
                  title: 'Documentation',
                  description: 'Comprehensive platform docs',
                  icon: FileText,
                  count: 156,
                  color: 'success'
                },
                {
                  title: 'Webinar Recordings',
                  description: 'Expert-led training sessions',
                  icon: Play,
                  count: 12,
                  color: 'warning'
                },
                {
                  title: 'Best Practices',
                  description: 'Industry best practices guide',
                  icon: Lightbulb,
                  count: 8,
                  color: 'error'
                },
                {
                  title: 'API Reference',
                  description: 'Complete API documentation',
                  icon: BookOpen,
                  count: 45,
                  color: 'primary'
                },
                {
                  title: 'Case Studies',
                  description: 'Real customer success stories',
                  icon: Award,
                  count: 16,
                  color: 'success'
                }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" interactive className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 bg-${resource.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <resource.icon className={`h-6 w-6 text-${resource.color}-600`} />
                      </div>
                      <h3 className="font-semibold mb-2">{resource.title}</h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        {resource.description}
                      </p>
                      <Badge variant="secondary" className="mb-4">
                        {resource.count} resources
                      </Badge>
                      <Button size="sm" className="w-full">
                        Explore
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
