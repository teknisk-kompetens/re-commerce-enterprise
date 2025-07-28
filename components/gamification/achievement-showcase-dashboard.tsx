
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Award,
  Crown,
  Medal,
  Sparkles,
  Target,
  Lock,
  Unlock,
  Heart,
  Share2,
  Eye,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Gift,
  Gem,
  Coins,
  Settings,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2
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
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  rarity: string;
  difficulty: string;
  pointValue: number;
  iconUrl?: string;
  badgeUrl?: string;
  color: string;
  gradientColors: string[];
  maxProgress?: number;
  xpReward: number;
  coinReward: number;
  gemReward: number;
  reputationReward: number;
  specialRewards: string[];
  isSecret: boolean;
  isRepeatable: boolean;
  isTimeLimited: boolean;
  availableUntil?: string;
  seasonId?: string;
  unlockedCount: number;
  userProgress?: {
    currentProgress: number;
    isUnlocked: boolean;
    unlockedAt?: string;
    isFavorite: boolean;
    progressPercentage: number;
  };
  globalStats: {
    unlockedCount: number;
    unlockRate: number;
  };
}

interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  completionRate: number;
  rarityDistribution: { [key: string]: number };
  categoryProgress: { [key: string]: { unlocked: number; total: number } };
}

const AchievementShowcaseDashboard: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        
        // Mock achievements data
        const mockAchievements: Achievement[] = [
          {
            id: '1',
            name: 'First Steps',
            description: 'Complete your first activity on the platform',
            category: 'milestone',
            type: 'binary',
            rarity: 'common',
            difficulty: 'easy',
            pointValue: 10,
            iconUrl: '/api/placeholder/64/64',
            color: '#10B981',
            gradientColors: ['#10B981', '#059669'],
            maxProgress: 1,
            xpReward: 50,
            coinReward: 10,
            gemReward: 0,
            reputationReward: 5,
            specialRewards: ['Welcome Badge'],
            isSecret: false,
            isRepeatable: false,
            isTimeLimited: false,
            unlockedCount: 1247,
            userProgress: {
              currentProgress: 1,
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
              isFavorite: true,
              progressPercentage: 100,
            },
            globalStats: {
              unlockedCount: 1247,
              unlockRate: 89.2,
            },
          },
          {
            id: '2',
            name: 'Social Butterfly',
            description: 'Share 10 achievements on social media',
            category: 'social',
            type: 'progress',
            rarity: 'uncommon',
            difficulty: 'medium',
            pointValue: 25,
            iconUrl: '/api/placeholder/64/64',
            color: '#3B82F6',
            gradientColors: ['#3B82F6', '#1D4ED8'],
            maxProgress: 10,
            xpReward: 150,
            coinReward: 50,
            gemReward: 5,
            reputationReward: 25,
            specialRewards: ['Social Media Badge', 'Viral Share Boost'],
            isSecret: false,
            isRepeatable: false,
            isTimeLimited: false,
            unlockedCount: 892,
            userProgress: {
              currentProgress: 7,
              isUnlocked: false,
              isFavorite: false,
              progressPercentage: 70,
            },
            globalStats: {
              unlockedCount: 892,
              unlockRate: 63.8,
            },
          },
          {
            id: '3',
            name: 'Level Master',
            description: 'Reach level 50',
            category: 'progression',
            type: 'threshold',
            rarity: 'rare',
            difficulty: 'hard',
            pointValue: 100,
            iconUrl: '/api/placeholder/64/64',
            color: '#8B5CF6',
            gradientColors: ['#8B5CF6', '#7C3AED'],
            maxProgress: 50,
            xpReward: 500,
            coinReward: 200,
            gemReward: 25,
            reputationReward: 100,
            specialRewards: ['Master Crown', 'XP Multiplier x2'],
            isSecret: false,
            isRepeatable: false,
            isTimeLimited: false,
            unlockedCount: 234,
            userProgress: {
              currentProgress: 12,
              isUnlocked: false,
              isFavorite: true,
              progressPercentage: 24,
            },
            globalStats: {
              unlockedCount: 234,
              unlockRate: 16.7,
            },
          },
          {
            id: '4',
            name: 'Hidden Champion',
            description: 'Unlock this secret achievement by completing special tasks',
            category: 'special',
            type: 'secret',
            rarity: 'legendary',
            difficulty: 'expert',
            pointValue: 500,
            iconUrl: '/api/placeholder/64/64',
            color: '#F59E0B',
            gradientColors: ['#F59E0B', '#D97706'],
            xpReward: 1000,
            coinReward: 500,
            gemReward: 100,
            reputationReward: 250,
            specialRewards: ['Legendary Crown', 'Secret Badge', 'Exclusive Title'],
            isSecret: true,
            isRepeatable: false,
            isTimeLimited: false,
            unlockedCount: 45,
            userProgress: {
              currentProgress: 0,
              isUnlocked: false,
              isFavorite: false,
              progressPercentage: 0,
            },
            globalStats: {
              unlockedCount: 45,
              unlockRate: 3.2,
            },
          },
          {
            id: '5',
            name: 'Speed Demon',
            description: 'Complete 5 challenges in under 1 hour',
            category: 'skill',
            type: 'time-based',
            rarity: 'epic',
            difficulty: 'hard',
            pointValue: 200,
            iconUrl: '/api/placeholder/64/64',
            color: '#EF4444',
            gradientColors: ['#EF4444', '#DC2626'],
            maxProgress: 5,
            xpReward: 300,
            coinReward: 100,
            gemReward: 15,
            reputationReward: 75,
            specialRewards: ['Speed Badge', 'Time Bonus x1.5'],
            isSecret: false,
            isRepeatable: true,
            isTimeLimited: false,
            unlockedCount: 156,
            userProgress: {
              currentProgress: 2,
              isUnlocked: false,
              isFavorite: false,
              progressPercentage: 40,
            },
            globalStats: {
              unlockedCount: 156,
              unlockRate: 11.1,
            },
          },
          {
            id: '6',
            name: 'Season Champion',
            description: 'Win the seasonal tournament',
            category: 'competitive',
            type: 'seasonal',
            rarity: 'mythic',
            difficulty: 'master',
            pointValue: 1000,
            iconUrl: '/api/placeholder/64/64',
            color: '#06B6D4',
            gradientColors: ['#06B6D4', '#0891B2'],
            xpReward: 2000,
            coinReward: 1000,
            gemReward: 200,
            reputationReward: 500,
            specialRewards: ['Champion Crown', 'Seasonal Trophy', 'Exclusive Avatar'],
            isSecret: false,
            isRepeatable: false,
            isTimeLimited: true,
            availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            seasonId: 'winter-2024',
            unlockedCount: 12,
            userProgress: {
              currentProgress: 0,
              isUnlocked: false,
              isFavorite: true,
              progressPercentage: 0,
            },
            globalStats: {
              unlockedCount: 12,
              unlockRate: 0.9,
            },
          },
        ];

        const mockStats: AchievementStats = {
          totalAchievements: mockAchievements.length,
          unlockedAchievements: mockAchievements.filter(a => a.userProgress?.isUnlocked).length,
          completionRate: 33.3,
          rarityDistribution: {
            common: 35,
            uncommon: 25,
            rare: 20,
            epic: 12,
            legendary: 6,
            mythic: 2,
          },
          categoryProgress: {
            milestone: { unlocked: 3, total: 8 },
            social: { unlocked: 2, total: 6 },
            skill: { unlocked: 1, total: 5 },
            progression: { unlocked: 1, total: 4 },
            competitive: { unlocked: 0, total: 3 },
            special: { unlocked: 0, total: 2 },
          },
        };

        setAchievements(mockAchievements);
        setFilteredAchievements(mockAchievements);
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Filter achievements based on selected criteria
  useEffect(() => {
    let filtered = achievements;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(a => a.rarity === selectedRarity);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(a => a.difficulty === selectedDifficulty);
    }

    if (showUnlockedOnly) {
      filtered = filtered.filter(a => a.userProgress?.isUnlocked);
    }

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAchievements(filtered);
  }, [achievements, selectedCategory, selectedRarity, selectedDifficulty, showUnlockedOnly, searchTerm]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      case 'mythic': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      case 'master': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return Medal;
      case 'uncommon': return Star;
      case 'rare': return Award;
      case 'epic': return Trophy;
      case 'legendary': return Crown;
      case 'mythic': return Sparkles;
      default: return Medal;
    }
  };

  const rarityDistributionData = stats ? Object.entries(stats.rarityDistribution).map(([rarity, count]) => ({
    name: rarity,
    value: count,
    color: rarity === 'common' ? '#6B7280' :
           rarity === 'uncommon' ? '#10B981' :
           rarity === 'rare' ? '#3B82F6' :
           rarity === 'epic' ? '#8B5CF6' :
           rarity === 'legendary' ? '#F59E0B' : '#EC4899'
  })) : [];

  const categoryProgressData = stats ? Object.entries(stats.categoryProgress).map(([category, progress]) => ({
    category,
    unlocked: progress.unlocked,
    total: progress.total,
    percentage: (progress.unlocked / progress.total) * 100
  })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-yellow-500 animate-bounce mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Achievement Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, unlock, and showcase your achievements. Track your progress and compete with others.
          </p>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Achievements</p>
                    <p className="text-3xl font-bold">{stats.totalAchievements}</p>
                  </div>
                  <Trophy className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Unlocked</p>
                    <p className="text-3xl font-bold">{stats.unlockedAchievements}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Completion Rate</p>
                    <p className="text-3xl font-bold">{stats.completionRate.toFixed(1)}%</p>
                  </div>
                  <Target className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Favorites</p>
                    <p className="text-3xl font-bold">{achievements.filter(a => a.userProgress?.isFavorite).length}</p>
                  </div>
                  <Heart className="h-12 w-12 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters and Search */}
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
                      placeholder="Search achievements..."
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
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="skill">Skill</SelectItem>
                      <SelectItem value="progression">Progression</SelectItem>
                      <SelectItem value="competitive">Competitive</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                      <SelectItem value="mythic">Mythic</SelectItem>
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
                      <SelectItem value="master">Master</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant={showUnlockedOnly ? "default" : "outline"}
                    onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unlocked Only
                  </Button>
                  
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Rarity Distribution</CardTitle>
              <CardDescription>Distribution of achievements by rarity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rarityDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {rarityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Progress</CardTitle>
              <CardDescription>Your progress in each achievement category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="unlocked" fill="#10B981" name="Unlocked" />
                  <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Achievements ({filteredAchievements.length})
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom
              </Button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredAchievements.map((achievement, index) => {
                  const RarityIcon = getRarityIcon(achievement.rarity);
                  const isUnlocked = achievement.userProgress?.isUnlocked;
                  const isSecret = achievement.isSecret && !isUnlocked;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card 
                            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                              isUnlocked ? 'ring-2 ring-green-200 bg-green-50' : 
                              achievement.userProgress?.isFavorite ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                            }`}
                            onClick={() => setSelectedAchievement(achievement)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-3 rounded-full ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    {isSecret ? (
                                      <Lock className="h-8 w-8 text-gray-400" />
                                    ) : (
                                      <RarityIcon className={`h-8 w-8 ${isUnlocked ? 'text-green-600' : 'text-gray-400'}`} />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg">
                                      {isSecret ? '??? Hidden Achievement' : achievement.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge className={getRarityColor(achievement.rarity)}>
                                        {achievement.rarity}
                                      </Badge>
                                      <Badge className={getDifficultyColor(achievement.difficulty)}>
                                        {achievement.difficulty}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                  {achievement.userProgress?.isFavorite && (
                                    <Heart className="h-5 w-5 text-red-500 fill-current" />
                                  )}
                                  {isUnlocked && (
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                  )}
                                  {achievement.isTimeLimited && (
                                    <Clock className="h-5 w-5 text-orange-500" />
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-4">
                                {isSecret ? 'Complete special tasks to unlock this hidden achievement' : achievement.description}
                              </p>
                              
                              {achievement.userProgress && !isUnlocked && achievement.maxProgress && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Progress</span>
                                    <span className="text-sm text-muted-foreground">
                                      {achievement.userProgress.currentProgress} / {achievement.maxProgress}
                                    </span>
                                  </div>
                                  <Progress value={achievement.userProgress.progressPercentage} className="h-2" />
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-2">
                                  <Zap className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium">+{achievement.pointValue} pts</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{achievement.globalStats.unlockRate.toFixed(1)}% unlocked</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                      </Dialog>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredAchievements.map((achievement, index) => {
                    const RarityIcon = getRarityIcon(achievement.rarity);
                    const isUnlocked = achievement.userProgress?.isUnlocked;
                    const isSecret = achievement.isSecret && !isUnlocked;
                    
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`p-6 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                          isUnlocked ? 'bg-green-50' : ''
                        }`}
                        onClick={() => setSelectedAchievement(achievement)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {isSecret ? (
                              <Lock className="h-8 w-8 text-gray-400" />
                            ) : (
                              <RarityIcon className={`h-8 w-8 ${isUnlocked ? 'text-green-600' : 'text-gray-400'}`} />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-lg">
                                {isSecret ? '??? Hidden Achievement' : achievement.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={getRarityColor(achievement.rarity)}>
                                  {achievement.rarity}
                                </Badge>
                                <Badge className={getDifficultyColor(achievement.difficulty)}>
                                  {achievement.difficulty}
                                </Badge>
                                {achievement.userProgress?.isFavorite && (
                                  <Heart className="h-5 w-5 text-red-500 fill-current" />
                                )}
                                {isUnlocked && (
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mt-2">
                              {isSecret ? 'Complete special tasks to unlock this hidden achievement' : achievement.description}
                            </p>
                            
                            {achievement.userProgress && !isUnlocked && achievement.maxProgress && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Progress</span>
                                  <span className="text-sm text-muted-foreground">
                                    {achievement.userProgress.currentProgress} / {achievement.maxProgress}
                                  </span>
                                </div>
                                <Progress value={achievement.userProgress.progressPercentage} className="h-2" />
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Zap className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium">+{achievement.pointValue} pts</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{achievement.globalStats.unlockRate.toFixed(1)}% unlocked</span>
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Achievement Detail Modal */}
        {selectedAchievement && (
          <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                    {React.createElement(getRarityIcon(selectedAchievement.rarity), { 
                      className: "h-8 w-8 text-white" 
                    })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedAchievement.isSecret && !selectedAchievement.userProgress?.isUnlocked 
                        ? '??? Hidden Achievement' 
                        : selectedAchievement.name}
                    </h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getRarityColor(selectedAchievement.rarity)}>
                        {selectedAchievement.rarity}
                      </Badge>
                      <Badge className={getDifficultyColor(selectedAchievement.difficulty)}>
                        {selectedAchievement.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {selectedAchievement.category}
                      </Badge>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {selectedAchievement.isSecret && !selectedAchievement.userProgress?.isUnlocked
                    ? 'Complete special tasks to unlock this hidden achievement'
                    : selectedAchievement.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Progress Section */}
                {selectedAchievement.userProgress && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Progress</h3>
                    {selectedAchievement.userProgress.isUnlocked ? (
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">Achievement Unlocked!</p>
                          <p className="text-sm text-green-600">
                            Unlocked on {new Date(selectedAchievement.userProgress.unlockedAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ) : selectedAchievement.maxProgress ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Progress</span>
                          <span className="text-muted-foreground">
                            {selectedAchievement.userProgress.currentProgress} / {selectedAchievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={selectedAchievement.userProgress.progressPercentage} className="h-3" />
                        <p className="text-sm text-muted-foreground">
                          {selectedAchievement.userProgress.progressPercentage.toFixed(1)}% complete
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground">Complete the required actions to unlock this achievement</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Rewards Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rewards</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedAchievement.xpReward > 0 && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Zap className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="font-semibold">+{selectedAchievement.xpReward}</p>
                        <p className="text-sm text-muted-foreground">XP</p>
                      </div>
                    )}
                    {selectedAchievement.coinReward > 0 && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <Coins className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                        <p className="font-semibold">+{selectedAchievement.coinReward}</p>
                        <p className="text-sm text-muted-foreground">Coins</p>
                      </div>
                    )}
                    {selectedAchievement.gemReward > 0 && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Gem className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="font-semibold">+{selectedAchievement.gemReward}</p>
                        <p className="text-sm text-muted-foreground">Gems</p>
                      </div>
                    )}
                    {selectedAchievement.reputationReward > 0 && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Star className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold">+{selectedAchievement.reputationReward}</p>
                        <p className="text-sm text-muted-foreground">Reputation</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedAchievement.specialRewards.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Special Rewards</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAchievement.specialRewards.map((reward, index) => (
                          <Badge key={index} variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100">
                            <Gift className="h-3 w-3 mr-1" />
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Global Stats */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Global Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedAchievement.globalStats.unlockedCount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Players Unlocked</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedAchievement.globalStats.unlockRate.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Unlock Rate</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedAchievement.userProgress?.isFavorite ? "default" : "outline"}
                      size="sm"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      {selectedAchievement.userProgress?.isFavorite ? 'Favorited' : 'Add to Favorites'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  
                  {selectedAchievement.userProgress?.isUnlocked && (
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      View Certificate
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AchievementShowcaseDashboard;
