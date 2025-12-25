import { useEffect, useState } from 'react'
import { incidentService, Incident } from '../services/incidents'
import { format } from 'date-fns'

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', severity: '' })

  useEffect(() => {
    loadIncidents()
  }, [filter])

  const loadIncidents = async () => {
    try {
      const data = await incidentService.getIncidents({
        limit: 100,
        ...(filter.status && { status: filter.status }),
        ...(filter.severity && { severity: filter.severity }),
      })
      setIncidents(data)
    } catch (error) {
      console.error('Failed to load incidents:', error)
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
      case 'contained':
        return 'bg-blue-100 text-blue-800'
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800'
      case 'detected':
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
        <h1 className="text-3xl font-bold text-gray-900">Security Incidents</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="detected">Detected</option>
          <option value="investigating">Investigating</option>
          <option value="contained">Contained</option>
          <option value="resolved">Resolved</option>
        </select>
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
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {incidents.map((incident) => (
            <li key={incident.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {incident.title}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity}
                    </span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        incident.status
                      )}`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Type: {incident.incident_type.replace('_', ' ')}
                      {incident.response_time_minutes && (
                        <span className="ml-4">
                          Response: {incident.response_time_minutes} min
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Detected:{' '}
                      {format(new Date(incident.detected_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {incident.description && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{incident.description}</p>
                  </div>
                )}
                {incident.lessons_learned && (
                  <div className="mt-2">
                    <p className="text-sm text-blue-600">
                      <strong>Lessons Learned:</strong> {incident.lessons_learned}
                    </p>
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

export default Incidents


