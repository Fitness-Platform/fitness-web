import { apiRequest } from '../../../services/apiClient'
import { getCsrfToken } from './getCsrfToken'

export type LoginCredentials = {
  email: string
  password: string
}

export async function login(credentials: LoginCredentials): Promise<void> {
  const csrf = await getCsrfToken()

  await apiRequest<unknown>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify(credentials),
  })
}