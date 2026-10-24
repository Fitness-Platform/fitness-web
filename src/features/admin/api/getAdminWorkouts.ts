import { apiRequest } from "../../../services/apiClient";
import type { AdminWorkout } from "../types/adminWorkout";

export function getAdminWorkouts(): Promise<
  AdminWorkout[]
> {
  return apiRequest<AdminWorkout[]>(
    "/api/admin/workouts",
  );
}