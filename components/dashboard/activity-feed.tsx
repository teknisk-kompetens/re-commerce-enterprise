
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  CheckCircle2, 
  UserPlus, 
  FolderOpen, 
  MessageSquare, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: string
  action: string
  entity: string
  entityId: string
  description: string
  user: {
    id: string
    name: string
    email: string
  }
  timestamp: string
  metadata?: any
}

const activityIcons = {
  created: FolderOpen,
  completed: CheckCircle2,
  assigned: UserPlus,
  commented: MessageSquare,
  joined: UserPlus,
  updated: ArrowUpRight
}

const activityColors = {
  created: 'bg-blue-500',
  completed: 'bg-green-500',
  assigned: 'bg-purple-500',
  commented: 'bg-orange-500',
  joined: 'bg-cyan-500',
  updated: 'bg-pink-500'
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activity-feed?limit=15')
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
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
          <CardTitle className="text-lg font-semibold">Activity Feed</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchActivities}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No recent activity
              </div>
            ) : (
              activities.map((activity, index) => {
                const Icon = activityIcons[activity.action as keyof typeof activityIcons] || ArrowUpRight
                const color = activityColors[activity.action as keyof typeof activityColors] || 'bg-gray-500'
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                      <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/api/avatar/${activity.user.id}`} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name?.charAt(0) || activity.user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {activity.user.name || activity.user.email}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {activity.entity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                        {activity.metadata && (
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
