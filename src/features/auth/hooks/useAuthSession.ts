import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from '../api/getCurrentUser'

export const authSessionQueryKey = ['auth', 'session'] as const

export function useAuthSession() {
  const query = useQuery({
    queryKey: authSessionQueryKey,
    queryFn: getCurrentUser,
  })

  return {
    ...query,
    user: query.data,
    isAuthenticated: query.isSuccess && query.data !== null,
    isUnauthenticated: query.isSuccess && query.data === null,
  }
}