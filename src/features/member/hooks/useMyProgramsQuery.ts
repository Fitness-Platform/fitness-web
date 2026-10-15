import { useQuery } from '@tanstack/react-query'

import { getMyPrograms } from '../api/getMyPrograms'

export const myProgramsQueryKey = [
  'member',
  'programs',
] as const

export function useMyProgramsQuery() {
  return useQuery({
    queryKey: myProgramsQueryKey,
    queryFn: getMyPrograms,
  })
}