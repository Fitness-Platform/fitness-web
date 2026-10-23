import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminProgram } from "../types/adminDashboard";

export type AdminProgramStatusAction =
  | "PUBLISH"
  | "DRAFT";

type UpdateAdminProgramStatusParams = {
  programId: string;
  action: AdminProgramStatusAction;
};

export async function updateAdminProgramStatus({
  programId,
  action,
}: UpdateAdminProgramStatusParams): Promise<AdminProgram> {
  const csrf = await getCsrfToken();

  const endpoint =
    action === "PUBLISH"
      ? `/api/admin/programs/${programId}/publish`
      : `/api/admin/programs/${programId}/draft`;

  return apiRequest<AdminProgram>(
    endpoint,
    {
      method: "POST",
      headers: {
        [csrf.headerName]: csrf.token,
      },
    },
  );
}