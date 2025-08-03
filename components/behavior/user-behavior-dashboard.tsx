
/**
 * USER BEHAVIOR ANALYTICS DASHBOARD
 * User journey tracking, heatmap analysis, session recording, and A/B testing
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  MousePointer,
  Eye,
  Play,
  Target,
  TrendingUp,
  MapPin,
  Clock,
  Navigation,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  GitBranch,
  TestTube,
  Layers,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sankey,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

// Proper TypeScript interfaces replacing all 'any' types
interface JourneySummary {
  totalSessions: number;
  averageSessionDuration: number;
  topEntryPages: string[];
  topExitPages: string[];
  conversionRate: number;
}

interface UserPath {
  id: string;
  path: string[];
  sessionCount: number;
  conversionRate: number;
  averageDuration: number;
}

interface DropoffPoint {
  page: string;
  dropoffRate: number;
  sessionCount: number;
  previousPage: string;
}

interface DeviceAnalysis {
  device: 'desktop' | 'mobile' | 'tablet';
  sessionCount: number;
  conversionRate: number;
  averageDuration: number;
}

interface TimeSeriesDataPoint {
  timestamp: string;
  sessions: number;
  conversions: number;
  bounceRate: number;
}

interface HeatmapSummary {
  totalInteractions: number;
  averageTimeOnPage: number;
  topInteractedElements: string[];
  scrollDepth: number;
}

interface HeatmapDataPoint {
  x: number;
  y: number;
  intensity: number;
  elementType: string;
}

interface TopPage {
  url: string;
  views: number;
  averageTimeOnPage: number;
  bounceRate: number;
}

interface InteractionBreakdown {
  elementType: string;
  interactions: number;
  conversionRate: number;
}

interface DeviceBreakdown {
  device: string;
  percentage: number;
  sessions: number;
}

interface RecordingSummary {
  totalRecordings: number;
  averageSessionDuration: number;
  uniqueUsers: number;
  topBouncePages: string[];
}

interface SessionRecording {
  id: string;
  userId: string;
  duration: number;
  pages: string[];
  events: number;
  timestamp: string;
  device: string;
}

interface BounceAnalysis {
  bounceRate: number;
  topBouncePages: string[];
  averageTimeToBounceBounce: number;
}

interface ABTestSummary {
  activeTests: number;
  completedTests: number;
  totalVariations: number;
  significantResults: number;
}

interface ABTest {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  variations: Array<{
    id: string;
    name: string;
    traffic: number;
    conversions: number;
    conversionRate: number;
  }>;
  startDate: string;
  endDate?: string;
  confidence: number;
}

interface SegmentSummary {
  totalSegments: number;
  activeUsers: number;
  topPerformingSegment: string;
}

interface BehavioralSegment {
  id: string;
  name: string;
  userCount: number;
  conversionRate: number;
  avgSessionDuration: number;
  criteria: string[];
}

interface UserFlowTransition {
  from: string;
  to: string;
  sessionCount: number;
  conversionRate: number;
}

interface InteractionSummary {
  totalInteractions: number;
  averageInteractionsPerSession: number;
  topInteractionType: string;
}

interface TopElement {
  selector: string;
  interactions: number;
  conversionRate: number;
  elementType: string;
}

interface InteractionHeatmapPoint {
  elementId: string;
  interactions: number;
  x: number;
  y: number;
}

interface BehaviorData {
  userJourneys: {
    summary: JourneySummary;
    topPaths: UserPath[];
    dropoffPoints: DropoffPoint[];
    deviceAnalysis: DeviceAnalysis[];
    timeSeriesData: TimeSeriesDataPoint[];
  };
  heatmapData: {
    summary: HeatmapSummary;
    heatmapData: HeatmapDataPoint[];
    topPages: TopPage[];
    interactionBreakdown: InteractionBreakdown[];
    deviceBreakdown: DeviceBreakdown[];
  };
  sessionRecordings: {
    summary: RecordingSummary;
    recordings: SessionRecording[];
    deviceBreakdown: DeviceBreakdown[];
    bounceAnalysis: BounceAnalysis;
  };
  abTests: {
    summary: ABTestSummary;
    activeTests: ABTest[];
    completedTests: ABTest[];
  };
  behavioralSegments: {
    summary: SegmentSummary;
    segments: BehavioralSegment[];
  };
  userFlow: {
    transitions: UserFlowTransition[];
    totalSessions: number;
    totalSteps: number;
    uniqueSteps: number;
  };
  interactionAnalysis: {
    summary: InteractionSummary;
    topElements: TopElement[];
    interactionHeatmap: InteractionHeatmapPoint[];
  };
}

interface UserBehaviorDashboardProps {
  tenantId?: string;
}

export function UserBehaviorDashboard({ tenantId = 'default' }: UserBehaviorDashboardProps) {
  const [data, setData] = useState<BehaviorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedPage, setSelectedPage] = useState<string>('');

  const fetchBehaviorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [journeys, heatmap, recordings, abTests, segments, userFlow, interactions] = await Promise.all([
        fetch(`/api/behavior/user-analytics?action=user_journeys&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/behavior/user-analytics?action=heatmap_data&tenantId=${tenantId}&timeRange=${selectedTimeRange}${selectedPage ? `&pageUrl=${selectedPage}` : ''}`),
        fetch(`/api/behavior/user-analytics?action=session_recordings&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/behavior/user-analytics?action=ab_tests&tenantId=${tenantId}`),
        fetch(`/api/behavior/user-analytics?action=behavioral_segments&tenantId=${tenantId}`),
        fetch(`/api/behavior/user-analytics?action=user_flow_analysis&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/behavior/user-analytics?action=interaction_analysis&tenantId=${tenantId}&timeRange=${selectedTimeRange}${selectedPage ? `&pageUrl=${selectedPage}` : ''}`)
      ]);

      const [journeysData, heatmapData, recordingsData, abTestsData, segmentsData, userFlowData, interactionsData] = await Promise.all([
        journeys.json(),
        heatmap.json(),
        recordings.json(),
        abTests.json(),
        segments.json(),
        userFlow.json(),
        interactions.json()
      ]);

      setData({
        userJourneys: journeysData.data,
        heatmapData: heatmapData.data,
        sessionRecordings: recordingsData.data,
        abTests: abTestsData.data,
        behavioralSegments: segmentsData.data,
        userFlow: userFlowData.data,
        interactionAnalysis: interactionsData.data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch behavior data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBehaviorData();
  }, [tenantId, selectedTimeRange, selectedPage]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getDeviceIcon = (device: string) => {
    switch (device?.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Eye className="h-6 w-6 animate-pulse" />
          <span>Loading behavior analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>No behavior data available</AlertDescription>
      </Alert>
    );
  }

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Behavior Analytics</h2>
          <p className="text-muted-foreground">Deep insights into user interactions and journey patterns</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button onClick={fetchBehaviorData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User Journeys</p>
                <p className="text-2xl font-bold">{formatNumber(data.userJourneys.summary?.totalJourneys || 0)}</p>
                <p className="text-sm text-muted-foreground">
                  {data.userJourneys.summary?.conversionRate || 0}% conversion
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100">
                <MousePointer className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Interactions</p>
                <p className="text-2xl font-bold">{formatNumber(data.heatmapData.summary?.totalInteractions || 0)}</p>
                <p className="text-sm text-muted-foreground">
                  {data.heatmapData.summary?.totalClicks || 0} clicks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Play className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Session Recordings</p>
                <p className="text-2xl font-bold">{data.sessionRecordings.summary?.totalRecordings || 0}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(data.sessionRecordings.summary?.avgDuration || 0)} avg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-100">
                <TestTube className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">A/B Tests</p>
                <p className="text-2xl font-bold">{data.abTests.summary?.activeTests || 0}</p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(data.abTests.summary?.totalParticipants || 0)} participants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="journeys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          <TabsTrigger value="heatmaps">Heatmaps</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="flow">User Flow</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="journeys" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Journey Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>Journey Summary</span>
                </CardTitle>
                <CardDescription>Overview of user journey metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.userJourneys.summary?.avgJourneyLength || 0}</p>
                    <p className="text-sm text-muted-foreground">Avg Steps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatDuration(data.userJourneys.summary?.avgJourneyTime || 0)}</p>
                    <p className="text-sm text-muted-foreground">Avg Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.userJourneys.summary?.totalConversions || 0}</p>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.userJourneys.summary?.totalDropoffs || 0}</p>
                    <p className="text-sm text-muted-foreground">Dropoffs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Device Performance</span>
                </CardTitle>
                <CardDescription>Journey success by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.userJourneys.deviceAnalysis?.map((device, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(device.device)}
                          <span className="font-medium capitalize">{device.device}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{device.conversionRate}%</p>
                          <p className="text-sm text-muted-foreground">{device.count} journeys</p>
                        </div>
                      </div>
                      <Progress value={device.conversionRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Journey Paths */}
          <Card>
            <CardHeader>
              <CardTitle>Top Journey Paths</CardTitle>
              <CardDescription>Most common user journey sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.userJourneys.topPaths?.slice(0, 8).map((path, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{path.path}</p>
                      <p className="text-xs text-muted-foreground">
                        Avg time: {formatDuration(path.avgTime)} • {path.conversionRate}% conversion
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{path.count}</p>
                      <p className="text-sm text-muted-foreground">journeys</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dropoff Points */}
          <Card>
            <CardHeader>
              <CardTitle>Major Dropoff Points</CardTitle>
              <CardDescription>Steps where users most commonly exit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.userJourneys.dropoffPoints?.slice(0, 6).map((dropoff, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-red-100">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">{dropoff.step}</p>
                        <p className="text-sm text-muted-foreground">Critical exit point</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{dropoff.dropoffs}</p>
                      <p className="text-sm text-muted-foreground">exits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmaps" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Interaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MousePointer className="h-5 w-5" />
                  <span>Interaction Overview</span>
                </CardTitle>
                <CardDescription>Click and interaction statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatNumber(data.heatmapData.summary?.totalClicks || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Clicks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatDuration(data.heatmapData.summary?.totalHoverTime || 0)}</p>
                    <p className="text-sm text-muted-foreground">Hover Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.heatmapData.summary?.uniquePages || 0}</p>
                    <p className="text-sm text-muted-foreground">Pages Tracked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatNumber(data.heatmapData.summary?.totalInteractions || 0)}</p>
                    <p className="text-sm text-muted-foreground">Interactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interaction Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Interaction Types</span>
                </CardTitle>
                <CardDescription>Breakdown by interaction type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.heatmapData.interactionBreakdown?.map((interaction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                        <span className="font-medium capitalize">{interaction.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{interaction.count}</p>
                        <p className="text-sm text-muted-foreground">{interaction.totalClicks} clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Most Interactive Pages</CardTitle>
              <CardDescription>Pages with highest user interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.heatmapData.topPages?.slice(0, 8).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{page.page}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>{page.totalClicks} clicks</span>
                        <span>{formatDuration(page.totalHoverTime)} hover</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{page.interactions}</p>
                      <p className="text-sm text-muted-foreground">interactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Interaction Patterns</CardTitle>
              <CardDescription>How users interact across different devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {data.heatmapData.deviceBreakdown?.map((device, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getDeviceIcon(device.device)}
                    </div>
                    <h4 className="font-medium capitalize">{device.device}</h4>
                    <p className="text-2xl font-bold mt-2">{device.interactions}</p>
                    <p className="text-sm text-muted-foreground">interactions</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>Avg position: {device.avgX}, {device.avgY}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recordings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recording Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Recording Statistics</span>
                </CardTitle>
                <CardDescription>Session recording overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.sessionRecordings.summary?.avgPageCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Avg Pages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.sessionRecordings.summary?.avgInteractionCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Avg Interactions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.sessionRecordings.summary?.avgErrorCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Avg Errors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.sessionRecordings.summary?.bounceRate || 0}%</p>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bounce Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5" />
                  <span>Bounce Analysis</span>
                </CardTitle>
                <CardDescription>Users who left quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{data.sessionRecordings.bounceAnalysis?.totalBounced || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Bounced Sessions</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">{data.sessionRecordings.bounceAnalysis?.bounceRate || 0}%</p>
                      <p className="text-xs text-muted-foreground">Bounce Rate</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{formatDuration(data.sessionRecordings.bounceAnalysis?.avgBounceTime || 0)}</p>
                      <p className="text-xs text-muted-foreground">Avg Bounce Time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Recordings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Session Recordings</CardTitle>
              <CardDescription>Latest recorded user sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.sessionRecordings.recordings?.slice(0, 8).map((recording, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        recording.bounced ? 'bg-red-100' : 
                        recording.engagementScore >= 80 ? 'bg-green-100' : 
                        recording.engagementScore >= 60 ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <Play className={`h-4 w-4 ${
                          recording.bounced ? 'text-red-600' : 
                          recording.engagementScore >= 80 ? 'text-green-600' : 
                          recording.engagementScore >= 60 ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Session {recording.sessionId.slice(-8)}</p>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span>{formatDuration(recording.duration)}</span>
                          <span>{recording.pageCount} pages</span>
                          <span>{recording.interactionCount} interactions</span>
                          {getDeviceIcon(recording.deviceType)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getEngagementColor(recording.engagementScore)}`}>
                        {recording.engagementScore}
                      </p>
                      <p className="text-sm text-muted-foreground">engagement</p>
                      {recording.bounced && (
                        <Badge variant="destructive" className="text-xs mt-1">Bounced</Badge>
                      )}
                      {recording.conversionEvents?.length > 0 && (
                        <Badge variant="default" className="text-xs mt-1">Converted</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Recording Device Analysis</CardTitle>
              <CardDescription>Session quality by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {data.sessionRecordings.deviceBreakdown?.map((device, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getDeviceIcon(device.device)}
                    </div>
                    <h4 className="font-medium capitalize">{device.device}</h4>
                    <p className="text-2xl font-bold mt-2">{device.count}</p>
                    <p className="text-sm text-muted-foreground">recordings</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <p>Avg duration: {formatDuration(device.avgDuration)}</p>
                      <p>Avg interactions: {device.avgInteractions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abtests" className="space-y-4">
          {/* Active Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>Active A/B Tests</span>
              </CardTitle>
              <CardDescription>{data.abTests.summary?.activeTests || 0} currently running tests</CardDescription>
            </CardHeader>
            <CardContent>
              {data.abTests.activeTests && data.abTests.activeTests.length > 0 ? (
                <div className="space-y-4">
                  {data.abTests.activeTests.map((test, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{test.testName}</h4>
                          <p className="text-sm text-muted-foreground">{test.hypothesis}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">{test.testType}</Badge>
                            <Badge variant={test.status === 'running' ? 'default' : 'secondary'}>
                              {test.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{test.totalParticipants}</p>
                          <p className="text-sm text-muted-foreground">participants</p>
                        </div>
                      </div>
                      
                      {test.progressPercentage && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{test.progressPercentage}%</span>
                          </div>
                          <Progress value={test.progressPercentage} className="h-2" />
                        </div>
                      )}

                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {test.variantResults?.map((variant: any, variantIndex: number) => (
                          <div key={variantIndex} className="p-2 border rounded text-center">
                            <p className="font-medium">{variant.variant}</p>
                            <p className="text-sm text-muted-foreground">{variant.participants} users</p>
                            <p className="text-sm">Conv: ${variant.avgConversionValue.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No active A/B tests</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Completed Tests</span>
              </CardTitle>
              <CardDescription>Recently completed A/B test results</CardDescription>
            </CardHeader>
            <CardContent>
              {data.abTests.completedTests && data.abTests.completedTests.length > 0 ? (
                <div className="space-y-4">
                  {data.abTests.completedTests.slice(0, 5).map((test, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{test.testName}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{test.testType}</Badge>
                            <Badge variant="default">Completed</Badge>
                            {test.winner && (
                              <Badge variant="default">Winner: {test.winner}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{test.totalParticipants}</p>
                          <p className="text-sm text-muted-foreground">participants</p>
                        </div>
                      </div>

                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {test.variantResults?.map((variant: any, variantIndex: number) => (
                          <div key={variantIndex} className={`p-2 border rounded text-center ${
                            variant.variant === test.winner ? 'border-green-500 bg-green-100' : ''
                          }`}>
                            <p className="font-medium">{variant.variant}</p>
                            <p className="text-sm text-muted-foreground">{variant.participants} users</p>
                            <p className="text-sm font-semibold">${variant.totalConversionValue.toFixed(2)}</p>
                            {variant.variant === test.winner && (
                              <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No completed tests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Behavioral Segments</span>
              </CardTitle>
              <CardDescription>
                {data.behavioralSegments.summary?.totalSegments || 0} segments with {formatNumber(data.behavioralSegments.summary?.totalMemberships || 0)} memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.behavioralSegments.segments?.map((segment, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{segment.name}</h4>
                        <Badge variant={segment.isActive ? "default" : "secondary"}>
                          {segment.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="capitalize">{segment.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Users:</span>
                          <span className="font-semibold">{formatNumber(segment.userCount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Memberships:</span>
                          <span>{segment.activeMemberships}</span>
                        </div>
                        {segment.description && (
                          <p className="text-muted-foreground text-xs mt-2">{segment.description}</p>
                        )}
                        {segment.tags && segment.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {segment.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {segment.recentMemberships && segment.recentMemberships.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Recent Members</p>
                          <div className="space-y-1">
                            {segment.recentMemberships.slice(0, 3).map((member: any, memberIndex: number) => (
                              <div key={memberIndex} className="flex justify-between text-xs">
                                <span>User {member.userId?.slice(-6)}</span>
                                <span>{member.membershipScore.toFixed(1)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>User Flow Analysis</span>
              </CardTitle>
              <CardDescription>
                {data.userFlow.totalSessions} sessions • {data.userFlow.uniqueSteps} unique steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.userFlow.transitions?.slice(0, 15).map((transition, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium">{transition.from}</span>
                      </div>
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">{transition.to}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{transition.count}</p>
                      <p className="text-sm text-muted-foreground">{transition.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Interaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MousePointer className="h-5 w-5" />
                  <span>Interaction Summary</span>
                </CardTitle>
                <CardDescription>Detailed interaction analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatNumber(data.interactionAnalysis.summary?.totalInteractions || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Interactions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.interactionAnalysis.summary?.uniqueElements || 0}</p>
                    <p className="text-sm text-muted-foreground">Unique Elements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.interactionAnalysis.summary?.avgScrollDepth?.toFixed(1) || 0}%</p>
                    <p className="text-sm text-muted-foreground">Avg Scroll Depth</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.interactionAnalysis.summary?.scrollInteractions || 0}</p>
                    <p className="text-sm text-muted-foreground">Scroll Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Page Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Page Filter</span>
                </CardTitle>
                <CardDescription>Filter interactions by page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">All pages</option>
                    {data.heatmapData.topPages?.slice(0, 10).map((page, index) => (
                      <option key={index} value={page.page}>
                        {page.page}
                      </option>
                    ))}
                  </select>
                  {selectedPage && (
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <p className="font-medium">Filtering by:</p>
                      <p className="text-muted-foreground truncate">{selectedPage}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Interactive Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Most Interactive Elements</CardTitle>
              <CardDescription>Elements with highest user interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.interactionAnalysis.topElements?.slice(0, 10).map((element, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {element.elementType}
                        </Badge>
                        <span className="font-medium text-sm">{element.elementId || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>{element.totalClicks} clicks</span>
                        <span>{formatDuration(element.totalHoverTime)} hover</span>
                        <span>{element.avgScrollDepth}% scroll</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{element.interactions}</p>
                      <p className="text-sm text-muted-foreground">interactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
