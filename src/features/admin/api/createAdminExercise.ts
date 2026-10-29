import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminExercise } from "../types/adminExercise";

export type CreateAdminExerciseRequest = {
  name: string;
  instructions: string | null;
  equipment: string | null;
  videoUrl: string | null;
  videoMediaId?: string | null;
};



export async function createAdminExercise(
  request: CreateAdminExerciseRequest,
): Promise<AdminExercise> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminExercise>(
    "/api/admin/exercises",
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