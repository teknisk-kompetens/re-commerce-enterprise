
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
  Crown,
  Coins,
  Gem,
  Users,
  BarChart3,
  Calendar,
  Gift,
  Flame,

  Medal,
  ChevronRight,
  Plus,
  Sparkles,
  Activity,
  Gamepad2,
  Settings,
  Eye,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GamificationProfile {
  id: string;
  userId: string;
  experiencePoints: number;
  gamificationCoins: number;
  premiumGems: number;
  reputationPoints: number;
  currentLevel: number;
  nextLevelXP: number;
  dailyStreak: number;
  longestStreak: number;
  currentTier: string;
  totalActivities: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  pointTransactions: PointTransaction[];
  earnedAchievements: UserAchievement[];
  leaderboardEntries: LeaderboardEntry[];
}

interface PointTransaction {
  id: string;
  type: string;
  currency: string;
  amount: number;
  source: string;
  description: string;
  createdAt: string;
}

interface UserAchievement {
  id: string;
  isUnlocked: boolean;
  unlockedAt: string;
  achievement: {
    id: string;
    name: string;
    description: string;
    rarity: string;
    iconUrl?: string;
    pointValue: number;
  };
}

interface LeaderboardEntry {
  id: string;
  currentRank: number;
  score: string;
  leaderboard: {
    id: string;
    name: string;
    category: string;
    type: string;
  };
}

interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  rarity: string;
  targetValue: number;
  baseReward: any;
  userProgress?: {
    currentProgress: number;
    progressPercentage: number;
    isCompleted: boolean;
  };
}

interface AnalyticsData {
  totalActiveUsers: number;
  dailyActiveUsers: number;
  pointsDistributed: any;
  achievementsUnlocked: number;
  challengesCompleted: number;
  userRetention: number;
  engagementGrowth: number;
}

const GamificationOverviewDashboard: React.FC = () => {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        
        // Mock profile data
        const mockProfile: GamificationProfile = {
          id: 'profile-1',
          userId: 'user-1',
          experiencePoints: 2840,
          gamificationCoins: 1250,
          premiumGems: 87,
          reputationPoints: 456,
          currentLevel: 12,
          nextLevelXP: 3200,
          dailyStreak: 7,
          longestStreak: 15,
          currentTier: 'gold',
          totalActivities: 156,
          user: {
            id: 'user-1',
            name: 'Alex Johnson',
            email: 'alex@example.com',
          },
          pointTransactions: [
            {
              id: '1',
              type: 'earned',
              currency: 'xp',
              amount: 50,
              source: 'daily_challenge',
              description: 'Completed daily login challenge',
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              type: 'earned',
              currency: 'coins',
              amount: 25,
              source: 'achievement_unlock',
              description: 'Unlocked First Steps achievement',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
          earnedAchievements: [
            {
              id: '1',
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
              achievement: {
                id: 'ach-1',
                name: 'First Steps',
                description: 'Complete your first activity',
                rarity: 'common',
                pointValue: 10,
              },
            },
          ],
          leaderboardEntries: [
            {
              id: '1',
              currentRank: 3,
              score: '2840',
              leaderboard: {
                id: 'lb-1',
                name: 'Monthly XP Leaders',
                category: 'global',
                type: 'points',
              },
            },
          ],
        };

        const mockChallenges: DailyChallenge[] = [
          {
            id: '1',
            name: 'Daily Login',
            description: 'Log in to the platform',
            category: 'activity',
            difficulty: 'easy',
            rarity: 'common',
            targetValue: 1,
            baseReward: { xp: 50, coins: 10 },
            userProgress: {
              currentProgress: 1,
              progressPercentage: 100,
              isCompleted: true,
            },
          },
          {
            id: '2',
            name: 'Social Butterfly',
            description: 'Share 3 achievements on social media',
            category: 'social',
            difficulty: 'medium',
            rarity: 'uncommon',
            targetValue: 3,
            baseReward: { xp: 100, coins: 25, reputation: 10 },
            userProgress: {
              currentProgress: 1,
              progressPercentage: 33.3,
              isCompleted: false,
            },
          },
        ];

        const mockAnalytics: AnalyticsData = {
          totalActiveUsers: 1247,
          dailyActiveUsers: 342,
          pointsDistributed: { xp: 15420, coins: 8765, gems: 234, reputation: 2156 },
          achievementsUnlocked: 89,
          challengesCompleted: 456,
          userRetention: 78.5,
          engagementGrowth: 12.3,
        };

        setProfile(mockProfile);
        setChallenges(mockChallenges);
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  const calculateLevelProgress = () => {
    if (!profile) return 0;
    const currentLevelXP = profile.currentLevel === 1 ? 0 : Math.floor(100 * Math.pow(profile.currentLevel - 1, 1.5));
    const progressInLevel = profile.experiencePoints - currentLevelXP;
    const xpForNextLevel = profile.nextLevelXP - currentLevelXP;
    return (progressInLevel / xpForNextLevel) * 100;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600';
      case 'silver': return 'text-gray-500';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-blue-400';
      case 'diamond': return 'text-purple-500';
      default: return 'text-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return Medal;
      case 'silver': return Medal;
      case 'gold': return Crown;
      case 'platinum': return Trophy;
      case 'diamond': return Sparkles;
      default: return Medal;
    }
  };

  const currencyIcons = {
    xp: Zap,
    coins: Coins,
    gems: Gem,
    reputation: Star,
  };

  const currencyColors = {
    xp: 'text-blue-500',
    coins: 'text-yellow-500',
    gems: 'text-purple-500',
    reputation: 'text-green-500',
  };

  const weeklyProgressData = [
    { day: 'Mon', xp: 240, coins: 60, activities: 8 },
    { day: 'Tue', xp: 320, coins: 80, activities: 12 },
    { day: 'Wed', xp: 180, coins: 45, activities: 6 },
    { day: 'Thu', xp: 410, coins: 95, activities: 15 },
    { day: 'Fri', xp: 290, coins: 70, activities: 10 },
    { day: 'Sat', xp: 350, coins: 85, activities: 13 },
    { day: 'Sun', xp: 380, coins: 90, activities: 14 },
  ];

  const achievementDistribution = [
    { name: 'Common', value: 45, color: '#8B5CF6' },
    { name: 'Uncommon', value: 25, color: '#06B6D4' },
    { name: 'Rare', value: 20, color: '#10B981' },
    { name: 'Epic', value: 8, color: '#F59E0B' },
    { name: 'Legendary', value: 2, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Gamepad2 className="h-16 w-16 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading gamification dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gamification Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your progress, earn rewards, and compete with others in our comprehensive gamification system
          </p>
        </motion.div>

        {/* User Profile Summary */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20 border-4 border-white/20">
                      <AvatarImage src="/api/placeholder/80/80" />
                      <AvatarFallback className="text-2xl bg-white/20">
                        {profile.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-3xl font-bold">{profile.user.name}</h2>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          Level {profile.currentLevel}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {React.createElement(getTierIcon(profile.currentTier), { 
                            className: `h-5 w-5 ${getTierColor(profile.currentTier)}` 
                          })}
                          <span className="capitalize font-medium">{profile.currentTier} Tier</span>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between w-96">
                          <span className="text-sm opacity-90">Level Progress</span>
                          <span className="text-sm opacity-90">
                            {profile.experiencePoints} / {profile.nextLevelXP} XP
                          </span>
                        </div>
                        <Progress value={calculateLevelProgress()} className="h-2 bg-white/20" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <Flame className="h-6 w-6 text-orange-300" />
                        <span className="text-sm opacity-90">Current Streak</span>
                      </div>
                      <p className="text-3xl font-bold">{profile.dailyStreak}</p>
                      <p className="text-sm opacity-75">days</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="h-6 w-6 text-green-300" />
                        <span className="text-sm opacity-90">Activities</span>
                      </div>
                      <p className="text-3xl font-bold">{profile.totalActivities}</p>
                      <p className="text-sm opacity-75">completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Currency Overview */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {Object.entries({
              xp: profile.experiencePoints,
              coins: profile.gamificationCoins,
              gems: profile.premiumGems,
              reputation: profile.reputationPoints,
            }).map(([currency, amount]) => {
              const Icon = currencyIcons[currency as keyof typeof currencyIcons];
              const colorClass = currencyColors[currency as keyof typeof currencyColors];
              
              return (
                <Card key={currency} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          {currency === 'xp' ? 'Experience' : currency}
                        </p>
                        <p className="text-3xl font-bold mt-2">{amount.toLocaleString()}</p>
                      </div>
                      <Icon className={`h-12 w-12 ${colorClass}`} />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span>+12% from last week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Weekly Progress</span>
                  </CardTitle>
                  <CardDescription>Your activity and rewards over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="xp" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="coins" stackId="2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activities</span>
                  </CardTitle>
                  <CardDescription>Your latest point transactions and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.pointTransactions.slice(0, 5).map((transaction) => {
                      const Icon = currencyIcons[transaction.currency as keyof typeof currencyIcons];
                      const colorClass = currencyColors[transaction.currency as keyof typeof currencyColors];
                      
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <Icon className={`h-6 w-6 ${colorClass}`} />
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">{transaction.source}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Achievement Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Achievement Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Unlocked</span>
                      <span className="font-bold text-2xl">{profile?.earnedAchievements.length || 0}</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={achievementDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {achievementDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Recent Achievements</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.earnedAchievements.map((userAchievement) => (
                      <div 
                        key={userAchievement.id} 
                        className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-full">
                            <Trophy className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{userAchievement.achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{userAchievement.achievement.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={userAchievement.achievement.rarity === 'common' ? 'default' : 'secondary'}>
                                {userAchievement.achievement.rarity}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                +{userAchievement.achievement.pointValue} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5" />
                        <span>{challenge.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={challenge.difficulty === 'easy' ? 'default' : 'secondary'}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant={challenge.rarity === 'common' ? 'outline' : 'default'}>
                          {challenge.rarity}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {challenge.userProgress && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-muted-foreground">
                              {challenge.userProgress.currentProgress} / {challenge.targetValue}
                            </span>
                          </div>
                          <Progress value={challenge.userProgress.progressPercentage} className="h-2" />
                          {challenge.userProgress.isCompleted && (
                            <div className="flex items-center text-green-600 mt-2">
                              <Trophy className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">Completed!</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Rewards</span>
                        <div className="flex items-center space-x-2">
                          {Object.entries(challenge.baseReward).map(([currency, amount]) => {
                            const Icon = currencyIcons[currency as keyof typeof currencyIcons];
                            return (
                              <div key={currency} className="flex items-center space-x-1">
                                <Icon className="h-4 w-4" />
                                <span className="text-sm">+{amount as number}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Rankings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Your Rankings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.leaderboardEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <h4 className="font-semibold">{entry.leaderboard.name}</h4>
                          <p className="text-sm text-muted-foreground">{entry.leaderboard.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">#{entry.currentRank}</p>
                          <p className="text-sm text-muted-foreground">{entry.score} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Global Leaderboard Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-5 w-5" />
                      <span>Top Performers</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: 'Emma Thompson', score: 4250, avatar: '/api/placeholder/40/40' },
                      { rank: 2, name: 'Michael Chen', score: 3890, avatar: '/api/placeholder/40/40' },
                      { rank: 3, name: 'Sarah Wilson', score: 3654, avatar: '/api/placeholder/40/40' },
                      { rank: 4, name: 'David Rodriguez', score: 3421, avatar: '/api/placeholder/40/40' },
                      { rank: 5, name: 'Lisa Anderson', score: 3198, avatar: '/api/placeholder/40/40' },
                    ].map((user) => (
                      <div key={user.rank} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          user.rank === 2 ? 'bg-gray-100 text-gray-700' :
                          user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                        </div>
                        <p className="font-bold text-blue-600">{user.score.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                        <p className="text-3xl font-bold">{analytics.totalActiveUsers.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span>+{analytics.engagementGrowth.toFixed(1)}% growth</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                        <p className="text-3xl font-bold">{analytics.achievementsUnlocked}</p>
                      </div>
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-blue-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span>This month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Challenges</p>
                        <p className="text-3xl font-bold">{analytics.challengesCompleted}</p>
                      </div>
                      <Target className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span>Completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Retention</p>
                        <p className="text-3xl font-bold">{analytics.userRetention.toFixed(1)}%</p>
                      </div>
                      <Activity className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span>User retention</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-4"
        >
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Gift className="h-5 w-5 mr-2" />
            Visit Rewards Store
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5 mr-2" />
            Share Progress
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GamificationOverviewDashboard;
