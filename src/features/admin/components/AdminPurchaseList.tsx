import type { AdminPurchase } from "../types/adminDashboard";
import type { AdminUser } from "../types/adminUser";
import { purchaseAmount, purchaseDate } from "../utils/purchaseFormatting";
import AdminPurchaseStatusBadge from "./AdminPurchaseStatusBadge";
import { structureButton } from "./programStructureStyles";

export default function AdminPurchaseList({
  purchases,
  users,
  onDetails,
}: {
  purchases: AdminPurchase[];
  users: Map<string, AdminUser>;
  onDetails: (purchaseId: string) => void;
}) {
  return (
    <ul
      aria-label="Purchases"
      className="divide-y divide-border border border-border"
    >
      {purchases.map((purchase) => {
        const email =
          users.get(purchase.userId)?.email ?? "Client details unavailable";
        return (
          <li
            key={purchase.purchaseId}
            className="grid gap-5 px-5 py-6 sm:px-7 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
          >
            <div className="min-w-0 break-words">
              <p className="text-sm font-medium">{email}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {purchase.programName}
              </p>
              <div className="mt-3">
                <AdminPurchaseStatusBadge status={purchase.status} />
              </div>
            </div>
            <dl className="grid min-w-0 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Amount
                </dt>
                <dd className="mt-1 font-medium">
                  {purchaseAmount(purchase.amountCents, purchase.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Created
                </dt>
                <dd className="mt-1">{purchaseDate(purchase.createdAt)}</dd>
              </div>
              {purchase.paidAt && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Paid
                  </dt>
                  <dd className="mt-1">{purchaseDate(purchase.paidAt)}</dd>
                </div>
              )}
            </dl>
            <div>
              <button
                type="button"
                className={structureButton}
                onClick={() => onDetails(purchase.purchaseId)}
                aria-label={`Purchase details for ${email} in ${purchase.programName}`}
              >
                Details
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
