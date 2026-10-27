import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeAdminProgramStructure,
  getAdminProgramWeeks,
  getAdminProgramWeekWorkouts,
  type ProgramStructureChange,
} from "../api/adminProgramStructure";
import { adminProgramQueryKey } from "./useAdminProgramQuery";

export const adminProgramWeeksQueryKey = (programId: string) =>
  [...adminProgramQueryKey(programId), "weeks"] as const;

export function useAdminProgramWeeksQuery(programId: string) {
  return useQuery({
    queryKey: adminProgramWeeksQueryKey(programId),
    queryFn: () => getAdminProgramWeeks(programId),
    enabled: Boolean(programId),
  });
}

export function useAdminProgramWeekWorkoutsQuery(
  programId: string,
  weekId: string,
) {
  return useQuery({
    queryKey: [...adminProgramWeeksQueryKey(programId), weekId, "workouts"],
    queryFn: () => getAdminProgramWeekWorkouts(programId, weekId),
    enabled: Boolean(programId && weekId),
  });
}

export function useAdminProgramStructureMutation(programId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (change: ProgramStructureChange) =>
      changeAdminProgramStructure(programId, change),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminProgramQueryKey(programId),
      });
    },
  });
}
