import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";

export async function deleteAdminExercise(
  exerciseId: string,
): Promise<void> {
  const csrf = await getCsrfToken();

  await apiRequest<void>(
    `/api/admin/exercises/${exerciseId}`,
    {
      method: "DELETE",
      headers: {
        [csrf.headerName]: csrf.token,
      },
    },
  );
}