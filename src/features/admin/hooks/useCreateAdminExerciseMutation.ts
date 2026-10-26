import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminExercise,
  type CreateAdminExerciseRequest,
} from "../api/createAdminExercise";
import { adminExercisesQueryKey } from "./useAdminExercisesQuery";

export function useCreateAdminExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      request: CreateAdminExerciseRequest,
    ) => createAdminExercise(request),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminExercisesQueryKey,
      });
    },
  });
}