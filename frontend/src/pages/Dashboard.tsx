import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { dashboardService, SecurityPosture, DashboardStats } from '../services/dashboard'

const Dashboard = () => {
  const [posture, setPosture] = useState<SecurityPosture | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postureData, statsData] = await Promise.all([
          dashboardService.getSecurityPosture(),
          dashboardService.getDashboardStats(),
        ])
        setPosture(postureData)
        setStats(statsData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'critical':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Security Posture</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold text-gray-900">
                  {posture?.overall_score.toFixed(1) || '0'}%
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-500">Security Score</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getRiskColor(
                  posture?.risk_level || 'medium'
                )}`}
              >
                {posture?.risk_level.toUpperCase() || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold text-red-600">
                  {posture?.critical_alerts || 0}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-500">
                Critical Alerts
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold text-orange-600">
                  {posture?.open_vulnerabilities || 0}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-500">
                Open Vulnerabilities
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl font-bold text-blue-600">
                  {posture?.compliance_score.toFixed(1) || '0'}%
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-500">
                Compliance Score
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Security Score Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={posture?.trend_data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString()
                }
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString()
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Security Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Overview Statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: 'Vulnerabilities',
                  Total: stats?.total_vulnerabilities || 0,
                  Critical: stats?.critical_vulnerabilities || 0,
                },
                {
                  name: 'Incidents',
                  Total: stats?.open_incidents || 0,
                  Critical: stats?.critical_incidents || 0,
                },
                {
                  name: 'Frameworks',
                  Total: stats?.compliance_frameworks || 0,
                  Compliant: stats?.compliant_frameworks || 0,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Total" fill="#3b82f6" />
              <Bar dataKey="Critical" fill="#ef4444" />
              <Bar dataKey="Compliant" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


