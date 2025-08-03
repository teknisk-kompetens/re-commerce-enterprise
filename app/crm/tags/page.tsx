
// ============================================================================
// ENTERPRISE CRM - TAGS MANAGEMENT MODULE
// Centralized Tag System for CRM Entities
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Plus, Search, Filter, Download, Tag, 
  Edit, Trash2, Users, Building2, TrendingUp, 
  MoreHorizontal, Hash, Palette, Eye, Settings,
  BarChart3, PieChart, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Mock data for tags
const mockTags = [
  {
    id: '1',
    name: 'High Priority',
    description: 'High priority prospects and customers',
    color: '#EF4444',
    category: 'priority',
    usage: {
      contacts: 45,
      companies: 12,
      deals: 8
    },
    createdAt: '2024-01-15',
    createdBy: 'Sarah Johnson'
  },
  {
    id: '2',
    name: 'Enterprise',
    description: 'Large enterprise accounts',
    color: '#3B82F6',
    category: 'company_size',
    usage: {
      contacts: 89,
      companies: 23,
      deals: 15
    },
    createdAt: '2024-01-10',
    createdBy: 'Michael Chen'
  },
  {
    id: '3',
    name: 'Tech Sector',
    description: 'Technology industry contacts and companies',
    color: '#10B981',
    category: 'industry',
    usage: {
      contacts: 156,
      companies: 67,
      deals: 28
    },
    createdAt: '2024-01-08',
    createdBy: 'David Wilson'
  },
  {
    id: '4',
    name: 'Hot Lead',
    description: 'Highly engaged prospects ready to convert',
    color: '#F59E0B',
    category: 'lead_status',
    usage: {
      contacts: 23,
      companies: 8,
      deals: 12
    },
    createdAt: '2024-01-12',
    createdBy: 'Emily Davis'
  },
  {
    id: '5',
    name: 'Q1 Target',
    description: 'Deals targeted for Q1 closing',
    color: '#8B5CF6',
    category: 'sales_cycle',
    usage: {
      contacts: 34,
      companies: 15,
      deals: 22
    },
    createdAt: '2024-01-05',
    createdBy: 'Sarah Johnson'
  }
]

const tagCategories = [
  { id: 'priority', name: 'Priority Level', count: 3 },
  { id: 'company_size', name: 'Company Size', count: 4 },
  { id: 'industry', name: 'Industry', count: 8 },
  { id: 'lead_status', name: 'Lead Status', count: 6 },
  { id: 'sales_cycle', name: 'Sales Cycle', count: 5 }
]

export default function TagsManagementPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTag, setNewTag] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    category: 'priority'
  })

  const filteredTags = mockTags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tag.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalUsage = mockTags.reduce((sum, tag) => sum + tag.usage.contacts + tag.usage.companies + tag.usage.deals, 0)

  const handleCreateTag = () => {
    // Handle tag creation logic here
    console.log('Creating tag:', newTag)
    setIsCreateDialogOpen(false)
    setNewTag({ name: '', description: '', color: '#3B82F6', category: 'priority' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/crm">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to CRM
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tags Management</h1>
                <p className="text-gray-600 mt-1">
                  Organize and categorize your CRM data with intelligent tagging
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Tags
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tag
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Tag</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tag-name">Tag Name</Label>
                      <Input
                        id="tag-name"
                        value={newTag.name}
                        onChange={(e) => setNewTag({...newTag, name: e.target.value})}
                        placeholder="Enter tag name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tag-description">Description</Label>
                      <Textarea
                        id="tag-description"
                        value={newTag.description}
                        onChange={(e) => setNewTag({...newTag, description: e.target.value})}
                        placeholder="Describe what this tag represents"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tag-category">Category</Label>
                        <Select value={newTag.category} onValueChange={(value) => setNewTag({...newTag, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tagCategories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tag-color">Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={newTag.color}
                            onChange={(e) => setNewTag({...newTag, color: e.target.value})}
                            className="w-12 h-10 p-1 rounded cursor-pointer"
                          />
                          <Input
                            value={newTag.color}
                            onChange={(e) => setNewTag({...newTag, color: e.target.value})}
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTag}>
                        Create Tag
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tags">Tags Library</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Tags</p>
                      <p className="text-3xl font-bold text-blue-600">{mockTags.length}</p>
                    </div>
                    <Tag className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-3xl font-bold text-green-600">{tagCategories.length}</p>
                    </div>
                    <Hash className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Usage</p>
                      <p className="text-3xl font-bold text-purple-600">{totalUsage}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Usage</p>
                      <p className="text-3xl font-bold text-orange-600">{Math.round(totalUsage / mockTags.length)}</p>
                    </div>
                    <Target className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Tag Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagCategories.map((category) => (
                    <div key={category.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.count} tags</p>
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Used Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Most Used Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTags
                    .sort((a, b) => (b.usage.contacts + b.usage.companies + b.usage.deals) - 
                                   (a.usage.contacts + a.usage.companies + a.usage.deals))
                    .slice(0, 5)
                    .map((tag) => {
                      const totalUsage = tag.usage.contacts + tag.usage.companies + tag.usage.deals
                      return (
                        <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            ></div>
                            <div>
                              <h4 className="font-medium text-gray-900">{tag.name}</h4>
                              <p className="text-sm text-gray-600">{tag.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{totalUsage}</div>
                            <div className="text-sm text-gray-500">uses</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tags Library Tab */}
          <TabsContent value="tags" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tags by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {tagCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredTags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            ></div>
                            <div>
                              <CardTitle className="text-lg">{tag.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {tagCategories.find(c => c.id === tag.category)?.name}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4">{tag.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>Contacts</span>
                            </div>
                            <span className="font-medium">{tag.usage.contacts}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4 text-green-500" />
                              <span>Companies</span>
                            </div>
                            <span className="font-medium">{tag.usage.companies}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-purple-500" />
                              <span>Deals</span>
                            </div>
                            <span className="font-medium">{tag.usage.deals}</span>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Created by {tag.createdBy}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tag Usage Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Tag Usage by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tagCategories.map((category) => {
                      const categoryTags = mockTags.filter(tag => tag.category === category.id)
                      const categoryUsage = categoryTags.reduce((sum, tag) => 
                        sum + tag.usage.contacts + tag.usage.companies + tag.usage.deals, 0)
                      const percentage = (categoryUsage / totalUsage) * 100
                      
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm text-gray-600">{categoryUsage} uses</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tag Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTags
                      .sort((a, b) => (b.usage.contacts + b.usage.companies + b.usage.deals) - 
                                     (a.usage.contacts + a.usage.companies + a.usage.deals))
                      .slice(0, 8)
                      .map((tag, index) => {
                        const totalUsage = tag.usage.contacts + tag.usage.companies + tag.usage.deals
                        return (
                          <div key={tag.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              ></div>
                              <span className="text-sm font-medium">{tag.name}</span>
                            </div>
                            <div className="text-sm text-gray-600">{totalUsage}</div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
