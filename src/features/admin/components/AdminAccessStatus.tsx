import { accessStatus } from "../utils/programAccess";
import type { AdminProgramAccess } from "../types/adminDashboard";

export default function AdminAccessStatus({
  access,
  now,
}: {
  access: AdminProgramAccess;
  now: number;
}) {
  const status = accessStatus(access, now);
  const color =
    status === "ACTIVE"
      ? "bg-primary/10 text-primary-dark"
      : status === "SCHEDULED"
        ? "bg-[#F3EEE1] text-[#776842]"
        : "bg-border/40 text-muted-foreground";
  return (
    <span
      className={`inline-block w-fit px-3 py-2 text-[9px] font-medium uppercase tracking-[0.14em] ${color}`}
    >
      {status}
    </span>
  );
}
