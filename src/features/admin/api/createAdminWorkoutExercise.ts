import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminWorkoutExercise } from "../types/adminWorkoutExercise";

export type CreateAdminWorkoutExerciseRequest = {
  exerciseId: string;
  sets: number;
  reps: string;
  suggestedWeightLb: number | null;
  restSeconds: number | null;
  notes: string | null;
  position: number;
};

type CreateAdminWorkoutExerciseParams = {
  workoutId: string;
  request: CreateAdminWorkoutExerciseRequest;
};

export async function createAdminWorkoutExercise({
  workoutId,
  request,
}: CreateAdminWorkoutExerciseParams): Promise<AdminWorkoutExercise> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminWorkoutExercise>(
    `/api/admin/workouts/${workoutId}/exercises`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify(request),
    },
  );
}