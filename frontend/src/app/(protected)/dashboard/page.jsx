"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/common/Card";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Users,
  Folder,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { getDashboardStats } from "@/shared/services/stats";
import { Loading, Badge } from "@/components/common";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDashboardStats();
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="py-12 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { resourceStats, userStats, monthlyData, isAdmin } = dashboardData;

  // Prepare summary cards data
  const summaryCards = [
    {
      label: "Total Resources",
      value: resourceStats.totalResources,
      icon: <Folder className="w-6 h-6 text-blue-600" />,
      description: `${resourceStats.overdue} overdue`,
      trend: resourceStats.overdue > 0 ? "negative" : "positive"
    },
    {
      label: "Recent Activity",
      value: resourceStats.recentActivity?.length || 0,
      icon: <Activity className="w-6 h-6 text-yellow-600" />,
      description: "Recent changes",
      trend: "neutral"
    }
  ];

  // Add user stats for admins
  if (isAdmin && userStats) {
    summaryCards.splice(1, 0, {
      label: "Total Users",
      value: userStats.totalUsers,
      icon: <Users className="w-6 h-6 text-green-600" />,
      description: `${userStats.byStatus.active} active`,
      trend: "positive"
    });
  }

  // Prepare monthly chart data
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Resources Created",
        data: Object.values(monthlyData),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
      x: { grid: { color: "#f3f4f6" } }
    }
  };

  // Prepare status distribution chart
  const statusData = {
    labels: Object.keys(resourceStats.byStatus || {}),
    datasets: [
      {
        data: Object.values(resourceStats.byStatus || {}),
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)", // green
          "rgba(59, 130, 246, 0.7)", // blue
          "rgba(245, 158, 11, 0.7)", // yellow
          "rgba(239, 68, 68, 0.7)" // red
        ],
        borderWidth: 2,
        borderColor: "#ffffff"
      }
    ]
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false }
    }
  };

  // Format recent activity
  const formatActivity = activity => {
    if (!activity) return [];

    return activity.map(item => {
      const action = item.updatedAt !== item.createdAt ? "updated" : "created";
      const user = item.user?.name || "Unknown";
      return `${item.name} was ${action} by ${user}`;
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.name}! Here's what's happening with your
          resources.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map(item => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                {item.label}
              </CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {item.value}
              </div>
              <CardDescription className="flex items-center gap-2">
                {item.trend === "negative" && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                {item.trend === "positive" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {item.trend === "neutral" && (
                  <Clock className="w-4 h-4 text-gray-500" />
                )}
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resources Created (Monthly)</CardTitle>
            <CardDescription>
              Number of resources created per month this year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Resources by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <Doughnut data={statusData} options={statusOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes in your system</CardDescription>
          </CardHeader>
          <CardContent>
            {resourceStats.recentActivity &&
            resourceStats.recentActivity.length > 0 ? (
              <ul className="text-sm divide-y divide-gray-100">
                {formatActivity(resourceStats.recentActivity).map(
                  (activity, index) => (
                    <li key={index} className="flex items-center gap-3 py-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin-specific sections */}
      {isAdmin && userStats && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>User Overview</CardTitle>
              <CardDescription>
                User statistics and recent registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* User Status */}
                <div>
                  <h4 className="mb-3 font-medium">User Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Active Users
                      </span>
                      <Badge color="green">{userStats.byStatus.active}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Invited Users
                      </span>
                      <Badge color="blue">{userStats.byStatus.invited}</Badge>
                    </div>
                  </div>
                </div>

                {/* Recent Registrations */}
                <div>
                  <h4 className="mb-3 font-medium">Recent Registrations</h4>
                  {userStats.recentRegistrations &&
                  userStats.recentRegistrations.length > 0 ? (
                    <ul className="space-y-2">
                      {userStats.recentRegistrations.slice(0, 3).map(user => (
                        <li
                          key={user.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">{user.name}</span>
                          <Badge color="gray" size="sm">
                            {user.roles?.[0]?.name || "No Role"}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No recent registrations
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
