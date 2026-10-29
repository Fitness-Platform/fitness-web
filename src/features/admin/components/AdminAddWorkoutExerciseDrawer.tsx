import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useCreateAdminWorkoutExerciseMutation } from "../hooks/useCreateAdminWorkoutExerciseMutation";
import type { AdminExercise } from "../types/adminExercise";

const addWorkoutExerciseSchema = z.object({
  exerciseId: z.string().min(1, "Select an exercise."),

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

type AddWorkoutExerciseFormData = z.infer<typeof addWorkoutExerciseSchema>;

type AdminAddWorkoutExerciseDrawerProps = {
  workoutId: string;
  exercises: AdminExercise[];
  nextPosition: number;
  onClose: () => void;
};

function AdminAddWorkoutExerciseDrawer({
  workoutId,
  exercises,
  nextPosition,
  onClose,
}: AdminAddWorkoutExerciseDrawerProps) {
  const [exerciseSearch, setExerciseSearch] = useState("");

  const createWorkoutExerciseMutation = useCreateAdminWorkoutExerciseMutation({
    workoutId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AddWorkoutExerciseFormData>({
    resolver: zodResolver(addWorkoutExerciseSchema),
    defaultValues: {
      exerciseId: "",
      sets: "3",
      reps: "",
      suggestedWeightLb: "",
      restSeconds: "",
      position: String(nextPosition),
      notes: "",
    },
  });

  const selectedExerciseId = useWatch({
    control,
    name: "exerciseId",
  });

  const selectedExercise =
    exercises.find((exercise) => exercise.id === selectedExerciseId) ?? null;

  const filteredExercises = useMemo(() => {
    const normalizedSearch = exerciseSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return exercises;
    }

    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(normalizedSearch) ||
        (exercise.equipment ?? "").toLowerCase().includes(normalizedSearch),
    );
  }, [exerciseSearch, exercises]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !createWorkoutExerciseMutation.isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [createWorkoutExerciseMutation.isPending, onClose]);

  async function handleAddExercise(data: AddWorkoutExerciseFormData) {
    try {
      await createWorkoutExerciseMutation.mutateAsync({
        exerciseId: data.exerciseId,

        sets: Number(data.sets),

        reps: data.reps.trim(),

        suggestedWeightLb:
          data.suggestedWeightLb === "" ? null : Number(data.suggestedWeightLb),

        restSeconds: data.restSeconds === "" ? null : Number(data.restSeconds),

        position: Number(data.position),

        notes: data.notes.trim() || null,
      });

      onClose();
    } catch {
      // Mutation error is displayed below.
    }
  }

  const errorMessage =
    createWorkoutExerciseMutation.error instanceof ApiError
      ? createWorkoutExerciseMutation.error.status === 409
        ? "This position is already being used in this workout. Choose another position."
        : createWorkoutExerciseMutation.error.status === 400
          ? "Review the exercise prescription and try again."
          : createWorkoutExerciseMutation.error.status === 404
            ? "The selected exercise could not be found."
            : "Unable to add the exercise. Please try again."
      : "Unable to add the exercise. Please try again.";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close add exercise"
        onClick={() => {
          if (!createWorkoutExerciseMutation.isPending) {
            onClose();
          }
        }}
        className="absolute inset-0 h-full w-full bg-foreground/30"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-workout-exercise-title"
        className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-background sm:max-w-[540px]"
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-6 sm:px-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
              Workout Structure
            </p>

            <h2
              id="add-workout-exercise-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
            >
              Add Exercise
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Select an exercise from your library and define its prescription.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={createWorkoutExerciseMutation.isPending}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleAddExercise)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            <input type="hidden" {...register("exerciseId")} />

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Select Exercise *
              </p>

              {selectedExercise ? (
                <div className="mt-3 border border-primary-dark p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {selectedExercise.name}
                      </p>

                      {selectedExercise.equipment && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {selectedExercise.equipment}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setValue("exerciseId", "", {
                          shouldValidate: true,
                        })
                      }
                      className="text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <label className="relative mt-3 block">
                    <span className="sr-only">Search exercise library</span>

                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={1.6}
                    />

                    <input
                      type="search"
                      value={exerciseSearch}
                      onChange={(event) =>
                        setExerciseSearch(event.target.value)
                      }
                      placeholder="Search exercise library"
                      className="h-11 w-full border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none focus:border-primary-dark"
                    />
                  </label>

                  <div className="mt-3 max-h-[380px] overflow-y-auto border border-border lg:max-h-[460px]">
                    {filteredExercises.length === 0 ? (
                      <p className="p-5 text-sm text-muted-foreground">
                        No exercises found.
                      </p>
                    ) : (
                      filteredExercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          type="button"
                          onClick={() =>
                            setValue("exerciseId", exercise.id, {
                              shouldValidate: true,
                            })
                          }
                          className="block w-full border-b border-border px-4 py-4 text-left transition last:border-b-0 hover:bg-foreground/[0.03]"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {exercise.name}
                          </p>

                          {exercise.equipment && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {exercise.equipment}
                            </p>
                          )}

                          {exercise.instructions && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                              {exercise.instructions}
                            </p>
                          )}

                          {exercise.videoUrl && (
                            <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark">
                              Video available
                            </p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}

              {errors.exerciseId && (
                <p className="mt-2 text-xs text-red-700">
                  {errors.exerciseId.message}
                </p>
              )}
            </div>

            {selectedExercise && (
              <div className="mt-8 border-t border-border pt-7">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
                  Prescription
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="exercise-sets"
                      className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Sets *
                    </label>

                    <input
                      id="exercise-sets"
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
                      htmlFor="exercise-reps"
                      className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Reps *
                    </label>

                    <input
                      id="exercise-reps"
                      type="text"
                      placeholder="8-10"
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
                      htmlFor="exercise-weight"
                      className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Suggested Weight (LB)
                    </label>

                    <input
                      id="exercise-weight"
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
                      htmlFor="exercise-rest"
                      className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Rest (Seconds)
                    </label>

                    <input
                      id="exercise-rest"
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
                    htmlFor="exercise-position"
                    className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Position *
                  </label>

                  <input
                    id="exercise-position"
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

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    The next available position has been selected automatically.
                  </p>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="exercise-notes"
                    className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Notes
                  </label>

                  <textarea
                    id="exercise-notes"
                    rows={4}
                    {...register("notes")}
                    className="mt-2 w-full resize-none border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary-dark"
                  />
                </div>
              </div>
            )}

            {createWorkoutExerciseMutation.isError && (
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
              disabled={createWorkoutExerciseMutation.isPending}
              className="admin-secondary-action min-h-11 flex-1 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createWorkoutExerciseMutation.isPending || !selectedExercise
              }
              className="min-h-11 flex-1 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {createWorkoutExerciseMutation.isPending
                ? "Adding..."
                : "Add to Workout"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default AdminAddWorkoutExerciseDrawer;
