import { apiRequest } from "../../../services/apiClient";
import type { AdminProgram } from "../types/adminDashboard";

export function getAdminProgram(
  programId: string,
): Promise<AdminProgram> {
  return apiRequest<AdminProgram>(
    `/api/admin/programs/${programId}`,
  );
}