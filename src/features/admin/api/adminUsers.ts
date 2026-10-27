import { apiRequest } from "../../../services/apiClient";
import type { AdminUser } from "../types/adminUser";

export function getAdminUsers(email = "") {
  const query = new URLSearchParams();
  if (email.trim()) query.set("email", email.trim());
  return apiRequest<AdminUser[]>(
    `/api/admin/users${query.size ? `?${query}` : ""}`,
  );
}
