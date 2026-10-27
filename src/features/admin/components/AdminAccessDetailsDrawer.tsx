import { useAdminProgramAccessQuery } from "../hooks/useAdminProgramAccesses";
import type { AdminProgram, AdminProgramAccess } from "../types/adminDashboard";
import type { AdminUser } from "../types/adminUser";
import { accessDate, accessError } from "../utils/programAccess";
import AdminAccessStatus from "./AdminAccessStatus";
import AdminStructureDialog from "./AdminStructureDialog";
import { structureButton, structureCancel } from "./programStructureStyles";

export default function AdminAccessDetailsDrawer({
  access,
  users,
  programs,
  now,
  onClose,
}: {
  access: AdminProgramAccess;
  users: AdminUser[];
  programs: AdminProgram[];
  now: number;
  onClose: () => void;
}) {
  const query = useAdminProgramAccessQuery(access);
  const details = query.data;
  const client = users.find((user) => user.id === details.userId);
  const program = programs.find((item) => item.id === details.programId);
  const fields = [
    ["Client", client?.email ?? "Client details unavailable"],
    ["Role", client?.role ?? "Unavailable"],
    ["Program", program?.name ?? "Program details unavailable"],
    ["Starts at", accessDate(details.startsAt)],
    ["Expires at", accessDate(details.expiresAt)],
    ...(details.revokedAt
      ? [["Revoked at", accessDate(details.revokedAt)]]
      : []),
    ["Created at", accessDate(details.createdAt)],
  ];
  return (
    <AdminStructureDialog
      drawer
      eyebrow="Clients & Access"
      title="Access Details"
      description="Review the client’s program access and dates."
      pending={false}
      onClose={onClose}
    >
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-7 sm:px-8">
        {query.isFetching && (
          <p role="status" className="text-xs text-muted-foreground">
            Refreshing access details...
          </p>
        )}
        {query.isError ? (
          <div role="alert" className="text-sm text-red-700">
            <p>
              {accessError(
                query.error,
                "Unable to load access details. Please try again.",
              )}
            </p>
            <button
              type="button"
              className={structureButton + " mt-3"}
              onClick={() => query.refetch()}
            >
              Retry details
            </button>
          </div>
        ) : (
          <>
            <AdminAccessStatus access={details} now={now} />
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
        )}
      </div>
      <footer className="flex shrink-0 justify-end border-t border-border px-6 py-5 sm:px-8">
        <button type="button" className={structureCancel} onClick={onClose}>
          Close
        </button>
      </footer>
    </AdminStructureDialog>
  );
}
