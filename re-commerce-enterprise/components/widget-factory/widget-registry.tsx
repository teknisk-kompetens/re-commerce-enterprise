
'use client';

/**
 * WIDGET REGISTRY
 * Searchable library of available widgets with categories, filtering,
 * and drag-to-canvas functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid,
  List,
  Star,
  Download,
  Clock,
  Tag,
  Package,
  ChevronDown,
  Plus
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

import { widgetRegistry } from '@/lib/widget-registry';

interface WidgetRegistryProps {
  onWidgetSelect: (widgetId: string) => void;
}

interface WidgetDefinition {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  author: string;
  tags: string[];
  icon: string;
  preview?: string;
  thumbnail?: string;
  metadata: {
    downloads: number;
    rating: number;
    created: Date;
    updated: Date;
  };
}

const SAMPLE_WIDGETS: WidgetDefinition[] = [
  {
    id: 'text-widget',
    name: 'Text Display',
    version: '1.0.0',
    category: 'Basic',
    description: 'Simple text display widget with rich formatting options',
    author: 'Widget Factory',
    tags: ['text', 'basic', 'content'],
    icon: '📝',
    metadata: {
      downloads: 1250,
      rating: 4.8,
      created: new Date('2024-01-15'),
      updated: new Date('2024-03-10'),
    },
  },
  {
    id: 'chart-widget',
    name: 'Chart Visualizer',
    version: '2.1.0',
    category: 'Visualization',
    description: 'Advanced charting widget with multiple chart types and real-time data',
    author: 'DataViz Team',
    tags: ['chart', 'visualization', 'data', 'analytics'],
    icon: '📊',
    metadata: {
      downloads: 980,
      rating: 4.9,
      created: new Date('2024-02-01'),
      updated: new Date('2024-03-15'),
    },
  },
  {
    id: 'form-widget',
    name: 'Dynamic Form',
    version: '1.5.0',
    category: 'Input',
    description: 'Flexible form builder with validation and custom field types',
    author: 'Forms Inc',
    tags: ['form', 'input', 'validation', 'data-entry'],
    icon: '📋',
    metadata: {
      downloads: 756,
      rating: 4.6,
      created: new Date('2024-01-20'),
      updated: new Date('2024-03-08'),
    },
  },
  {
    id: 'map-widget',
    name: 'Interactive Map',
    version: '3.0.0',
    category: 'Visualization',
    description: 'Map widget with markers, layers, and geospatial data support',
    author: 'GeoTech',
    tags: ['map', 'geo', 'location', 'visualization'],
    icon: '🗺️',
    metadata: {
      downloads: 432,
      rating: 4.7,
      created: new Date('2024-02-10'),
      updated: new Date('2024-03-12'),
    },
  },
  {
    id: 'calendar-widget',
    name: 'Event Calendar',
    version: '1.8.0',
    category: 'Productivity',
    description: 'Full-featured calendar with event management and scheduling',
    author: 'Calendar Pro',
    tags: ['calendar', 'events', 'scheduling', 'productivity'],
    icon: '📅',
    metadata: {
      downloads: 623,
      rating: 4.5,
      created: new Date('2024-01-25'),
      updated: new Date('2024-03-05'),
    },
  },
  {
    id: 'image-gallery-widget',
    name: 'Image Gallery',
    version: '2.2.0',
    category: 'Media',
    description: 'Responsive image gallery with lightbox and slideshow features',
    author: 'Media Solutions',
    tags: ['image', 'gallery', 'media', 'slideshow'],
    icon: '🖼️',
    metadata: {
      downloads: 892,
      rating: 4.4,
      created: new Date('2024-01-30'),
      updated: new Date('2024-03-14'),
    },
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Categories', count: 15 },
  { id: 'basic', name: 'Basic', count: 4 },
  { id: 'visualization', name: 'Visualization', count: 3 },
  { id: 'input', name: 'Input', count: 2 },
  { id: 'productivity', name: 'Productivity', count: 2 },
  { id: 'media', name: 'Media', count: 2 },
  { id: 'advanced', name: 'Advanced', count: 2 },
];

export function WidgetRegistry({ onWidgetSelect }: WidgetRegistryProps) {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>(SAMPLE_WIDGETS);
  const [filteredWidgets, setFilteredWidgets] = useState<WidgetDefinition[]>(SAMPLE_WIDGETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'downloads' | 'rating' | 'updated'>('name');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = [...new Set(widgets.flatMap(w => w.tags))];

  // Filter and search widgets
  useEffect(() => {
    let filtered = widgets;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => 
        w.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query) ||
        w.tags.some(tag => tag.toLowerCase().includes(query)) ||
        w.author.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(w =>
        selectedTags.every(tag => w.tags.includes(tag))
      );
    }

    // Sort widgets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'downloads':
          return b.metadata.downloads - a.metadata.downloads;
        case 'rating':
          return b.metadata.rating - a.metadata.rating;
        case 'updated':
          return b.metadata.updated.getTime() - a.metadata.updated.getTime();
        default:
          return 0;
      }
    });

    setFilteredWidgets(filtered);
  }, [widgets, searchQuery, selectedCategory, selectedTags, sortBy]);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const handleWidgetDragStart = useCallback((event: React.DragEvent, widget: WidgetDefinition) => {
    event.dataTransfer.setData('application/widget-id', widget.id);
    event.dataTransfer.setData('application/widget-data', JSON.stringify(widget));
    event.dataTransfer.effectAllowed = 'copy';
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Widget Registry
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Category
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {CATEGORIES.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'bg-gray-100 dark:bg-gray-700' : ''}
                >
                  <span className="flex-1">{category.name}</span>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Tags
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTags.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {allTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
              {selectedTags.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedTags([])}>
                    Clear all tags
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort: {sortBy}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('downloads')}>
                Most Downloaded
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rating')}>
                Highest Rated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('updated')}>
                Recently Updated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active filters */}
        {(selectedCategory !== 'all' || selectedTags.length > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {filteredWidgets.length} widget{filteredWidgets.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Widget List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredWidgets.map((widget) => (
                  <WidgetCard
                    key={widget.id}
                    widget={widget}
                    onSelect={() => onWidgetSelect(widget.id)}
                    onDragStart={(e) => handleWidgetDragStart(e, widget)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filteredWidgets.map((widget) => (
                  <WidgetListItem
                    key={widget.id}
                    widget={widget}
                    onSelect={() => onWidgetSelect(widget.id)}
                    onDragStart={(e) => handleWidgetDragStart(e, widget)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {filteredWidgets.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No widgets found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or browse different categories.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTags([]);
              }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Widget Card Component
interface WidgetCardProps {
  widget: WidgetDefinition;
  onSelect: () => void;
  onDragStart: (event: React.DragEvent) => void;
}

function WidgetCard({ widget, onSelect, onDragStart }: WidgetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        draggable
        onDragStart={onDragStart}
        onClick={onSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{widget.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {widget.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  v{widget.version} by {widget.author}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {widget.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {widget.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {widget.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{widget.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Download className="h-3 w-3 mr-1" />
                {widget.metadata.downloads.toLocaleString()}
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                {widget.metadata.rating}
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(widget.metadata.updated)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper function for date formatting
const formatDate = (date: Date) => {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
};

// Widget List Item Component
interface WidgetListItemProps {
  widget: WidgetDefinition;
  onSelect: () => void;
  onDragStart: (event: React.DragEvent) => void;
}

function WidgetListItem({ widget, onSelect, onDragStart }: WidgetListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
    >
      <Card
        className="cursor-pointer hover:shadow-sm transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        draggable
        onDragStart={onDragStart}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="text-xl">{widget.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {widget.name}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {widget.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {widget.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>v{widget.version}</span>
                  <div className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {widget.metadata.downloads.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                    {widget.metadata.rating}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
