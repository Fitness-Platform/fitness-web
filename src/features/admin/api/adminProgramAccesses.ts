import { apiRequest } from "../../../services/apiClient";
import { getCsrfToken } from "../../auth/api/getCsrfToken";
import type { AdminProgramAccess } from "../types/adminDashboard";

export type AccessFilters = { userId?: string; programId?: string };
export type GrantAccessRequest = {
  userId: string;
  programId: string;
  startsAt: string;
  expiresAt: string | null;
};

export function getAdminProgramAccesses(filters: AccessFilters = {}) {
  const query = new URLSearchParams();
  if (filters.userId) query.set("userId", filters.userId);
  if (filters.programId) query.set("programId", filters.programId);
  return apiRequest<AdminProgramAccess[]>(
    `/api/admin/program-accesses${query.size ? `?${query}` : ""}`,
  );
}
export function getAdminProgramAccess(accessId: string) {
  return apiRequest<AdminProgramAccess>(
    `/api/admin/program-accesses/${accessId}`,
  );
}
export async function grantAdminProgramAccess(request: GrantAccessRequest) {
  const csrf = await getCsrfToken();
  return apiRequest<AdminProgramAccess>("/api/admin/program-accesses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify(request),
  });
}
export async function revokeAdminProgramAccess(accessId: string) {
  const csrf = await getCsrfToken();
  return apiRequest<AdminProgramAccess>(
    `/api/admin/program-accesses/${accessId}/revoke`,
    { method: "POST", headers: { [csrf.headerName]: csrf.token } },
  );
}
