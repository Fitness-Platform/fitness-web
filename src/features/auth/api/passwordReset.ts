import { apiRequest } from '../../../services/apiClient'
import { getCsrfToken } from './getCsrfToken'

export type ForgotPasswordRequest = { email: string }
export type ResetPasswordRequest = { token: string; newPassword: string }

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  const csrf = await getCsrfToken()
  await apiRequest<unknown>('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [csrf.headerName]: csrf.token },
    body: JSON.stringify(data),
  })
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  const csrf = await getCsrfToken()
  await apiRequest<unknown>('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [csrf.headerName]: csrf.token },
    body: JSON.stringify(data),
  })
}
