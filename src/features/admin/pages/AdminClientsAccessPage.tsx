import AdminHistoryPagination from "../components/AdminHistoryPagination";
import { useState } from "react";
import { useAdminProgramAccessesQuery } from "../hooks/useAdminProgramAccesses";
import { useAdminProgramsQuery } from "../hooks/useAdminProgramsQuery";
import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import { useAccessClock } from "../hooks/useAccessClock";
import type { AdminProgramAccess } from "../types/adminDashboard";
import type { AdminUser } from "../types/adminUser";
import AdminAccessList from "../components/AdminAccessList";
import AdminUserPicker from "../components/AdminUserPicker";
import AdminGrantAccessDrawer from "../components/AdminGrantAccessDrawer";
import AdminRevokeAccessDialog from "../components/AdminRevokeAccessDialog";
import AdminAccessDetailsDrawer from "../components/AdminAccessDetailsDrawer";
import {
  structureButton,
  structureInput,
  structureLabel,
  structurePrimary,
} from "../components/programStructureStyles";

type Action =
  | { kind: "grant" }
  | { kind: "details" | "revoke"; access: AdminProgramAccess };

export default function AdminClientsAccessPage() {
  const [client, setClient] = useState<AdminUser | null>(null);
  const [programId, setProgramId] = useState("");
  const [action, setAction] = useState<Action | null>(null);
  const [notice, setNotice] = useState("");
  const query = useAdminProgramAccessesQuery({
    ...(client ? { userId: client.id } : {}),
    ...(programId ? { programId } : {}),
  });
  const users = useAdminUsersQuery();
  const programs = useAdminProgramsQuery();
  const now = useAccessClock();
  const resolvedUsers =
    client && !users.data?.some((user) => user.id === client.id)
      ? [...(users.data ?? []), client]
      : (users.data ?? []);
  const close = () => setAction(null);
  function granted(access: AdminProgramAccess) {
    // Retain matching filters; clear only filters that would hide the new grant.
    if (client && client.id !== access.userId) setClient(null);
    if (programId && programId !== access.programId) setProgramId("");
    setNotice("Access granted.");
  }
  const selectedAccess =
    action && "access" in action
      ? (query.data?.find((access) => access.id === action.access.id) ??
        action.access)
      : null;
  return (
    <div className="space-y-8 lg:space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
            Clients & Access
          </p>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[44px]">
            Program access
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Manage which clients can access Daniela’s programs.
          </p>
        </div>
        <button
          type="button"
          className={structurePrimary}
          onClick={() => setAction({ kind: "grant" })}
        >
          Grant Access
        </button>
      </header>
      {notice && (
        <p role="status" className="text-sm text-primary-dark">
          {notice}
        </p>
      )}
      <section
        aria-label="Access filters"
        className="grid gap-6 border-y border-border py-6 md:grid-cols-2"
      >
        <AdminUserPicker
          value={client}
          onChange={setClient}
          label="Filter by client"
          optional
        />
        <div className="min-w-0">
          <label htmlFor="access-program-filter" className={structureLabel}>
            Filter by program
          </label>
          <select
            id="access-program-filter"
            className={structureInput}
            value={programId}
            onChange={(event) => setProgramId(event.target.value)}
          >
            <option value="">All programs</option>
            {programs.data?.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
          {programs.isPending && (
            <p role="status" className="mt-2 text-xs text-muted-foreground">
              Loading programs...
            </p>
          )}
          {programs.isSuccess && !programs.data.length && (
            <p className="mt-2 text-xs text-muted-foreground">
              No programs available.
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Dates use {Intl.DateTimeFormat().resolvedOptions().timeZone}.
          </p>
          {(client || programId) && (
            <button
              type="button"
              className={structureButton + " mt-4"}
              onClick={() => {
                setClient(null);
                setProgramId("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </section>
      {(users.isError || programs.isError) && (
        <section role="alert" className="border border-border p-5">
          <p className="text-sm text-red-700">
            Unable to load{" "}
            {users.isError && programs.isError
              ? "client and program details"
              : users.isError
                ? "client details"
                : "program details"}
            . Access records are still available below.
          </p>
          <button
            type="button"
            className={structureButton + " mt-3"}
            onClick={() => {
              if (users.isError) void users.refetch();
              if (programs.isError) void programs.refetch();
            }}
          >
            Retry lookup data
          </button>
        </section>
      )}
      {query.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading program accesses...
        </p>
      ) : query.isError ? (
        <section role="alert" className="border border-border p-5">
          <p className="text-sm text-red-700">
            Unable to load program accesses.
          </p>
          <button
            type="button"
            className={structureButton + " mt-3"}
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </section>
      ) : query.data.length ? (
        <AdminHistoryPagination
          key={JSON.stringify([client?.id, programId])}
          items={query.data}
          renderPage={(page) => (
            <AdminAccessList
              accesses={page}
              users={resolvedUsers}
              programs={programs.data ?? []}
              now={now}
              onDetails={(access) => setAction({ kind: "details", access })}
              onRevoke={(access) => setAction({ kind: "revoke", access })}
            />
          )}
        />
      ) : (
        <section className="border border-border p-7 text-sm leading-6 text-muted-foreground">
          {client || programId
            ? "No accesses match these filters."
            : "No program accesses yet. Grant access to a registered client to get started."}
        </section>
      )}
      {action?.kind === "grant" && (
        <AdminGrantAccessDrawer
          initialClient={client}
          initialProgramId={programId}
          onGranted={granted}
          onClose={close}
        />
      )}
      {action?.kind === "details" && (
        <AdminAccessDetailsDrawer
          access={action.access}
          users={resolvedUsers}
          programs={programs.data ?? []}
          now={now}
          onClose={close}
        />
      )}
      {action?.kind === "revoke" && selectedAccess && (
        <AdminRevokeAccessDialog
          access={selectedAccess}
          now={now}
          clientEmail={
            resolvedUsers.find((user) => user.id === selectedAccess.userId)
              ?.email ?? "Client details unavailable"
          }
          programName={
            programs.data?.find(
              (program) => program.id === selectedAccess.programId,
            )?.name ?? "Program details unavailable"
          }
          onClose={close}
        />
      )}
    </div>
  );
}
