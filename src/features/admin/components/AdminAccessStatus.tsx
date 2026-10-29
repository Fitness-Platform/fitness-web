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
      ? "bg-[#E3ECE7] text-[#496658]"
      : status === "REVOKED"
        ? "bg-[#F5E2E0] text-[#A4433F]"
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
