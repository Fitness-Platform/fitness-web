import { ApiError, apiRequest } from '../../../services/apiClient'
import type { AuthUser } from '../types/authUser'

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiRequest<AuthUser>('/api/auth/me')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }

    throw error
  }
}