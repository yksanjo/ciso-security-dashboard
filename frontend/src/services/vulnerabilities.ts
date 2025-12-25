import api from './api'

export interface Vulnerability {
  id: number
  title: string
  description?: string
  cve_id?: string
  cvss_score?: number
  severity: string
  status: string
  asset_name?: string
  asset_type?: string
  source?: string
  discovered_at: string
  resolved_at?: string
  sla_deadline?: string
  remediation_notes?: string
  created_at: string
}

export interface VulnerabilityCreate {
  title: string
  description?: string
  cve_id?: string
  cvss_score?: number
  severity: string
  asset_name?: string
  asset_type?: string
  source?: string
}

export const vulnerabilityService = {
  async getVulnerabilities(params?: {
    skip?: number
    limit?: number
    severity?: string
    status?: string
  }): Promise<Vulnerability[]> {
    const response = await api.get('/api/vulnerabilities', { params })
    return response.data
  },

  async getVulnerability(id: number): Promise<Vulnerability> {
    const response = await api.get(`/api/vulnerabilities/${id}`)
    return response.data
  },

  async createVulnerability(data: VulnerabilityCreate): Promise<Vulnerability> {
    const response = await api.post('/api/vulnerabilities', data)
    return response.data
  },

  async updateVulnerability(
    id: number,
    data: Partial<Vulnerability>
  ): Promise<Vulnerability> {
    const response = await api.patch(`/api/vulnerabilities/${id}`, data)
    return response.data
  },

  async deleteVulnerability(id: number): Promise<void> {
    await api.delete(`/api/vulnerabilities/${id}`)
  },
}


