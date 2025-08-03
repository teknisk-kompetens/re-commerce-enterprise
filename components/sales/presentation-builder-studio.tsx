
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  BarChart3, 
  Play, 
  Save, 
  Download, 
  Share2, 
  Copy, 
  Trash2, 
  Plus, 
  Eye, 
  Settings, 
  Palette, 
  Layers, 
  Grid, 
  MonitorPlay,
  FileText,
  Presentation,
  Users,
  Clock,
  Star,
  Building2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Button } from '@/components/ui/button-enhanced';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface SlideTemplate {
  id: string;
  name: string;
  category: 'title' | 'content' | 'comparison' | 'data' | 'closing';
  preview: string;
  elements: SlideElement[];
}

interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'chart' | 'shape' | 'video';
  content: Record<string, unknown>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Record<string, string | number>;
}

interface Presentation {
  id: string;
  title: string;
  description: string;
  industry: string;
  slides: Slide[];
  theme: string;
  created_at: Date;
  updated_at: Date;
  author: string;
  status: 'draft' | 'published' | 'archived';
}

interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  notes: string;
  duration?: number;
}

export function PresentationBuilderStudio() {
  const [activePresentation, setActivePresentation] = useState<Presentation | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'present'>('edit');
  const [zoom, setZoom] = useState(100);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const slideTemplates: SlideTemplate[] = [
    {
      id: 'title-1',
      name: 'Executive Title',
      category: 'title',
      preview: '/api/placeholder/300/200',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: { text: 'Presentation Title', fontSize: 36, fontWeight: 'bold' },
          position: { x: 50, y: 200 },
          size: { width: 600, height: 100 },
          style: { textAlign: 'center', color: '#1f2937' }
        },
        {
          id: 'subtitle',
          type: 'text',
          content: { text: 'Subtitle or Company Name', fontSize: 18 },
          position: { x: 50, y: 320 },
          size: { width: 600, height: 50 },
          style: { textAlign: 'center', color: '#6b7280' }
        }
      ]
    },
    {
      id: 'content-1',
      name: 'Two Column Layout',
      category: 'content',
      preview: '/api/placeholder/300/200',
      elements: [
        {
          id: 'heading',
          type: 'text',
          content: { text: 'Section Headline', fontSize: 24, fontWeight: 'semibold' },
          position: { x: 50, y: 50 },
          size: { width: 600, height: 60 },
          style: { color: '#1f2937' }
        },
        {
          id: 'left-content',
          type: 'text',
          content: { text: 'Left column content...', fontSize: 16 },
          position: { x: 50, y: 150 },
          size: { width: 290, height: 200 },
          style: { color: '#374151' }
        },
        {
          id: 'right-content',
          type: 'text',
          content: { text: 'Right column content...', fontSize: 16 },
          position: { x: 360, y: 150 },
          size: { width: 290, height: 200 },
          style: { color: '#374151' }
        }
      ]
    },
    {
      id: 'data-1',
      name: 'Chart & Insights',
      category: 'data',
      preview: '/api/placeholder/300/200',
      elements: [
        {
          id: 'chart-title',
          type: 'text',
          content: { text: 'Key Performance Metrics', fontSize: 24, fontWeight: 'semibold' },
          position: { x: 50, y: 50 },
          size: { width: 600, height: 60 },
          style: { color: '#1f2937' }
        },
        {
          id: 'chart',
          type: 'chart',
          content: { type: 'bar', data: [] },
          position: { x: 50, y: 120 },
          size: { width: 400, height: 250 },
          style: {}
        },
        {
          id: 'insights',
          type: 'text',
          content: { text: 'Key insights and takeaways...', fontSize: 14 },
          position: { x: 470, y: 120 },
          size: { width: 180, height: 250 },
          style: { color: '#374151' }
        }
      ]
    }
  ];

  const industryTemplates = [
    { id: 'retail', name: 'Retail & E-commerce', slides: 12, color: 'primary' },
    { id: 'healthcare', name: 'Healthcare', slides: 15, color: 'success' },
    { id: 'finance', name: 'Financial Services', slides: 18, color: 'warning' },
    { id: 'manufacturing', name: 'Manufacturing', slides: 14, color: 'error' },
    { id: 'technology', name: 'Technology', slides: 10, color: 'primary' }
  ];

  useEffect(() => {
    // Load existing presentations
    const mockPresentations: Presentation[] = [
      {
        id: '1',
        title: 'Q3 Enterprise Sales Deck',
        description: 'Comprehensive sales presentation for enterprise prospects',
        industry: 'technology',
        slides: [],
        theme: 'professional',
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-20'),
        author: 'Sarah Chen',
        status: 'published'
      },
      {
        id: '2',
        title: 'Healthcare Solution Overview',
        description: 'Industry-specific presentation for healthcare clients',
        industry: 'healthcare',
        slides: [],
        theme: 'medical',
        created_at: new Date('2024-01-10'),
        updated_at: new Date('2024-01-18'),
        author: 'Michael Rodriguez',
        status: 'draft'
      }
    ];
    setPresentations(mockPresentations);
  }, []);

  const createNewPresentation = (template?: string) => {
    const newPresentation: Presentation = {
      id: Date.now().toString(),
      title: 'Untitled Presentation',
      description: '',
      industry: template || 'general',
      slides: [{
        id: '1',
        title: 'Title Slide',
        elements: slideTemplates[0].elements,
        notes: ''
      }],
      theme: 'professional',
      created_at: new Date(),
      updated_at: new Date(),
      author: 'Current User',
      status: 'draft'
    };
    
    setActivePresentation(newPresentation);
    setCurrentSlide(0);
    setViewMode('edit');
  };

  const addSlide = (templateId?: string) => {
    if (!activePresentation) return;
    
    const template = templateId ? slideTemplates.find(t => t.id === templateId) : slideTemplates[1];
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Slide ${activePresentation.slides.length + 1}`,
      elements: template?.elements || [],
      notes: ''
    };

    const updatedPresentation = {
      ...activePresentation,
      slides: [...activePresentation.slides, newSlide],
      updated_at: new Date()
    };
    
    setActivePresentation(updatedPresentation);
    setCurrentSlide(updatedPresentation.slides.length - 1);
  };

  const duplicateSlide = (slideIndex: number) => {
    if (!activePresentation) return;
    
    const slideToClone = activePresentation.slides[slideIndex];
    const newSlide: Slide = {
      ...slideToClone,
      id: Date.now().toString(),
      title: `${slideToClone.title} (Copy)`
    };

    const updatedSlides = [...activePresentation.slides];
    updatedSlides.splice(slideIndex + 1, 0, newSlide);
    
    setActivePresentation({
      ...activePresentation,
      slides: updatedSlides,
      updated_at: new Date()
    });
  };

  const deleteSlide = (slideIndex: number) => {
    if (!activePresentation || activePresentation.slides.length <= 1) return;
    
    const updatedSlides = activePresentation.slides.filter((_, index) => index !== slideIndex);
    setActivePresentation({
      ...activePresentation,
      slides: updatedSlides,
      updated_at: new Date()
    });
    
    if (currentSlide >= updatedSlides.length) {
      setCurrentSlide(updatedSlides.length - 1);
    }
  };

  const exportPresentation = (format: 'pdf' | 'pptx' | 'web') => {
    // Implement export functionality
    console.log(`Exporting presentation as ${format}`);
  };

  if (!activePresentation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
                Presentation Builder Studio
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                Create professional, customizable presentations with industry-specific templates 
                and real-time collaboration features.
              </p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Create New */}
            <Card variant="elevated" className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create New Presentation</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Start with a blank presentation or choose from industry templates
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => createNewPresentation()}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Blank Presentation
                </Button>
                
                <div className="grid grid-cols-1 gap-2">
                  {industryTemplates.slice(0, 3).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      onClick={() => createNewPresentation(template.id)}
                      className="w-full justify-between"
                    >
                      <span>{template.name}</span>
                      <Badge variant="secondary">{template.slides} slides</Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Presentations */}
            <Card variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Presentations</h3>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {presentations.map((presentation) => (
                  <div
                    key={presentation.id}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() => setActivePresentation(presentation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{presentation.title}</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {presentation.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-500">
                          <span>By {presentation.author}</span>
                          <span>{presentation.updated_at.toLocaleDateString()}</span>
                          <Badge variant={presentation.status === 'published' ? 'default' : 'outline'}>
                            {presentation.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Presentation className="h-8 w-8 text-neutral-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Industry Templates */}
          <Card variant="elevated" className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Industry-Specific Templates</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Pre-built presentation templates optimized for different industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    variant="elevated" 
                    interactive
                    className="h-full cursor-pointer"
                    onClick={() => createNewPresentation(template.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 bg-${template.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <Building2 className={`h-6 w-6 text-${template.color}-600`} />
                      </div>
                      <h4 className="font-semibold mb-2">{template.name}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        {template.slides} professionally designed slides
                      </p>
                      <Button size="sm" className="w-full">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Main Editor Interface
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePresentation(null)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <Input
                value={activePresentation.title}
                onChange={(e) => setActivePresentation({
                  ...activePresentation,
                  title: e.target.value,
                  updated_at: new Date()
                })}
                className="text-lg font-semibold border-none bg-transparent px-2 py-1"
              />
              <Badge variant={activePresentation.status === 'published' ? 'default' : 'outline'}>
                {activePresentation.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
              <Button
                variant={viewMode === 'edit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('edit')}
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('preview')}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'present' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('present')}
              >
                <MonitorPlay className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Slides */}
        <div className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Slides</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowTemplates(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {activePresentation.slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  index === currentSlide
                    ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700'
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{slide.title}</div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Slide {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateSlide(index);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(index);
                      }}
                      disabled={activePresentation.slides.length <= 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Type className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="flex justify-center">
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: `${(800 * zoom) / 100}px`,
                  height: `${(600 * zoom) / 100}px`,
                  transform: `scale(${zoom / 100})`
                }}
              >
                {/* Slide Content */}
                <div className="w-full h-full relative">
                  {activePresentation.slides[currentSlide]?.elements.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-pointer ${
                        selectedElement === element.id ? 'ring-2 ring-primary-500' : ''
                      }`}
                      style={{
                        left: element.position.x,
                        top: element.position.y,
                        width: element.size.width,
                        height: element.size.height,
                        ...element.style
                      }}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      {element.type === 'text' && (
                        <div
                          style={{
                            fontSize: element.content.fontSize,
                            fontWeight: element.content.fontWeight,
                            ...element.style
                          }}
                        >
                          {element.content.text}
                        </div>
                      )}
                      {element.type === 'chart' && (
                        <div className="w-full h-full bg-neutral-100 rounded flex items-center justify-center">
                          <BarChart3 className="h-12 w-12 text-neutral-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700 p-4">
          <Tabs defaultValue="slide" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="slide">Slide</TabsTrigger>
              <TabsTrigger value="element">Element</TabsTrigger>
            </TabsList>
            
            <TabsContent value="slide" className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Slide Title</Label>
                <Input
                  value={activePresentation.slides[currentSlide]?.title || ''}
                  onChange={(e) => {
                    const updatedSlides = [...activePresentation.slides];
                    updatedSlides[currentSlide] = {
                      ...updatedSlides[currentSlide],
                      title: e.target.value
                    };
                    setActivePresentation({
                      ...activePresentation,
                      slides: updatedSlides
                    });
                  }}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Speaker Notes</Label>
                <Textarea
                  value={activePresentation.slides[currentSlide]?.notes || ''}
                  onChange={(e) => {
                    const updatedSlides = [...activePresentation.slides];
                    updatedSlides[currentSlide] = {
                      ...updatedSlides[currentSlide],
                      notes: e.target.value
                    };
                    setActivePresentation({
                      ...activePresentation,
                      slides: updatedSlides
                    });
                  }}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="element" className="space-y-4">
              {selectedElement ? (
                <div>
                  <p className="text-sm text-neutral-600">
                    Element properties will be displayed here when an element is selected.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Layers className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-sm text-neutral-600">
                    Select an element to edit its properties
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
