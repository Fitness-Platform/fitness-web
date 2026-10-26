import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateAdminExercise,
  type UpdateAdminExerciseRequest,
} from "../api/updateAdminExercise";
import { adminExerciseQueryKey } from "./useAdminExerciseQuery";
import { adminExercisesQueryKey } from "./useAdminExercisesQuery";

type UseUpdateAdminExerciseMutationParams = {
  exerciseId: string;
};

type UpdateAdminExerciseMutationVariables = {
  request: UpdateAdminExerciseRequest;
};

export function useUpdateAdminExerciseMutation({
  exerciseId,
}: UseUpdateAdminExerciseMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
    }: UpdateAdminExerciseMutationVariables) =>
      updateAdminExercise({
        exerciseId,
        request,
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            adminExerciseQueryKey(exerciseId),
        }),
        queryClient.invalidateQueries({
          queryKey: adminExercisesQueryKey,
        }),
      ]);
    },
  });
}