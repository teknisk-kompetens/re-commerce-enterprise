
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Star,
  Building,
  User,
  Clock,
  Play,
  Settings
} from 'lucide-react';
import type { DemoProfile } from '@/lib/types';

interface DemoProfileManagerProps {
  profiles: DemoProfile[];
  currentProfile?: DemoProfile;
  onProfileSelect: (profile: DemoProfile) => void;
  onProfileUpdate: () => void;
}

export function DemoProfileManager({ 
  profiles, 
  currentProfile, 
  onProfileSelect, 
  onProfileUpdate 
}: DemoProfileManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<DemoProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.targetRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProfile = async (profileData: Partial<DemoProfile>) => {
    try {
      const response = await fetch('/api/demo-builder/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      const response = await fetch(`/api/demo-builder/profiles/${profileId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleDuplicateProfile = async (profile: DemoProfile) => {
    const duplicatedProfile = {
      ...profile,
      name: `${profile.name} (Copy)`,
      id: undefined
    };

    await handleCreateProfile(duplicatedProfile);
  };

  return (
    <div className="space-y-4">
      {/* Search and Create */}
      <div className="space-y-3">
        <Input
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white dark:bg-gray-700"
        />
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Plus className="h-4 w-4" />
              Create New Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Demo Profile</DialogTitle>
            </DialogHeader>
            <CreateProfileForm onSubmit={handleCreateProfile} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredProfiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              currentProfile?.id === profile.id 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'hover:border-gray-300 dark:hover:border-gray-600'
            }`}>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0" onClick={() => onProfileSelect(profile)}>
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {profile.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {profile.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {profile.isTemplate && (
                        <Star className="h-3 w-3 text-yellow-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProfile(profile);
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      <Building className="h-2 w-2 mr-1" />
                      {profile.industry}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <User className="h-2 w-2 mr-1" />
                      {profile.targetRole}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-2 w-2 mr-1" />
                      {profile.duration}m
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateProfile(profile);
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProfile(profile.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      className="h-6 px-3 text-xs bg-green-500 hover:bg-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProfileSelect(profile);
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No profiles found</p>
        </div>
      )}
    </div>
  );
}

function CreateProfileForm({ onSubmit }: { onSubmit: (data: Partial<DemoProfile>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    targetRole: '',
    duration: 15,
    painPoints: [] as string[],
    focusAreas: [] as string[]
  });

  const industries = [
    'banking', 'healthcare', 'retail', 'manufacturing', 'technology', 
    'insurance', 'real-estate', 'education', 'government', 'energy'
  ];

  const roles = [
    'executive', 'manager', 'analyst', 'developer', 'architect', 
    'consultant', 'director', 'specialist', 'administrator'
  ];

  const commonPainPoints = [
    'Digital transformation complexity',
    'Operational efficiency',
    'Regulatory compliance',
    'Customer experience',
    'Data security',
    'System integration',
    'Cost optimization',
    'Scalability challenges'
  ];

  const commonFocusAreas = [
    'AI and automation',
    'Security and compliance',
    'Analytics and insights',
    'System integration',
    'Performance optimization',
    'User experience',
    'Process automation',
    'Real-time monitoring'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Profile Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            min="5"
            max="60"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="role">Target Role</Label>
          <Select value={formData.targetRole} onValueChange={(value) => setFormData({ ...formData, targetRole: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select target role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Pain Points</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {commonPainPoints.map(point => (
            <label key={point} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.painPoints.includes(point)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, painPoints: [...formData.painPoints, point] });
                  } else {
                    setFormData({ 
                      ...formData, 
                      painPoints: formData.painPoints.filter(p => p !== point) 
                    });
                  }
                }}
                className="rounded"
              />
              <span>{point}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Focus Areas</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {commonFocusAreas.map(area => (
            <label key={area} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.focusAreas.includes(area)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, focusAreas: [...formData.focusAreas, area] });
                  } else {
                    setFormData({ 
                      ...formData, 
                      focusAreas: formData.focusAreas.filter(a => a !== area) 
                    });
                  }
                }}
                className="rounded"
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500">
          Create Profile
        </Button>
      </div>
    </form>
  );
}
