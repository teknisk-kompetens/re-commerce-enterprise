
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Flame,
  Star,
  Trophy,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Award,
  Gift,
  Zap,
  Coins,
  Gem,
  Users,
  BarChart3,
  Filter,
  Search,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  RefreshCw,
  Timer,
  Flag,
  Sparkles,
  Heart,
  Brain,
  Gamepad2,
  MessageSquare,
  Camera,
  Code,
  Palette,
  Music,
  Book,
  Dumbbell,
  Coffee,
  Lightbulb,
  ThumbsUp,
  ArrowRight,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  Activity
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  objective: string;
  targetValue: number;
  criteria: any;
  baseReward: { [currency: string]: number };
  bonusReward: { [currency: string]: number };
  streakMultiplier: number;
  availableDate: string;
  expiresAt: string;
  duration: number;
  difficulty: string;
  rarity: string;
  isRepeating: boolean;
  repeatInterval?: string;
  maxCompletions: number;
  totalParticipants: number;
  completionRate: number;
  averageTimeToComplete?: number;
  userProgress?: {
    currentProgress: number;
    targetProgress: number;
    progressPercentage: number;
    isCompleted: boolean;
    completedAt?: string;
    timeToComplete?: number;
    rewardsEarned?: { [currency: string]: number };
    bonusEarned?: { [currency: string]: number };
    activities: any[];
    milestones: any[];
  };
}

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  streakBonus: number;
  nextMilestone: number;
  daysUntilMilestone: number;
  streakHistory: { date: string; completed: boolean }[];
}

interface ChallengeStats {
  totalCompleted: number;
  totalPoints: number;
  averageCompletion: number;
  favoriteCategory: string;
  completionByDifficulty: { [difficulty: string]: number };
  completionByCategory: { [category: string]: number };
  weeklyProgress: { day: string; completed: number; points: number }[];
}

const DailyChallengesDashboard: React.FC = () => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<DailyChallenge[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [challengeStats, setChallengeStats] = useState<ChallengeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<DailyChallenge | null>(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const fetchChallengesData = async () => {
      try {
        setLoading(true);
        
        // Mock challenges data
        const mockChallenges: DailyChallenge[] = [
          {
            id: '1',
            name: 'Daily Login Champion',
            description: 'Login to the platform every day this week',
            category: 'login',
            type: 'simple',
            objective: 'Complete daily login',
            targetValue: 1,
            criteria: { action: 'login', frequency: 'daily' },
            baseReward: { xp: 50, coins: 10 },
            bonusReward: { reputation: 5 },
            streakMultiplier: 1.2,
            availableDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 24,
            difficulty: 'easy',
            rarity: 'common',
            isRepeating: true,
            repeatInterval: 'daily',
            maxCompletions: 1,
            totalParticipants: 1247,
            completionRate: 89.2,
            averageTimeToComplete: 1,
            userProgress: {
              currentProgress: 1,
              targetProgress: 1,
              progressPercentage: 100,
              isCompleted: true,
              completedAt: new Date().toISOString(),
              timeToComplete: 1,
              rewardsEarned: { xp: 60, coins: 12 }, // With streak bonus
              bonusEarned: { reputation: 5 },
              activities: [
                { timestamp: new Date().toISOString(), action: 'login', increment: 1 }
              ],
              milestones: ['completed'],
            },
          },
          {
            id: '2',
            name: 'Social Butterfly',
            description: 'Share 3 achievements on social media',
            category: 'social',
            type: 'progressive',
            objective: 'Share achievements',
            targetValue: 3,
            criteria: { action: 'share', type: 'achievement', count: 3 },
            baseReward: { xp: 100, coins: 25, reputation: 10 },
            bonusReward: { gems: 5 },
            streakMultiplier: 1.1,
            availableDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 24,
            difficulty: 'medium',
            rarity: 'uncommon',
            isRepeating: false,
            maxCompletions: 1,
            totalParticipants: 892,
            completionRate: 34.7,
            averageTimeToComplete: 120,
            userProgress: {
              currentProgress: 1,
              targetProgress: 3,
              progressPercentage: 33.3,
              isCompleted: false,
              activities: [
                { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), action: 'share', platform: 'twitter', increment: 1 }
              ],
              milestones: ['first_share'],
            },
          },
          {
            id: '3',
            name: 'Knowledge Seeker',
            description: 'Complete 5 learning modules today',
            category: 'learning',
            type: 'progressive',
            objective: 'Complete learning modules',
            targetValue: 5,
            criteria: { action: 'complete', type: 'learning_module', count: 5 },
            baseReward: { xp: 150, coins: 30, reputation: 15 },
            bonusReward: { gems: 8 },
            streakMultiplier: 1.15,
            availableDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 24,
            difficulty: 'hard',
            rarity: 'rare',
            isRepeating: false,
            maxCompletions: 1,
            totalParticipants: 456,
            completionRate: 21.3,
            averageTimeToComplete: 180,
            userProgress: {
              currentProgress: 2,
              targetProgress: 5,
              progressPercentage: 40,
              isCompleted: false,
              activities: [
                { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), action: 'complete', module: 'React Basics', increment: 1 },
                { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), action: 'complete', module: 'TypeScript Fundamentals', increment: 1 }
              ],
              milestones: ['first_module', 'second_module'],
            },
          },
          {
            id: '4',
            name: 'Community Helper',
            description: 'Help 3 other users by commenting on their posts',
            category: 'community',
            type: 'social',
            objective: 'Help other users',
            targetValue: 3,
            criteria: { action: 'comment', target: 'user_posts', helpful: true, count: 3 },
            baseReward: { xp: 75, reputation: 25 },
            bonusReward: { coins: 20 },
            streakMultiplier: 1.1,
            availableDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 24,
            difficulty: 'medium',
            rarity: 'uncommon',
            isRepeating: false,
            maxCompletions: 1,
            totalParticipants: 634,
            completionRate: 42.1,
            userProgress: {
              currentProgress: 0,
              targetProgress: 3,
              progressPercentage: 0,
              isCompleted: false,
              activities: [],
              milestones: [],
            },
          },
          {
            id: '5',
            name: 'Creative Genius',
            description: 'Upload and share an original creation',
            category: 'creative',
            type: 'simple',
            objective: 'Share original content',
            targetValue: 1,
            criteria: { action: 'upload', type: 'original_content', share: true },
            baseReward: { xp: 200, coins: 50, reputation: 30 },
            bonusReward: { gems: 15 },
            streakMultiplier: 1.0,
            availableDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            duration: 24,
            difficulty: 'expert',
            rarity: 'epic',
            isRepeating: false,
            maxCompletions: 1,
            totalParticipants: 234,
            completionRate: 12.8,
            averageTimeToComplete: 240,
            userProgress: {
              currentProgress: 0,
              targetProgress: 1,
              progressPercentage: 0,
              isCompleted: false,
              activities: [],
              milestones: [],
            },
          },
        ];

        // Mock streak info
        const mockStreakInfo: StreakInfo = {
          currentStreak: 7,
          longestStreak: 15,
          streakBonus: 20, // 20% bonus
          nextMilestone: 10,
          daysUntilMilestone: 3,
          streakHistory: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: Math.random() > 0.3, // 70% completion rate
          })),
        };

        // Mock challenge stats
        const mockChallengeStats: ChallengeStats = {
          totalCompleted: 89,
          totalPoints: 12450,
          averageCompletion: 78.5,
          favoriteCategory: 'learning',
          completionByDifficulty: {
            easy: 45,
            medium: 28,
            hard: 12,
            expert: 4,
          },
          completionByCategory: {
            login: 25,
            social: 18,
            learning: 22,
            community: 15,
            creative: 9,
          },
          weeklyProgress: [
            { day: 'Mon', completed: 3, points: 245 },
            { day: 'Tue', completed: 4, points: 380 },
            { day: 'Wed', completed: 2, points: 150 },
            { day: 'Thu', completed: 5, points: 420 },
            { day: 'Fri', completed: 3, points: 290 },
            { day: 'Sat', completed: 4, points: 350 },
            { day: 'Sun', completed: 3, points: 275 },
          ],
        };

        setChallenges(mockChallenges);
        setFilteredChallenges(mockChallenges);
        setStreakInfo(mockStreakInfo);
        setChallengeStats(mockChallengeStats);
      } catch (error) {
        console.error('Error fetching challenges data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengesData();
  }, [selectedDate]);

  // Filter challenges based on criteria
  useEffect(() => {
    let filtered = challenges;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    if (showCompletedOnly) {
      filtered = filtered.filter(challenge => challenge.userProgress?.isCompleted);
    }

    if (searchTerm) {
      filtered = filtered.filter(challenge => 
        challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChallenges(filtered);
  }, [challenges, selectedCategory, selectedDifficulty, showCompletedOnly, searchTerm]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'login': return Coffee;
      case 'social': return Users;
      case 'learning': return Book;
      case 'community': return Heart;
      case 'creative': return Palette;
      case 'activity': return Activity;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'login': return 'text-orange-600 bg-orange-100';
      case 'social': return 'text-blue-600 bg-blue-100';
      case 'learning': return 'text-green-600 bg-green-100';
      case 'community': return 'text-pink-600 bg-pink-100';
      case 'creative': return 'text-purple-600 bg-purple-100';
      case 'activity': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'xp': return Zap;
      case 'coins': return Coins;
      case 'gems': return Gem;
      case 'reputation': return Star;
      default: return Coins;
    }
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'xp': return 'text-blue-500';
      case 'coins': return 'text-yellow-500';
      case 'gems': return 'text-purple-500';
      case 'reputation': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleStartChallenge = async (challenge: DailyChallenge) => {
    setSelectedChallenge(challenge);
    setShowProgressDialog(true);
  };

  const handleProgressUpdate = async (challenge: DailyChallenge, increment: number = 1) => {
    try {
      // Mock progress update
      const updatedChallenges = challenges.map(c => {
        if (c.id === challenge.id && c.userProgress) {
          const newProgress = Math.min(c.userProgress.currentProgress + increment, c.targetValue);
          const progressPercentage = (newProgress / c.targetValue) * 100;
          const isCompleted = newProgress >= c.targetValue;
          
          return {
            ...c,
            userProgress: {
              ...c.userProgress,
              currentProgress: newProgress,
              progressPercentage,
              isCompleted,
              completedAt: isCompleted ? new Date().toISOString() : c.userProgress.completedAt,
              activities: [
                ...c.userProgress.activities,
                {
                  timestamp: new Date().toISOString(),
                  action: 'progress_update',
                  increment,
                }
              ],
            },
          };
        }
        return c;
      });
      
      setChallenges(updatedChallenges);
      
      if (increment > 0) {
        alert(`Progress updated! +${increment} towards "${challenge.name}"`);
      }
    } catch (error) {
      console.error('Progress update error:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  const completionByDifficultyData = challengeStats ? Object.entries(challengeStats.completionByDifficulty).map(([difficulty, count]) => ({
    difficulty,
    count,
    color: difficulty === 'easy' ? '#10B981' :
           difficulty === 'medium' ? '#F59E0B' :
           difficulty === 'hard' ? '#EF4444' : '#8B5CF6'
  })) : [];

  const completionByCategoryData = challengeStats ? Object.entries(challengeStats.completionByCategory).map(([category, count]) => ({
    category,
    count,
    color: category === 'login' ? '#F97316' :
           category === 'social' ? '#3B82F6' :
           category === 'learning' ? '#10B981' :
           category === 'community' ? '#EC4899' : '#8B5CF6'
  })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Target className="h-16 w-16 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading daily challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Daily Challenges
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete daily challenges to earn rewards, maintain your streak, and level up your skills
          </p>
        </motion.div>

        {/* Streak Info */}
        {streakInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <Flame className="h-16 w-16 mx-auto mb-2 text-orange-200" />
                      <div className="text-4xl font-bold">{streakInfo.currentStreak}</div>
                      <div className="text-sm opacity-75">Day Streak</div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">You're on Fire! 🔥</h2>
                      <p className="text-lg opacity-90">
                        {streakInfo.daysUntilMilestone} more days to reach {streakInfo.nextMilestone} day milestone
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          +{streakInfo.streakBonus}% bonus rewards
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          Best: {streakInfo.longestStreak} days
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-7 gap-1">
                      {streakInfo.streakHistory.slice(-21).map((day, index) => (
                        <div
                          key={index}
                          className={`w-4 h-4 rounded-sm ${
                            day.completed ? 'bg-white/80' : 'bg-white/20'
                          }`}
                          title={`${day.date}: ${day.completed ? 'Completed' : 'Missed'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs opacity-75 text-center mt-2">Last 3 weeks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today's Challenges</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="history">Challenge History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search challenges..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="login">Login</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Difficulties</SelectItem>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        variant={showCompletedOnly ? "default" : "outline"}
                        onClick={() => setShowCompletedOnly(!showCompletedOnly)}
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed Only
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Challenges Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredChallenges.map((challenge, index) => {
                  const CategoryIcon = getCategoryIcon(challenge.category);
                  const isCompleted = challenge.userProgress?.isCompleted;
                  const progress = challenge.userProgress?.progressPercentage || 0;
                  const timeRemaining = new Date(challenge.expiresAt).getTime() - Date.now();
                  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
                  
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                        isCompleted ? 'ring-2 ring-green-200 bg-green-50' : 'hover:ring-2 hover:ring-blue-200'
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                                {isCompleted ? (
                                  <CheckCircle className="h-8 w-8 text-green-600" />
                                ) : (
                                  <CategoryIcon className="h-8 w-8 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{challenge.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getCategoryColor(challenge.category)}>
                                    {challenge.category}
                                  </Badge>
                                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                                    {challenge.difficulty}
                                  </Badge>
                                  <Badge className={getRarityColor(challenge.rarity)}>
                                    {challenge.rarity}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{hoursRemaining}h left</span>
                              </div>
                              {challenge.isRepeating && (
                                <Badge variant="outline" className="mt-1">
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Daily
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-muted-foreground">{challenge.description}</p>
                            
                            {/* Progress */}
                            {challenge.userProgress && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Progress</span>
                                  <span className="text-sm text-muted-foreground">
                                    {challenge.userProgress.currentProgress} / {challenge.targetValue}
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                {isCompleted && challenge.userProgress.completedAt && (
                                  <div className="flex items-center text-green-600 text-sm">
                                    <Trophy className="h-4 w-4 mr-1" />
                                    <span>
                                      Completed {new Date(challenge.userProgress.completedAt).toLocaleTimeString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Rewards */}
                            <div className="space-y-2">
                              <span className="text-sm font-medium">Rewards</span>
                              <div className="flex items-center space-x-4">
                                {Object.entries(challenge.baseReward).map(([currency, amount]) => {
                                  const Icon = getCurrencyIcon(currency);
                                  const colorClass = getCurrencyColor(currency);
                                  const streakBonus = Math.round(amount * (streakInfo?.streakBonus || 0) / 100);
                                  const totalAmount = amount + streakBonus;
                                  
                                  return (
                                    <div key={currency} className="flex items-center space-x-1">
                                      <Icon className={`h-4 w-4 ${colorClass}`} />
                                      <span className="text-sm font-medium">
                                        +{totalAmount}
                                        {streakBonus > 0 && (
                                          <span className="text-orange-600"> (+{streakBonus})</span>
                                        )}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{challenge.totalParticipants} participants</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BarChart3 className="h-4 w-4" />
                                <span>{challenge.completionRate.toFixed(1)}% completed</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="pt-2">
                              {isCompleted ? (
                                <Button variant="outline" className="w-full" disabled>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Completed
                                </Button>
                              ) : progress > 0 ? (
                                <Button 
                                  className="w-full" 
                                  onClick={() => handleProgressUpdate(challenge, 1)}
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Continue Challenge
                                </Button>
                              ) : (
                                <Button 
                                  className="w-full" 
                                  onClick={() => handleStartChallenge(challenge)}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Challenge
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {challengeStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Completed</p>
                        <p className="text-3xl font-bold">{challengeStats.totalCompleted}</p>
                      </div>
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                        <p className="text-3xl font-bold">{challengeStats.totalPoints.toLocaleString()}</p>
                      </div>
                      <Star className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
                        <p className="text-3xl font-bold">{challengeStats.averageCompletion.toFixed(1)}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Favorite Category</p>
                        <p className="text-2xl font-bold capitalize">{challengeStats.favoriteCategory}</p>
                      </div>
                      {React.createElement(getCategoryIcon(challengeStats.favoriteCategory), { 
                        className: "h-8 w-8 text-purple-500" 
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Weekly Progress Chart */}
            {challengeStats && (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Your challenge completion and points earned this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={challengeStats.weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="completed" orientation="left" />
                      <YAxis yAxisId="points" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area 
                        yAxisId="completed"
                        type="monotone" 
                        dataKey="completed" 
                        stackId="1" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6}
                        name="Challenges Completed"
                      />
                      <Area 
                        yAxisId="points"
                        type="monotone" 
                        dataKey="points" 
                        stackId="2" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.4}
                        name="Points Earned"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge History</CardTitle>
                <CardDescription>Your completed challenges and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Challenge History</h3>
                  <p className="text-muted-foreground">View your past challenge completions and streaks</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {challengeStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completion by Difficulty */}
                <Card>
                  <CardHeader>
                    <CardTitle>Completion by Difficulty</CardTitle>
                    <CardDescription>Your performance across different difficulty levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={completionByDifficultyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="difficulty" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          {completionByDifficultyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Completion by Category */}
                <Card>
                  <CardHeader>
                    <CardTitle>Completion by Category</CardTitle>
                    <CardDescription>Your activity across different challenge categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={completionByCategoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="count"
                          label={({ category, count }) => `${category}: ${count}`}
                        >
                          {completionByCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
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
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-4"
        >
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700">
            <Lightbulb className="h-5 w-5 mr-2" />
            Suggest Challenge
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="h-5 w-5 mr-2" />
            Challenge Settings
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-5 w-5 mr-2" />
            Share Progress
          </Button>
        </motion.div>

        {/* Challenge Start Dialog */}
        <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Challenge</DialogTitle>
              <DialogDescription>
                Ready to begin this challenge?
              </DialogDescription>
            </DialogHeader>
            
            {selectedChallenge && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {React.createElement(getCategoryIcon(selectedChallenge.category), { 
                      className: "h-8 w-8 text-blue-600" 
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedChallenge.name}</h3>
                    <p className="text-muted-foreground">{selectedChallenge.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Objective</span>
                    <span className="text-muted-foreground">{selectedChallenge.objective}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Target</span>
                    <span className="text-muted-foreground">{selectedChallenge.targetValue}</span>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Rewards</h4>
                    {Object.entries(selectedChallenge.baseReward).map(([currency, amount]) => {
                      const Icon = getCurrencyIcon(currency);
                      const colorClass = getCurrencyColor(currency);
                      const streakBonus = Math.round(amount * (streakInfo?.streakBonus || 0) / 100);
                      const totalAmount = amount + streakBonus;
                      
                      return (
                        <div key={currency} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${colorClass}`} />
                            <span className="capitalize">{currency === 'xp' ? 'Experience' : currency}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">+{totalAmount}</p>
                            {streakBonus > 0 && (
                              <p className="text-sm text-orange-600">+{streakBonus} streak bonus</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
                    Maybe Later
                  </Button>
                  <Button 
                    onClick={() => {
                      handleProgressUpdate(selectedChallenge, 0); // Initialize progress
                      setShowProgressDialog(false);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Challenge
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DailyChallengesDashboard;
