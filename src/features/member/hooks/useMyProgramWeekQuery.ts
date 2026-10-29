import { memberQueryRetry } from '../utils/memberQueryRetry'
import { useQuery } from '@tanstack/react-query'

import { getMyProgramWeek } from '../api/getMyProgramWeek'

export function memberProgramWeekQueryKey(
  programId: string,
  weekId: string,
) {
  return ['member', 'programs', programId, 'weeks', weekId] as const
}

export function useMyProgramWeekQuery(
  programId: string | undefined,
  weekId: string | undefined,
) {
  return useQuery({
    retry: memberQueryRetry,
    queryKey: memberProgramWeekQueryKey(
      programId ?? '',
      weekId ?? '',
    ),
    queryFn: () => getMyProgramWeek(programId!, weekId!),
    enabled: Boolean(programId && weekId),
  })
}