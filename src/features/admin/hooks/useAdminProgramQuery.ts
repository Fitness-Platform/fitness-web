import { useQuery } from "@tanstack/react-query";

import { getAdminProgram } from "../api/getAdminProgram";

export function adminProgramQueryKey(
  programId: string,
) {
  return [
    "admin",
    "programs",
    programId,
  ] as const;
}

export function useAdminProgramQuery(
  programId: string,
) {
  return useQuery({
    queryKey: adminProgramQueryKey(programId),
    queryFn: () => getAdminProgram(programId),
    enabled: Boolean(programId),
  });
}