

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Star,
  Crown,
  Gem,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Settings,
  Plus,
  Edit,
  Eye,
  Share2,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Bell,
  Gift,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingDown,
  Percent,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface CreatorMonetizationDashboardProps {
  creatorId: string;
  creatorProfile?: any;
}

export default function CreatorMonetizationDashboard({ 
  creatorId, 
  creatorProfile 
}: CreatorMonetizationDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("monthly");
  const [profile, setProfile] = useState(creatorProfile);
  const [earnings, setEarnings] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [royalties, setRoyalties] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreatorData();
  }, [creatorId, timeframe]);

  const fetchCreatorData = async () => {
    setLoading(true);
    try {
      const [
        profileRes,
        subscriptionsRes,
        revenueRes,
        payoutsRes,
        analyticsRes,
      ] = await Promise.all([
        fetch(`/api/secondary-market/creator-profiles?userId=${creatorId}`),
        fetch(`/api/secondary-market/subscriptions?creatorId=${creatorId}&status=active`),
        fetch(`/api/secondary-market/revenue-sharing?recipientId=${creatorId}&recipientType=creator`),
        fetch(`/api/secondary-market/revenue-sharing?action=get_creator_payouts&creatorId=${creatorId}`),
        fetch(`/api/secondary-market/subscriptions?action=get_subscription_analytics&creatorId=${creatorId}`),
      ]);

      const [
        profileData,
        subscriptionsData,
        revenueData,
        payoutsData,
        analyticsData,
      ] = await Promise.all([
        profileRes.json(),
        subscriptionsRes.json(),
        revenueRes.json(),
        payoutsRes.json(),
        analyticsRes.json(),
      ]);

      setProfile(profileData.profiles?.[0]);
      setSubscriptions(subscriptionsData.subscriptions || []);
      setEarnings(revenueData);
      setPayouts(payoutsData.payouts || []);
      setAnalytics(analyticsData.analytics);
    } catch (error) {
      console.error('Error fetching creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const EarningsOverview = () => (
    <div className="space-y-6">
      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${profile?.lifetimeEarnings?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    <ArrowUpRight className="h-3 w-3 inline mr-1" />
                    +24% this month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${analytics?.monthlyRevenue?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    +18% vs last month
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Subscribers</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {analytics?.activeSubscriptions || 0}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">
                    <Users className="h-3 w-3 inline mr-1" />
                    {analytics?.churnRate?.toFixed(1) || 0}% churn rate
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Creator Tier</p>
                  <p className="text-2xl font-bold text-orange-900 capitalize">
                    {profile?.tier || 'Creator'}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    <Award className="h-3 w-3 inline mr-1" />
                    {profile?.verificationLevel || 'Basic'} verified
                  </p>
                </div>
                <Crown className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-500" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm">Primary Sales</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${profile?.totalEarnings?.toFixed(2) || '0.00'}</span>
                  <span className="text-xs text-gray-500 ml-2">65%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">Secondary Market</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${profile?.secondaryEarnings?.toFixed(2) || '0.00'}</span>
                  <span className="text-xs text-gray-500 ml-2">20%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm">Royalties</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${profile?.royaltyEarnings?.toFixed(2) || '0.00'}</span>
                  <span className="text-xs text-gray-500 ml-2">10%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-sm">Subscriptions</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</span>
                  <span className="text-xs text-gray-500 ml-2">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-green-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Trust Score</span>
                  <span>{(profile?.trustScore * 20 || 0).toFixed(1)}%</span>
                </div>
                <Progress value={profile?.trustScore * 20 || 0} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Performance Score</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Next Tier Progress</span>
                  <span>{(profile?.nextTierProgress * 100 || 0).toFixed(0)}%</span>
                </div>
                <Progress value={profile?.nextTierProgress * 100 || 0} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Community Score</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{profile?.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-500">({profile?.reviewCount || 0})</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Earnings
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts?.slice(0, 5).map((payout, index) => (
              <motion.div
                key={payout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payout.payoutType} Payout</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payout.paidAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +${payout.netAmount?.toFixed(2)}
                  </p>
                  <Badge variant="outline" className="text-green-600">
                    {payout.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SubscriptionManagement = () => (
    <div className="space-y-6">
      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-blue-900">
                  {analytics?.activeSubscriptions || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monthly Recurring</p>
                <p className="text-2xl font-bold text-green-900">
                  ${analytics?.monthlyRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg. Lifetime</p>
                <p className="text-2xl font-bold text-purple-900">
                  {analytics?.averageLifetime?.toFixed(0) || 0} days
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Tiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subscription Tiers</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Basic",
                price: 9.99,
                subscribers: 45,
                color: "blue",
                features: ["Basic content access", "Community access", "Monthly newsletter"]
              },
              {
                name: "Premium",
                price: 19.99,
                subscribers: 28,
                color: "purple",
                features: ["All Basic benefits", "Premium content", "Early access", "Priority support"]
              },
              {
                name: "Exclusive",
                price: 49.99,
                subscribers: 12,
                color: "yellow",
                features: ["All Premium benefits", "Exclusive content", "Direct messaging", "1-on-1 sessions"]
              }
            ].map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-${tier.color}-200 bg-gradient-to-br from-${tier.color}-50 to-${tier.color}-100`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{tier.name}</h3>
                      <Badge className={`bg-${tier.color}-500 text-white`}>
                        {tier.subscribers} subs
                      </Badge>
                    </div>

                    <p className="text-2xl font-bold mb-4">
                      ${tier.price}
                      <span className="text-sm font-normal text-gray-600">/month</span>
                    </p>

                    <ul className="space-y-2 text-sm">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscribers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions?.slice(0, 5).map((subscription, index) => (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {subscription.subscriber?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{subscription.subscriber?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">
                      {subscription.tier} • Joined {new Date(subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${subscription.monthlyPrice}/mo</p>
                  <Badge variant="outline" className="text-green-600">
                    {subscription.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CreatorProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {profile?.displayName?.[0] || profile?.user?.name?.[0] || 'C'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{profile?.displayName || 'Creator'}</h2>
                <Badge className="bg-blue-500 text-white">
                  {profile?.verificationLevel || 'Basic'}
                </Badge>
                {profile?.featured && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{profile?.bio || 'No bio available'}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {profile?.followers || 0} followers
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {profile?.rating?.toFixed(1) || '0.0'} ({profile?.reviewCount || 0} reviews)
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-purple-500" />
                  {profile?.tier || 'Creator'} tier
                </div>
              </div>
            </div>

            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile?.specialties?.map((specialty, index) => (
              <Badge key={index} variant="outline">
                {specialty}
              </Badge>
            )) || (
              <p className="text-gray-500">No specialties listed</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portfolio</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile?.portfolio?.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold mb-2">{project.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{project.category}</Badge>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )) || (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No portfolio projects yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Creator Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Royalty Collection</p>
                <p className="text-sm text-gray-600">
                  Automatically collect royalties from secondary sales
                </p>
              </div>
              <Badge className={profile?.autoRoyalty ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {profile?.autoRoyalty ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-gray-600">
                  Make your profile visible to other users
                </p>
              </div>
              <Badge className={profile?.publicProfile ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {profile?.publicProfile ? "Public" : "Private"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Royalty Rate</p>
                <p className="text-sm text-gray-600">
                  Percentage earned from secondary sales
                </p>
              </div>
              <Badge variant="outline">
                {((profile?.royaltyRate || 0) * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage your monetization, subscribers, and creator profile
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Last Week</SelectItem>
                  <SelectItem value="monthly">Last Month</SelectItem>
                  <SelectItem value="quarterly">Last Quarter</SelectItem>
                  <SelectItem value="yearly">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button>
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <EarningsOverview />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>

          <TabsContent value="profile">
            <CreatorProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

