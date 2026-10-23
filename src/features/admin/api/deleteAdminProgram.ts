import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";

export async function deleteAdminProgram(
  programId: string,
): Promise<void> {
  const csrf = await getCsrfToken();

  return apiRequest<void>(
    `/api/admin/programs/${programId}`,
    {
      method: "DELETE",
      headers: {
        [csrf.headerName]: csrf.token,
      },
    },
  );
}