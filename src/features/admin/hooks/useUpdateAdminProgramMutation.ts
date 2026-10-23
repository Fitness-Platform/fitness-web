import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateAdminProgram,
  type UpdateAdminProgramRequest,
} from "../api/updateAdminProgram";
import { adminDashboardQueryKey } from "./useAdminDashboardQuery";
import { adminProgramQueryKey } from "./useAdminProgramQuery";
import { adminProgramsQueryKey } from "./useAdminProgramsQuery";

type UseUpdateAdminProgramMutationParams = {
  programId: string;
};

export function useUpdateAdminProgramMutation({
  programId,
}: UseUpdateAdminProgramMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      request: UpdateAdminProgramRequest,
    ) =>
      updateAdminProgram({
        programId,
        request,
      }),

    onSuccess: async (updatedProgram) => {
      queryClient.setQueryData(
        adminProgramQueryKey(programId),
        updatedProgram,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminProgramsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: adminDashboardQueryKey,
        }),
      ]);
    },
  });
}