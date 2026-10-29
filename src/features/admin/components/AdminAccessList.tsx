import type { AdminProgram, AdminProgramAccess } from "../types/adminDashboard";
import type { AdminUser } from "../types/adminUser";
import { accessDate, canRevokeAccess } from "../utils/programAccess";
import AdminAccessStatus from "./AdminAccessStatus";

const cell = "block pb-3 md:table-cell md:px-3 md:py-4 md:align-top";
const action =
  "inline-flex min-h-9 items-center text-left underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

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
    <table
      aria-label="Program access history"
      className="block w-full table-fixed border-y border-border text-sm md:table"
    >
      <colgroup className="hidden md:table-column-group">
        <col className="w-[25%]" />
        <col className="w-[17%]" />
        <col className="w-[12%]" />
        <col className="w-[26%]" />
        <col className="w-[20%]" />
      </colgroup>
      <thead className="hidden md:table-header-group">
        <tr className="border-b border-border text-left text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {["Client", "Program", "Status", "Access period", "Actions"].map(
            (label) => (
              <th key={label} scope="col" className="px-3 py-3 font-medium">
                {label}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {accesses.map((access) => {
          const client = userMap.get(access.userId);
          const program = programMap.get(access.programId);
          return (
            <tr
              key={access.id}
              className="block border-b border-border py-5 last:border-b-0 md:table-row md:py-0"
            >
              <td className={cell + " break-words font-medium"}>
                {client?.email ?? "Client details unavailable"}
              </td>
              <td className={cell + " break-words text-muted-foreground"}>
                {program?.name ?? "Program details unavailable"}
              </td>
              <td className={cell}>
                <AdminAccessStatus access={access} now={now} />
              </td>
              <td className={cell}>
                <dl className="space-y-2 text-xs leading-relaxed">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Started
                    </dt>
                    <dd className="mt-0.5">{accessDate(access.startsAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Expires
                    </dt>
                    <dd className="mt-0.5">{accessDate(access.expiresAt)}</dd>
                  </div>
                </dl>
              </td>
              <td className={cell + " !pb-0 md:!pb-4"}>
                <div className="flex flex-wrap gap-x-6 gap-y-0 md:flex-col md:items-start">
                  <button
                    type="button"
                    className={action + " text-primary-dark"}
                    onClick={() => onDetails(access)}
                    aria-label={`Access details for ${client?.email ?? "client"} in ${program?.name ?? "program"}`}
                  >
                    <span className="text-xs">Details</span>
                  </button>
                  {canRevokeAccess(access, now) && (
                    <button
                      type="button"
                      className={action + " text-red-700"}
                      onClick={() => onRevoke(access)}
                      aria-label={`Revoke access for ${client?.email ?? "client"} in ${program?.name ?? "program"}`}
                    >
                      <span className="text-xs">Revoke Access</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
