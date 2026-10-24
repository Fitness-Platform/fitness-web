import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminWorkout } from "../types/adminWorkout";

export type CreateAdminWorkoutRequest = {
  name: string;
  description: string | null;
};

export async function createAdminWorkout(
  request: CreateAdminWorkoutRequest,
): Promise<AdminWorkout> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminWorkout>(
    "/api/admin/workouts",
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