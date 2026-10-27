import { useQuery } from "@tanstack/react-query";
import { getAdminPurchase, getAdminPurchases } from "../api/adminPurchases";

export function useAdminPurchasesQuery() {
  return useQuery({
    queryKey: ["admin", "purchases", "list"],
    queryFn: getAdminPurchases,
  });
}

export function useAdminPurchaseQuery(purchaseId: string) {
  return useQuery({
    queryKey: ["admin", "purchases", "detail", purchaseId],
    queryFn: () => getAdminPurchase(purchaseId),
    enabled: Boolean(purchaseId),
  });
}
