import { useQuery } from '@tanstack/react-query'

import { getAdminPrograms } from '../api/getAdminPrograms'

export const adminProgramsQueryKey = [
  'admin',
  'programs',
] as const

export function useAdminProgramsQuery() {
  return useQuery({
    queryKey: adminProgramsQueryKey,
    queryFn: getAdminPrograms,
  })
}