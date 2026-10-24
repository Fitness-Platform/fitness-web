import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateAdminWorkoutExercise,
  type UpdateAdminWorkoutExerciseRequest,
} from "../api/updateAdminWorkoutExercise";
import { adminWorkoutExercisesQueryKey } from "./useAdminWorkoutExercisesQuery";

type UpdateWorkoutExerciseVariables = {
  workoutExerciseId: string;
  request: UpdateAdminWorkoutExerciseRequest;
};

type UseUpdateAdminWorkoutExerciseMutationParams = {
  workoutId: string;
};

export function useUpdateAdminWorkoutExerciseMutation({
  workoutId,
}: UseUpdateAdminWorkoutExerciseMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workoutExerciseId,
      request,
    }: UpdateWorkoutExerciseVariables) =>
      updateAdminWorkoutExercise({
        workoutId,
        workoutExerciseId,
        request,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          adminWorkoutExercisesQueryKey(
            workoutId,
          ),
      });
    },
  });
}