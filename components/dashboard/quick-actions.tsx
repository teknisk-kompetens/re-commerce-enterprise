
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Users, 
  FolderOpen, 
  Workflow,
  MessageSquare,
  Calendar,
  FileText,
  Settings
} from 'lucide-react'
import { motion } from 'framer-motion'

const quickActions = [
  {
    title: 'Create Task',
    description: 'Add a new task to your project',
    icon: Plus,
    color: 'bg-blue-500',
    action: () => console.log('Create task')
  },
  {
    title: 'New Project',
    description: 'Start a new project',
    icon: FolderOpen,
    color: 'bg-green-500',
    action: () => console.log('New project')
  },
  {
    title: 'Invite User',
    description: 'Add team members',
    icon: Users,
    color: 'bg-purple-500',
    action: () => console.log('Invite user')
  },
  {
    title: 'Create Workflow',
    description: 'Automate your processes',
    icon: Workflow,
    color: 'bg-orange-500',
    action: () => console.log('Create workflow')
  },
  {
    title: 'Schedule Meeting',
    description: 'Plan team meetings',
    icon: Calendar,
    color: 'bg-cyan-500',
    action: () => console.log('Schedule meeting')
  },
  {
    title: 'Generate Report',
    description: 'Create analytics report',
    icon: FileText,
    color: 'bg-pink-500',
    action: () => console.log('Generate report')
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={action.action}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                    <action.icon className={`h-4 w-4 ${action.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" className="w-full" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            More Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
