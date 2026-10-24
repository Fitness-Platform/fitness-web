import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteAdminWorkoutExercise } from "../api/deleteAdminWorkoutExercise";
import { adminWorkoutExercisesQueryKey } from "./useAdminWorkoutExercisesQuery";

type UseDeleteAdminWorkoutExerciseMutationParams = {
  workoutId: string;
};

export function useDeleteAdminWorkoutExerciseMutation({
  workoutId,
}: UseDeleteAdminWorkoutExerciseMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      workoutExerciseId: string,
    ) =>
      deleteAdminWorkoutExercise({
        workoutId,
        workoutExerciseId,
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