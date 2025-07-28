
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain,
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  Eye,
  Bot,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function AIScene() {
  const [aiMetrics, setAiMetrics] = useState({
    predictions: 0,
    accuracy: 0,
    insights: 0,
    automations: 0
  });

  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    // Animate metrics counting up
    const timer = setTimeout(() => {
      setAiMetrics({
        predictions: 1247,
        accuracy: 94.7,
        insights: 23,
        automations: 89
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const predictionAccuracyData = [
    { time: 'Jan', accuracy: 88, predictions: 1200 },
    { time: 'Feb', accuracy: 91, predictions: 1350 },
    { time: 'Mar', accuracy: 89, predictions: 1180 },
    { time: 'Apr', accuracy: 93, predictions: 1420 },
    { time: 'May', accuracy: 95, predictions: 1560 },
    { time: 'Jun', accuracy: 94, predictions: 1680 },
  ];

  const aiCapabilitiesData = [
    { subject: 'Prediction', A: 95, fullMark: 100 },
    { subject: 'Analysis', A: 88, fullMark: 100 },
    { subject: 'Automation', A: 92, fullMark: 100 },
    { subject: 'Optimization', A: 85, fullMark: 100 },
    { subject: 'Detection', A: 90, fullMark: 100 },
    { subject: 'Learning', A: 93, fullMark: 100 },
  ];

  // AI Insights for slideshow
  const aiInsights = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Revenue Prediction",
      description: "Q4 revenue projected to increase by 22% based on current trends",
      confidence: "94%",
      impact: "High",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "Customer Behavior Analysis",
      description: "Peak engagement detected during 2-4 PM, recommend content scheduling",
      confidence: "87%",
      impact: "Medium",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Performance Optimization",
      description: "Server resources can be optimized for 15% better performance",
      confidence: "91%",
      impact: "High",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Eye className="h-6 w-6 text-purple-500" />,
      title: "Anomaly Detection",
      description: "Unusual pattern detected in user registration flow",
      confidence: "96%",
      impact: "Critical",
      color: "from-purple-500 to-pink-600"
    }
  ];

  // Auto-advance insights slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % aiInsights.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [aiInsights.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-purple-900">
                    AI-Powered Intelligence Center
                  </CardTitle>
                  <p className="text-purple-700 mt-1">
                    Advanced machine learning insights and automated intelligence
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* AI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <Brain className="h-8 w-8 text-purple-500" />,
              title: "AI Predictions",
              value: aiMetrics.predictions.toLocaleString(),
              status: "Today",
              color: "bg-purple-50 border-purple-200"
            },
            {
              icon: <Target className="h-8 w-8 text-green-500" />,
              title: "Accuracy Rate",
              value: `${aiMetrics.accuracy}%`,
              status: "Excellent",
              color: "bg-green-50 border-green-200"
            },
            {
              icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
              title: "AI Insights",
              value: aiMetrics.insights.toString(),
              status: "Active",
              color: "bg-yellow-50 border-yellow-200"
            },
            {
              icon: <Bot className="h-8 w-8 text-blue-500" />,
              title: "Automations",
              value: `${aiMetrics.automations}%`,
              status: "Running",
              color: "bg-blue-50 border-blue-200"
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
          {/* Prediction Accuracy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                  AI Prediction Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={predictionAccuracyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#8B5CF6" strokeWidth={3} name="Accuracy %" />
                    <Line type="monotone" dataKey="predictions" stroke="#10B981" strokeWidth={2} name="Predictions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Capabilities Radar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                  AI Capabilities Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={aiCapabilitiesData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar 
                      name="AI Capabilities" 
                      dataKey="A" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Insights Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                  AI-Generated Insights
                </CardTitle>
                <div className="flex space-x-1">
                  {aiInsights.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentInsight(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentInsight ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                key={currentInsight}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`p-6 rounded-xl bg-gradient-to-r ${aiInsights[currentInsight]?.color} text-white`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {aiInsights[currentInsight]?.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {aiInsights[currentInsight]?.title}
                      </h3>
                      <p className="text-white/90 mb-4">
                        {aiInsights[currentInsight]?.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Confidence:</span>
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {aiInsights[currentInsight]?.confidence}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Impact:</span>
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {aiInsights[currentInsight]?.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Tools & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-gradient-to-r from-gray-50 to-purple-50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-gray-600" />
                AI-Powered Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/ai-analytics">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-white rounded-lg border hover:border-purple-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Brain className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">AI Analytics</h4>
                        <p className="text-sm text-gray-600">Advanced data analysis</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                
                <Link href="/ai-command-center">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-white rounded-lg border hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">AI Command Center</h4>
                        <p className="text-sm text-gray-600">Automated operations</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                <Link href="/ai-insights">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-white rounded-lg border hover:border-green-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">AI Insights</h4>
                        <p className="text-sm text-gray-600">Intelligent recommendations</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
}
