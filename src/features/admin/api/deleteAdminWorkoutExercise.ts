import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";

type DeleteAdminWorkoutExerciseParams = {
  workoutId: string;
  workoutExerciseId: string;
};

export async function deleteAdminWorkoutExercise({
  workoutId,
  workoutExerciseId,
}: DeleteAdminWorkoutExerciseParams): Promise<void> {
  const csrf = await getCsrfToken();

  return apiRequest<void>(
    `/api/admin/workouts/${workoutId}/exercises/${workoutExerciseId}`,
    {
      method: "DELETE",
      headers: {
        [csrf.headerName]: csrf.token,
      },
    },
  );
}