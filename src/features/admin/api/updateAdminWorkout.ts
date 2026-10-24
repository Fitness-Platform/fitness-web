import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminWorkout } from "../types/adminWorkout";

export type UpdateAdminWorkoutRequest = {
  name: string;
  description: string | null;
};

type UpdateAdminWorkoutParams = {
  workoutId: string;
  request: UpdateAdminWorkoutRequest;
};

export async function updateAdminWorkout({
  workoutId,
  request,
}: UpdateAdminWorkoutParams): Promise<AdminWorkout> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminWorkout>(
    `/api/admin/workouts/${workoutId}`,
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