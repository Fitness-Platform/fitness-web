import { apiRequest } from "../../../services/apiClient";
import type { AdminWorkoutExercise } from "../types/adminWorkoutExercise";

export function getAdminWorkoutExercises(
  workoutId: string,
): Promise<AdminWorkoutExercise[]> {
  return apiRequest<AdminWorkoutExercise[]>(
    `/api/admin/workouts/${workoutId}/exercises`,
  );
}