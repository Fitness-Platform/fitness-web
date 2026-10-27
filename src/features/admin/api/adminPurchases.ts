import { apiRequest } from "../../../services/apiClient";
import type { AdminPurchase } from "../types/adminDashboard";

export function getAdminPurchases() {
  return apiRequest<AdminPurchase[]>("/api/admin/purchases");
}

export function getAdminPurchase(purchaseId: string) {
  return apiRequest<AdminPurchase>(`/api/admin/purchases/${purchaseId}`);
}
