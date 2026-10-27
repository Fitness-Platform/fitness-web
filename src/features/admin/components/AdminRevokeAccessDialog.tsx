import { useRevokeAdminProgramAccessMutation } from "../hooks/useAdminProgramAccesses";
import type { AdminProgramAccess } from "../types/adminDashboard";
import { accessError, canRevokeAccess } from "../utils/programAccess";
import AdminStructureDialog from "./AdminStructureDialog";
import { structureCancel, structureDanger } from "./programStructureStyles";

export default function AdminRevokeAccessDialog({
  access,
  clientEmail,
  programName,
  now,
  onClose,
}: {
  access: AdminProgramAccess;
  clientEmail: string;
  programName: string;
  now: number;
  onClose: () => void;
}) {
  const mutation = useRevokeAdminProgramAccessMutation();
  async function revoke() {
    if (!canRevokeAccess(access)) return;
    try {
      await mutation.mutateAsync(access.id);
      onClose();
    } catch {
      /* Render the mutation error below. */
    }
  }
  return (
    <AdminStructureDialog
      eyebrow="Revoke Access"
      title="Revoke program access?"
      description="The client will no longer be able to use this access. The access record will remain available."
      pending={mutation.isPending}
      onClose={onClose}
    >
      <dl className="mt-5 space-y-4 break-words text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Client
          </dt>
          <dd className="mt-1">{clientEmail}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Program
          </dt>
          <dd className="mt-1">{programName}</dd>
        </div>
      </dl>
      {!canRevokeAccess(access, now) && (
        <p role="status" className="mt-4 text-sm text-muted-foreground">
          This access is no longer active or scheduled.
        </p>
      )}
      {mutation.isError && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {accessError(mutation.error)}
        </p>
      )}
      <footer className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className={structureCancel}
          disabled={mutation.isPending}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className={structureDanger}
          disabled={mutation.isPending || !canRevokeAccess(access, now)}
          onClick={revoke}
        >
          {mutation.isPending ? "Revoking..." : "Revoke Access"}
        </button>
      </footer>
    </AdminStructureDialog>
  );
}
