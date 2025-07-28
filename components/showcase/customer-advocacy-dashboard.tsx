
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Star,
  TrendingUp,
  Award,
  Gift,
  Target,
  Trophy,
  Crown,
  Heart,
  Handshake,
  Share2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  Edit,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Download,
  Upload,
  Settings,
  CheckCircle,
  Zap,
  AlertCircle,
  DollarSign,
  Percent,
  Hash,
  Flag,
  Send,
  Eye,
  MessageSquare,
  Building2,
  Globe,
  Activity,
  Coins,
  Medal,
  GamepadIcon,
  UserCheck,
  UserPlus,
  Sparkles,
  Rocket,
  Megaphone,
  ShoppingBag,
  CreditCard,
  Timer,
  RefreshCw
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import recharts for data visualization
import {
  LineChart,
  BarChart,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  Area,
  AreaChart
} from 'recharts';

interface CustomerAdvocate {
  id: string;
  contactName: string;
  contactTitle?: string;
  contactEmail: string;
  contactPhone?: string;
  advocacyTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'ambassador';
  advocacyScore: number;
  activitiesCount: number;
  referralsGiven: number;
  testimonialsProvided: number;
  caseStudiesParticipated: number;
  eventsAttended: number;
  contentContributed: number;
  joinedAt: string;
  lastActivityAt?: string;
  programStatus: 'active' | 'inactive' | 'paused' | 'graduated';
  totalRewardsEarned: number;
  rewardsCurrency: string;
  recognitionsCount: number;
  allowPublicProfile: boolean;
  customer: {
    companyName: string;
    logoUrl?: string;
    industry: string;
    companySize: string;
  };
  _count: {
    referrals: number;
    rewards: number;
    ambassadorPrograms: number;
    contentContributions: number;
  };
}

interface ReferralTracking {
  id: string;
  referralCode?: string;
  refereeEmail: string;
  refereeName?: string;
  refereeCompany?: string;
  referredAt: string;
  status: 'sent' | 'clicked' | 'signed-up' | 'qualified' | 'rewarded' | 'expired';
  qualificationMet: boolean;
  rewardEligible: boolean;
  referrerRewarded: boolean;
  referrerRewardAmount: number;
  conversionValue?: number;
  program: {
    name: string;
    rewardType: string;
    rewardAmount: number;
    rewardCurrency: string;
  };
  referrer: {
    companyName: string;
    industry: string;
    companySize: string;
  };
  advocate?: {
    contactName: string;
    advocacyTier: string;
    advocacyScore: number;
  };
}

interface AdvocateReward {
  id: string;
  rewardType: string;
  rewardCategory: string;
  points?: number;
  monetaryValue?: number;
  currency: string;
  description: string;
  triggerActivity: string;
  triggerDate: string;
  status: 'pending' | 'approved' | 'issued' | 'claimed' | 'expired';
  deliveryMethod?: string;
  public: boolean;
  announcement?: string;
  advocate: {
    contactName: string;
    advocacyTier: string;
    customer: {
      companyName: string;
      industry: string;
    };
  };
}

interface AdvocacyChallenge {
  id: string;
  title: string;
  description: string;
  objective: string;
  category: string;
  challengeType: 'individual' | 'team' | 'community';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  startDate: string;
  endDate: string;
  duration: number;
  participantCount: number;
  completedCount: number;
  totalSubmissions: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  featured: boolean;
  _count: {
    advocates: number;
    submissions: number;
  };
}

const CustomerAdvocacyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Data states
  const [advocates, setAdvocates] = useState<CustomerAdvocate[]>([]);
  const [referrals, setReferrals] = useState<ReferralTracking[]>([]);
  const [rewards, setRewards] = useState<AdvocateReward[]>([]);
  const [challenges, setChallenges] = useState<AdvocacyChallenge[]>([]);
  const [stats, setStats] = useState<any>({});

  // Chart colors
  const chartColors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

  // Mock data for demonstration
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock advocates data
        setAdvocates([
          {
            id: '1',
            contactName: 'Sarah Johnson',
            contactTitle: 'Chief Technology Officer',
            contactEmail: 'sarah@techcorp.com',
            contactPhone: '+1-555-0123',
            advocacyTier: 'platinum',
            advocacyScore: 920,
            activitiesCount: 45,
            referralsGiven: 8,
            testimonialsProvided: 12,
            caseStudiesParticipated: 3,
            eventsAttended: 6,
            contentContributed: 4,
            joinedAt: '2023-03-15T00:00:00Z',
            lastActivityAt: '2024-01-20T14:30:00Z',
            programStatus: 'active',
            totalRewardsEarned: 2850,
            rewardsCurrency: 'USD',
            recognitionsCount: 15,
            allowPublicProfile: true,
            customer: {
              companyName: 'TechCorp Solutions',
              logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
              industry: 'Technology',
              companySize: 'Enterprise'
            },
            _count: {
              referrals: 8,
              rewards: 15,
              ambassadorPrograms: 2,
              contentContributions: 4
            }
          },
          {
            id: '2',
            contactName: 'Michael Chen',
            contactTitle: 'Operations Manager',
            contactEmail: 'michael@retailmax.com',
            advocacyTier: 'gold',
            advocacyScore: 780,
            activitiesCount: 28,
            referralsGiven: 5,
            testimonialsProvided: 7,
            caseStudiesParticipated: 2,
            eventsAttended: 4,
            contentContributed: 2,
            joinedAt: '2023-06-20T00:00:00Z',
            lastActivityAt: '2024-01-18T16:45:00Z',
            programStatus: 'active',
            totalRewardsEarned: 1650,
            rewardsCurrency: 'USD',
            recognitionsCount: 8,
            allowPublicProfile: false,
            customer: {
              companyName: 'RetailMax Inc.',
              logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100',
              industry: 'Retail',
              companySize: 'Large'
            },
            _count: {
              referrals: 5,
              rewards: 8,
              ambassadorPrograms: 1,
              contentContributions: 2
            }
          },
          {
            id: '3',
            contactName: 'Lisa Rodriguez',
            contactTitle: 'Marketing Director',
            contactEmail: 'lisa@financeplus.com',
            advocacyTier: 'silver',
            advocacyScore: 580,
            activitiesCount: 18,
            referralsGiven: 3,
            testimonialsProvided: 4,
            caseStudiesParticipated: 1,
            eventsAttended: 2,
            contentContributed: 1,
            joinedAt: '2023-09-10T00:00:00Z',
            lastActivityAt: '2024-01-15T10:20:00Z',
            programStatus: 'active',
            totalRewardsEarned: 850,
            rewardsCurrency: 'USD',
            recognitionsCount: 4,
            allowPublicProfile: true,
            customer: {
              companyName: 'FinancePlus Corp',
              industry: 'Finance',
              companySize: 'Medium'
            },
            _count: {
              referrals: 3,
              rewards: 4,
              ambassadorPrograms: 0,
              contentContributions: 1
            }
          }
        ]);

        // Mock referrals data
        setReferrals([
          {
            id: '1',
            referralCode: 'REF-TECH-001',
            refereeEmail: 'prospect@newtech.com',
            refereeName: 'John Smith',
            refereeCompany: 'NewTech Innovations',
            referredAt: '2024-01-15T10:00:00Z',
            status: 'qualified',
            qualificationMet: true,
            rewardEligible: true,
            referrerRewarded: true,
            referrerRewardAmount: 500,
            conversionValue: 25000,
            program: {
              name: 'Enterprise Referral Program',
              rewardType: 'cash',
              rewardAmount: 500,
              rewardCurrency: 'USD'
            },
            referrer: {
              companyName: 'TechCorp Solutions',
              industry: 'Technology',
              companySize: 'Enterprise'
            },
            advocate: {
              contactName: 'Sarah Johnson',
              advocacyTier: 'platinum',
              advocacyScore: 920
            }
          },
          {
            id: '2',
            referralCode: 'REF-RETAIL-002',
            refereeEmail: 'manager@retailbiz.com',
            refereeName: 'Amanda Wilson',
            refereeCompany: 'RetailBiz Co.',
            referredAt: '2024-01-10T14:30:00Z',
            status: 'signed-up',
            qualificationMet: false,
            rewardEligible: false,
            referrerRewarded: false,
            referrerRewardAmount: 0,
            program: {
              name: 'Standard Referral Program',
              rewardType: 'credit',
              rewardAmount: 250,
              rewardCurrency: 'USD'
            },
            referrer: {
              companyName: 'RetailMax Inc.',
              industry: 'Retail',
              companySize: 'Large'
            },
            advocate: {
              contactName: 'Michael Chen',
              advocacyTier: 'gold',
              advocacyScore: 780
            }
          }
        ]);

        // Mock rewards data
        setRewards([
          {
            id: '1',
            rewardType: 'cash',
            rewardCategory: 'referral',
            monetaryValue: 500,
            currency: 'USD',
            description: 'Successful enterprise referral reward',
            triggerActivity: 'Qualified referral conversion',
            triggerDate: '2024-01-15T10:00:00Z',
            status: 'issued',
            deliveryMethod: 'bank-transfer',
            public: true,
            announcement: 'Sarah Johnson earned a $500 referral reward!',
            advocate: {
              contactName: 'Sarah Johnson',
              advocacyTier: 'platinum',
              customer: {
                companyName: 'TechCorp Solutions',
                industry: 'Technology'
              }
            }
          },
          {
            id: '2',
            rewardType: 'points',
            rewardCategory: 'testimonial',
            points: 200,
            currency: 'USD',
            description: 'Video testimonial contribution',
            triggerActivity: 'Published video testimonial',
            triggerDate: '2024-01-12T16:45:00Z',
            status: 'claimed',
            public: false,
            advocate: {
              contactName: 'Michael Chen',
              advocacyTier: 'gold',
              customer: {
                companyName: 'RetailMax Inc.',
                industry: 'Retail'
              }
            }
          },
          {
            id: '3',
            rewardType: 'gift',
            rewardCategory: 'milestone',
            monetaryValue: 150,
            currency: 'USD',
            description: 'Bronze tier achievement gift card',
            triggerActivity: 'Reached 500 advocacy points',
            triggerDate: '2024-01-08T09:15:00Z',
            status: 'pending',
            deliveryMethod: 'gift-card',
            public: true,
            advocate: {
              contactName: 'Lisa Rodriguez',
              advocacyTier: 'silver',
              customer: {
                companyName: 'FinancePlus Corp',
                industry: 'Finance'
              }
            }
          }
        ]);

        // Mock challenges data
        setChallenges([
          {
            id: '1',
            title: 'Q1 2024 Referral Challenge',
            description: 'Refer the most qualified prospects and win amazing prizes',
            objective: 'Drive new customer acquisition through advocate referrals',
            category: 'referral',
            challengeType: 'individual',
            difficulty: 'medium',
            startDate: '2024-01-01T00:00:00Z',
            endDate: '2024-03-31T23:59:59Z',
            duration: 90,
            participantCount: 25,
            completedCount: 8,
            totalSubmissions: 45,
            status: 'active',
            featured: true,
            _count: {
              advocates: 25,
              submissions: 45
            }
          },
          {
            id: '2',
            title: 'Content Creator Spotlight',
            description: 'Create the best customer success content and get featured',
            objective: 'Generate high-quality advocacy content for marketing',
            category: 'content',
            challengeType: 'community',
            difficulty: 'hard',
            startDate: '2024-02-01T00:00:00Z',
            endDate: '2024-02-29T23:59:59Z',
            duration: 28,
            participantCount: 15,
            completedCount: 12,
            totalSubmissions: 28,
            status: 'completed',
            featured: false,
            _count: {
              advocates: 15,
              submissions: 28
            }
          }
        ]);

        // Mock stats
        setStats({
          totalAdvocates: 87,
          activeAdvocates: 73,
          totalReferrals: 156,
          qualifiedReferrals: 89,
          totalRewards: 25400,
          averageAdvocacyScore: 685,
          topTier: 'Platinum',
          activeChallenges: 3,
          monthlyGrowth: 18.5,
          conversionRate: 57.1,
          averageReward: 425
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAdvocates = advocates.filter(advocate => {
    const matchesSearch = advocate.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         advocate.customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         advocate.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === "all" || advocate.advocacyTier === tierFilter;
    const matchesStatus = statusFilter === "all" || advocate.programStatus === statusFilter;
    const matchesIndustry = industryFilter === "all" || advocate.customer.industry === industryFilter;
    
    return matchesSearch && matchesTier && matchesStatus && matchesIndustry;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'ambassador': return 'bg-purple-100 text-purple-800';
      case 'platinum': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-blue-100 text-blue-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'ambassador': return <Crown className="h-4 w-4" />;
      case 'platinum': return <Medal className="h-4 w-4" />;
      case 'gold': return <Trophy className="h-4 w-4" />;
      case 'silver': return <Award className="h-4 w-4" />;
      case 'bronze': return <Star className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'rewarded': return 'bg-purple-100 text-purple-800';
      case 'signed-up': return 'bg-blue-100 text-blue-800';
      case 'clicked': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Sample chart data
  const advocacyGrowthData = [
    { month: 'Jan', advocates: 65, score: 650, rewards: 18500 },
    { month: 'Feb', advocates: 72, score: 665, rewards: 21200 },
    { month: 'Mar', advocates: 78, score: 675, rewards: 23800 },
    { month: 'Apr', advocates: 84, score: 680, rewards: 25100 },
    { month: 'May', advocates: 87, score: 685, rewards: 25400 },
  ];

  const tierDistributionData = [
    { tier: 'Bronze', count: 35, color: chartColors[4] },
    { tier: 'Silver', count: 28, color: chartColors[2] },
    { tier: 'Gold', count: 18, color: chartColors[1] },
    { tier: 'Platinum', count: 5, color: chartColors[0] },
    { tier: 'Ambassador', count: 1, color: chartColors[5] }
  ];

  const referralPerformanceData = [
    { category: 'Sent', count: 156, rate: 100 },
    { category: 'Clicked', count: 124, rate: 79.5 },
    { category: 'Signed Up', count: 98, rate: 62.8 },
    { category: 'Qualified', count: 89, rate: 57.1 },
    { category: 'Rewarded', count: 67, rate: 42.9 }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Advocates</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalAdvocates}</p>
                <p className="text-xs text-blue-500 mt-1">{stats.activeAdvocates} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Referrals</p>
                <p className="text-3xl font-bold text-green-900">{stats.totalReferrals}</p>
                <p className="text-xs text-green-500 mt-1">{stats.qualifiedReferrals} qualified</p>
              </div>
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Rewards</p>
                <p className="text-3xl font-bold text-purple-900">${(stats.totalRewards / 1000).toFixed(0)}K</p>
                <p className="text-xs text-purple-500 mt-1">Avg ${stats.averageReward}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-orange-900">{stats.conversionRate}%</p>
                <p className="text-xs text-orange-500 mt-1">Referral to qualified</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advocacy Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Advocacy Program Growth
          </CardTitle>
          <CardDescription>Monthly growth in advocates, scores, and rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={advocacyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="advocates"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Advocates', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <YAxis 
                  yAxisId="rewards"
                  orientation="right"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Rewards ($)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip wrapperStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line 
                  yAxisId="advocates"
                  type="monotone" 
                  dataKey="advocates" 
                  stroke={chartColors[0]} 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="rewards"
                  type="monotone" 
                  dataKey="rewards" 
                  stroke={chartColors[1]} 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tier Distribution and Referral Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Advocate Tier Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ tier, count, percent }) => `${tier}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {tierDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Referral Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralPerformanceData.map((stage, index) => (
                <div key={stage.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{stage.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {stage.rate}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={stage.rate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-500" />
            Top Performing Advocates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {advocates.sort((a, b) => b.advocacyScore - a.advocacyScore).slice(0, 5).map((advocate, index) => (
              <div key={advocate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    {advocate.customer.logoUrl && (
                      <img
                        src={advocate.customer.logoUrl}
                        alt={advocate.customer.companyName}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-sm">{advocate.contactName}</p>
                      <p className="text-xs text-gray-600">{advocate.contactTitle}</p>
                      <p className="text-xs text-gray-500">{advocate.customer.companyName}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getTierColor(advocate.advocacyTier)}>
                      {getTierIcon(advocate.advocacyTier)}
                      <span className="ml-1 capitalize">{advocate.advocacyTier}</span>
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-blue-600">{advocate.advocacyScore} points</p>
                  <p className="text-xs text-gray-500">{advocate.activitiesCount} activities</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-500" />
            Recent Advocacy Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New qualified referral</p>
                <p className="text-xs text-gray-600">Sarah Johnson referred NewTech Innovations - $25K value</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Reward issued</p>
                <p className="text-xs text-gray-600">Michael Chen earned $200 for video testimonial</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Challenge completed</p>
                <p className="text-xs text-gray-600">Content Creator Spotlight challenge ended with 28 submissions</p>
              </div>
              <span className="text-xs text-gray-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AdvocatesTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search advocates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="ambassador">Ambassador</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Advocate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advocates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAdvocates.map((advocate) => (
          <motion.div
            key={advocate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {advocate.customer.logoUrl && (
                      <img
                        src={advocate.customer.logoUrl}
                        alt={advocate.customer.companyName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{advocate.contactName}</h3>
                      {advocate.contactTitle && (
                        <p className="text-xs text-gray-600">{advocate.contactTitle}</p>
                      )}
                      <p className="text-xs text-gray-500">{advocate.customer.companyName}</p>
                    </div>
                  </div>
                  <Badge className={getTierColor(advocate.advocacyTier)}>
                    {getTierIcon(advocate.advocacyTier)}
                    <span className="ml-1 capitalize">{advocate.advocacyTier}</span>
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Advocacy Score</span>
                    <span className="font-bold text-blue-600">{advocate.advocacyScore}</span>
                  </div>
                  <Progress value={(advocate.advocacyScore / 1000) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-lg font-bold text-blue-600">{advocate.referralsGiven}</p>
                    <p className="text-xs text-blue-600">Referrals</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-600">{advocate.testimonialsProvided}</p>
                    <p className="text-xs text-green-600">Testimonials</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-lg font-bold text-purple-600">${advocate.totalRewardsEarned}</p>
                    <p className="text-xs text-purple-600">Rewards</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <p className="text-lg font-bold text-orange-600">{advocate.activitiesCount}</p>
                    <p className="text-xs text-orange-600">Activities</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className={advocate.programStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {advocate.programStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span>{new Date(advocate.joinedAt).toLocaleDateString()}</span>
                  </div>
                  {advocate.lastActivityAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Activity</span>
                      <span>{new Date(advocate.lastActivityAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ReferralsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Referral Tracking</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Track Referral
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {referrals.map((referral) => (
          <motion.div
            key={referral.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-sm">{referral.refereeName || 'Anonymous Referral'}</h3>
                    <p className="text-xs text-gray-600">{referral.refereeEmail}</p>
                    {referral.refereeCompany && (
                      <p className="text-xs text-gray-500">{referral.refereeCompany}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(referral.status)}>
                    {referral.status}
                  </Badge>
                </div>

                {referral.referralCode && (
                  <div className="mb-3 p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 mb-1">Referral Code</p>
                    <p className="text-sm font-mono font-medium">{referral.referralCode}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {referral.referrerRewardAmount > 0 && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">${referral.referrerRewardAmount}</p>
                      <p className="text-xs text-green-600">Reward</p>
                    </div>
                  )}
                  {referral.conversionValue && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">${(referral.conversionValue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-blue-600">Value</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Program</span>
                    <span className="font-medium">{referral.program.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Referrer</span>
                    <span>{referral.referrer.companyName}</span>
                  </div>
                  {referral.advocate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Advocate</span>
                      <div className="flex items-center gap-1">
                        <span>{referral.advocate.contactName}</span>
                        <Badge className={getTierColor(referral.advocate.advocacyTier)} size="sm">
                          {referral.advocate.advocacyTier}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Referred</span>
                    <span>{new Date(referral.referredAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {referral.qualificationMet && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Qualified
                    </Badge>
                  )}
                  {referral.rewardEligible && (
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      <Gift className="h-3 w-3 mr-1" />
                      Eligible
                    </Badge>
                  )}
                  {referral.referrerRewarded && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      <Coins className="h-3 w-3 mr-1" />
                      Rewarded
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const RewardsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advocate Rewards</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Issue Reward
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-sm">{reward.advocate.contactName}</h3>
                    <p className="text-xs text-gray-600">{reward.advocate.customer.companyName}</p>
                    <p className="text-xs text-gray-500">{reward.advocate.customer.industry}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTierColor(reward.advocate.advocacyTier)}>
                      {reward.advocate.advocacyTier}
                    </Badge>
                    <Badge className={
                      reward.status === 'issued' ? 'bg-green-100 text-green-800' :
                      reward.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                      reward.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {reward.status}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">{reward.description}</h4>
                  <p className="text-xs text-gray-600">{reward.triggerActivity}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-4">
                  {reward.monetaryValue ? (
                    <>
                      <p className="text-2xl font-bold text-purple-600">${reward.monetaryValue}</p>
                      <p className="text-xs text-purple-600">Monetary Reward</p>
                    </>
                  ) : reward.points ? (
                    <>
                      <p className="text-2xl font-bold text-blue-600">{reward.points}</p>
                      <p className="text-xs text-blue-600">Points</p>
                    </>
                  ) : (
                    <>
                      <Gift className="h-8 w-8 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-600">Gift Reward</p>
                    </>
                  )}
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {reward.rewardCategory}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="capitalize">{reward.rewardType}</span>
                  </div>
                  {reward.deliveryMethod && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="capitalize">{reward.deliveryMethod.replace('-', ' ')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Triggered</span>
                    <span>{new Date(reward.triggerDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {reward.public && reward.announcement && (
                  <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-500 mb-4">
                    <p className="text-xs text-yellow-800">{reward.announcement}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {reward.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ChallengesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advocacy Challenges</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Challenge
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {challenge.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className={
                      challenge.status === 'active' ? 'bg-green-100 text-green-800' :
                      challenge.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      challenge.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {challenge.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{challenge.participantCount}</p>
                    <p className="text-xs text-blue-600">Participants</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{challenge.totalSubmissions}</p>
                    <p className="text-xs text-green-600">Submissions</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{challenge.completedCount}</p>
                    <p className="text-xs text-purple-600">Completed</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {challenge.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="capitalize">{challenge.challengeType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <Badge className={
                      challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      challenge.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span>{challenge.duration} days</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Completion Rate</span>
                    <span>{Math.round((challenge.completedCount / challenge.participantCount) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(challenge.completedCount / challenge.participantCount) * 100} 
                    className="h-2" 
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Started: {new Date(challenge.startDate).toLocaleDateString()}</span>
                  <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Challenge
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Advocacy Program</h1>
          <p className="text-gray-600 mt-2">Manage advocates, referrals, rewards, and engagement programs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Advocate
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="advocates">Advocates</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="advocates">
          <AdvocatesTab />
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralsTab />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsTab />
        </TabsContent>

        <TabsContent value="challenges">
          <ChallengesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerAdvocacyDashboard;
