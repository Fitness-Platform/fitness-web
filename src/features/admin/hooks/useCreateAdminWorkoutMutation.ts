import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminWorkout,
  type CreateAdminWorkoutRequest,
} from "../api/createAdminWorkout";
import { adminWorkoutsQueryKey } from "./useAdminWorkoutsQuery";

export function useCreateAdminWorkoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      request: CreateAdminWorkoutRequest,
    ) => createAdminWorkout(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminWorkoutsQueryKey,
      });
    },
  });
}