import { apiRequest } from '../../../services/apiClient'
import { getCsrfToken } from './getCsrfToken'

export async function logout(): Promise<void> {
  const csrf = await getCsrfToken()

  await apiRequest<null>('/api/auth/logout', {
    method: 'POST',
    headers: {
      [csrf.headerName]: csrf.token,
    },
  })
}