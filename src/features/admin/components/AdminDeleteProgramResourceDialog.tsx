import { useAdminProgramResourceMutation } from "../hooks/useAdminProgramResources";
import type { AdminProgramResource } from "../types/adminProgramResource";
import AdminStructureDialog from "./AdminStructureDialog";
import {
  structureCancel,
  structureDanger,
  structureError,
} from "./programStructureStyles";

export default function AdminDeleteProgramResourceDialog({
  programId,
  resource,
  onClose,
}: {
  programId: string;
  resource: AdminProgramResource;
  onClose: () => void;
}) {
  const mutation = useAdminProgramResourceMutation(programId);
  async function remove() {
    try {
      await mutation.mutateAsync({ action: "delete", resourceId: resource.id });
      onClose();
    } catch {
      /* The error is displayed in the confirmation. */
    }
  }
  return (
    <AdminStructureDialog
      eyebrow="Delete Resource"
      title={`Delete ${resource.title}?`}
      description="This permanently removes the resource from the program and cannot be undone."
      pending={mutation.isPending}
      onClose={onClose}
    >
      {mutation.isError && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {structureError(mutation.error)}
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
          disabled={mutation.isPending}
          onClick={remove}
        >
          {mutation.isPending ? "Deleting..." : "Delete Resource"}
        </button>
      </footer>
    </AdminStructureDialog>
  );
}
