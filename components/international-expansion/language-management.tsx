
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Languages,
  Plus,
  Edit,
  Trash2,
  Globe,
  Check,
  X,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
  isActive: boolean;
  priority: number;
  completeness: number;
  translationStats: {
    total: number;
    approved: number;
    completeness: number;
  };
}

interface TenantLanguage {
  id: string;
  isDefault: boolean;
  isActive: boolean;
  priority: number;
  translationStatus: string;
  completeness: number;
  language: Language;
}

interface LanguageManagementProps {
  tenantId: string;
}

export default function LanguageManagement({ tenantId }: LanguageManagementProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [tenantLanguages, setTenantLanguages] = useState<TenantLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [editingTenantLanguage, setEditingTenantLanguage] = useState<TenantLanguage | null>(null);

  useEffect(() => {
    fetchLanguages();
    fetchTenantLanguages();
  }, [tenantId]);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/i18n/languages?active=true');
      const data = await response.json();
      if (data.success) {
        setLanguages(data.data);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchTenantLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/i18n/tenant-config?tenantId=${tenantId}`);
      const data = await response.json();
      if (data.success) {
        setTenantLanguages(data.data);
      }
    } catch (error) {
      console.error('Error fetching tenant languages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLanguage = async (languageId: string) => {
    try {
      const response = await fetch('/api/i18n/tenant-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          languageId,
          isActive: true,
          priority: 0
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchTenantLanguages();
        setShowAddDialog(false);
        setSelectedLanguage(null);
      }
    } catch (error) {
      console.error('Error adding language:', error);
    }
  };

  const handleUpdateTenantLanguage = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/i18n/tenant-config?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        await fetchTenantLanguages();
        setEditingTenantLanguage(null);
      }
    } catch (error) {
      console.error('Error updating tenant language:', error);
    }
  };

  const handleRemoveLanguage = async (id: string) => {
    try {
      const response = await fetch(`/api/i18n/tenant-config?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchTenantLanguages();
      }
    } catch (error) {
      console.error('Error removing language:', error);
    }
  };

  const getAvailableLanguages = () => {
    const configuredLanguageIds = tenantLanguages.map(tl => tl.language.id);
    return languages.filter(lang => !configuredLanguageIds.includes(lang.id));
  };

  const filteredLanguages = getAvailableLanguages().filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 90) return 'text-green-600';
    if (completeness >= 70) return 'text-yellow-600';
    if (completeness >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Language Management</h2>
          <p className="text-gray-600 mt-1">
            Configure languages and manage translations for global reach
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configured Languages</CardTitle>
            <Languages className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantLanguages.length}</div>
            <p className="text-xs text-gray-600">
              {tenantLanguages.filter(tl => tl.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Translation Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                tenantLanguages.reduce((sum, tl) => sum + tl.completeness, 0) / 
                Math.max(tenantLanguages.length, 1)
              )}%
            </div>
            <p className="text-xs text-gray-600">Average completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Language</CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenantLanguages.find(tl => tl.isDefault)?.language.code.toUpperCase() || 'None'}
            </div>
            <p className="text-xs text-gray-600">Primary language</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RTL Languages</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tenantLanguages.filter(tl => tl.language.isRTL).length}
            </div>
            <p className="text-xs text-gray-600">Right-to-left support</p>
          </CardContent>
        </Card>
      </div>

      {/* Configured Languages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Languages</CardTitle>
          <CardDescription>
            Languages currently configured for your tenant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Translation Progress</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantLanguages.map((tenantLang) => (
                  <TableRow key={tenantLang.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium">{tenantLang.language.name}</div>
                          <div className="text-sm text-gray-500">
                            {tenantLang.language.nativeName}
                          </div>
                        </div>
                        {tenantLang.language.isRTL && (
                          <Badge variant="secondary" className="text-xs">RTL</Badge>
                        )}
                        {tenantLang.isDefault && (
                          <Badge variant="default" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {tenantLang.language.code.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {tenantLang.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className={getCompletenessColor(tenantLang.completeness)}>
                            {Math.round(tenantLang.completeness)}%
                          </span>
                        </div>
                        <Progress value={tenantLang.completeness} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {tenantLang.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTenantLanguage(tenantLang)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!tenantLang.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLanguage(tenantLang.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Language Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Language</DialogTitle>
            <DialogDescription>
              Select a language to add to your tenant configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {filteredLanguages.map((language) => (
                <div
                  key={language.id}
                  className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    selectedLanguage?.id === language.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedLanguage(language)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{language.name}</div>
                        <div className="text-sm text-gray-500">
                          {language.nativeName} ({language.code.toUpperCase()})
                        </div>
                      </div>
                      {language.isRTL && (
                        <Badge variant="secondary" className="text-xs">RTL</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round(language.completeness)}% translated
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedLanguage && handleAddLanguage(selectedLanguage.id)}
              disabled={!selectedLanguage}
            >
              Add Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tenant Language Dialog */}
      <Dialog
        open={!!editingTenantLanguage}
        onOpenChange={() => setEditingTenantLanguage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Language Configuration</DialogTitle>
            <DialogDescription>
              Update settings for {editingTenantLanguage?.language.name}
            </DialogDescription>
          </DialogHeader>

          {editingTenantLanguage && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editingTenantLanguage.isActive}
                  onCheckedChange={(checked) =>
                    setEditingTenantLanguage({ ...editingTenantLanguage, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={editingTenantLanguage.isDefault}
                  onCheckedChange={(checked) =>
                    setEditingTenantLanguage({ ...editingTenantLanguage, isDefault: checked })
                  }
                />
                <Label htmlFor="isDefault">Set as default language</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={editingTenantLanguage.priority}
                  onChange={(e) =>
                    setEditingTenantLanguage({
                      ...editingTenantLanguage,
                      priority: parseInt(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTenantLanguage(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                editingTenantLanguage &&
                handleUpdateTenantLanguage(editingTenantLanguage.id, {
                  isActive: editingTenantLanguage.isActive,
                  isDefault: editingTenantLanguage.isDefault,
                  priority: editingTenantLanguage.priority
                })
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
