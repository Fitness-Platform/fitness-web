import AdminHistoryPagination from "../components/AdminHistoryPagination";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAdminPurchasesQuery } from "../hooks/useAdminPurchases";
import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import type { AdminPurchaseStatus } from "../types/adminDashboard";
import type { AdminUser } from "../types/adminUser";
import AdminUserPicker from "../components/AdminUserPicker";
import AdminPurchaseList from "../components/AdminPurchaseList";
import AdminPurchaseDetailsDrawer from "../components/AdminPurchaseDetailsDrawer";
import {
  structureButton,
  structureInput,
  structureLabel,
} from "../components/programStructureStyles";

export default function AdminPurchasesPage() {
  const query = useAdminPurchasesQuery();
  const users = useAdminUsersQuery();
  const [client, setClient] = useState<AdminUser | null>(null);
  const [programId, setProgramId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const status: AdminPurchaseStatus | "" =
    (["PENDING", "PAID", "EXPIRED"] as const).find(value => value === searchParams.get("status")) ?? "";
  function setStatus(value: AdminPurchaseStatus | "") {
    setSearchParams(current => {
      const next = new URLSearchParams(current);
      if (value) next.set("status", value);
      else next.delete("status");
      return next;
    });
  }
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const purchases = query.data ?? [];
  const userMap = new Map(users.data?.map((user) => [user.id, user]));
  if (client) userMap.set(client.id, client);
  const programs = [
    ...new Map(
      purchases.map((purchase) => [purchase.programId, purchase.programName]),
    ).entries(),
  ];
  const filtered = purchases.filter(
    (purchase) =>
      (!client || purchase.userId === client.id) &&
      (!programId || purchase.programId === programId) &&
      (!status || purchase.status === status),
  );
  const filtersActive = Boolean(client || programId || status);
  return (
    <div className="space-y-8 lg:space-y-10">
      <header>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
          Purchases
        </p>
        <h1 className="mt-2 text-[32px] font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[44px]">
          Purchase history
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Review program purchases and payment status.
        </p>
      </header>
      <section
        aria-label="Purchase filters"
        className="grid gap-6 border-y border-border py-6 md:grid-cols-3"
      >
        <AdminUserPicker
          value={client}
          onChange={setClient}
          label="Filter by client"
          optional
        />
        <div className="min-w-0">
          <label htmlFor="purchase-program-filter" className={structureLabel}>
            Filter by program
          </label>
          <select
            id="purchase-program-filter"
            value={programId}
            onChange={(event) => setProgramId(event.target.value)}
            className={structureInput}
          >
            <option value="">All programs</option>
            {programs.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="purchase-status-filter" className={structureLabel}>
            Filter by status
          </label>
          <select
            id="purchase-status-filter"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AdminPurchaseStatus | "")
            }
            className={structureInput}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Dates use {Intl.DateTimeFormat().resolvedOptions().timeZone}.
          </p>
          {filtersActive && (
            <button
              type="button"
              className={structureButton + " mt-4"}
              onClick={() => {
                setClient(null);
                setProgramId("");
                setStatus("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </section>
      {users.isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading client details...
        </p>
      )}
      {users.isError && (
        <section role="alert" className="border border-border p-5">
          <p className="text-sm text-red-700">
            Unable to load client details. Purchase records remain available
            below.
          </p>
          <button
            type="button"
            className={structureButton + " mt-3"}
            onClick={() => users.refetch()}
          >
            Retry client details
          </button>
        </section>
      )}
      {query.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading purchases...
        </p>
      ) : query.isError ? (
        <section role="alert" className="border border-border p-5">
          <p className="text-sm text-red-700">Unable to load purchases.</p>
          <button
            type="button"
            className={structureButton + " mt-3"}
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </section>
      ) : filtered.length ? (
        <AdminHistoryPagination
          key={JSON.stringify([client?.id, programId, status])}
          items={filtered}
          renderPage={(page) => (
            <AdminPurchaseList
              purchases={page}
              users={userMap}
              onDetails={setDetailsId}
            />
          )}
        />
      ) : (
        <section className="border border-border p-7 text-sm leading-6 text-muted-foreground">
          {filtersActive
            ? "No purchases match these filters."
            : "No purchases yet. Program purchases will appear here."}
        </section>
      )}
      {detailsId && (
        <AdminPurchaseDetailsDrawer
          purchaseId={detailsId}
          users={userMap}
          onClose={() => setDetailsId(null)}
        />
      )}
    </div>
  );
}
