
/**
 * PowerMode Status Component
 * Displays honest PowerMode status and metrics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { getPowerModeInstance, activatePowerMode, isPowerModeActive, PowerModeMetrics } from '@/lib/powermode-honest';

interface PowerModeStatusProps {
  className?: string;
}

interface PowerModeReport {
  totalWorkflows: number;
  completedTasks: number;
  sessionDurationMinutes: number;
  completedWorkflows: number;
  [key: string]: any;
}

export default function PowerModeStatus({ className = '' }: PowerModeStatusProps) {
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState<PowerModeMetrics | null>(null);
  const [report, setReport] = useState<PowerModeReport | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    checkPowerModeStatus();
    const interval = setInterval(checkPowerModeStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkPowerModeStatus = () => {
    const powerMode = getPowerModeInstance();
    const active = powerMode.isActiveMode();
    const currentMetrics = powerMode.getHonestMetrics();
    const currentReport = powerMode.generateHonestReport() as PowerModeReport;
    
    setIsActive(active);
    setMetrics(currentMetrics);
    setReport(currentReport);
    setLastUpdate(new Date());
  };

  const handleActivate = () => {
    const success = activatePowerMode();
    if (success) {
      setIsActive(true);
      checkPowerModeStatus();
      console.log('🎯 PowerMode 3.0 Honest Edition Successfully Activated!');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* PowerMode Status Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className={`h-5 w-5 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
              Power Mode 3.0 Honest Edition
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? 'default' : 'secondary'} className="font-mono">
                {isActive ? '⚡ ACTIVE' : '💤 INACTIVE'}
              </Badge>
              {!isActive && (
                <Button onClick={handleActivate} size="sm" variant="outline">
                  Activate PowerMode
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Honest Mission Statement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">
              🎯 <strong>Mission:</strong> Real utility through structure and systematization
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ✅ NO fake promises • ✅ NO simulated results • ✅ Only transparent progress tracking
            </p>
          </div>

          {/* System Status */}
          {isActive && report && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{report.totalWorkflows || 0}</div>
                <div className="text-xs text-green-700 font-medium">Active Workflows</div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{report.completedTasks || 0}</div>
                <div className="text-xs text-blue-700 font-medium">Tasks Completed</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">
                  {report.sessionDurationMinutes ? `${Math.round(report.sessionDurationMinutes)}m` : '0m'}
                </div>
                <div className="text-xs text-orange-700 font-medium">Session Time</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">
                  {report.completedWorkflows || 0}
                </div>
                <div className="text-xs text-purple-700 font-medium">Workflows Done</div>
              </div>
            </div>
          )}

          {/* Honest Assessment Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>All metrics based on actual usage - No fabricated improvements</span>
          </div>

          {/* Last Update */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* PowerMode Features */}
      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium text-green-800">Structured Workflow Organization</div>
                  <div className="text-sm text-green-600">Systematic task breakdown and planning</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium text-green-800">Transparent Progress Tracking</div>
                  <div className="text-sm text-green-600">Honest metrics without fabrication</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium text-red-800">NO Fake AI Optimizations</div>
                  <div className="text-sm text-red-600">Structure and systematization only</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium text-red-800">NO Fabricated Metrics</div>
                  <div className="text-sm text-red-600">All numbers based on actual usage</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
