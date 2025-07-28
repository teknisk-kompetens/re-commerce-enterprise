
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Eye,
  UserCheck,
  Key,
  Globe,
  Wifi,
  Server,
  Database
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

export function SecurityScene() {
  const [securityMetrics, setSecurityMetrics] = useState({
    threatLevel: 0,
    blockedAttacks: 0,
    secureConnections: 0,
    complianceScore: 0
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Unusual login pattern detected', location: 'NYC', time: '2 min ago', severity: 'medium' },
    { id: 2, type: 'info', message: 'Security patch applied successfully', location: 'System', time: '15 min ago', severity: 'low' },
    { id: 3, type: 'success', message: 'Threat blocked automatically', location: 'Firewall', time: '32 min ago', severity: 'high' }
  ]);

  useEffect(() => {
    // Animate metrics counting up
    const timer = setTimeout(() => {
      setSecurityMetrics({
        threatLevel: 2.3,
        blockedAttacks: 1247,
        secureConnections: 99.8,
        complianceScore: 96.5
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const threatData = [
    { time: '00:00', threats: 12, blocked: 12, severity: 'low' },
    { time: '04:00', threats: 8, blocked: 8, severity: 'low' },
    { time: '08:00', threats: 23, blocked: 21, severity: 'medium' },
    { time: '12:00', threats: 45, blocked: 43, severity: 'high' },
    { time: '16:00', threats: 32, blocked: 31, severity: 'medium' },
    { time: '20:00', threats: 18, blocked: 18, severity: 'low' },
  ];

  const securityStatusData = [
    { name: 'Secure', value: 85, color: '#10B981' },
    { name: 'Warning', value: 12, color: '#F59E0B' },
    { name: 'Critical', value: 3, color: '#EF4444' },
  ];

  const complianceData = [
    { framework: 'GDPR', score: 98, status: 'compliant' },
    { framework: 'SOC 2', score: 95, status: 'compliant' },
    { framework: 'ISO 27001', score: 92, status: 'compliant' },
    { framework: 'PCI DSS', score: 97, status: 'compliant' },
    { framework: 'HIPAA', score: 89, status: 'review' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-red-900">
                    Security & Compliance Center
                  </CardTitle>
                  <p className="text-red-700 mt-1">
                    Real-time threat monitoring and compliance management
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
              title: "Threat Level",
              value: `${securityMetrics.threatLevel}%`,
              status: "Low",
              color: "bg-yellow-50 border-yellow-200"
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
              title: "Blocked Attacks",
              value: securityMetrics.blockedAttacks.toLocaleString(),
              status: "Today",
              color: "bg-green-50 border-green-200"
            },
            {
              icon: <Lock className="h-8 w-8 text-blue-500" />,
              title: "Secure Connections",
              value: `${securityMetrics.secureConnections}%`,
              status: "SSL/TLS",
              color: "bg-blue-50 border-blue-200"
            },
            {
              icon: <Shield className="h-8 w-8 text-purple-500" />,
              title: "Compliance Score",
              value: `${securityMetrics.complianceScore}%`,
              status: "Excellent",
              color: "bg-purple-50 border-purple-200"
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`transition-all duration-300 hover:shadow-xl ${metric.color}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    {metric.icon}
                    <Badge variant="outline" className="text-xs text-gray-700 bg-gray-100">
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Threat Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-red-500" />
                  Threat Detection Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} name="Threats Detected" />
                    <Line type="monotone" dataKey="blocked" stroke="#10B981" strokeWidth={2} name="Threats Blocked" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Status */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  Security Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={securityStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {securityStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Compliance Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-purple-500" />
                Compliance Framework Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.map((framework, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        framework.status === 'compliant' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <Shield className={`h-4 w-4 ${
                          framework.status === 'compliant' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{framework.framework}</div>
                        <div className="text-sm text-gray-600">
                          Compliance Score: {framework.score}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={framework.score} className="w-24" />
                      <Badge 
                        variant={framework.status === 'compliant' ? 'default' : 'secondary'}
                        className={framework.status === 'compliant' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                      >
                        {framework.status === 'compliant' ? 'Compliant' : 'Review'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.type === 'success' ? 'bg-green-500' : 
                      alert.type === 'warning' ? 'bg-yellow-500' : 
                      alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            alert.severity === 'high' ? 'border-red-200 text-red-700' :
                            alert.severity === 'medium' ? 'border-yellow-200 text-yellow-700' :
                            'border-green-200 text-green-700'
                          }`}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{alert.location}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
}
