import { useEffect, useState } from 'react'
import { vulnerabilityService, Vulnerability } from '../services/vulnerabilities'
import { format } from 'date-fns'

const Vulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ severity: '', status: '' })

  useEffect(() => {
    loadVulnerabilities()
  }, [filter])

  const loadVulnerabilities = async () => {
    try {
      const data = await vulnerabilityService.getVulnerabilities({
        limit: 100,
        ...(filter.severity && { severity: filter.severity }),
        ...(filter.status && { status: filter.status }),
      })
      setVulnerabilities(data)
    } catch (error) {
      console.error('Failed to load vulnerabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'open':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vulnerabilities</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filter.severity}
          onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {vulnerabilities.map((vuln) => (
            <li key={vuln.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {vuln.title}
                    </p>
                    {vuln.cve_id && (
                      <span className="ml-2 text-xs text-gray-500">
                        {vuln.cve_id}
                      </span>
                    )}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
                        vuln.severity
                      )}`}
                    >
                      {vuln.severity}
                    </span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        vuln.status
                      )}`}
                    >
                      {vuln.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {vuln.asset_name && (
                        <span className="mr-4">Asset: {vuln.asset_name}</span>
                      )}
                      {vuln.cvss_score && (
                        <span>CVSS: {vuln.cvss_score}</span>
                      )}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Discovered:{' '}
                      {format(new Date(vuln.discovered_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {vuln.description && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{vuln.description}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Vulnerabilities


