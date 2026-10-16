import { useQuery } from '@tanstack/react-query'

import { getMyProgram } from '../api/getMyProgram'

export function memberProgramQueryKey(programId: string) {
  return ['member', 'programs', programId] as const
}

export function useMyProgramQuery(programId: string | undefined) {
  return useQuery({
    queryKey: memberProgramQueryKey(programId ?? ''),
    queryFn: () => getMyProgram(programId!),
    enabled: Boolean(programId),
  })
}