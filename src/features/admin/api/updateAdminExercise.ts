import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminExercise } from "../types/adminExercise";

export type UpdateAdminExerciseRequest = {
  name: string;
  instructions: string | null;
  equipment: string | null;
  videoUrl: string | null;
};

type UpdateAdminExerciseParams = {
  exerciseId: string;
  request: UpdateAdminExerciseRequest;
};

export async function updateAdminExercise({
  exerciseId,
  request,
}: UpdateAdminExerciseParams): Promise<AdminExercise> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminExercise>(
    `/api/admin/exercises/${exerciseId}`,
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