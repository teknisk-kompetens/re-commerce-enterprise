
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  Star,
  TrendingUp,
  Brain,
  Shield,
  BarChart3,
  Plug,
  Globe,
  Layers,
  Move,
  Eye,
  Settings
} from 'lucide-react';
import type { EnterpriseSystemComponent } from '@/lib/types';

interface ComponentLibraryProps {
  components: EnterpriseSystemComponent[];
  onComponentDrag: (component: EnterpriseSystemComponent) => void;
}

const categoryIcons = {
  ai: Brain,
  security: Shield,
  analytics: BarChart3,
  integration: Plug,
  management: Globe
};

const categoryColors = {
  ai: 'bg-purple-500',
  security: 'bg-red-500',
  analytics: 'bg-blue-500',
  integration: 'bg-green-500',
  management: 'bg-orange-500'
};

export function ComponentLibrary({ components, onComponentDrag }: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'rating'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort components
  const filteredComponents = components
    .filter(component => {
      const matchesSearch = component.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.usageCount - a.usageCount;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const categories = Array.from(new Set(components.map(c => c.category)));

  const handleDragStart = (component: EnterpriseSystemComponent, e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    onComponentDrag(component);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="popularity">Popular</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Component Count and View Toggle */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{filteredComponents.length} components</span>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setViewMode('grid')}
          >
            <Layers className="h-3 w-3" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setViewMode('list')}
          >
            <Layers className="h-3 w-3 rotate-90" />
          </Button>
        </div>
      </div>

      {/* Components Grid/List */}
      <div className={`space-y-2 max-h-96 overflow-y-auto ${
        viewMode === 'grid' ? 'grid grid-cols-1 gap-2' : ''
      }`}>
        {filteredComponents.map((component, index) => {
          const CategoryIcon = categoryIcons[component.category as keyof typeof categoryIcons] || Layers;
          const categoryColor = categoryColors[component.category as keyof typeof categoryColors] || 'bg-gray-400';

          return (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              draggable
              onDragStart={(e) => handleDragStart(component, e as unknown as React.DragEvent<HTMLDivElement>)}
              className="group cursor-move"
            >
              <Card className="hover:shadow-md transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700 group-hover:scale-[1.02]">
                <CardContent className={`p-3 ${viewMode === 'list' ? 'flex items-center gap-3' : ''}`}>
                  {/* Component Icon */}
                  <div className={`${categoryColor} p-2 rounded-lg text-white flex-shrink-0 ${
                    viewMode === 'list' ? 'w-10 h-10' : 'w-8 h-8 mb-3'
                  } flex items-center justify-center`}>
                    <CategoryIcon className="h-4 w-4" />
                  </div>

                  <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : ''}`}>
                    {/* Component Header */}
                    <div className={`${viewMode === 'list' ? 'flex items-start justify-between' : ''} mb-2`}>
                      <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {component.title}
                          </h4>
                          {component.isHighlighted && (
                            <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 ${
                          viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-2'
                        }`}>
                          {component.description}
                        </p>
                      </div>

                      {viewMode === 'list' && (
                        <div className="flex items-center gap-1 ml-2">
                          <Badge variant="secondary" className="text-xs">
                            {component.category}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Component Badges and Stats */}
                    <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : 'space-y-2'}`}>
                      {viewMode === 'grid' && (
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {component.category}
                          </Badge>
                          {component.isPremium && (
                            <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                              Premium
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className={`flex items-center ${viewMode === 'list' ? 'gap-4' : 'gap-2 justify-between'} text-xs text-gray-500 dark:text-gray-400`}>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{component.usageCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{component.rating.toFixed(1)}</span>
                        </div>
                        {viewMode === 'list' && component.isPremium && (
                          <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Drag Indicator */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                        <Move className="h-3 w-3" />
                        <span>Drag to add</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No components found</p>
          <p className="text-xs">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Component Categories Summary */}
      {searchTerm === '' && selectedCategory === 'all' && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
          <div className="grid grid-cols-1 gap-2">
            {categories.map(category => {
              const categoryComponents = components.filter(c => c.category === category);
              const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Layers;
              const categoryColor = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-400';

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <div className={`${categoryColor} p-1.5 rounded text-white`}>
                    <CategoryIcon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {category}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryComponents.length}
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
