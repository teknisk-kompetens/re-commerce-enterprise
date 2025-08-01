
'use client'

import dynamic from 'next/dynamic'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading chart...</div>
})

interface Widget {
  id: string
  name: string
  type: string
  config: any
}

interface WidgetRendererProps {
  widget: Widget
  config: any
}

// Sample data for charts
const sampleData = [
  { name: 'Jan', value: 400, sales: 240 },
  { name: 'Feb', value: 300, sales: 139 },
  { name: 'Mar', value: 200, sales: 980 },
  { name: 'Apr', value: 278, sales: 390 },
  { name: 'May', value: 189, sales: 480 },
  { name: 'Jun', value: 239, sales: 380 }
]

const colors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3']

export default function WidgetRenderer({ widget, config }: WidgetRendererProps) {
  const renderWidget = () => {
    switch (widget.type) {
      case 'CHART':
        const chartType = config?.chartType || 'line'
        
        if (chartType === 'line') {
          return (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData}>
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors[0]} 
                  strokeWidth={2}
                  dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )
        } else if (chartType === 'bar') {
          return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData}>
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                />
                <Bar dataKey="value" fill={colors[1]} />
              </BarChart>
            </ResponsiveContainer>
          )
        } else if (chartType === 'pie') {
          return (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sampleData.slice(0, 4)}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                >
                  {sampleData.slice(0, 4).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )
        }
        break

      case 'TEXT':
        return (
          <div 
            className="flex items-center justify-center h-full p-4"
            style={{ 
              fontSize: config?.fontSize || 16,
              color: config?.color || '#1f2937',
              textAlign: config?.align || 'center'
            }}
          >
            <div className="font-medium">
              {config?.text || widget.name}
            </div>
          </div>
        )

      case 'IMAGE':
        return (
          <div className="relative w-full h-full">
            {config?.src ? (
              <img
                src={config.src}
                alt={config?.alt || widget.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="text-sm">Image Widget</div>
                </div>
              </div>
            )}
          </div>
        )

      case 'TABLE':
        const tableData = config?.data || [
          { id: 1, name: 'Product A', price: '$29.99', stock: 150 },
          { id: 2, name: 'Product B', price: '$39.99', stock: 89 },
          { id: 3, name: 'Product C', price: '$19.99', stock: 234 }
        ]

        return (
          <div className="h-full overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(tableData[0] || {}).map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row: any, index: number) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'FORM':
        return (
          <div className="p-4 h-full overflow-auto">
            <h3 className="text-lg font-medium mb-4">{config?.title || 'Contact Form'}</h3>
            <form className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        )

      case 'MAP':
        return (
          <div className="relative w-full h-full bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🗺️</div>
              <div className="text-sm">Map Widget</div>
              <div className="text-xs mt-1">Interactive map coming soon</div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">{widget.name}</div>
              <div className="text-sm">Custom Widget</div>
              <div className="text-xs mt-1">Type: {widget.type}</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full h-full">
      {renderWidget()}
    </div>
  )
}
