import { apiRequest } from '../../../services/apiClient'
import type { AdminProgram } from '../types/adminDashboard'

export function getAdminPrograms(): Promise<AdminProgram[]> {
  return apiRequest<AdminProgram[]>(
    '/api/admin/programs',
  )
}