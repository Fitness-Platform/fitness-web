import { memberQueryRetry } from '../utils/memberQueryRetry'
import { useQuery } from '@tanstack/react-query'

import { getMyProgramWorkout } from '../api/getMyProgramWorkout'

export function memberProgramWorkoutQueryKey(
  programId: string,
  weekId: string,
  programWeekWorkoutId: string,
) {
  return [
    'member',
    'programs',
    programId,
    'weeks',
    weekId,
    'workouts',
    programWeekWorkoutId,
  ] as const
}

export function useMyProgramWorkoutQuery(
  programId: string | undefined,
  weekId: string | undefined,
  programWeekWorkoutId: string | undefined,
) {
  return useQuery({
    retry: memberQueryRetry,
    queryKey: memberProgramWorkoutQueryKey(
      programId ?? '',
      weekId ?? '',
      programWeekWorkoutId ?? '',
    ),
    queryFn: () =>
      getMyProgramWorkout(
        programId!,
        weekId!,
        programWeekWorkoutId!,
      ),
    enabled: Boolean(
      programId &&
      weekId &&
      programWeekWorkoutId,
    ),
  })
}