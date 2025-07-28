
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  Eye,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Github,
  FileText,
  BarChart3,
  Target,
  Zap,
  Activity
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContributionStats {
  totalContributions: number;
  totalProjects: number;
  codeContributions: number;
  documentationContributions: number;
  issueContributions: number;
  reviewContributions: number;
  pointsEarned: number;
  currentStreak: number;
  longestStreak: number;
  monthlyGrowth: number;
}

interface OpenSourceProject {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  languages: string[];
  topics: string[];
  maintainer: {
    name: string;
    email: string;
  };
  repositoryUrl: string;
  starCount: number;
  forkCount: number;
  contributorCount: number;
  commitCount: number;
  issueCount: number;
  pullRequestCount: number;
  codeQualityScore?: number;
  testCoverage?: number;
  lastCommitAt?: string;
  lastReleaseAt?: string;
  lastActivityAt: string;
  status: string;
  license?: string;
}

interface Contribution {
  id: string;
  type: string;
  title: string;
  description?: string;
  project: {
    name: string;
    slug: string;
  };
  contributor: {
    name: string;
    email: string;
  };
  status: string;
  impact: string;
  pointsAwarded: number;
  isFirstContribution: boolean;
  isFeatured: boolean;
  pullRequestUrl?: string;
  issueUrl?: string;
  filesChanged?: number;
  linesAdded?: number;
  linesDeleted?: number;
  complexity: string;
  createdAt: string;
  mergedAt?: string;
}

interface ContributionTracking {
  id: string;
  period: string;
  totalContributions: number;
  codeContributions: number;
  documentationContributions: number;
  issueContributions: number;
  reviewContributions: number;
  pointsEarned: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  projectsContributed: number;
}

interface Recognition {
  id: string;
  type: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  pointValue: number;
  badgeUrl?: string;
  awardedAt: string;
}

export default function OpenSourceContributionDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [projects, setProjects] = useState<OpenSourceProject[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [tracking, setTracking] = useState<ContributionTracking[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContributionData();
  }, []);

  const loadContributionData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats: ContributionStats = {
        totalContributions: 342,
        totalProjects: 28,
        codeContributions: 245,
        documentationContributions: 67,
        issueContributions: 23,
        reviewContributions: 7,
        pointsEarned: 3450,
        currentStreak: 12,
        longestStreak: 45,
        monthlyGrowth: 23.5,
      };

      const mockProjects: OpenSourceProject[] = [
        {
          id: "1",
          name: "react-components-library",
          description: "A comprehensive library of reusable React components for modern web applications",
          category: "library",
          language: "TypeScript",
          languages: ["TypeScript", "JavaScript", "CSS"],
          topics: ["react", "components", "ui", "library"],
          maintainer: { name: "Sarah Johnson", email: "sarah@example.com" },
          repositoryUrl: "https://github.com/user/react-components-library",
          starCount: 1245,
          forkCount: 189,
          contributorCount: 67,
          commitCount: 890,
          issueCount: 23,
          pullRequestCount: 156,
          codeQualityScore: 9.2,
          testCoverage: 87.5,
          lastCommitAt: "2024-01-15T10:30:00Z",
          lastReleaseAt: "2024-01-10T14:20:00Z",
          lastActivityAt: "2024-01-15T10:30:00Z",
          status: "active",
          license: "MIT",
        },
        {
          id: "2",
          name: "api-testing-framework",
          description: "Advanced testing framework for REST and GraphQL APIs with automated test generation",
          category: "tool",
          language: "Python",
          languages: ["Python", "JavaScript"],
          topics: ["testing", "api", "automation", "framework"],
          maintainer: { name: "Mike Chen", email: "mike@example.com" },
          repositoryUrl: "https://github.com/user/api-testing-framework",
          starCount: 856,
          forkCount: 134,
          contributorCount: 45,
          commitCount: 567,
          issueCount: 18,
          pullRequestCount: 89,
          codeQualityScore: 8.7,
          testCoverage: 92.3,
          lastCommitAt: "2024-01-14T16:45:00Z",
          lastActivityAt: "2024-01-14T16:45:00Z",
          status: "active",
          license: "Apache-2.0",
        },
      ];

      const mockContributions: Contribution[] = [
        {
          id: "1",
          type: "code",
          title: "Add responsive design support to Button component",
          description: "Implemented responsive breakpoints and mobile-first design for the Button component",
          project: { name: "react-components-library", slug: "react-components-library" },
          contributor: { name: "John Doe", email: "john@example.com" },
          status: "merged",
          impact: "moderate",
          pointsAwarded: 75,
          isFirstContribution: false,
          isFeatured: true,
          pullRequestUrl: "https://github.com/user/react-components-library/pull/245",
          filesChanged: 8,
          linesAdded: 156,
          linesDeleted: 23,
          complexity: "moderate",
          createdAt: "2024-01-10T12:00:00Z",
          mergedAt: "2024-01-12T15:30:00Z",
        },
        {
          id: "2",
          type: "documentation",
          title: "Update API documentation with new endpoints",
          description: "Added comprehensive documentation for the new authentication endpoints",
          project: { name: "api-testing-framework", slug: "api-testing-framework" },
          contributor: { name: "Jane Smith", email: "jane@example.com" },
          status: "merged",
          impact: "minor",
          pointsAwarded: 25,
          isFirstContribution: true,
          isFeatured: false,
          pullRequestUrl: "https://github.com/user/api-testing-framework/pull/67",
          filesChanged: 3,
          linesAdded: 89,
          linesDeleted: 12,
          complexity: "simple",
          createdAt: "2024-01-08T09:15:00Z",
          mergedAt: "2024-01-09T11:20:00Z",
        },
        {
          id: "3",
          type: "bug_report",
          title: "Memory leak in test runner",
          description: "Identified and reported a memory leak that occurs during long test runs",
          project: { name: "api-testing-framework", slug: "api-testing-framework" },
          contributor: { name: "Alex Johnson", email: "alex@example.com" },
          status: "reviewed",
          impact: "major",
          pointsAwarded: 50,
          isFirstContribution: false,
          isFeatured: false,
          issueUrl: "https://github.com/user/api-testing-framework/issues/123",
          complexity: "complex",
          createdAt: "2024-01-12T14:30:00Z",
        },
      ];

      const mockTracking: ContributionTracking[] = [
        {
          id: "1",
          period: "2024-01",
          totalContributions: 23,
          codeContributions: 15,
          documentationContributions: 5,
          issueContributions: 2,
          reviewContributions: 1,
          pointsEarned: 450,
          currentStreak: 12,
          longestStreak: 12,
          activeDays: 18,
          projectsContributed: 5,
        },
        {
          id: "2",
          period: "2023-12",
          totalContributions: 34,
          codeContributions: 28,
          documentationContributions: 4,
          issueContributions: 1,
          reviewContributions: 1,
          pointsEarned: 680,
          currentStreak: 8,
          longestStreak: 45,
          activeDays: 22,
          projectsContributed: 3,
        },
      ];

      const mockRecognitions: Recognition[] = [
        {
          id: "1",
          type: "contributor_of_month",
          title: "Contributor of the Month",
          description: "Outstanding contributions to open source projects in January 2024",
          category: "contribution",
          level: "gold",
          pointValue: 500,
          badgeUrl: "/badges/contributor-of-month.svg",
          awardedAt: "2024-01-31T12:00:00Z",
        },
        {
          id: "2",
          type: "first_contribution",
          title: "First Contribution",
          description: "Made your first open source contribution",
          category: "milestone",
          level: "bronze",
          pointValue: 100,
          badgeUrl: "/badges/first-contribution.svg",
          awardedAt: "2023-06-15T10:30:00Z",
        },
      ];

      setStats(mockStats);
      setProjects(mockProjects);
      setContributions(mockContributions);
      setTracking(mockTracking);
      setRecognitions(mockRecognitions);
    } catch (error) {
      console.error("Error loading contribution data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: "bg-blue-100 text-blue-800",
      reviewed: "bg-yellow-100 text-yellow-800",
      merged: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      reverted: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      minor: "bg-green-100 text-green-800",
      moderate: "bg-yellow-100 text-yellow-800",
      major: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[impact as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code":
        return <GitCommit className="h-4 w-4" />;
      case "documentation":
        return <FileText className="h-4 w-4" />;
      case "bug_report":
        return <AlertCircle className="h-4 w-4" />;
      case "feature_request":
        return <Zap className="h-4 w-4" />;
      case "review":
        return <Eye className="h-4 w-4" />;
      case "testing":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <GitBranch className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      bronze: "bg-amber-100 text-amber-800",
      silver: "bg-gray-100 text-gray-800",
      gold: "bg-yellow-100 text-yellow-800",
      platinum: "bg-purple-100 text-purple-800",
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredContributions = contributions.filter((contribution) => {
    const matchesSearch = contribution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || contribution.type === typeFilter;
    const matchesStatus = statusFilter === "all" || contribution.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Open Source Contributions</h1>
          <p className="text-gray-600">Track your contributions and impact in the open source community</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Contributions</p>
                  <p className="text-2xl font-bold">{stats.totalContributions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Points Earned</p>
                  <p className="text-2xl font-bold">{stats.pointsEarned.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold">{stats.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="recognition">Recognition</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contribution Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Contribution Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Code Contributions</span>
                      <span>{stats?.codeContributions}</span>
                    </div>
                    <Progress value={(stats?.codeContributions || 0) / (stats?.totalContributions || 1) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Documentation</span>
                      <span>{stats?.documentationContributions}</span>
                    </div>
                    <Progress value={(stats?.documentationContributions || 0) / (stats?.totalContributions || 1) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Issues</span>
                      <span>{stats?.issueContributions}</span>
                    </div>
                    <Progress value={(stats?.issueContributions || 0) / (stats?.totalContributions || 1) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reviews</span>
                      <span>{stats?.reviewContributions}</span>
                    </div>
                    <Progress value={(stats?.reviewContributions || 0) / (stats?.totalContributions || 1) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Contributions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Recent Contributions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contributions.slice(0, 5).map((contribution) => (
                  <div key={contribution.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                      {getTypeIcon(contribution.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{contribution.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">{contribution.project.name}</span>
                        <Badge className={getStatusColor(contribution.status)} variant="secondary">
                          {contribution.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(contribution.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      +{contribution.pointsAwarded}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contributions Tab */}
        <TabsContent value="contributions" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contributions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="bug_report">Bug Reports</SelectItem>
                <SelectItem value="feature_request">Feature Requests</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contributions List */}
          <div className="grid gap-4">
            {filteredContributions.map((contribution) => (
              <motion.div
                key={contribution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          {getTypeIcon(contribution.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{contribution.title}</h3>
                            <Badge className={getStatusColor(contribution.status)}>
                              {contribution.status}
                            </Badge>
                            <Badge className={getImpactColor(contribution.impact)}>
                              {contribution.impact}
                            </Badge>
                            {contribution.isFirstContribution && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                First contribution
                              </Badge>
                            )}
                            {contribution.isFeatured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                Featured
                              </Badge>
                            )}
                          </div>
                          {contribution.description && (
                            <p className="text-gray-600 mb-3">{contribution.description}</p>
                          )}
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>Project: {contribution.project.name}</span>
                            <span>Type: {contribution.type}</span>
                            <span>Complexity: {contribution.complexity}</span>
                            {contribution.filesChanged && (
                              <span>{contribution.filesChanged} files changed</span>
                            )}
                            {contribution.linesAdded && (
                              <span className="text-green-600">+{contribution.linesAdded}</span>
                            )}
                            {contribution.linesDeleted && (
                              <span className="text-red-600">-{contribution.linesDeleted}</span>
                            )}
                            <span>{formatDate(contribution.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            +{contribution.pointsAwarded}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {contribution.pullRequestUrl && (
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Pull Request
                              </DropdownMenuItem>
                            )}
                            {contribution.issueUrl && (
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Issue
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Share Achievement</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          <div className="grid gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          <Badge variant="outline">{project.category}</Badge>
                          <Badge variant="outline">{project.language}</Badge>
                          {project.license && (
                            <Badge variant="secondary">{project.license}</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="flex items-center flex-wrap gap-2 mb-4">
                          {project.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">{project.starCount}</div>
                            <div className="text-xs text-gray-500">Stars</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{project.forkCount}</div>
                            <div className="text-xs text-gray-500">Forks</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{project.contributorCount}</div>
                            <div className="text-xs text-gray-500">Contributors</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{project.commitCount}</div>
                            <div className="text-xs text-gray-500">Commits</div>
                          </div>
                        </div>
                        
                        {(project.codeQualityScore || project.testCoverage) && (
                          <div className="flex items-center gap-6 mb-4">
                            {project.codeQualityScore && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Quality Score:</span>
                                <Badge variant="outline">{project.codeQualityScore}/10</Badge>
                              </div>
                            )}
                            {project.testCoverage && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Test Coverage:</span>
                                <Badge variant="outline">{project.testCoverage}%</Badge>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>Maintained by {project.maintainer.name}</span>
                          <span>Last activity {formatDate(project.lastActivityAt)}</span>
                          {project.lastReleaseAt && (
                            <span>Last release {formatDate(project.lastReleaseAt)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Repository</DropdownMenuItem>
                            <DropdownMenuItem>Contribute</DropdownMenuItem>
                            <DropdownMenuItem>Follow Project</DropdownMenuItem>
                            <DropdownMenuItem>Report Issue</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <div className="grid gap-6">
            {tracking.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {record.period}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{record.totalContributions}</div>
                        <div className="text-sm text-gray-500">Total Contributions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{record.codeContributions}</div>
                        <div className="text-sm text-gray-500">Code</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{record.documentationContributions}</div>
                        <div className="text-sm text-gray-500">Documentation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{record.pointsEarned}</div>
                        <div className="text-sm text-gray-500">Points Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{record.currentStreak}</div>
                        <div className="text-sm text-gray-500">Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{record.projectsContributed}</div>
                        <div className="text-sm text-gray-500">Projects</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Recognition Tab */}
        <TabsContent value="recognition" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recognitions.map((recognition) => (
              <motion.div
                key={recognition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{recognition.title}</h3>
                        {recognition.description && (
                          <p className="text-sm text-gray-600 mt-1">{recognition.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center gap-2">
                        <Badge className={getLevelColor(recognition.level)}>
                          {recognition.level}
                        </Badge>
                        <Badge variant="outline">{recognition.category}</Badge>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Award className="h-4 w-4" />
                          <span>{recognition.pointValue} points</span>
                        </div>
                        <div>Awarded {formatDate(recognition.awardedAt)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
