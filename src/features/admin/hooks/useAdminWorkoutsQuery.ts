import { useQuery } from "@tanstack/react-query";

import { getAdminWorkouts } from "../api/getAdminWorkouts";

export const adminWorkoutsQueryKey = [
  "admin",
  "workouts",
] as const;

export function useAdminWorkoutsQuery() {
  return useQuery({
    queryKey: adminWorkoutsQueryKey,
    queryFn: getAdminWorkouts,
  });
}