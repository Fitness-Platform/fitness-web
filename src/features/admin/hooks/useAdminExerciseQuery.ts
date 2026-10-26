import { useQuery } from "@tanstack/react-query";

import { getAdminExercise } from "../api/getAdminExercise";

export function adminExerciseQueryKey(
  exerciseId: string,
) {
  return [
    "admin",
    "exercises",
    exerciseId,
  ] as const;
}

export function useAdminExerciseQuery(
  exerciseId: string,
) {
  return useQuery({
    queryKey:
      adminExerciseQueryKey(exerciseId),

    queryFn: () =>
      getAdminExercise(exerciseId),

    enabled: Boolean(exerciseId),
  });
}