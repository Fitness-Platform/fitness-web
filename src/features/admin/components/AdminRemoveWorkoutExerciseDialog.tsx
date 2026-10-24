import { useEffect } from "react";

import { useDeleteAdminWorkoutExerciseMutation } from "../hooks/useDeleteAdminWorkoutExerciseMutation";

type AdminRemoveWorkoutExerciseDialogProps = {
  workoutId: string;
  workoutExerciseId: string;
  exerciseName: string;
  onClose: () => void;
};

function AdminRemoveWorkoutExerciseDialog({
  workoutId,
  workoutExerciseId,
  exerciseName,
  onClose,
}: AdminRemoveWorkoutExerciseDialogProps) {
  const deleteMutation =
    useDeleteAdminWorkoutExerciseMutation({
      workoutId,
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
        !deleteMutation.isPending
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
    deleteMutation.isPending,
    onClose,
  ]);

  async function handleRemove() {
    try {
      await deleteMutation.mutateAsync(
        workoutExerciseId,
      );

      onClose();
    } catch {
      // Error is rendered below.
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close remove exercise confirmation"
        onClick={() => {
          if (!deleteMutation.isPending) {
            onClose();
          }
        }}
        className="absolute inset-0 h-full w-full bg-foreground/30"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-workout-exercise-title"
        className="relative w-full max-w-md border border-border bg-background p-6 sm:p-8"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-red-700">
          Remove Exercise
        </p>

        <h2
          id="remove-workout-exercise-title"
          className="mt-4 text-2xl font-semibold tracking-tight text-foreground"
        >
          Remove {exerciseName}?
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This removes the exercise from this
          workout. The exercise will remain
          available in your exercise library.
        </p>

        {deleteMutation.isError && (
          <div
            role="alert"
            className="mt-5 border border-red-200 bg-red-50 px-4 py-3"
          >
            <p className="text-sm text-red-700">
              Unable to remove this exercise.
              Please try again.
            </p>
          </div>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteMutation.isPending
            }
            className="min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleRemove}
            disabled={
              deleteMutation.isPending
            }
            className="min-h-11 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending
              ? "Removing..."
              : "Remove Exercise"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminRemoveWorkoutExerciseDialog;