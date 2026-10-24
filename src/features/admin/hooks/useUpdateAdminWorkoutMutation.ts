import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateAdminWorkout,
  type UpdateAdminWorkoutRequest,
} from "../api/updateAdminWorkout";

type UseUpdateAdminWorkoutMutationParams = {
  workoutId: string;
};

export function useUpdateAdminWorkoutMutation({
  workoutId,
}: UseUpdateAdminWorkoutMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      request: UpdateAdminWorkoutRequest,
    ) =>
      updateAdminWorkout({
        workoutId,
        request,
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "admin",
            "workouts",
            workoutId,
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "admin",
            "workouts",
          ],
        }),
      ]);
    },
  });
}