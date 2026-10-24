import { useQuery } from "@tanstack/react-query";

import { getAdminExercises } from "../api/getAdminExercises";

export const adminExercisesQueryKey = [
  "admin",
  "exercises",
] as const;

export function useAdminExercisesQuery() {
  return useQuery({
    queryKey: adminExercisesQueryKey,
    queryFn: getAdminExercises,
  });
}