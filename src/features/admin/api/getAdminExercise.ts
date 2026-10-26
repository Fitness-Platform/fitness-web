import { apiRequest } from "../../../services/apiClient";
import type { AdminExercise } from "../types/adminExercise";

export function getAdminExercise(
  exerciseId: string,
): Promise<AdminExercise> {
  return apiRequest<AdminExercise>(
    `/api/admin/exercises/${exerciseId}`,
  );
}