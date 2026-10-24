import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminWorkoutExercise,
  type CreateAdminWorkoutExerciseRequest,
} from "../api/createAdminWorkoutExercise";
import { adminWorkoutExercisesQueryKey } from "./useAdminWorkoutExercisesQuery";

type UseCreateAdminWorkoutExerciseMutationParams = {
  workoutId: string;
};

export function useCreateAdminWorkoutExerciseMutation({
  workoutId,
}: UseCreateAdminWorkoutExerciseMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      request: CreateAdminWorkoutExerciseRequest,
    ) =>
      createAdminWorkoutExercise({
        workoutId,
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