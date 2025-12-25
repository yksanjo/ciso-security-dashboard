import api from './api'

export interface SecurityPosture {
  overall_score: number
  risk_level: string
  critical_alerts: number
  open_vulnerabilities: number
  active_incidents: number
  compliance_score: number
  trend_data: Array<{ date: string; value: number }>
}

export interface DashboardStats {
  total_vulnerabilities: number
  critical_vulnerabilities: number
  open_incidents: number
  critical_incidents: number
  compliance_frameworks: number
  compliant_frameworks: number
  security_score: number
  compliance_score: number
}

export const dashboardService = {
  async getSecurityPosture(): Promise<SecurityPosture> {
    const response = await api.get('/api/dashboard/posture')
    return response.data
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/api/dashboard/stats')
    return response.data
  },
}


