import type { AdminProgram, AdminProgramAccess } from "../types/adminDashboard";
import type { AdminUser } from "../types/adminUser";
import { accessDate, canRevokeAccess } from "../utils/programAccess";
import AdminAccessStatus from "./AdminAccessStatus";
import { structureButton } from "./programStructureStyles";

export default function AdminAccessList({
  accesses,
  users,
  programs,
  now,
  onDetails,
  onRevoke,
}: {
  accesses: AdminProgramAccess[];
  users: AdminUser[];
  programs: AdminProgram[];
  now: number;
  onDetails: (access: AdminProgramAccess) => void;
  onRevoke: (access: AdminProgramAccess) => void;
}) {
  const userMap = new Map(users.map((user) => [user.id, user]));
  const programMap = new Map(programs.map((program) => [program.id, program]));
  return (
    <ul className="divide-y divide-border border border-border">
      {accesses.map((access) => {
        const client = userMap.get(access.userId);
        const program = programMap.get(access.programId);
        return (
          <li
            key={access.id}
            className="grid gap-5 px-5 py-6 sm:px-7 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
          >
            <div className="min-w-0 break-words">
              <p className="text-sm font-medium">
                {client?.email ?? "Client details unavailable"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {program?.name ?? "Program details unavailable"}
              </p>
              <div className="mt-3">
                <AdminAccessStatus access={access} now={now} />
              </div>
            </div>
            <dl className="grid min-w-0 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Starts at
                </dt>
                <dd className="mt-1">{accessDate(access.startsAt)}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Expires at
                </dt>
                <dd className="mt-1">{accessDate(access.expiresAt)}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-start gap-3">
              <button
                type="button"
                className={structureButton}
                onClick={() => onDetails(access)}
                aria-label={`Access details for ${client?.email ?? "client"} in ${program?.name ?? "program"}`}
              >
                Details
              </button>
              {canRevokeAccess(access, now) && (
                <button
                  type="button"
                  className="min-h-11 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-red-700"
                  onClick={() => onRevoke(access)}
                  aria-label={`Revoke access for ${client?.email ?? "client"} in ${program?.name ?? "program"}`}
                >
                  Revoke Access
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
