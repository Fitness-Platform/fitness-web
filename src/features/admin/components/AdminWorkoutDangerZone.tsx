import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from "../../../services/apiClient";
import { useDeleteAdminWorkoutMutation } from "../hooks/useDeleteAdminWorkoutMutation";
import type { AdminWorkout } from "../types/adminWorkout";

type AdminWorkoutDangerZoneProps = {
  workout: AdminWorkout;
};

function AdminWorkoutDangerZone({ workout }: AdminWorkoutDangerZoneProps) {
  const navigate = useNavigate();

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const deleteWorkoutMutation = useDeleteAdminWorkoutMutation({
    workoutId: workout.id,
  });

  async function handleDelete() {
    try {
      await deleteWorkoutMutation.mutateAsync();

      navigate("/admin/workouts", {
        replace: true,
      });
    } catch {
      // Error is displayed in the dialog.
    }
  }

  const errorMessage =
    deleteWorkoutMutation.error instanceof ApiError &&
    deleteWorkoutMutation.error.status === 409
      ? "This workout is currently assigned to a program week and cannot be deleted. Remove it from the program before deleting the workout."
      : deleteWorkoutMutation.error instanceof ApiError &&
          deleteWorkoutMutation.error.status === 404
        ? "Workout not found."
        : "Unable to delete this workout. Please try again.";

  return (
    <>
      <section className="border border-red-200 bg-background p-5 sm:p-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-red-700">
          Danger Zone
        </p>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Delete workout
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Permanently remove this workout from your workout library. This
              action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              deleteWorkoutMutation.reset();
              setIsConfirmationOpen(true);
            }}
            className="min-h-11 shrink-0 border border-red-700 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-red-800"
          >
            Delete Workout
          </button>
        </div>
      </section>

      {isConfirmationOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() => {
              if (!deleteWorkoutMutation.isPending) {
                setIsConfirmationOpen(false);
              }
            }}
            className="absolute inset-0 h-full w-full bg-foreground/30"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-workout-title"
            className="relative z-10 w-full max-w-md border border-border bg-background p-6 sm:p-8"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-red-700">
              Delete Workout
            </p>

            <h2
              id="delete-workout-title"
              className="mt-3 text-xl font-semibold tracking-tight text-foreground"
            >
              Delete {workout.name}?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This permanently removes the workout from your workout library and
              cannot be undone.
            </p>

            {deleteWorkoutMutation.isError && (
              <div
                role="alert"
                className="mt-5 border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm leading-6 text-red-700">{errorMessage}</p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmationOpen(false)}
                disabled={deleteWorkoutMutation.isPending}
                className="admin-secondary-action min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteWorkoutMutation.isPending}
                className="min-h-11 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteWorkoutMutation.isPending
                  ? "Deleting..."
                  : "Delete Workout"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default AdminWorkoutDangerZone;
