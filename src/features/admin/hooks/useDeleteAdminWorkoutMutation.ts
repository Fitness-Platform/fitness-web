import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteAdminWorkout } from "../api/deleteAdminWorkout";

type UseDeleteAdminWorkoutMutationParams = {
  workoutId: string;
};

export function useDeleteAdminWorkoutMutation({
  workoutId,
}: UseDeleteAdminWorkoutMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteAdminWorkout(workoutId),

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: [
          "admin",
          "workouts",
          workoutId,
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin", "workouts"],
      });
    },
  });
}