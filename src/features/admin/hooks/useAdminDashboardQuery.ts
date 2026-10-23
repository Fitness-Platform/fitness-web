import { useQuery } from '@tanstack/react-query'

import { getAdminDashboardData } from '../api/getAdminDashboardData'

export const adminDashboardQueryKey = [
  'admin',
  'dashboard',
] as const

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: adminDashboardQueryKey,
    queryFn: getAdminDashboardData,
  })
}