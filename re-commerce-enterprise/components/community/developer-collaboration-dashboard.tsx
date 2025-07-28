
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  GitBranch,
  Users,
  MessageSquare,
  Star,
  Eye,
  Heart,
  GitCommit,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Calendar,
  Trophy
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CollaborationStats {
  totalProjects: number;
  activeCollaborations: number;
  codeShares: number;
  mentorships: number;
  monthlyContributions: number;
  codeReviews: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  visibility: string;
  owner: {
    user: {
      name: string;
      email: string;
    };
  };
  repositoryUrl?: string;
  technologies: string[];
  contributorCount: number;
  commitCount: number;
  issueCount: number;
  starCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CodeShare {
  id: string;
  title: string;
  description?: string;
  language: string;
  framework?: string;
  category: string;
  difficulty: string;
  creator: {
    user: {
      name: string;
      email: string;
    };
  };
  viewCount: number;
  likeCount: number;
  forkCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Mentorship {
  id: string;
  status: string;
  focus: string[];
  goals?: string;
  duration?: number;
  mentor: {
    user: {
      name: string;
      email: string;
    };
  };
  mentee: {
    user: {
      name: string;
      email: string;
    };
  };
  sessionsCompleted: number;
  rating?: number;
  startedAt?: string;
  nextSession?: string;
}

interface DeveloperProfile {
  id: string;
  user: {
    name: string;
    email: string;
  };
  title?: string;
  company?: string;
  location?: string;
  bio?: string;
  skills: string[];
  expertise: string[];
  experience: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  contributionCount: number;
  followerCount: number;
  followingCount: number;
  isAvailableForMentoring: boolean;
}

export default function DeveloperCollaborationDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<CollaborationStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [codeShares, setCodeShares] = useState<CodeShare[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [developerProfiles, setDeveloperProfiles] = useState<DeveloperProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaborationData();
  }, []);

  const loadCollaborationData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats: CollaborationStats = {
        totalProjects: 45,
        activeCollaborations: 12,
        codeShares: 89,
        mentorships: 8,
        monthlyContributions: 156,
        codeReviews: 34,
      };

      const mockProjects: Project[] = [
        {
          id: "1",
          name: "e-commerce-platform",
          description: "Modern e-commerce platform built with React and Node.js",
          category: "web_app",
          status: "active",
          visibility: "public",
          owner: {
            user: { name: "Sarah Johnson", email: "sarah@example.com" },
          },
          repositoryUrl: "https://github.com/user/e-commerce-platform",
          technologies: ["React", "Node.js", "PostgreSQL", "TypeScript"],
          contributorCount: 8,
          commitCount: 245,
          issueCount: 12,
          starCount: 34,
          createdAt: "2024-01-01T12:00:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          name: "analytics-dashboard",
          description: "Real-time analytics dashboard with customizable widgets",
          category: "tool",
          status: "active",
          visibility: "public",
          owner: {
            user: { name: "Mike Chen", email: "mike@example.com" },
          },
          repositoryUrl: "https://github.com/user/analytics-dashboard",
          technologies: ["Vue.js", "D3.js", "Python", "Redis"],
          contributorCount: 5,
          commitCount: 156,
          issueCount: 8,
          starCount: 28,
          createdAt: "2024-01-05T14:20:00Z",
          updatedAt: "2024-01-14T16:45:00Z",
        },
      ];

      const mockCodeShares: CodeShare[] = [
        {
          id: "1",
          title: "React Custom Hook for API Calls",
          description: "A reusable custom hook for handling API calls with loading states and error handling",
          language: "javascript",
          framework: "react",
          category: "component",
          difficulty: "intermediate",
          creator: {
            user: { name: "Alex Johnson", email: "alex@example.com" },
          },
          viewCount: 245,
          likeCount: 34,
          forkCount: 12,
          commentCount: 8,
          createdAt: "2024-01-10T12:00:00Z",
          updatedAt: "2024-01-12T15:30:00Z",
        },
        {
          id: "2",
          title: "Advanced SQL Query Optimization",
          description: "Performance optimization techniques for complex SQL queries",
          language: "sql",
          category: "tutorial",
          difficulty: "advanced",
          creator: {
            user: { name: "Emma Davis", email: "emma@example.com" },
          },
          viewCount: 189,
          likeCount: 56,
          forkCount: 8,
          commentCount: 15,
          createdAt: "2024-01-08T09:15:00Z",
          updatedAt: "2024-01-11T11:20:00Z",
        },
      ];

      const mockMentorships: Mentorship[] = [
        {
          id: "1",
          status: "active",
          focus: ["React", "Frontend Development", "Career Growth"],
          goals: "Help mentee transition to senior frontend developer role",
          duration: 12,
          mentor: {
            user: { name: "Sarah Johnson", email: "sarah@example.com" },
          },
          mentee: {
            user: { name: "John Doe", email: "john@example.com" },
          },
          sessionsCompleted: 4,
          rating: 5,
          startedAt: "2024-01-01T12:00:00Z",
          nextSession: "2024-01-20T14:00:00Z",
        },
        {
          id: "2",
          status: "pending",
          focus: ["Backend Development", "System Design"],
          mentor: {
            user: { name: "Mike Chen", email: "mike@example.com" },
          },
          mentee: {
            user: { name: "Jane Smith", email: "jane@example.com" },
          },
          sessionsCompleted: 0,
        },
      ];

      const mockDeveloperProfiles: DeveloperProfile[] = [
        {
          id: "1",
          user: { name: "Sarah Johnson", email: "sarah@example.com" },
          title: "Senior Frontend Developer",
          company: "TechCorp",
          location: "Stockholm, Sweden",
          bio: "Passionate frontend developer with 8+ years of experience in React and modern web technologies.",
          skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
          expertise: ["Frontend Architecture", "Performance Optimization", "Team Leadership"],
          experience: "senior",
          githubUsername: "sarahjohnson",
          linkedinUrl: "https://linkedin.com/in/sarahjohnson",
          portfolioUrl: "https://sarahjohnson.dev",
          contributionCount: 245,
          followerCount: 89,
          followingCount: 34,
          isAvailableForMentoring: true,
        },
        {
          id: "2",
          user: { name: "Mike Chen", email: "mike@example.com" },
          title: "Full Stack Engineer",
          company: "StartupXYZ",
          location: "Göteborg, Sweden",
          bio: "Full stack developer specializing in scalable web applications and cloud architecture.",
          skills: ["Node.js", "Python", "React", "AWS", "Docker"],
          expertise: ["Backend Development", "System Design", "Cloud Architecture"],
          experience: "senior",
          githubUsername: "mikechen",
          contributionCount: 189,
          followerCount: 67,
          followingCount: 45,
          isAvailableForMentoring: true,
        },
      ];

      setStats(mockStats);
      setProjects(mockProjects);
      setCodeShares(mockCodeShares);
      setMentorships(mockMentorships);
      setDeveloperProfiles(mockDeveloperProfiles);
    } catch (error) {
      console.error("Error loading collaboration data:", error);
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
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      on_hold: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getExperienceColor = (experience: string) => {
    const colors = {
      junior: "bg-green-100 text-green-800",
      mid: "bg-blue-100 text-blue-800",
      senior: "bg-purple-100 text-purple-800",
      expert: "bg-orange-100 text-orange-800",
    };
    return colors[experience as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Developer Collaboration</h1>
          <p className="text-gray-600">Connect, collaborate, and learn with fellow developers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Find Developers
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Start Project
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-blue-600" />
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
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Collabs</p>
                  <p className="text-2xl font-bold">{stats.activeCollaborations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Code Shares</p>
                  <p className="text-2xl font-bold">{stats.codeShares}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Mentorships</p>
                  <p className="text-2xl font-bold">{stats.mentorships}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Monthly Commits</p>
                  <p className="text-2xl font-bold">{stats.monthlyContributions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="text-sm text-gray-600">Code Reviews</p>
                  <p className="text-2xl font-bold">{stats.codeReviews}</p>
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
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="code-shares">Code Shares</TabsTrigger>
          <TabsTrigger value="mentorships">Mentorships</TabsTrigger>
          <TabsTrigger value="developers">Developers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{project.contributorCount} contributors</span>
                        <span>{project.commitCount} commits</span>
                        <span>{project.starCount} stars</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Code Shares */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Popular Code Shares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {codeShares.slice(0, 3).map((codeShare) => (
                  <div key={codeShare.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{codeShare.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Badge variant="outline">{codeShare.language}</Badge>
                        {codeShare.framework && (
                          <Badge variant="outline">{codeShare.framework}</Badge>
                        )}
                        <Badge className={getDifficultyColor(codeShare.difficulty)}>
                          {codeShare.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {codeShare.viewCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {codeShare.likeCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {codeShare.forkCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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
              New Project
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
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline">{project.category}</Badge>
                          <Badge variant="outline">{project.visibility}</Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="flex items-center flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.contributorCount} contributors
                          </div>
                          <div className="flex items-center gap-1">
                            <GitCommit className="h-4 w-4" />
                            {project.commitCount} commits
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {project.issueCount} issues
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {project.starCount} stars
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Updated {formatDate(project.updatedAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {project.repositoryUrl && (
                          <Button variant="outline" size="sm">
                            <Github className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Project</DropdownMenuItem>
                            <DropdownMenuItem>Join Project</DropdownMenuItem>
                            <DropdownMenuItem>Follow Updates</DropdownMenuItem>
                            <DropdownMenuItem>Report Project</DropdownMenuItem>
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

        {/* Code Shares Tab */}
        <TabsContent value="code-shares" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search code shares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Share Code
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeShares.map((codeShare) => (
              <motion.div
                key={codeShare.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{codeShare.title}</h3>
                        {codeShare.description && (
                          <p className="text-sm text-gray-600 mb-3">{codeShare.description}</p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{codeShare.language}</Badge>
                          {codeShare.framework && (
                            <Badge variant="outline">{codeShare.framework}</Badge>
                          )}
                          <Badge className={getDifficultyColor(codeShare.difficulty)}>
                            {codeShare.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {codeShare.viewCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {codeShare.likeCount}
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-4 w-4" />
                            {codeShare.forkCount}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            By {codeShare.creator.user.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(codeShare.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Mentorships Tab */}
        <TabsContent value="mentorships" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search mentorships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Find Mentor
            </Button>
          </div>

          <div className="grid gap-6">
            {mentorships.map((mentorship) => (
              <motion.div
                key={mentorship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getStatusColor(mentorship.status)}>
                            {mentorship.status}
                          </Badge>
                          {mentorship.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{mentorship.rating}/5</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Mentor</h4>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {mentorship.mentor.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{mentorship.mentor.user.name}</p>
                                <p className="text-sm text-gray-600">{mentorship.mentor.user.email}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Mentee</h4>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {mentorship.mentee.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{mentorship.mentee.user.name}</p>
                                <p className="text-sm text-gray-600">{mentorship.mentee.user.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-gray-600 mb-2">Focus Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {mentorship.focus.map((area) => (
                              <Badge key={area} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {mentorship.goals && (
                          <div className="mt-4">
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Goals</h4>
                            <p className="text-sm text-gray-600">{mentorship.goals}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            {mentorship.sessionsCompleted} sessions completed
                          </div>
                          {mentorship.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {mentorship.duration} weeks duration
                            </div>
                          )}
                          {mentorship.nextSession && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Next: {formatDate(mentorship.nextSession)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Session</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>Rate Mentorship</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Developers Tab */}
        <TabsContent value="developers" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerProfiles.map((profile) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-lg">
                            {profile.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{profile.user.name}</h3>
                          {profile.title && (
                            <p className="text-sm text-gray-600">{profile.title}</p>
                          )}
                          {profile.company && (
                            <p className="text-sm text-gray-500">at {profile.company}</p>
                          )}
                          {profile.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{profile.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {profile.bio && (
                        <p className="text-sm text-gray-600">{profile.bio}</p>
                      )}

                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={getExperienceColor(profile.experience)}>
                          {profile.experience}
                        </Badge>
                        {profile.isAvailableForMentoring && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Available for mentoring
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>{profile.contributionCount} contributions</span>
                          <span>{profile.followerCount} followers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {profile.githubUsername && (
                            <Button variant="ghost" size="sm">
                              <Github className="h-4 w-4" />
                            </Button>
                          )}
                          {profile.linkedinUrl && (
                            <Button variant="ghost" size="sm">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          )}
                          {profile.portfolioUrl && (
                            <Button variant="ghost" size="sm">
                              <Globe className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          <Button className="flex-1" size="sm">
                            Connect
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
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
