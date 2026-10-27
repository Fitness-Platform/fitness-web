import { useAdminProgramStructureMutation } from "../hooks/useAdminProgramStructure";
import AdminStructureDialog from "./AdminStructureDialog";
import {
  structureCancel,
  structureDanger,
  structureError,
} from "./programStructureStyles";

export default function AdminStructureDeleteDialog({
  programId,
  weekId,
  assignmentId,
  name,
  onClose,
}: {
  programId: string;
  weekId: string;
  assignmentId?: string;
  name: string;
  onClose: () => void;
}) {
  const mutation = useAdminProgramStructureMutation(programId);
  async function remove() {
    try {
      await mutation.mutateAsync(
        assignmentId
          ? { action: "removeWorkout", weekId, assignmentId }
          : { action: "deleteWeek", weekId },
      );
      onClose();
    } catch {
      /* The backend error remains visible in the confirmation. */
    }
  }
  return (
    <AdminStructureDialog
      title={`${assignmentId ? "Remove" : "Delete"} ${name}?`}
      description={
        assignmentId
          ? "This removes the workout from this week only. The workout will remain available in your Workout Library."
          : "This permanently deletes the week and its workout assignments. Workouts will remain in the Workout Library. Weeks already in use may not be deleted."
      }
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
          disabled={mutation.isPending}
          onClick={onClose}
          className={structureCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={remove}
          className={structureDanger}
        >
          {mutation.isPending
            ? "Removing..."
            : assignmentId
              ? "Remove Workout"
              : "Delete Week"}
        </button>
      </footer>
    </AdminStructureDialog>
  );
}
