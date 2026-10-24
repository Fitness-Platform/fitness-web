import { apiRequest } from "../../../services/apiClient";
import type { AdminWorkout } from "../types/adminWorkout";

export function getAdminWorkout(
  workoutId: string,
): Promise<AdminWorkout> {
  return apiRequest<AdminWorkout>(
    `/api/admin/workouts/${workoutId}`,
  );
}