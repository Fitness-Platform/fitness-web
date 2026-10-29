import type { AdminPurchaseStatus } from "../types/adminDashboard";

export default function AdminPurchaseStatusBadge({
  status,
}: {
  status: AdminPurchaseStatus;
}) {
  const color =
    status === "PAID"
      ? "bg-[#E3ECE7] text-[#496658]"
      : status === "PENDING"
        ? "bg-[#F1E8D5] text-[#7A6334]"
        : "bg-border/40 text-muted-foreground";
  return (
    <span
      className={`inline-block w-fit px-3 py-2 text-[9px] font-medium uppercase tracking-[0.14em] ${color}`}
    >
      {status}
    </span>
  );
}
