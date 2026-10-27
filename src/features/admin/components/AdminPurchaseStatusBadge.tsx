import type { AdminPurchaseStatus } from "../types/adminDashboard";

export default function AdminPurchaseStatusBadge({
  status,
}: {
  status: AdminPurchaseStatus;
}) {
  const color =
    status === "PAID"
      ? "bg-primary/10 text-primary-dark"
      : status === "PENDING"
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
