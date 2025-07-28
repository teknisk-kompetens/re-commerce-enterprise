
/**
 * CHUNK 1: OPTIMIZED PROPERTIES PANEL
 * Memoized properties panel component
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MousePointer, Download } from 'lucide-react';
import { ErrorBoundary, WidgetErrorFallback } from '@/lib/error-handling/error-boundary';

interface Widget {
  id: string;
  name: string;
  type: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

interface PropertiesPanelProps {
  selectedWidget: string | null;
  widgets: Widget[];
  onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
}

const PropertiesPanel = React.memo(({ selectedWidget, widgets, onUpdateWidget }: PropertiesPanelProps) => {
  const widget = selectedWidget ? widgets.find(w => w.id === selectedWidget) : null;

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Properties
        </h3>

        {widget ? (
          <ErrorBoundary fallback={WidgetErrorFallback}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="widget-name">Widget Name</Label>
                <Input
                  id="widget-name"
                  defaultValue={widget.name}
                  onChange={(e) => onUpdateWidget(widget.id, { name: e.target.value })}
                  aria-describedby="widget-name-desc"
                />
                <p id="widget-name-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Display name for this widget
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="widget-width">Width</Label>
                  <Input
                    id="widget-width"
                    type="number"
                    defaultValue={widget.width}
                    onChange={(e) => onUpdateWidget(widget.id, { width: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="widget-height">Height</Label>
                  <Input
                    id="widget-height"
                    type="number"
                    defaultValue={widget.height}
                    onChange={(e) => onUpdateWidget(widget.id, { height: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => {
                      // Handle delete
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MousePointer className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a widget to edit its properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

PropertiesPanel.displayName = 'PropertiesPanel';

export default PropertiesPanel;
