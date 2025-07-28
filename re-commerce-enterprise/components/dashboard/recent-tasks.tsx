
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  category: {
    id: string
    name: string
    color: string
  } | null
  project: {
    id: string
    name: string
    color: string
  } | null
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
}

const priorityIcons = {
  low: Circle,
  medium: Clock,
  high: AlertTriangle,
  urgent: AlertTriangle
}

export function RecentTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data.tasks?.slice(0, 6) || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      })

      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        ))
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-5 h-5 bg-slate-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              {completedTasks} of {totalTasks} completed
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No tasks yet
            </div>
          ) : (
            tasks.map((task, index) => {
              const PriorityIcon = priorityIcons[task.priority]
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    task.completed 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  } hover:shadow-md transition-shadow`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => toggleTask(task.id, !task.completed)}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-medium ${
                        task.completed 
                          ? 'line-through text-slate-500 dark:text-slate-400' 
                          : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {task.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${priorityColors[task.priority]}`}
                      >
                        <PriorityIcon className="h-3 w-3 mr-1" />
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={`/api/avatar/${task.user.id}`} />
                        <AvatarFallback className="text-xs">
                          {task.user.name?.charAt(0) || task.user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {task.user.name || task.user.email}
                      </span>
                      
                      {task.project && (
                        <Badge variant="secondary" className="text-xs">
                          {task.project.name}
                        </Badge>
                      )}
                      
                      {task.dueDate && (
                        <span className={`text-xs ${
                          isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </motion.div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
