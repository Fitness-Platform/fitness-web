import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteAdminProgram } from "../api/deleteAdminProgram";
import { adminDashboardQueryKey } from "./useAdminDashboardQuery";
import { adminProgramQueryKey } from "./useAdminProgramQuery";
import { adminProgramsQueryKey } from "./useAdminProgramsQuery";

type UseDeleteAdminProgramMutationParams = {
  programId: string;
};

export function useDeleteAdminProgramMutation({
  programId,
}: UseDeleteAdminProgramMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteAdminProgram(programId),

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: adminProgramQueryKey(programId),
      });

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