import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProgramAccess,
  getAdminProgramAccesses,
  grantAdminProgramAccess,
  revokeAdminProgramAccess,
  type AccessFilters,
} from "../api/adminProgramAccesses";
import type { AdminProgramAccess } from "../types/adminDashboard";
import { adminDashboardQueryKey } from "./useAdminDashboardQuery";

export const adminProgramAccessesQueryKey = [
  "admin",
  "program-accesses",
] as const;
export function useAdminProgramAccessesQuery(filters: AccessFilters) {
  return useQuery({
    queryKey: [...adminProgramAccessesQueryKey, "list", filters],
    queryFn: () => getAdminProgramAccesses(filters),
  });
}
export function useAdminProgramAccessQuery(access: AdminProgramAccess) {
  return useQuery({
    queryKey: [...adminProgramAccessesQueryKey, "detail", access.id],
    queryFn: () => getAdminProgramAccess(access.id),
    initialData: access,
  });
}
export function useGrantAdminProgramAccessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: grantAdminProgramAccess,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminProgramAccessesQueryKey,
        }),
        queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
      ]);
    },
  });
}
export function useRevokeAdminProgramAccessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeAdminProgramAccess,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminProgramAccessesQueryKey,
        }),
        queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey }),
      ]);
    },
  });
}
