import { useQuery } from "@tanstack/react-query";

import { getAdminWorkout } from "../api/getAdminWorkout";

export function adminWorkoutQueryKey(
  workoutId: string,
) {
  return [
    "admin",
    "workouts",
    workoutId,
  ] as const;
}

export function useAdminWorkoutQuery(
  workoutId: string,
) {
  return useQuery({
    queryKey:
      adminWorkoutQueryKey(workoutId),
    queryFn: () =>
      getAdminWorkout(workoutId),
    enabled: workoutId.length > 0,
  });
}