import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateAdminProgramStatus,
  type AdminProgramStatusAction,
} from "../api/updateAdminProgramStatus";
import { adminDashboardQueryKey } from "./useAdminDashboardQuery";
import { adminProgramQueryKey } from "./useAdminProgramQuery";
import { adminProgramsQueryKey } from "./useAdminProgramsQuery";

type UseUpdateAdminProgramStatusMutationParams = {
  programId: string;
};

export function useUpdateAdminProgramStatusMutation({
  programId,
}: UseUpdateAdminProgramStatusMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      action: AdminProgramStatusAction,
    ) =>
      updateAdminProgramStatus({
        programId,
        action,
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