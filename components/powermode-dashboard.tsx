
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  getPowerModeStatus, 
  getWorkflowOrganizationStatus, 
  activatePowerMode 
} from '@/lib/powermode-honest/powermode-status';

const PowerModeDashboard: React.FC = () => {
  const [status, setStatus] = useState(getPowerModeStatus());
  const [workflow, setWorkflow] = useState(getWorkflowOrganizationStatus());
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (!isActivated) {
      const activated = activatePowerMode();
      setStatus(activated);
      setIsActivated(true);
    }
  }, [isActivated]);

  const progressPercentage = (workflow.transparentProgress.completedSteps / workflow.transparentProgress.totalSteps) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-600">
            ⚡ PowerMode {status.version} {status.edition}
          </h1>
          <p className="text-gray-600 mt-2">
            Systematic workflow organization without fabricated AI claims
          </p>
        </div>
        <Badge variant={status.isActive ? "default" : "secondary"} className="text-lg px-4 py-2">
          {status.isActive ? "🟢 ACTIVE" : "🔴 INACTIVE"}
        </Badge>
      </div>

      {/* System Integrity Panel */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛡️ System Integrity Check
          </CardTitle>
          <CardDescription>
            Verification that we're using REAL capabilities, not simulated AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>No Simulated AI</span>
              <Badge variant={status.systemIntegrity.noSimulatedAI ? "default" : "destructive"}>
                {status.systemIntegrity.noSimulatedAI ? "✅ VERIFIED" : "❌ FAILED"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>No Fake Metrics</span>
              <Badge variant={status.systemIntegrity.noFakeMetrics ? "default" : "destructive"}>
                {status.systemIntegrity.noFakeMetrics ? "✅ VERIFIED" : "❌ FAILED"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Structural Integrity</span>
              <Badge variant={status.systemIntegrity.structuralIntegrityMaintained ? "default" : "destructive"}>
                {status.systemIntegrity.structuralIntegrityMaintained ? "✅ MAINTAINED" : "❌ COMPROMISED"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Honest Implementation</span>
              <Badge variant={status.systemIntegrity.honestImplementation ? "default" : "destructive"}>
                {status.systemIntegrity.honestImplementation ? "✅ CONFIRMED" : "❌ CORRUPTED"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Modules Status */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🔄 Workflow Organizer</CardTitle>
            <CardDescription>Systematic task breakdown and organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tasks Structured:</span>
                <Badge>{status.workflowOrganizer.tasksStructured}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Templates Available:</span>
                <Badge>{status.workflowOrganizer.templatesAvailable}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configuration Manager</CardTitle>
            <CardDescription>Structured settings and template management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Settings Managed:</span>
                <Badge>{status.configManager.settingsManaged}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Templates Loaded:</span>
                <Badge>{status.configManager.templatesLoaded}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Task Load Manager</CardTitle>
            <CardDescription>Priority-based resource allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tasks Prioritized:</span>
                <Badge>{status.taskLoadManager.tasksPrioritized}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Resources Tracked:</span>
                <Badge>{status.taskLoadManager.resourcesTracked}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Honest Metrics</CardTitle>
            <CardDescription>Transparent progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Real Progress Tracked:</span>
                <Badge variant={status.honestMetrics.realProgressTracked ? "default" : "secondary"}>
                  {status.honestMetrics.realProgressTracked ? "✅ YES" : "❌ NO"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>No Fabricated Results:</span>
                <Badge variant={status.honestMetrics.noFabricatedResults ? "default" : "destructive"}>
                  {status.honestMetrics.noFabricatedResults ? "✅ CLEAN" : "❌ CONTAMINATED"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Workflow Status */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Current Mission: {workflow.currentTask}
          </CardTitle>
          <CardDescription>
            Systematic approach to RE:Commerce Enterprise deployment recovery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Progress</span>
                <span className="text-sm text-gray-600">
                  {workflow.transparentProgress.completedSteps} / {workflow.transparentProgress.totalSteps} steps
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Task Breakdown:</h4>
              {workflow.taskBreakdown.map((task, index) => (
                <div key={index} className="text-sm pl-4">
                  {task}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-medium mb-2">Systematic Approach:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Problem Analysis:</span>
                    <Badge variant={workflow.systematicApproach.problemAnalysis === "COMPLETE" ? "default" : "secondary"}>
                      {workflow.systematicApproach.problemAnalysis}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Root Cause ID:</span>
                    <Badge variant={workflow.systematicApproach.rootCauseIdentification === "COMPLETE" ? "default" : "secondary"}>
                      {workflow.systematicApproach.rootCauseIdentification}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Solution Design:</span>
                    <Badge variant={workflow.systematicApproach.solutionDesign === "COMPLETE" ? "default" : "outline"}>
                      {workflow.systematicApproach.solutionDesign}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Transparent Progress:</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Current Step:</strong> {workflow.transparentProgress.currentStep}</div>
                  <div><strong>ETA:</strong> {workflow.transparentProgress.estimatedTimeRemaining}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Philosophy */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">🌟 PowerMode Philosophy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-800 font-medium text-center">
            "Verklig nytta genom struktur och systematik, inte genom falska löften."
          </p>
          <p className="text-yellow-700 text-sm text-center mt-2">
            No fake AI, no simulated results - just structured excellence and transparent progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerModeDashboard;
