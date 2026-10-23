import { getCsrfToken } from '../../auth/api/getCsrfToken'
import { apiRequest } from '../../../services/apiClient'
import type { AdminProgram } from '../types/adminDashboard'

export type CreateAdminProgramRequest = {
  name: string
  description: string | null
}

export async function createAdminProgram(
  request: CreateAdminProgramRequest,
): Promise<AdminProgram> {
  const csrf = await getCsrfToken()

  return apiRequest<AdminProgram>(
    '/api/admin/programs',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify(request),
    },
  )
}