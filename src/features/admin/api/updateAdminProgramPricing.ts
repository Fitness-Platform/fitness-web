import { getCsrfToken } from "../../auth/api/getCsrfToken";
import { apiRequest } from "../../../services/apiClient";
import type { AdminProgram } from "../types/adminDashboard";

export type UpdateAdminProgramPricingRequest = {
  priceCents: number | null;
};

type UpdateAdminProgramPricingParams = {
  programId: string;
  request: UpdateAdminProgramPricingRequest;
};

export async function updateAdminProgramPricing({
  programId,
  request,
}: UpdateAdminProgramPricingParams): Promise<AdminProgram> {
  const csrf = await getCsrfToken();

  return apiRequest<AdminProgram>(
    `/api/admin/programs/${programId}/pricing`,
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