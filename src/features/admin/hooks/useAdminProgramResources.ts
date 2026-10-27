import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeAdminProgramResource,
  getAdminProgramResources,
  type ProgramResourceChange,
} from "../api/adminProgramResources";
import { adminProgramQueryKey } from "./useAdminProgramQuery";

export const adminProgramResourcesQueryKey = (programId: string) =>
  [...adminProgramQueryKey(programId), "resources"] as const;

export function useAdminProgramResourcesQuery(programId: string) {
  return useQuery({
    queryKey: adminProgramResourcesQueryKey(programId),
    queryFn: () => getAdminProgramResources(programId),
    enabled: Boolean(programId),
  });
}

export function useAdminProgramResourceMutation(programId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (change: ProgramResourceChange) =>
      changeAdminProgramResource(programId, change),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminProgramResourcesQueryKey(programId),
      });
    },
  });
}
