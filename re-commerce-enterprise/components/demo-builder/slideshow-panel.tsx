
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Edit,
  Plus,
  Trash2,
  Settings,
  Monitor,
  Clock,
  Layers,
  Wand2,
  Eye,
  Copy
} from 'lucide-react';
import type { DemoProfile, DemoSlide, EnterpriseSystemComponent } from '@/lib/types';

interface SlideshowPanelProps {
  profile?: DemoProfile;
  currentSlide: number;
  isPreview: boolean;
  onSlideChange: (slide: number) => void;
  onSlideUpdate: () => void;
  enterpriseComponents: EnterpriseSystemComponent[];
}

export function SlideshowPanel({ 
  profile, 
  currentSlide, 
  isPreview, 
  onSlideChange, 
  onSlideUpdate,
  enterpriseComponents 
}: SlideshowPanelProps) {
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<DemoSlide | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const slides = profile?.slides || [];
  const currentSlideData = slides[currentSlide];

  // Auto-advance slides in preview mode
  useEffect(() => {
    if (isPlaying && isPreview && slides.length > 0) {
      const duration = currentSlideData?.duration || 5;
      const timer = setTimeout(() => {
        if (currentSlide < slides.length - 1) {
          onSlideChange(currentSlide + 1);
        } else {
          setIsPlaying(false);
        }
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, isPreview, currentSlide, slides.length, currentSlideData?.duration, onSlideChange]);

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      onSlideChange(currentSlide + 1);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCreateSlide = async (slideData: Partial<DemoSlide>) => {
    try {
      const response = await fetch(`/api/demo-builder/profiles/${profile?.id}/slides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });

      if (response.ok) {
        onSlideUpdate();
      }
    } catch (error) {
      console.error('Error creating slide:', error);
    }
  };

  const handleUpdateSlide = async (slideId: string, slideData: Partial<DemoSlide>) => {
    try {
      const response = await fetch(`/api/demo-builder/slides/${slideId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });

      if (response.ok) {
        setEditingSlide(null);
        onSlideUpdate();
      }
    } catch (error) {
      console.error('Error updating slide:', error);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/demo-builder/slides/${slideId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onSlideUpdate();
        if (currentSlide >= slides.length - 1 && currentSlide > 0) {
          onSlideChange(currentSlide - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a demo profile to manage slides</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Slideshow Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePlay}
            disabled={!isPreview}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {slides.length > 0 ? `${currentSlide + 1} / ${slides.length}` : '0 / 0'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Manage Slideshow</DialogTitle>
              </DialogHeader>
              <SlideManager
                profile={profile}
                slides={slides}
                enterpriseComponents={enterpriseComponents}
                onSlideCreate={handleCreateSlide}
                onSlideUpdate={handleUpdateSlide}
                onSlideDelete={handleDeleteSlide}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Slide Display */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSlideData ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 h-full"
            >
              {/* Slide Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentSlideData.title}
                </h2>
                {currentSlideData.description && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentSlideData.description}
                  </p>
                )}
              </div>

              {/* Slide Content */}
              <div className="mb-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">{currentSlideData.content}</p>
                </div>
              </div>

              {/* Enterprise Components Preview */}
              {currentSlideData.components && currentSlideData.components.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Featured Components
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentSlideData.components.map((componentName: any, index: number) => {
                      const component = enterpriseComponents.find(c => c.id === componentName.id || c.name === componentName);
                      if (!component) return null;

                      return (
                        <motion.div
                          key={component.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${component.color} text-white`}>
                                  <Layers className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                                    {component.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {component.description}
                                  </p>
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    {component.category}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Slide Duration Indicator */}
              {isPreview && isPlaying && currentSlideData.duration && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Auto-advance in {currentSlideData.duration}s</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 ml-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: currentSlideData.duration }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
            >
              <div className="text-center">
                <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No slides available</p>
                <p className="text-sm">Create your first slide to get started</p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsManageDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Slide
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Thumbnails */}
      {slides.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onSlideChange(index)}
              className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all ${
                index === currentSlide
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="w-24 h-16 bg-white dark:bg-gray-700 rounded border flex items-center justify-center">
                <Monitor className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-xs text-center mt-1 truncate w-24">
                {slide.title}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SlideManager({ 
  profile, 
  slides, 
  enterpriseComponents,
  onSlideCreate,
  onSlideUpdate,
  onSlideDelete 
}: {
  profile: DemoProfile;
  slides: DemoSlide[];
  enterpriseComponents: EnterpriseSystemComponent[];
  onSlideCreate: (slide: Partial<DemoSlide>) => void;
  onSlideUpdate: (slideId: string, slide: Partial<DemoSlide>) => void;
  onSlideDelete: (slideId: string) => void;
}) {
  const [editingSlide, setEditingSlide] = useState<DemoSlide | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Create New Slide */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Slides ({slides.length})</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Slide</DialogTitle>
            </DialogHeader>
            <SlideForm
              enterpriseComponents={enterpriseComponents}
              onSubmit={(slideData) => {
                onSlideCreate(slideData);
                setIsCreateDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {slide.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {slide.description || slide.content}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setEditingSlide(slide)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    onClick={() => onSlideDelete(slide.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{slide.duration || 5}s</span>
                <span>•</span>
                <Layers className="h-3 w-3" />
                <span>{slide.components?.length || 0} components</span>
              </div>

              <div className="mt-3 text-center">
                <Badge variant="outline" className="text-xs">
                  Slide {index + 1}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No slides created yet</p>
          <p className="text-sm">Add your first slide to get started</p>
        </div>
      )}

      {/* Edit Slide Dialog */}
      {editingSlide && (
        <Dialog open={!!editingSlide} onOpenChange={() => setEditingSlide(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Slide</DialogTitle>
            </DialogHeader>
            <SlideForm
              slide={editingSlide}
              enterpriseComponents={enterpriseComponents}
              onSubmit={(slideData) => {
                onSlideUpdate(editingSlide.id, slideData);
                setEditingSlide(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function SlideForm({ 
  slide, 
  enterpriseComponents, 
  onSubmit 
}: { 
  slide?: DemoSlide; 
  enterpriseComponents: EnterpriseSystemComponent[];
  onSubmit: (data: Partial<DemoSlide>) => void;
}) {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    description: slide?.description || '',
    content: slide?.content || '',
    duration: slide?.duration || 5,
    components: slide?.components || [] as EnterpriseSystemComponent[],
    layout: slide?.layout || 'full' as 'full' | 'split' | 'grid'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleComponent = (component: EnterpriseSystemComponent) => {
    const newComponents = formData.components.some((c: EnterpriseSystemComponent) => c.id === component.id)
      ? formData.components.filter((c: EnterpriseSystemComponent) => c.id !== component.id)
      : [...formData.components, component];
    
    setFormData({ ...formData, components: newComponents });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Slide Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            min="1"
            max="30"
          />
        </div>
        <div>
          <Label htmlFor="layout">Layout</Label>
          <Select value={formData.layout} onValueChange={(value) => setFormData({ ...formData, layout: value as 'split' | 'grid' | 'full' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="split">Split Layout</SelectItem>
              <SelectItem value="grid">Grid Layout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Enterprise Components</Label>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
          {enterpriseComponents.map(component => (
            <label key={component.id} className="flex items-center space-x-2 text-sm p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                checked={formData.components.some((c: EnterpriseSystemComponent) => c.id === component.id)}
                onChange={() => toggleComponent(component)}
                className="rounded"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-3 h-3 rounded ${component.color}`}></div>
                <span className="truncate">{component.title}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {slide ? 'Update' : 'Create'} Slide
        </Button>
      </div>
    </form>
  );
}
