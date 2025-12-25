import api from './api'

export interface ComplianceControl {
  id: number
  control_id: string
  title: string
  description?: string
  status: string
  evidence?: string
  remediation_notes?: string
}

export interface ComplianceFramework {
  id: number
  name: string
  framework_type: string
  version?: string
  description?: string
  overall_score: number
  last_assessed_at?: string
  controls: ComplianceControl[]
}

export const complianceService = {
  async getFrameworks(): Promise<ComplianceFramework[]> {
    const response = await api.get('/api/compliance/frameworks')
    return response.data
  },

  async getFramework(id: number): Promise<ComplianceFramework> {
    const response = await api.get(`/api/compliance/frameworks/${id}`)
    return response.data
  },

  async getFrameworkControls(id: number): Promise<ComplianceControl[]> {
    const response = await api.get(`/api/compliance/frameworks/${id}/controls`)
    return response.data
  },

  async updateControl(
    id: number,
    data: Partial<ComplianceControl>
  ): Promise<ComplianceControl> {
    const response = await api.patch(`/api/compliance/controls/${id}`, data)
    return response.data
  },
}


