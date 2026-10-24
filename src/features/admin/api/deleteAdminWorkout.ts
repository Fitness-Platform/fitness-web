import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";

export async function deleteAdminWorkout(
  workoutId: string,
): Promise<void> {
  const csrf = await getCsrfToken();

  return apiRequest<void>(
    `/api/admin/workouts/${workoutId}`,
    {
      method: "DELETE",
      headers: {
        [csrf.headerName]: csrf.token,
      },
    },
  );
}