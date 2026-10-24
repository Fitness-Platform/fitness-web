import { useQuery } from "@tanstack/react-query";

import { getAdminWorkoutExercises } from "../api/getAdminWorkoutExercises";

export function adminWorkoutExercisesQueryKey(
  workoutId: string,
) {
  return [
    "admin",
    "workouts",
    workoutId,
    "exercises",
  ] as const;
}

export function useAdminWorkoutExercisesQuery(
  workoutId: string,
) {
  return useQuery({
    queryKey:
      adminWorkoutExercisesQueryKey(
        workoutId,
      ),
    queryFn: () =>
      getAdminWorkoutExercises(workoutId),
    enabled: workoutId.length > 0,
  });
}