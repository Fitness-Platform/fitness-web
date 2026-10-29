import { ApiError } from '../../../services/apiClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { completeMyWorkout } from '../api/completeMyWorkout'
import { memberProgramWorkoutQueryKey } from './useMyProgramWorkoutQuery'

type UseCompleteMyWorkoutMutationParams = {
  programId: string
  weekId: string
  programWeekWorkoutId: string
}

export function useCompleteMyWorkoutMutation({
  programId,
  weekId,
  programWeekWorkoutId,
}: UseCompleteMyWorkoutMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      completeMyWorkout({
        programId,
        weekId,
        programWeekWorkoutId,
      }),

    onError: async (error) => {
      if (error instanceof ApiError && error.status === 403) {
        await queryClient.invalidateQueries({
          queryKey: memberProgramWorkoutQueryKey(programId, weekId, programWeekWorkoutId),
        })
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: memberProgramWorkoutQueryKey(
          programId,
          weekId,
          programWeekWorkoutId,
        ),
      })
    },
  })
}