import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useUpdateAdminWorkoutExerciseMutation } from "../hooks/useUpdateAdminWorkoutExerciseMutation";
import type { AdminExercise } from "../types/adminExercise";
import type { AdminWorkoutExercise } from "../types/adminWorkoutExercise";

const editWorkoutExerciseSchema = z.object({
  sets: z
    .string()
    .trim()
    .min(1, "Sets are required.")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      "Sets must be greater than 0.",
    ),

  reps: z
    .string()
    .trim()
    .min(1, "Reps are required.")
    .max(50, "Reps must be 50 characters or fewer."),

  suggestedWeightLb: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      "Weight cannot be negative.",
    ),

  restSeconds: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0),
      "Rest must be 0 or greater.",
    ),

  position: z
    .string()
    .trim()
    .min(1, "Position is required.")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      "Position must be greater than 0.",
    ),

  notes: z.string().trim(),
});

type EditWorkoutExerciseFormData = z.infer<typeof editWorkoutExerciseSchema>;

type AdminEditWorkoutExerciseDrawerProps = {
  workoutId: string;
  workoutExercise: AdminWorkoutExercise;
  exercise: AdminExercise | null;
  onClose: () => void;
};

function AdminEditWorkoutExerciseDrawer({
  workoutId,
  workoutExercise,
  exercise,
  onClose,
}: AdminEditWorkoutExerciseDrawerProps) {
  const updateMutation = useUpdateAdminWorkoutExerciseMutation({
    workoutId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditWorkoutExerciseFormData>({
    resolver: zodResolver(editWorkoutExerciseSchema),
    defaultValues: {
      sets: String(workoutExercise.sets),
      reps: workoutExercise.reps,
      suggestedWeightLb:
        workoutExercise.suggestedWeightLb != null
          ? String(workoutExercise.suggestedWeightLb)
          : "",
      restSeconds:
        workoutExercise.restSeconds != null
          ? String(workoutExercise.restSeconds)
          : "",
      position: String(workoutExercise.position),
      notes: workoutExercise.notes ?? "",
    },
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !updateMutation.isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, updateMutation.isPending]);

  async function handleUpdateExercise(data: EditWorkoutExerciseFormData) {
    try {
      await updateMutation.mutateAsync({
        workoutExerciseId: workoutExercise.id,

        request: {
          sets: Number(data.sets),

          reps: data.reps.trim(),

          suggestedWeightLb:
            data.suggestedWeightLb === ""
              ? null
              : Number(data.suggestedWeightLb),

          restSeconds:
            data.restSeconds === "" ? null : Number(data.restSeconds),

          position: Number(data.position),

          notes: data.notes.trim() || null,
        },
      });

      onClose();
    } catch {
      // Mutation error is rendered below.
    }
  }

  const errorMessage =
    updateMutation.error instanceof ApiError
      ? updateMutation.error.status === 409
        ? "This position is already being used in this workout. Choose another position."
        : updateMutation.error.status === 400
          ? "Review the exercise prescription and try again."
          : updateMutation.error.status === 404
            ? "This workout exercise could not be found."
            : "Unable to update the exercise. Please try again."
      : "Unable to update the exercise. Please try again.";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close edit exercise"
        onClick={() => {
          if (!updateMutation.isPending) {
            onClose();
          }
        }}
        className="absolute inset-0 h-full w-full bg-foreground/30"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-workout-exercise-title"
        className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-background sm:max-w-[540px]"
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-6 sm:px-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
              Workout Structure
            </p>

            <h2
              id="edit-workout-exercise-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
            >
              Edit Exercise
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Update the prescription for this exercise.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleUpdateExercise)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            <div className="border border-border p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Exercise
              </p>

              <p className="mt-2 text-sm font-medium text-foreground">
                {exercise?.name ?? "Unknown exercise"}
              </p>

              {exercise?.equipment && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {exercise.equipment}
                </p>
              )}
            </div>

            <div className="mt-8 border-t border-border pt-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
                Prescription
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-exercise-sets"
                    className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Sets *
                  </label>

                  <input
                    id="edit-exercise-sets"
                    type="number"
                    min="1"
                    step="1"
                    {...register("sets")}
                    className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-dark"
                  />

                  {errors.sets && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.sets.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-exercise-reps"
                    className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Reps *
                  </label>

                  <input
                    id="edit-exercise-reps"
                    type="text"
                    {...register("reps")}
                    className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-dark"
                  />

                  {errors.reps && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.reps.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-exercise-weight"
                    className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Suggested Weight (LB)
                  </label>

                  <input
                    id="edit-exercise-weight"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("suggestedWeightLb")}
                    className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-dark"
                  />

                  {errors.suggestedWeightLb && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.suggestedWeightLb.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-exercise-rest"
                    className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Rest (Seconds)
                  </label>

                  <input
                    id="edit-exercise-rest"
                    type="number"
                    min="0"
                    step="1"
                    {...register("restSeconds")}
                    className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-dark"
                  />

                  {errors.restSeconds && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.restSeconds.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="edit-exercise-position"
                  className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Position *
                </label>

                <input
                  id="edit-exercise-position"
                  type="number"
                  min="1"
                  step="1"
                  {...register("position")}
                  className="mt-2 h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-dark"
                />

                {errors.position && (
                  <p className="mt-1 text-xs text-red-700">
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label
                  htmlFor="edit-exercise-notes"
                  className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Notes
                </label>

                <textarea
                  id="edit-exercise-notes"
                  rows={4}
                  {...register("notes")}
                  className="mt-2 w-full resize-none border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary-dark"
                />
              </div>
            </div>

            {updateMutation.isError && (
              <div
                role="alert"
                className="mt-6 border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-border px-6 py-5 sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="min-h-11 flex-1 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="min-h-11 flex-1 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default AdminEditWorkoutExerciseDrawer;
