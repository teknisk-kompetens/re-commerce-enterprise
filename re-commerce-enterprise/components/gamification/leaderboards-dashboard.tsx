
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  Target,
  Calendar,
  Clock,
  Filter,
  Search,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Plus,
  Eye,
  Share2,
  Gift,
  Zap,
  Coins,
  Gem,
  Flag,
  Timer,
  Award,
  ChevronRight,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

interface LeaderboardEntry {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  currentRank: number;
  previousRank?: number;
  rankChange: number;
  score: number;
  previousScore: number;
  scoreChange: number;
  streak: number;
  bestStreak: number;
  participationDays: number;
  achievementsUnlocked: number;
  totalActivities: number;
  timeInLeaderboard: number;
  rewardsEarned: any[];
  totalRewardValue: number;
}

interface Leaderboard {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  metric: string;
  period: string;
  startDate?: string;
  endDate?: string;
  resetFrequency?: string;
  isCompetition: boolean;
  competitionType?: string;
  maxParticipants?: number;
  rewardStructure: any;
  prizes: any[];
  isPublic: boolean;
  status: string;
  entries: LeaderboardEntry[];
  participantCount: number;
}

interface Competition {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  registrationStart: string;
  registrationEnd: string;
  competitionStart: string;
  competitionEnd: string;
  maxParticipants?: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: any;
  rewardStructure: any;
  status: string;
  isPublic: boolean;
  isFeatured: boolean;
  bannerImage?: string;
}

const LeaderboardsDashboard: React.FC = () => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<Leaderboard | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userPosition, setUserPosition] = useState<LeaderboardEntry | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // Mock leaderboards data
        const mockLeaderboards: Leaderboard[] = [
          {
            id: '1',
            name: 'Monthly XP Champions',
            description: 'Top performers by experience points this month',
            category: 'global',
            type: 'points',
            metric: 'total_xp',
            period: 'monthly',
            resetFrequency: 'monthly',
            isCompetition: false,
            rewardStructure: {
              1: { xp: 1000, coins: 500, gems: 50, title: 'XP Champion' },
              2: { xp: 750, coins: 300, gems: 30, title: 'XP Master' },
              3: { xp: 500, coins: 200, gems: 20, title: 'XP Expert' },
            },
            prizes: [],
            isPublic: true,
            status: 'active',
            participantCount: 1247,
            entries: [
              {
                id: '1',
                userId: 'user-1',
                user: {
                  id: 'user-1',
                  name: 'Emma Thompson',
                  email: 'emma@example.com',
                  avatar: '/api/placeholder/40/40',
                },
                currentRank: 1,
                previousRank: 2,
                rankChange: 1,
                score: 4250,
                previousScore: 3890,
                scoreChange: 360,
                streak: 15,
                bestStreak: 18,
                participationDays: 28,
                achievementsUnlocked: 23,
                totalActivities: 156,
                timeInLeaderboard: 28,
                rewardsEarned: [],
                totalRewardValue: 0,
              },
              {
                id: '2',
                userId: 'user-2',
                user: {
                  id: 'user-2',
                  name: 'Michael Chen',
                  email: 'michael@example.com',
                  avatar: '/api/placeholder/40/40',
                },
                currentRank: 2,
                previousRank: 1,
                rankChange: -1,
                score: 3890,
                previousScore: 4100,
                scoreChange: -210,
                streak: 12,
                bestStreak: 22,
                participationDays: 30,
                achievementsUnlocked: 19,
                totalActivities: 142,
                timeInLeaderboard: 30,
                rewardsEarned: [],
                totalRewardValue: 0,
              },
              {
                id: '3',
                userId: 'user-3',
                user: {
                  id: 'user-3',
                  name: 'Sarah Wilson',
                  email: 'sarah@example.com',
                  avatar: '/api/placeholder/40/40',
                },
                currentRank: 3,
                previousRank: 4,
                rankChange: 1,
                score: 3654,
                previousScore: 3200,
                scoreChange: 454,
                streak: 8,
                bestStreak: 15,
                participationDays: 25,
                achievementsUnlocked: 17,
                totalActivities: 128,
                timeInLeaderboard: 25,
                rewardsEarned: [],
                totalRewardValue: 0,
              },
              {
                id: '4',
                userId: 'user-4',
                user: {
                  id: 'user-4',
                  name: 'David Rodriguez',
                  email: 'david@example.com',
                  avatar: '/api/placeholder/40/40',
                },
                currentRank: 4,
                previousRank: 3,
                rankChange: -1,
                score: 3421,
                previousScore: 3450,
                scoreChange: -29,
                streak: 5,
                bestStreak: 12,
                participationDays: 22,
                achievementsUnlocked: 15,
                totalActivities: 119,
                timeInLeaderboard: 22,
                rewardsEarned: [],
                totalRewardValue: 0,
              },
              {
                id: '5',
                userId: 'user-5',
                user: {
                  id: 'user-5',
                  name: 'Lisa Anderson',
                  email: 'lisa@example.com',
                  avatar: '/api/placeholder/40/40',
                },
                currentRank: 5,
                previousRank: 6,
                rankChange: 1,
                score: 3198,
                previousScore: 2950,
                scoreChange: 248,
                streak: 10,
                bestStreak: 14,
                participationDays: 27,
                achievementsUnlocked: 16,
                totalActivities: 134,
                timeInLeaderboard: 27,
                rewardsEarned: [],
                totalRewardValue: 0,
              },
            ],
          },
          {
            id: '2',
            name: 'Weekly Activity Leaders',
            description: 'Most active users this week',
            category: 'weekly',
            type: 'activities',
            metric: 'weekly_activities',
            period: 'weekly',
            resetFrequency: 'weekly',
            isCompetition: false,
            rewardStructure: {
              1: { coins: 200, gems: 20 },
              2: { coins: 150, gems: 15 },
              3: { coins: 100, gems: 10 },
            },
            prizes: [],
            isPublic: true,
            status: 'active',
            participantCount: 892,
            entries: [
              {
                id: '6',
                userId: 'user-6',
                user: {
                  id: 'user-6',
                  name: 'Alex Johnson',
                  email: 'alex@example.com',
                  avatar: '/api/placeholder/40/40',
                },
                currentRank: 1,
                previousRank: 3,
                rankChange: 2,
                score: 89,
                previousScore: 67,
                scoreChange: 22,
                streak: 7,
                bestStreak: 7,
                participationDays: 7,
                achievementsUnlocked: 4,
                totalActivities: 89,
                timeInLeaderboard: 7,
                rewardsEarned: [],
                totalRewardValue: 0,
              },
            ],
          },
        ];

        const mockCompetitions: Competition[] = [
          {
            id: '1',
            name: 'Winter Challenge 2024',
            description: 'Compete in the ultimate winter tournament',
            type: 'tournament',
            category: 'seasonal',
            registrationStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            registrationEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            competitionStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            competitionEnd: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            maxParticipants: 1000,
            currentParticipants: 743,
            entryFee: 50,
            prizePool: { coins: 10000, gems: 500, xp: 50000 },
            rewardStructure: {
              1: { coins: 3000, gems: 200, xp: 15000, title: 'Winter Champion' },
              2: { coins: 2000, gems: 150, xp: 10000, title: 'Winter Master' },
              3: { coins: 1500, gems: 100, xp: 7500, title: 'Winter Expert' },
            },
            status: 'registration',
            isPublic: true,
            isFeatured: true,
            bannerImage: '/api/placeholder/800/300',
          },
          {
            id: '2',
            name: 'Speed Run Challenge',
            description: 'Complete tasks as fast as possible',
            type: 'race',
            category: 'skill',
            registrationStart: new Date().toISOString(),
            registrationEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            competitionStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            competitionEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            maxParticipants: 500,
            currentParticipants: 234,
            entryFee: 25,
            prizePool: { coins: 5000, gems: 250 },
            rewardStructure: {
              1: { coins: 1500, gems: 100, title: 'Speed Demon' },
              2: { coins: 1000, gems: 75, title: 'Quick Master' },
              3: { coins: 750, gems: 50, title: 'Swift Runner' },
            },
            status: 'registration',
            isPublic: true,
            isFeatured: false,
          },
        ];

        const mockUserPosition: LeaderboardEntry = {
          id: 'user-pos',
          userId: 'current-user',
          user: {
            id: 'current-user',
            name: 'You',
            email: 'you@example.com',
          },
          currentRank: 23,
          previousRank: 28,
          rankChange: 5,
          score: 2145,
          previousScore: 1890,
          scoreChange: 255,
          streak: 6,
          bestStreak: 9,
          participationDays: 20,
          achievementsUnlocked: 12,
          totalActivities: 87,
          timeInLeaderboard: 20,
          rewardsEarned: [],
          totalRewardValue: 0,
        };

        setLeaderboards(mockLeaderboards);
        setCompetitions(mockCompetitions);
        setUserPosition(mockUserPosition);
        setSelectedLeaderboard(mockLeaderboards[0]);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getRankChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-100';
    if (change < 0) return 'text-red-600 bg-red-100';
    return 'text-muted-foreground bg-gray-100';
  };

  const getCompetitionStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'registration': return 'text-green-600 bg-green-100';
      case 'active': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const progressData = [
    { day: 'Mon', rank: 28, score: 1650 },
    { day: 'Tue', rank: 26, score: 1720 },
    { day: 'Wed', rank: 25, score: 1890 },
    { day: 'Thu', rank: 24, score: 1950 },
    { day: 'Fri', rank: 23, score: 2045 },
    { day: 'Sat', rank: 23, score: 2120 },
    { day: 'Sun', rank: 23, score: 2145 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-yellow-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
            Leaderboards & Competitions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compete with others, climb the rankings, and win amazing prizes
          </p>
        </motion.div>

        {/* User Position Summary */}
        {userPosition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">#{userPosition.currentRank}</div>
                      <div className="flex items-center justify-center space-x-1">
                        {getRankChangeIcon(userPosition.rankChange)}
                        <span className="text-sm">
                          {Math.abs(userPosition.rankChange)} {userPosition.rankChange > 0 ? 'up' : userPosition.rankChange < 0 ? 'down' : ''}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Your Global Ranking</h2>
                      <p className="text-lg opacity-90">Current Score: {userPosition.score.toLocaleString()}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {userPosition.streak} day streak
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {userPosition.achievementsUnlocked} achievements
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <ResponsiveContainer width={300} height={120}>
                      <AreaChart data={progressData}>
                        <Area type="monotone" dataKey="score" stroke="#ffffff" fill="#ffffff" fillOpacity={0.3} />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px' }}
                          labelStyle={{ color: '#000' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="global">Global Leaderboards</TabsTrigger>
            <TabsTrigger value="competitions">Active Competitions</TabsTrigger>
            <TabsTrigger value="personal">Personal Stats</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leaderboards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="all_time">All Time</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="skill">Skill-based</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Custom
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaderboard List */}
              <div className="lg:col-span-1 space-y-4">
                {leaderboards.map((leaderboard) => (
                  <Card 
                    key={leaderboard.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedLeaderboard?.id === leaderboard.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedLeaderboard(leaderboard)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{leaderboard.name}</CardTitle>
                        <Badge variant="outline" className={leaderboard.isCompetition ? 'bg-orange-100 text-orange-700' : ''}>
                          {leaderboard.period}
                        </Badge>
                      </div>
                      <CardDescription>{leaderboard.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{leaderboard.participantCount} participants</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Leaderboard */}
              {selectedLeaderboard && (
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">{selectedLeaderboard.name}</CardTitle>
                          <CardDescription className="text-lg">{selectedLeaderboard.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedLeaderboard.entries.slice(0, 10).map((entry, index) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center space-x-4 p-4 rounded-lg border ${
                              entry.currentRank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-center w-12">
                              {getRankIcon(entry.currentRank)}
                            </div>
                            
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={entry.user.avatar} />
                              <AvatarFallback>
                                {entry.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-lg">{entry.user.name}</h4>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-blue-600">
                                    {entry.score.toLocaleString()}
                                  </p>
                                  <div className="flex items-center justify-end space-x-1">
                                    {getRankChangeIcon(entry.rankChange)}
                                    <span className={`text-sm font-medium ${
                                      entry.rankChange > 0 ? 'text-green-600' : 
                                      entry.rankChange < 0 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                      {entry.rankChange > 0 ? '+' : ''}{entry.rankChange}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Target className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm text-muted-foreground">
                                    {entry.streak} streak
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm text-muted-foreground">
                                    {entry.achievementsUnlocked} achievements
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm text-muted-foreground">
                                    {entry.participationDays} days
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Rewards Section */}
                      {Object.keys(selectedLeaderboard.rewardStructure).length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h3 className="text-lg font-semibold mb-4">Rewards</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(selectedLeaderboard.rewardStructure).slice(0, 3).map(([position, rewards]: [string, any]) => (
                              <div key={position} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                                <div className="text-2xl font-bold mb-2">
                                  {position === '1' ? '🥇' : position === '2' ? '🥈' : '🥉'} #{position}
                                </div>
                                <div className="space-y-2">
                                  {rewards.xp && (
                                    <div className="flex items-center justify-center space-x-2">
                                      <Zap className="h-4 w-4 text-blue-500" />
                                      <span className="text-sm">+{rewards.xp} XP</span>
                                    </div>
                                  )}
                                  {rewards.coins && (
                                    <div className="flex items-center justify-center space-x-2">
                                      <Coins className="h-4 w-4 text-yellow-500" />
                                      <span className="text-sm">+{rewards.coins} Coins</span>
                                    </div>
                                  )}
                                  {rewards.gems && (
                                    <div className="flex items-center justify-center space-x-2">
                                      <Gem className="h-4 w-4 text-purple-500" />
                                      <span className="text-sm">+{rewards.gems} Gems</span>
                                    </div>
                                  )}
                                  {rewards.title && (
                                    <div className="flex items-center justify-center space-x-2">
                                      <Award className="h-4 w-4 text-orange-500" />
                                      <span className="text-sm">{rewards.title}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="competitions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {competitions.map((competition) => (
                <Card key={competition.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    {competition.bannerImage && (
                      <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                        <Trophy className="h-16 w-16 text-white" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{competition.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCompetitionStatusColor(competition.status)}>
                          {competition.status}
                        </Badge>
                        {competition.isFeatured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-base">{competition.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Competition Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Participants</p>
                          <p className="text-lg font-bold">
                            {competition.currentParticipants}
                            {competition.maxParticipants && `/${competition.maxParticipants}`}
                          </p>
                          {competition.maxParticipants && (
                            <Progress 
                              value={(competition.currentParticipants / competition.maxParticipants) * 100} 
                              className="h-2 mt-1" 
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Entry Fee</p>
                          <div className="flex items-center space-x-2">
                            <Coins className="h-5 w-5 text-yellow-500" />
                            <span className="text-lg font-bold">{competition.entryFee}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Registration</span>
                          <span className="text-muted-foreground">
                            {new Date(competition.registrationEnd).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Competition</span>
                          <span className="text-muted-foreground">
                            {new Date(competition.competitionStart).toLocaleDateString()} - {new Date(competition.competitionEnd).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Prize Pool */}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Prize Pool</p>
                        <div className="flex items-center space-x-4">
                          {competition.prizePool.coins && (
                            <div className="flex items-center space-x-1">
                              <Coins className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{competition.prizePool.coins.toLocaleString()}</span>
                            </div>
                          )}
                          {competition.prizePool.gems && (
                            <div className="flex items-center space-x-1">
                              <Gem className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">{competition.prizePool.gems.toLocaleString()}</span>
                            </div>
                          )}
                          {competition.prizePool.xp && (
                            <div className="flex items-center space-x-1">
                              <Zap className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{competition.prizePool.xp.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {competition.status === 'registration' && (
                          <Button>
                            <Flag className="h-4 w-4 mr-2" />
                            Register Now
                          </Button>
                        )}
                        
                        {competition.status === 'active' && (
                          <Button>
                            <Target className="h-4 w-4 mr-2" />
                            Join Competition
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            {userPosition && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Performance</CardTitle>
                    <CardDescription>Detailed breakdown of your ranking performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-3xl font-bold text-blue-600">{userPosition.currentRank}</p>
                          <p className="text-sm text-muted-foreground">Current Rank</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-3xl font-bold text-green-600">{userPosition.score.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Score</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <p className="text-3xl font-bold text-orange-600">{userPosition.streak}</p>
                          <p className="text-sm text-muted-foreground">Current Streak</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-3xl font-bold text-purple-600">{userPosition.achievementsUnlocked}</p>
                          <p className="text-sm text-muted-foreground">Achievements</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Rank Change</span>
                          <div className="flex items-center space-x-2">
                            {getRankChangeIcon(userPosition.rankChange)}
                            <Badge className={getRankChangeColor(userPosition.rankChange)}>
                              {userPosition.rankChange > 0 ? '+' : ''}{userPosition.rankChange} positions
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Score Change</span>
                          <span className={`font-medium ${
                            userPosition.scoreChange > 0 ? 'text-green-600' : 
                            userPosition.scoreChange < 0 ? 'text-red-600' : 'text-muted-foreground'
                          }`}>
                            {userPosition.scoreChange > 0 ? '+' : ''}{userPosition.scoreChange.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Best Streak</span>
                          <span className="font-medium">{userPosition.bestStreak} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Participation Days</span>
                          <span className="font-medium">{userPosition.participationDays} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Activities</span>
                          <span className="font-medium">{userPosition.totalActivities}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                    <CardDescription>Your ranking and score progression this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="score" orientation="left" />
                        <YAxis yAxisId="rank" orientation="right" reversed />
                        <Tooltip />
                        <Legend />
                        <Area 
                          yAxisId="score"
                          type="monotone" 
                          dataKey="score" 
                          stackId="1" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.6}
                          name="Score"
                        />
                        <Area 
                          yAxisId="rank"
                          type="monotone" 
                          dataKey="rank" 
                          stackId="2" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.4}
                          name="Rank"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                      <p className="text-3xl font-bold">2,139</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+12% from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Competitions</p>
                      <p className="text-3xl font-bold">8</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-blue-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>3 starting soon</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Competition</p>
                      <p className="text-3xl font-bold">156</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>participants per event</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Prize Pool</p>
                      <p className="text-3xl font-bold">250K</p>
                    </div>
                    <Gift className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>total coins distributed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeaderboardsDashboard;
