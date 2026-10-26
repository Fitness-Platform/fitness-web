import { useEffect } from "react";

import { ApiError } from "../../../services/apiClient";
import { useDeleteAdminExerciseMutation } from "../hooks/useDeleteAdminExerciseMutation";

type AdminDeleteExerciseDialogProps = {
  exerciseId: string;
  exerciseName: string;
  onClose: () => void;
  onDeleted: () => void;
};

function AdminDeleteExerciseDialog({
  exerciseId,
  exerciseName,
  onClose,
  onDeleted,
}: AdminDeleteExerciseDialogProps) {
  const deleteExerciseMutation =
    useDeleteAdminExerciseMutation({
      exerciseId,
    });

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !deleteExerciseMutation.isPending
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    deleteExerciseMutation.isPending,
    onClose,
  ]);

  async function handleDelete() {
    try {
      await deleteExerciseMutation.mutateAsync();
      onDeleted();
    } catch {
      // Error remains visible in the dialog.
    }
  }

  const isExerciseInUse =
    deleteExerciseMutation.error instanceof
      ApiError &&
    deleteExerciseMutation.error.status === 409;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close delete exercise dialog"
        onClick={() => {
          if (
            !deleteExerciseMutation.isPending
          ) {
            onClose();
          }
        }}
        className="absolute inset-0 h-full w-full bg-foreground/30"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-exercise-title"
        className="relative z-10 w-full max-w-[445px] border border-border bg-background p-7 sm:p-8"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-red-700">
          Delete Exercise
        </p>

        <h2
          id="delete-exercise-title"
          className="mt-4 text-2xl font-semibold tracking-tight text-foreground"
        >
          Delete {exerciseName}?
        </h2>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          This permanently removes the exercise
          from your exercise library and cannot
          be undone.
        </p>

        {isExerciseInUse && (
          <div
            role="alert"
            className="mt-5 border border-red-200 bg-red-50 px-4 py-4"
          >
            <p className="text-sm leading-6 text-red-700">
              This exercise is currently being
              used by a workout and cannot be
              deleted. Remove it from the workout
              before deleting the exercise.
            </p>
          </div>
        )}

        {deleteExerciseMutation.isError &&
          !isExerciseInUse && (
            <div
              role="alert"
              className="mt-5 border border-red-200 bg-red-50 px-4 py-4"
            >
              <p className="text-sm leading-6 text-red-700">
                Unable to delete the exercise.
                Please try again.
              </p>
            </div>
          )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteExerciseMutation.isPending
            }
            className="min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              deleteExerciseMutation.isPending
            }
            className="min-h-11 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteExerciseMutation.isPending
              ? "Deleting..."
              : "Delete Exercise"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminDeleteExerciseDialog;