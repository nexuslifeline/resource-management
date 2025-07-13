'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useAuthStore } from '@/store/useAuthStore'
import { Users, Folder, Activity } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const summary = [
  {
    label: 'Total Resources',
    value: 55,
    icon: <Folder className="w-6 h-6 text-blue-600" />, 
    description: '+10% from last month',
  },
  {
    label: 'Total Users',
    value: 12,
    icon: <Users className="w-6 h-6 text-green-600" />, 
    description: '+2 new users',
  },
  {
    label: 'Recent Activity',
    value: 8,
    icon: <Activity className="w-6 h-6 text-yellow-600" />, 
    description: '8 changes today',
  },
]

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Resources Created',
      data: [3, 5, 8, 6, 7, 9, 4, 6, 8, 10, 7, 5],
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 6,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
    x: { grid: { color: '#f3f4f6' } },
  },
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summary.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{item.label}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resources Created (Monthly)</CardTitle>
            <CardDescription>Bar chart of resources created per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-100 text-sm">
              <li className="py-2">Resource "API Docs" was updated by Alice</li>
              <li className="py-2">Resource "CRM System" assigned to Bob</li>
              <li className="py-2">User John Doe added</li>
              <li className="py-2">Resource "Mobile App" deleted</li>
              <li className="py-2">Resource "Inventory" marked as completed</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 