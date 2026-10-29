import { memberQueryRetry } from '../utils/memberQueryRetry'
import { useQuery } from '@tanstack/react-query'

import { getMyPrograms } from '../api/getMyPrograms'

export const myProgramsQueryKey = [
  'member',
  'programs',
] as const

export function useMyProgramsQuery() {
  return useQuery({
    retry: memberQueryRetry,
    queryKey: myProgramsQueryKey,
    queryFn: getMyPrograms,
  })
}