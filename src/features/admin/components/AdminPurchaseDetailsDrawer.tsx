import { useAdminPurchaseQuery } from "../hooks/useAdminPurchases";
import type { AdminUser } from "../types/adminUser";
import {
  purchaseAmount,
  purchaseDate,
  purchaseDetailError,
} from "../utils/purchaseFormatting";
import AdminPurchaseStatusBadge from "./AdminPurchaseStatusBadge";
import AdminStructureDialog from "./AdminStructureDialog";
import { structureButton, structureCancel } from "./programStructureStyles";

export default function AdminPurchaseDetailsDrawer({
  purchaseId,
  users,
  onClose,
}: {
  purchaseId: string;
  users: Map<string, AdminUser>;
  onClose: () => void;
}) {
  const query = useAdminPurchaseQuery(purchaseId);
  const purchase = query.data;
  const client = purchase ? users.get(purchase.userId) : undefined;
  const fields = purchase
    ? [
        ["Client", client?.email ?? "Client details unavailable"],
        ["Role", client?.role ?? "Unavailable"],
        ["Program", purchase.programName],
        ["Amount", purchaseAmount(purchase.amountCents, purchase.currency)],
        ["Currency", purchase.currency.toUpperCase()],
        ["Created at", purchaseDate(purchase.createdAt)],
        [
          "Paid at",
          purchase.paidAt ? purchaseDate(purchase.paidAt) : "Not paid",
        ],
      ]
    : [];
  return (
    <AdminStructureDialog
      drawer
      eyebrow="Purchases"
      title="Purchase Details"
      description="Review this purchase and its payment status."
      pending={false}
      onClose={onClose}
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-7 sm:px-8">
        {query.isPending ? (
          <p role="status" className="text-sm text-muted-foreground">
            Loading purchase details...
          </p>
        ) : query.isError ? (
          <div role="alert" className="text-sm text-red-700">
            <p>{purchaseDetailError(query.error)}</p>
            <button
              type="button"
              className={structureButton + " mt-3"}
              onClick={() => query.refetch()}
            >
              Retry details
            </button>
          </div>
        ) : purchase ? (
          <>
            {query.isFetching && (
              <p role="status" className="text-xs text-muted-foreground">
                Refreshing purchase details...
              </p>
            )}
            <AdminPurchaseStatusBadge status={purchase.status} />
            <dl className="space-y-6 break-words">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm leading-6">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-muted-foreground">
              Times shown in {Intl.DateTimeFormat().resolvedOptions().timeZone}.
            </p>
          </>
        ) : null}
      </div>
      <footer className="flex shrink-0 justify-end border-t border-border px-6 py-5 sm:px-8">
        <button type="button" className={structureCancel} onClick={onClose}>
          Close
        </button>
      </footer>
    </AdminStructureDialog>
  );
}
