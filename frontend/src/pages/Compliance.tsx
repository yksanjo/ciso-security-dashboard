import { useEffect, useState } from 'react'
import { complianceService, ComplianceFramework } from '../services/compliance'
import { format } from 'date-fns'

const Compliance = () => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([])
  const [selectedFramework, setSelectedFramework] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFrameworks()
  }, [])

  const loadFrameworks = async () => {
    try {
      const data = await complianceService.getFrameworks()
      setFrameworks(data)
      if (data.length > 0 && !selectedFramework) {
        setSelectedFramework(data[0].id)
      }
    } catch (error) {
      console.error('Failed to load frameworks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800'
      case 'partially_compliant':
        return 'bg-yellow-100 text-yellow-800'
      case 'non_compliant':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const framework = frameworks.find((f) => f.id === selectedFramework)

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Frameworks</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {frameworks.map((fw) => (
                <li
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedFramework === fw.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {fw.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {fw.framework_type.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        fw.overall_score
                      )}`}
                    >
                      {fw.overall_score.toFixed(0)}%
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Framework Details */}
        <div className="lg:col-span-2">
          {framework ? (
            <div className="bg-white shadow rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {framework.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {framework.description || 'No description'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-4xl font-bold ${getScoreColor(
                        framework.overall_score
                      )}`}
                    >
                      {framework.overall_score.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-500">Compliance Score</p>
                    {framework.last_assessed_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last assessed:{' '}
                        {format(
                          new Date(framework.last_assessed_at),
                          'MMM d, yyyy'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Controls</h3>
                <div className="space-y-3">
                  {framework.controls.length > 0 ? (
                    framework.controls.map((control) => (
                      <div
                        key={control.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {control.control_id}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  control.status
                                )}`}
                              >
                                {control.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              {control.title}
                            </p>
                            {control.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {control.description}
                              </p>
                            )}
                            {control.remediation_notes && (
                              <p className="text-sm text-orange-600 mt-2">
                                <strong>Remediation:</strong>{' '}
                                {control.remediation_notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No controls defined for this framework.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <p className="text-gray-500">Select a framework to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Compliance


