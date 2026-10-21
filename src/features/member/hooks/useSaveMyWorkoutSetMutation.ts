import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  saveMyWorkoutSet,
  type SaveMyWorkoutSetRequest,
} from '../api/saveMyWorkoutSet'
import { memberProgramWorkoutQueryKey } from './useMyProgramWorkoutQuery'

type UseSaveMyWorkoutSetMutationParams = {
  programId: string
  weekId: string
  programWeekWorkoutId: string
}

type SaveWorkoutSetVariables = {
  workoutExerciseId: string
  setNumber: number
  request: SaveMyWorkoutSetRequest
}

export function useSaveMyWorkoutSetMutation({
  programId,
  weekId,
  programWeekWorkoutId,
}: UseSaveMyWorkoutSetMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workoutExerciseId,
      setNumber,
      request,
    }: SaveWorkoutSetVariables) =>
      saveMyWorkoutSet({
        programId,
        weekId,
        programWeekWorkoutId,
        workoutExerciseId,
        setNumber,
        request,
      }),

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