import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteAdminExercise } from "../api/deleteAdminExercise";
import { adminExercisesQueryKey } from "./useAdminExercisesQuery";

type UseDeleteAdminExerciseMutationParams = {
  exerciseId: string;
};

export function useDeleteAdminExerciseMutation({
  exerciseId,
}: UseDeleteAdminExerciseMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteAdminExercise(exerciseId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminExercisesQueryKey,
      });
    },
  });
}