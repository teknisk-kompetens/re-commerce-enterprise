
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  FolderOpen, 
  Users, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface Project {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  startDate: string | null
  endDate: string | null
  createdAt: string
  owner: {
    id: string
    name: string
    email: string
  }
  tasks: {
    id: string
    completed: boolean
  }[]
}

export function ProjectProgress() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects?.slice(0, 5) || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No projects yet
            </div>
          ) : (
            projects.map((project, index) => {
              const totalTasks = project.tasks.length
              const completedTasks = project.tasks.filter(task => task.completed).length
              const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {project.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={project.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {project.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {completedTasks} of {totalTasks} tasks completed
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-2"
                      style={{ 
                        backgroundColor: project.color + '20',
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3" />
                        <span>{project.owner.name || project.owner.email}</span>
                      </div>
                      
                      {project.endDate && (
                        <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Due {formatDistanceToNow(new Date(project.endDate), { addSuffix: true })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {progressPercentage > 75 && (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      )}
                      {progressPercentage < 25 && (
                        <Clock className="h-3 w-3 text-orange-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
