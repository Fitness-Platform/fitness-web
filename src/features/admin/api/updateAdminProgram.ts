import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminProgram } from "../types/adminDashboard";

export type UpdateAdminProgramRequest = {
  name: string;
  description: string | null;
};

type UpdateAdminProgramParams = {
  programId: string;
  request: UpdateAdminProgramRequest;
};

export async function updateAdminProgram({
  programId,
  request,
}: UpdateAdminProgramParams): Promise<AdminProgram> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminProgram>(
    `/api/admin/programs/${programId}`,
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