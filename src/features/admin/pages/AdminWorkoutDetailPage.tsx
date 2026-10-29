import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";

import AdminAddWorkoutExerciseDrawer from "../components/AdminAddWorkoutExerciseDrawer";
import AdminEditWorkoutExerciseDrawer from "../components/AdminEditWorkoutExerciseDrawer";
import AdminRemoveWorkoutExerciseDialog from "../components/AdminRemoveWorkoutExerciseDialog";
import { useAdminExercisesQuery } from "../hooks/useAdminExercisesQuery";
import { useAdminWorkoutExercisesQuery } from "../hooks/useAdminWorkoutExercisesQuery";
import { useAdminWorkoutQuery } from "../hooks/useAdminWorkoutQuery";
import { useUpdateAdminWorkoutMutation } from "../hooks/useUpdateAdminWorkoutMutation";
import type { AdminWorkoutExercise } from "../types/adminWorkoutExercise";
import AdminWorkoutDangerZone from "../components/AdminWorkoutDangerZone";

const updateWorkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workout name is required.")
    .max(150, "Workout name must be 150 characters or fewer."),

  description: z.string().trim(),
});

type UpdateWorkoutFormData = z.infer<typeof updateWorkoutSchema>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AdminWorkoutDetailPage() {
  const { workoutId = "" } = useParams();

  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  const [editingWorkoutExercise, setEditingWorkoutExercise] =
    useState<AdminWorkoutExercise | null>(null);

  const [removingWorkoutExercise, setRemovingWorkoutExercise] =
    useState<AdminWorkoutExercise | null>(null);

  const [isEditingWorkout, setIsEditingWorkout] = useState(false);

  const {
    data: workout,
    isPending,
    isError,
    refetch,
  } = useAdminWorkoutQuery(workoutId);

  const {
    data: workoutExercises = [],
    isPending: areWorkoutExercisesPending,
    isError: areWorkoutExercisesError,
  } = useAdminWorkoutExercisesQuery(workoutId);

  const {
    data: exercises = [],
    isPending: areExercisesPending,
    isError: areExercisesError,
  } = useAdminExercisesQuery();

  const updateWorkoutMutation = useUpdateAdminWorkoutMutation({
    workoutId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateWorkoutFormData>({
    resolver: zodResolver(updateWorkoutSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const exerciseById = new Map(
    exercises.map((exercise) => [exercise.id, exercise]),
  );

  const orderedWorkoutExercises = [...workoutExercises].sort(
    (first, second) => first.position - second.position,
  );

  const nextExercisePosition =
    orderedWorkoutExercises.length > 0
      ? Math.max(
          ...orderedWorkoutExercises.map(
            (workoutExercise) => workoutExercise.position,
          ),
        ) + 1
      : 1;

  if (isPending) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading workout...
      </p>
    );
  }

  if (isError || !workout) {
    return (
      <section className="border border-border p-5">
        <p className="text-sm font-medium text-foreground">
          Unable to load workout
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while loading this workout.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
        >
          Try Again
        </button>
      </section>
    );
  }

  const currentWorkout = workout;

  function handleStartEditingWorkout() {
    reset({
      name: currentWorkout.name,
      description: currentWorkout.description ?? "",
    });

    updateWorkoutMutation.reset();
    setIsEditingWorkout(true);
  }

  function handleCancelWorkoutEdit() {
    reset({
      name: currentWorkout.name,
      description: currentWorkout.description ?? "",
    });

    updateWorkoutMutation.reset();
    setIsEditingWorkout(false);
  }

  async function handleUpdateWorkout(data: UpdateWorkoutFormData) {
    try {
      await updateWorkoutMutation.mutateAsync({
        name: data.name.trim(),
        description: data.description.trim() || null,
      });

      setIsEditingWorkout(false);
    } catch {
      // Mutation error is rendered below.
    }
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <header>
        <Link
          to="/admin/workouts"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark"
        >
          <ArrowLeft
            className="h-3.5 w-3.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          Workouts
        </Link>

        <h1 className="mt-8 text-[32px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
          {currentWorkout.name}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          {currentWorkout.description || "No description"}
        </p>
      </header>

      <section className="border border-border p-6 lg:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
            Workout Details
          </p>

          {!isEditingWorkout && (
            <button
              type="button"
              onClick={handleStartEditingWorkout}
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark transition hover:opacity-70"
            >
              Edit
            </button>
          )}
        </div>

        {!isEditingWorkout ? (
          <>
            <div className="mt-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Name
              </p>

              <p className="mt-2 text-sm font-medium text-foreground">
                {currentWorkout.name}
              </p>
            </div>

            <div className="mt-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {currentWorkout.description || "No description"}
              </p>
            </div>

            <div className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Created
                </p>

                <p className="mt-2 text-sm text-foreground">
                  {formatDate(currentWorkout.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Last Updated
                </p>

                <p className="mt-2 text-sm text-foreground">
                  {formatDate(currentWorkout.updatedAt)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(handleUpdateWorkout)} className="mt-8">
            <div>
              <label
                htmlFor="workout-name"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Workout Name *
              </label>

              <input
                id="workout-name"
                type="text"
                {...register("name")}
                className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary-dark"
              />

              {errors.name && (
                <p className="mt-2 text-xs text-red-700">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="workout-description"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Description
              </label>

              <textarea
                id="workout-description"
                rows={6}
                {...register("description")}
                className="mt-2 w-full resize-none border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary-dark"
              />
            </div>

            {updateWorkoutMutation.isError && (
              <div
                role="alert"
                className="mt-6 border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">
                  Unable to update this workout. Please try again.
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelWorkoutEdit}
                disabled={updateWorkoutMutation.isPending}
                className="admin-secondary-action min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateWorkoutMutation.isPending}
                className="min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateWorkoutMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="border border-border">
        <div className="flex flex-col gap-5 border-b border-border px-6 py-6 sm:flex-row sm:items-end sm:justify-between lg:px-7">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
              Workout Structure
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Exercises
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Build the session and define how each exercise should be
              performed.
            </p>
          </div>

          <div className="flex items-center gap-5">
            {!areWorkoutExercisesPending && (
              <p className="text-xs text-muted-foreground">
                {orderedWorkoutExercises.length}{" "}
                {orderedWorkoutExercises.length === 1
                  ? "exercise"
                  : "exercises"}
              </p>
            )}

            <button
              type="button"
              onClick={() => setIsAddExerciseOpen(true)}
              className="min-h-10 border border-primary-dark px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
            >
              + Add Exercise
            </button>
          </div>
        </div>

        {(areWorkoutExercisesPending || areExercisesPending) && (
          <p
            role="status"
            className="px-6 py-10 text-sm text-muted-foreground lg:px-7"
          >
            Loading workout exercises...
          </p>
        )}

        {(areWorkoutExercisesError || areExercisesError) && (
          <div className="px-6 py-10 lg:px-7">
            <p className="text-sm font-medium text-foreground">
              Unable to load workout exercises
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while loading the workout structure.
            </p>
          </div>
        )}

        {!areWorkoutExercisesPending &&
          !areExercisesPending &&
          !areWorkoutExercisesError &&
          !areExercisesError &&
          orderedWorkoutExercises.length === 0 && (
            <div className="px-6 py-14 text-center lg:px-7">
              <p className="text-sm font-medium text-foreground">
                No exercises added yet.
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Start building this workout by adding an exercise from your
                library.
              </p>
            </div>
          )}

        {!areWorkoutExercisesPending &&
          !areExercisesPending &&
          !areWorkoutExercisesError &&
          !areExercisesError &&
          orderedWorkoutExercises.length > 0 && (
            <>
              <div className="hidden lg:block">
                {orderedWorkoutExercises.map((workoutExercise) => {
                  const exercise = exerciseById.get(workoutExercise.exerciseId);

                  return (
                    <article
                      key={workoutExercise.id}
                      className="grid grid-cols-[56px_minmax(180px,1.2fr)_repeat(4,minmax(80px,0.5fr))_120px] items-start gap-4 border-b border-border px-6 py-6 last:border-b-0"
                    >
                      <p className="text-xs text-muted-foreground">
                        {String(workoutExercise.position).padStart(2, "0")}
                      </p>

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {exercise?.name ?? "Unknown exercise"}
                        </p>

                        {exercise?.equipment && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {exercise.equipment}
                          </p>
                        )}

                        {workoutExercise.notes && (
                          <p className="mt-3 text-xs leading-5 text-muted-foreground">
                            {workoutExercise.notes}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Sets
                        </p>

                        <p className="mt-2 text-sm text-foreground">
                          {workoutExercise.sets}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Reps
                        </p>

                        <p className="mt-2 text-sm text-foreground">
                          {workoutExercise.reps}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Weight
                        </p>

                        <p className="mt-2 text-sm text-foreground">
                          {workoutExercise.suggestedWeightLb != null
                            ? `${workoutExercise.suggestedWeightLb} lb`
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Rest
                        </p>

                        <p className="mt-2 text-sm text-foreground">
                          {workoutExercise.restSeconds != null
                            ? `${workoutExercise.restSeconds} sec`
                            : "—"}
                        </p>
                      </div>

                      <div className="space-y-2 text-right">
                        {exercise?.videoUrl && (
                          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark">
                            Video available
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setEditingWorkoutExercise(workoutExercise)
                          }
                          className="text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:opacity-70"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setRemovingWorkoutExercise(workoutExercise)
                          }
                          className="block w-full text-right text-[9px] font-medium uppercase tracking-[0.15em] text-red-700 transition hover:opacity-70"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="lg:hidden">
                {orderedWorkoutExercises.map((workoutExercise) => {
                  const exercise = exerciseById.get(workoutExercise.exerciseId);

                  return (
                    <article
                      key={workoutExercise.id}
                      className="border-b border-border p-5 last:border-b-0"
                    >
                      <p className="text-xs text-muted-foreground">
                        {String(workoutExercise.position).padStart(2, "0")}
                      </p>

                      <h3 className="mt-3 text-lg font-medium text-foreground">
                        {exercise?.name ?? "Unknown exercise"}
                      </h3>

                      {exercise?.equipment && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {exercise.equipment}
                        </p>
                      )}

                      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                            Sets
                          </p>

                          <p className="mt-1 text-sm text-foreground">
                            {workoutExercise.sets}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                            Reps
                          </p>

                          <p className="mt-1 text-sm text-foreground">
                            {workoutExercise.reps}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                            Weight
                          </p>

                          <p className="mt-1 text-sm text-foreground">
                            {workoutExercise.suggestedWeightLb != null
                              ? `${workoutExercise.suggestedWeightLb} lb`
                              : "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                            Rest
                          </p>

                          <p className="mt-1 text-sm text-foreground">
                            {workoutExercise.restSeconds != null
                              ? `${workoutExercise.restSeconds} sec`
                              : "—"}
                          </p>
                        </div>
                      </div>

                      {workoutExercise.notes && (
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">
                          {workoutExercise.notes}
                        </p>
                      )}

                      {exercise?.videoUrl && (
                        <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark">
                          Video available
                        </p>
                      )}

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingWorkoutExercise(workoutExercise)
                          }
                          className="min-h-10 flex-1 border border-primary-dark text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setRemovingWorkoutExercise(workoutExercise)
                          }
                          className="min-h-10 flex-1 border border-red-300 text-[9px] font-medium uppercase tracking-[0.15em] text-red-700 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
      </section>

      <AdminWorkoutDangerZone workout={currentWorkout} />

      {isAddExerciseOpen && (
        <AdminAddWorkoutExerciseDrawer
          workoutId={workoutId}
          exercises={exercises}
          nextPosition={nextExercisePosition}
          onClose={() => setIsAddExerciseOpen(false)}
        />
      )}

      {editingWorkoutExercise && (
        <AdminEditWorkoutExerciseDrawer
          workoutId={workoutId}
          workoutExercise={editingWorkoutExercise}
          exercise={exerciseById.get(editingWorkoutExercise.exerciseId) ?? null}
          onClose={() => setEditingWorkoutExercise(null)}
        />
      )}

      {removingWorkoutExercise && (
        <AdminRemoveWorkoutExerciseDialog
          workoutId={workoutId}
          workoutExerciseId={removingWorkoutExercise.id}
          exerciseName={
            exerciseById.get(removingWorkoutExercise.exerciseId)?.name ??
            "this exercise"
          }
          onClose={() => setRemovingWorkoutExercise(null)}
        />
      )}
    </div>
  );
}

export default AdminWorkoutDetailPage;
