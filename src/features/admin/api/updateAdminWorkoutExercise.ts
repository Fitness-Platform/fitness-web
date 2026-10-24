import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminWorkoutExercise } from "../types/adminWorkoutExercise";

export type UpdateAdminWorkoutExerciseRequest = {
  sets: number;
  reps: string;
  suggestedWeightLb: number | null;
  restSeconds: number | null;
  notes: string | null;
  position: number;
};

type UpdateAdminWorkoutExerciseParams = {
  workoutId: string;
  workoutExerciseId: string;
  request: UpdateAdminWorkoutExerciseRequest;
};

export async function updateAdminWorkoutExercise({
  workoutId,
  workoutExerciseId,
  request,
}: UpdateAdminWorkoutExerciseParams): Promise<AdminWorkoutExercise> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminWorkoutExercise>(
    `/api/admin/workouts/${workoutId}/exercises/${workoutExerciseId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify(request),
    },
  );
}