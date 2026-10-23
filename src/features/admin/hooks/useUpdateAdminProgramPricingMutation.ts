import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateAdminProgramPricing,
  type UpdateAdminProgramPricingRequest,
} from "../api/updateAdminProgramPricing";
import { adminDashboardQueryKey } from "./useAdminDashboardQuery";
import { adminProgramQueryKey } from "./useAdminProgramQuery";
import { adminProgramsQueryKey } from "./useAdminProgramsQuery";

type UseUpdateAdminProgramPricingMutationParams = {
  programId: string;
};

export function useUpdateAdminProgramPricingMutation({
  programId,
}: UseUpdateAdminProgramPricingMutationParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      request: UpdateAdminProgramPricingRequest,
    ) =>
      updateAdminProgramPricing({
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