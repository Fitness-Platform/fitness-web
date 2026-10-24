import { apiRequest } from "../../../services/apiClient";
import type { AdminExercise } from "../types/adminExercise";

export function getAdminExercises(): Promise<
  AdminExercise[]
> {
  return apiRequest<AdminExercise[]>(
    "/api/admin/exercises",
  );
}