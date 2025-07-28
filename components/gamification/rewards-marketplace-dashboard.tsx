
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Star,
  Crown,
  Gem,
  Coins,
  Zap,
  ShoppingCart,
  Heart,
  Filter,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Package,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Share2,
  Download,
  Upload,
  Settings,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Target,
  Ticket,
  Percent,
  DollarSign,
  CreditCard,
  Wallet,
  ShoppingBag,
  Store,
  Truck
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  cost: { [currency: string]: number };
  originalValue?: { [currency: string]: number };
  discountPercentage: number;
  isActive: boolean;
  stock?: number;
  maxPerUser?: number;
  levelRequirement: number;
  tierRequirement?: string;
  achievements: string[];
  imageUrl?: string;
  iconUrl?: string;
  rarity: string;
  availableFrom: string;
  availableUntil?: string;
  isLimitedTime: boolean;
  benefits: string[];
  duration?: number;
  stackable: boolean;
  tradeable: boolean;
  totalPurchases: number;
  popularity: number;
  canPurchase?: boolean;
  purchaseBlockers?: string[];
  userRedemptions?: any[];
  totalRedemptions: number;
}

interface UserBalance {
  xp: number;
  coins: number;
  gems: number;
  reputation: number;
}

interface RedemptionHistory {
  id: string;
  rewardItem: {
    id: string;
    name: string;
    imageUrl?: string;
    category: string;
  };
  quantity: number;
  totalCost: { [currency: string]: number };
  status: string;
  fulfilledAt?: string;
  expiresAt?: string;
  isUsed: boolean;
  usedAt?: string;
  remainingUses?: number;
  createdAt: string;
}

const RewardsMarketplaceDashboard: React.FC = () => {
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RewardItem[]>([]);
  const [userBalance, setUserBalance] = useState<UserBalance>({ xp: 0, coins: 0, gems: 0, reputation: 0 });
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<RewardItem | null>(null);
  const [showRedemptionDialog, setShowRedemptionDialog] = useState(false);
  const [redemptionQuantity, setRedemptionQuantity] = useState(1);

  // Mock data for demonstration
  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        setLoading(true);
        
        // Mock user balance
        const mockBalance: UserBalance = {
          xp: 2840,
          coins: 1250,
          gems: 87,
          reputation: 456,
        };

        // Mock reward items
        const mockRewardItems: RewardItem[] = [
          {
            id: '1',
            name: 'Premium Theme Pack',
            description: 'Unlock exclusive dark and light themes for your dashboard',
            category: 'premium_features',
            type: 'digital',
            cost: { coins: 200 },
            discountPercentage: 0,
            isActive: true,
            stock: undefined,
            maxPerUser: 1,
            levelRequirement: 5,
            achievements: [],
            imageUrl: '/api/placeholder/200/200',
            rarity: 'uncommon',
            availableFrom: new Date().toISOString(),
            isLimitedTime: false,
            benefits: ['Dark theme', 'Light theme', 'Custom colors'],
            stackable: false,
            tradeable: false,
            totalPurchases: 342,
            popularity: 8.5,
            canPurchase: true,
            purchaseBlockers: [],
            userRedemptions: [],
            totalRedemptions: 342,
          },
          {
            id: '2',
            name: 'XP Boost Potion',
            description: 'Double your XP gains for the next 24 hours',
            category: 'consumables',
            type: 'consumable',
            cost: { gems: 15 },
            discountPercentage: 20,
            originalValue: { gems: 19 },
            isActive: true,
            stock: 50,
            maxPerUser: 5,
            levelRequirement: 1,
            achievements: [],
            imageUrl: '/api/placeholder/200/200',
            rarity: 'rare',
            availableFrom: new Date().toISOString(),
            isLimitedTime: false,
            benefits: ['2x XP multiplier', '24 hour duration'],
            duration: 24,
            stackable: true,
            tradeable: false,
            totalPurchases: 128,
            popularity: 9.2,
            canPurchase: true,
            purchaseBlockers: [],
            userRedemptions: [],
            totalRedemptions: 128,
          },
          {
            id: '3',
            name: 'Golden Crown Avatar',
            description: 'Show your status with this exclusive golden crown avatar frame',
            category: 'cosmetics',
            type: 'permanent',
            cost: { coins: 500, reputation: 100 },
            discountPercentage: 0,
            isActive: true,
            levelRequirement: 25,
            tierRequirement: 'gold',
            achievements: ['Level Master'],
            imageUrl: '/api/placeholder/200/200',
            rarity: 'epic',
            availableFrom: new Date().toISOString(),
            isLimitedTime: false,
            benefits: ['Golden crown frame', 'Prestige indicator', 'Special animations'],
            stackable: false,
            tradeable: false,
            totalPurchases: 45,
            popularity: 9.8,
            canPurchase: false,
            purchaseBlockers: ['Requires level 25', 'Requires gold tier'],
            userRedemptions: [],
            totalRedemptions: 45,
          },
          {
            id: '4',
            name: 'Coffee Shop Gift Card',
            description: '$25 gift card for your favorite coffee shop',
            category: 'real_world',
            type: 'physical',
            cost: { coins: 2500 },
            discountPercentage: 0,
            isActive: true,
            stock: 10,
            maxPerUser: 2,
            levelRequirement: 15,
            achievements: [],
            imageUrl: '/api/placeholder/200/200',
            rarity: 'legendary',
            availableFrom: new Date().toISOString(),
            isLimitedTime: false,
            benefits: ['$25 value', 'Most coffee chains accepted', 'Digital delivery'],
            stackable: true,
            tradeable: false,
            totalPurchases: 23,
            popularity: 9.5,
            canPurchase: false,
            purchaseBlockers: ['Insufficient coins (need 2500, have 1250)'],
            userRedemptions: [],
            totalRedemptions: 23,
          },
          {
            id: '5',
            name: 'Weekly Streak Protector',
            description: 'Protect your streak for one missed day',
            category: 'perks',
            type: 'consumable',
            cost: { gems: 25 },
            discountPercentage: 0,
            isActive: true,
            maxPerUser: 3,
            levelRequirement: 10,
            achievements: [],
            imageUrl: '/api/placeholder/200/200',
            rarity: 'rare',
            availableFrom: new Date().toISOString(),
            isLimitedTime: false,
            benefits: ['Protects 1 day streak', 'Automatic activation', 'Peace of mind'],
            stackable: true,
            tradeable: false,
            totalPurchases: 89,
            popularity: 8.8,
            canPurchase: true,
            purchaseBlockers: [],
            userRedemptions: [],
            totalRedemptions: 89,
          },
          {
            id: '6',
            name: 'Limited Edition Winter Badge',
            description: 'Exclusive winter-themed badge available for a limited time',
            category: 'cosmetics',
            type: 'permanent',
            cost: { coins: 150, gems: 10 },
            discountPercentage: 0,
            isActive: true,
            levelRequirement: 1,
            achievements: [],
            imageUrl: '/api/placeholder/200/200',
            rarity: 'epic',
            availableFrom: new Date().toISOString(),
            availableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            isLimitedTime: true,
            benefits: ['Snowflake animation', 'Winter theme', 'Limited availability'],
            stackable: false,
            tradeable: false,
            totalPurchases: 67,
            popularity: 9.1,
            canPurchase: true,
            purchaseBlockers: [],
            userRedemptions: [],
            totalRedemptions: 67,
          },
        ];

        // Mock redemption history
        const mockRedemptionHistory: RedemptionHistory[] = [
          {
            id: '1',
            rewardItem: {
              id: '1',
              name: 'Premium Theme Pack',
              imageUrl: '/api/placeholder/50/50',
              category: 'premium_features',
            },
            quantity: 1,
            totalCost: { coins: 200 },
            status: 'fulfilled',
            fulfilledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isUsed: true,
            usedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            rewardItem: {
              id: '2',
              name: 'XP Boost Potion',
              imageUrl: '/api/placeholder/50/50',
              category: 'consumables',
            },
            quantity: 2,
            totalCost: { gems: 30 },
            status: 'fulfilled',
            fulfilledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isUsed: false,
            remainingUses: 2,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];

        setUserBalance(mockBalance);
        setRewardItems(mockRewardItems);
        setFilteredItems(mockRewardItems);
        setRedemptionHistory(mockRedemptionHistory);
      } catch (error) {
        console.error('Error fetching rewards data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsData();
  }, []);

  // Filter items based on criteria
  useEffect(() => {
    let filtered = rewardItems;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(item => item.rarity === selectedRarity);
    }

    if (availableOnly) {
      filtered = filtered.filter(item => {
        const now = new Date();
        const availableFrom = new Date(item.availableFrom);
        const availableUntil = item.availableUntil ? new Date(item.availableUntil) : null;
        
        return availableFrom <= now && (!availableUntil || availableUntil >= now);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [rewardItems, selectedCategory, selectedType, selectedRarity, availableOnly, searchTerm]);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'premium_features': return Crown;
      case 'cosmetics': return Sparkles;
      case 'consumables': return Package;
      case 'real_world': return Gift;
      case 'perks': return Star;
      default: return Package;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'fulfilled': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRedeemItem = async (item: RewardItem) => {
    setSelectedItem(item);
    setRedemptionQuantity(1);
    setShowRedemptionDialog(true);
  };

  const confirmRedemption = async () => {
    if (!selectedItem) return;

    try {
      // Mock redemption process
      console.log(`Redeeming ${redemptionQuantity}x ${selectedItem.name}`);
      
      // Update user balance
      const totalCost = Object.entries(selectedItem.cost).reduce((acc, [currency, amount]) => {
        acc[currency] = amount * redemptionQuantity;
        return acc;
      }, {} as any);

      setUserBalance(prev => {
        const updated = { ...prev };
        Object.entries(totalCost).forEach(([currency, amount]) => {
          if (currency in updated && typeof amount === 'number') {
            updated[currency as keyof UserBalance] -= amount;
          }
        });
        return updated;
      });

      // Add to redemption history
      const newRedemption: RedemptionHistory = {
        id: `redemption-${Date.now()}`,
        rewardItem: {
          id: selectedItem.id,
          name: selectedItem.name,
          imageUrl: selectedItem.imageUrl,
          category: selectedItem.category,
        },
        quantity: redemptionQuantity,
        totalCost,
        status: 'fulfilled',
        fulfilledAt: new Date().toISOString(),
        isUsed: false,
        remainingUses: selectedItem.type === 'consumable' ? redemptionQuantity : undefined,
        createdAt: new Date().toISOString(),
      };

      setRedemptionHistory(prev => [newRedemption, ...prev]);
      setShowRedemptionDialog(false);
      setSelectedItem(null);

      // Show success message (would use toast in real app)
      alert(`Successfully redeemed ${redemptionQuantity}x ${selectedItem.name}!`);
    } catch (error) {
      console.error('Redemption error:', error);
      alert('Failed to redeem item. Please try again.');
    }
  };

  const categoryDistribution = [
    { name: 'Premium Features', value: 25, color: '#8B5CF6' },
    { name: 'Cosmetics', value: 30, color: '#10B981' },
    { name: 'Consumables', value: 20, color: '#3B82F6' },
    { name: 'Real World', value: 15, color: '#F59E0B' },
    { name: 'Perks', value: 10, color: '#EF4444' },
  ];

  const popularityData = rewardItems.slice(0, 6).map(item => ({
    name: item.name.substring(0, 15) + '...',
    purchases: item.totalPurchases,
    popularity: item.popularity,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Gift className="h-16 w-16 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading rewards marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Rewards Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Redeem your hard-earned points for premium features, cosmetics, and real-world rewards
          </p>
        </motion.div>

        {/* User Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Balance</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(userBalance).map(([currency, amount]) => {
                      const Icon = getCurrencyIcon(currency);
                      return (
                        <div key={currency} className="text-center">
                          <Icon className="h-8 w-8 mx-auto mb-2 opacity-90" />
                          <p className="text-2xl font-bold">{amount.toLocaleString()}</p>
                          <p className="text-sm opacity-75 capitalize">{currency === 'xp' ? 'Experience' : currency}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Wallet className="h-24 w-24 opacity-30" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="history">Purchase History</TabsTrigger>
            <TabsTrigger value="inventory">My Items</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
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
                          placeholder="Search rewards..."
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
                          <SelectItem value="premium_features">Premium Features</SelectItem>
                          <SelectItem value="cosmetics">Cosmetics</SelectItem>
                          <SelectItem value="consumables">Consumables</SelectItem>
                          <SelectItem value="real_world">Real World</SelectItem>
                          <SelectItem value="perks">Perks</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="consumable">Consumable</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
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
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        variant={availableOnly ? "default" : "outline"}
                        onClick={() => setAvailableOnly(!availableOnly)}
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Available Only
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

            {/* Rewards Grid/List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Available Rewards ({filteredItems.length})
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Sort by Popularity
                  </Button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {filteredItems.map((item, index) => {
                      const CategoryIcon = getCategoryIcon(item.category);
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                            !item.canPurchase ? 'opacity-60' : ''
                          }`}>
                            <CardHeader className="pb-3">
                              <div className="relative">
                                {item.imageUrl ? (
                                  <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                                    <CategoryIcon className="h-16 w-16 text-purple-500" />
                                  </div>
                                ) : (
                                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                    <CategoryIcon className="h-16 w-16 text-gray-400" />
                                  </div>
                                )}
                                
                                <div className="absolute top-2 left-2 flex gap-2">
                                  <Badge className={getRarityColor(item.rarity)}>
                                    {item.rarity}
                                  </Badge>
                                  {item.isLimitedTime && (
                                    <Badge variant="destructive">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Limited
                                    </Badge>
                                  )}
                                </div>

                                {item.discountPercentage > 0 && (
                                  <div className="absolute top-2 right-2">
                                    <Badge variant="destructive">
                                      <Percent className="h-3 w-3 mr-1" />
                                      {item.discountPercentage}% OFF
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                            </CardHeader>
                            
                            <CardContent>
                              <div className="space-y-4">
                                {/* Cost */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Cost</span>
                                  <div className="flex items-center space-x-3">
                                    {Object.entries(item.cost).map(([currency, amount]) => {
                                      const Icon = getCurrencyIcon(currency);
                                      const colorClass = getCurrencyColor(currency);
                                      
                                      return (
                                        <div key={currency} className="flex items-center space-x-1">
                                          <Icon className={`h-4 w-4 ${colorClass}`} />
                                          <span className="font-bold">{amount.toLocaleString()}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Stock */}
                                {item.stock !== null && item.stock !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Stock</span>
                                    <span className={`text-sm ${item.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                                      {item.stock} remaining
                                    </span>
                                  </div>
                                )}

                                {/* Requirements */}
                                {(item.levelRequirement > 1 || item.tierRequirement || item.achievements.length > 0) && (
                                  <div className="space-y-2">
                                    <span className="text-sm font-medium">Requirements</span>
                                    <div className="flex flex-wrap gap-1">
                                      {item.levelRequirement > 1 && (
                                        <Badge variant="outline" className="text-xs">
                                          Level {item.levelRequirement}+
                                        </Badge>
                                      )}
                                      {item.tierRequirement && (
                                        <Badge variant="outline" className="text-xs">
                                          {item.tierRequirement} tier
                                        </Badge>
                                      )}
                                      {item.achievements.length > 0 && (
                                        <Badge variant="outline" className="text-xs">
                                          {item.achievements.length} achievements
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Action Button */}
                                <div className="pt-2">
                                  {item.canPurchase ? (
                                    <Button 
                                      className="w-full" 
                                      onClick={() => handleRedeemItem(item)}
                                    >
                                      <ShoppingCart className="h-4 w-4 mr-2" />
                                      Redeem Now
                                    </Button>
                                  ) : (
                                    <div className="space-y-2">
                                      <Button variant="outline" className="w-full" disabled>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cannot Purchase
                                      </Button>
                                      {item.purchaseBlockers && item.purchaseBlockers.length > 0 && (
                                        <div className="text-xs text-red-600">
                                          {item.purchaseBlockers[0]}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Popularity */}
                                <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>{item.totalPurchases} purchased</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3" />
                                    <span>{item.popularity}/10</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {filteredItems.map((item, index) => {
                        const CategoryIcon = getCategoryIcon(item.category);
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className={`p-6 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                              !item.canPurchase ? 'opacity-60' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-purple-100 rounded-lg">
                                <CategoryIcon className="h-8 w-8 text-purple-600" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-lg">{item.name}</h3>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getRarityColor(item.rarity)}>
                                      {item.rarity}
                                    </Badge>
                                    {item.isLimitedTime && (
                                      <Badge variant="destructive">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Limited
                                      </Badge>
                                    )}
                                    {item.discountPercentage > 0 && (
                                      <Badge variant="destructive">
                                        <Percent className="h-3 w-3 mr-1" />
                                        {item.discountPercentage}% OFF
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <p className="text-muted-foreground mt-2">{item.description}</p>
                                
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-4">
                                    {Object.entries(item.cost).map(([currency, amount]) => {
                                      const Icon = getCurrencyIcon(currency);
                                      const colorClass = getCurrencyColor(currency);
                                      
                                      return (
                                        <div key={currency} className="flex items-center space-x-1">
                                          <Icon className={`h-4 w-4 ${colorClass}`} />
                                          <span className="font-bold">{amount.toLocaleString()}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                      <Users className="h-4 w-4" />
                                      <span>{item.totalPurchases}</span>
                                    </div>
                                    
                                    {item.canPurchase ? (
                                      <Button onClick={() => handleRedeemItem(item)}>
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Redeem
                                      </Button>
                                    ) : (
                                      <Button variant="outline" disabled>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cannot Purchase
                                      </Button>
                                    )}
                                  </div>
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
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>Your reward redemption history and current items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {redemptionHistory.map((redemption) => (
                    <div key={redemption.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Gift className="h-6 w-6 text-purple-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{redemption.rewardItem.name}</h4>
                          <Badge className={getStatusColor(redemption.status)}>
                            {redemption.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Quantity: {redemption.quantity}</span>
                          <span>•</span>
                          <span>{new Date(redemption.createdAt).toLocaleDateString()}</span>
                          {redemption.remainingUses && (
                            <>
                              <span>•</span>
                              <span>{redemption.remainingUses} uses remaining</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          {Object.entries(redemption.totalCost).map(([currency, amount]) => {
                            const Icon = getCurrencyIcon(currency);
                            const colorClass = getCurrencyColor(currency);
                            
                            return (
                              <div key={currency} className="flex items-center space-x-1">
                                <Icon className={`h-4 w-4 ${colorClass}`} />
                                <span className="text-sm">{amount}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {redemption.status === 'fulfilled' && !redemption.isUsed && redemption.remainingUses && (
                          <Button variant="outline" size="sm">
                            <Target className="h-4 w-4 mr-2" />
                            Use Now
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {redemptionHistory.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Purchase History</h3>
                      <p className="text-muted-foreground mb-4">You haven't redeemed any rewards yet</p>
                      <Button>
                        <Store className="h-4 w-4 mr-2" />
                        Browse Marketplace
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Items</CardTitle>
                <CardDescription>Manage your owned items and active effects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Inventory Coming Soon</h3>
                  <p className="text-muted-foreground">Track and manage your redeemed items here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Distribution of available rewards by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Popular Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Items</CardTitle>
                  <CardDescription>Most purchased rewards this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={popularityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="purchases" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                      <p className="text-3xl font-bold">{rewardItems.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available</p>
                      <p className="text-3xl font-bold">{filteredItems.length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Limited Time</p>
                      <p className="text-3xl font-bold">{rewardItems.filter(item => item.isLimitedTime).length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Your Purchases</p>
                      <p className="text-3xl font-bold">{redemptionHistory.length}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Redemption Dialog */}
        <Dialog open={showRedemptionDialog} onOpenChange={setShowRedemptionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Redemption</DialogTitle>
              <DialogDescription>
                Are you sure you want to redeem this item?
              </DialogDescription>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    {React.createElement(getCategoryIcon(selectedItem.category), { 
                      className: "h-8 w-8 text-purple-600" 
                    })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Quantity</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRedemptionQuantity(Math.max(1, redemptionQuantity - 1))}
                        disabled={redemptionQuantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center">{redemptionQuantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRedemptionQuantity(redemptionQuantity + 1)}
                        disabled={selectedItem.maxPerUser ? redemptionQuantity >= selectedItem.maxPerUser : false}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Total Cost</h4>
                    {Object.entries(selectedItem.cost).map(([currency, amount]) => {
                      const Icon = getCurrencyIcon(currency);
                      const colorClass = getCurrencyColor(currency);
                      const totalAmount = amount * redemptionQuantity;
                      const userAmount = userBalance[currency as keyof UserBalance];
                      const sufficient = userAmount >= totalAmount;
                      
                      return (
                        <div key={currency} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${colorClass}`} />
                            <span className="capitalize">{currency === 'xp' ? 'Experience' : currency}</span>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${sufficient ? 'text-green-600' : 'text-red-600'}`}>
                              {totalAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Balance: {userAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedItem.benefits.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Benefits</h4>
                        <ul className="space-y-1">
                          {selectedItem.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={() => setShowRedemptionDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmRedemption}
                    disabled={!selectedItem.canPurchase}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Confirm Redemption
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

export default RewardsMarketplaceDashboard;
