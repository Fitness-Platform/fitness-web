import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../../../services/apiClient";
import { getPublicProgram, getPublicPrograms } from "../api/getPublicProgram";
import { programIdPattern } from "../utils/programDestination";

export function usePublicProgram(programId: string) {
  return useQuery({
    queryKey: ["public", "programs", programId],
    queryFn: () => getPublicProgram(programId),
    enabled: programIdPattern.test(programId),
    retry: (count, error) =>
      !(error instanceof ApiError && error.status === 404) && count < 1,
  });
}

export function usePublicPrograms() {
  return useQuery({
    queryKey: ["public", "programs"],
    queryFn: getPublicPrograms,
    retry: 1,
  });
}
