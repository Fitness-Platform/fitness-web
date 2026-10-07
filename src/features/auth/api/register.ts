import { apiRequest } from '../../../services/apiClient'
import { getCsrfToken } from './getCsrfToken'

export type RegisterCredentials = {
  email: string
  password: string
}

export type RegisterResponse = {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const csrf = await getCsrfToken()

  return apiRequest<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify(credentials),
  })
}