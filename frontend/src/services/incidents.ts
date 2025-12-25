import api from './api'

export interface Incident {
  id: number
  title: string
  description?: string
  incident_type: string
  status: string
  severity: string
  detected_at: string
  contained_at?: string
  resolved_at?: string
  response_time_minutes?: number
  resolution_time_minutes?: number
  affected_assets?: string
  root_cause?: string
  lessons_learned?: string
  created_at: string
}

export interface IncidentCreate {
  title: string
  description?: string
  incident_type: string
  severity: string
  affected_assets?: string
}

export const incidentService = {
  async getIncidents(params?: {
    skip?: number
    limit?: number
    status?: string
    severity?: string
  }): Promise<Incident[]> {
    const response = await api.get('/api/incidents', { params })
    return response.data
  },

  async getIncident(id: number): Promise<Incident> {
    const response = await api.get(`/api/incidents/${id}`)
    return response.data
  },

  async createIncident(data: IncidentCreate): Promise<Incident> {
    const response = await api.post('/api/incidents', data)
    return response.data
  },

  async updateIncident(
    id: number,
    data: Partial<Incident>
  ): Promise<Incident> {
    const response = await api.patch(`/api/incidents/${id}`, data)
    return response.data
  },

  async deleteIncident(id: number): Promise<void> {
    await api.delete(`/api/incidents/${id}`)
  },
}


