import { Link, useParams } from "react-router-dom";

import { ApiError } from "../../../services/apiClient";
import MemberExerciseCard from "../components/MemberExerciseCard";
import { useMyProgramWorkoutQuery } from "../hooks/useMyProgramWorkoutQuery";
import { useSaveMyWorkoutSetMutation } from "../hooks/useSaveMyWorkoutSetMutation";
import { useCompleteMyWorkoutMutation } from "../hooks/useCompleteMyWorkoutMutation";

function MemberWorkoutPage() {
  const { programId, weekId, programWeekWorkoutId } = useParams();

  const {
    data: workout,
    isPending,
    isError,
    error,
    refetch,
  } = useMyProgramWorkoutQuery(programId, weekId, programWeekWorkoutId);

  const saveSetMutation = useSaveMyWorkoutSetMutation({
    programId: programId ?? "",
    weekId: weekId ?? "",
    programWeekWorkoutId: programWeekWorkoutId ?? "",
  });

  const completeWorkoutMutation = useCompleteMyWorkoutMutation({
    programId: programId ?? "",
    weekId: weekId ?? "",
    programWeekWorkoutId: programWeekWorkoutId ?? "",
  });

  const isAccessDenied = error instanceof ApiError && error.status === 403;

  const areAllSetsSaved =
    workout?.exercises.every((exercise) =>
      Array.from({ length: exercise.sets }, (_, index) => index + 1).every(
        (setNumber) =>
          exercise.completedSets.some((set) => set.setNumber === setNumber),
      ),
    ) ?? false;

  return (
    <div className="space-y-8">
      <Link
        to={`/app/programs/${programId}/weeks/${weekId}`}
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← Week overview
      </Link>

      {isPending && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">Loading workout...</p>
        </div>
      )}

      {isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="font-medium text-foreground">
            This workout isn't available.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Return to the week overview to continue your training.
          </p>
        </div>
      )}

      {isError && !isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-foreground">
            We couldn't load this workout.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
          >
            Try again
          </button>
        </div>
      )}

      {!isPending && !isError && workout && (
        <>
          <header className="max-w-2xl">
            <p className="text-sm text-muted-foreground">
              Workout {workout.position}
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {workout.name}
            </h1>

            {workout.description && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                {workout.description}
              </p>
            )}
          </header>

          <section aria-labelledby="workout-exercises-heading">
            <h2
              id="workout-exercises-heading"
              className="text-xl font-medium text-foreground"
            >
              Exercises
            </h2>

            {workout.exercises.length === 0 ? (
              <div className="mt-4 border border-border p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                  No exercises available yet.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {workout.exercises.map((exercise) => {
                  const isSavingThisExercise =
                    saveSetMutation.isPending &&
                    saveSetMutation.variables?.workoutExerciseId ===
                      exercise.workoutExerciseId;

                  const savingSetNumber = isSavingThisExercise
                    ? (saveSetMutation.variables?.setNumber ?? null)
                    : null;

                  return (
                    <div key={exercise.workoutExerciseId}>
                      <MemberExerciseCard
                        exercise={exercise}
                        isWorkoutCompleted={workout.completedAt !== null}
                        isSaving={isSavingThisExercise}
                        savingSetNumber={savingSetNumber}
                        onSaveSet={(setNumber, reps, weightLb) => {
                          saveSetMutation.mutate({
                            workoutExerciseId: exercise.workoutExerciseId,
                            setNumber,
                            request: {
                              reps,
                              weightLb,
                            },
                          });
                        }}
                      />

                      {saveSetMutation.isError &&
                        saveSetMutation.variables?.workoutExerciseId ===
                          exercise.workoutExerciseId && (
                          <div className="mt-3 border border-border p-4">
                            <p className="text-sm text-foreground">
                              We couldn't save this set. Try again.
                            </p>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          {workout.completedAt !== null ? (
            <div className="border border-primary-dark p-5 sm:p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
                Workout completed
              </p>

              <h2 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                Nice work.
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your workout has been saved.
              </p>
            </div>
          ) : (
            <div className="border-t border-border pt-6">
              {!areAllSetsSaved && (
                <p className="mb-3 text-sm text-muted-foreground">
                  Complete every prescribed set before finishing the workout.
                </p>
              )}

              <button
                type="button"
                disabled={
                  !areAllSetsSaved ||
                  saveSetMutation.isPending ||
                  completeWorkoutMutation.isPending
                }
                onClick={() => completeWorkoutMutation.mutate()}
                className="w-full bg-primary px-5 py-4 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {completeWorkoutMutation.isPending
                  ? "Completing..."
                  : "Complete Workout"}
              </button>

              {completeWorkoutMutation.isError && (
                <div className="mt-3 border border-border p-4">
                  <p className="text-sm text-foreground">
                    We couldn't complete this workout. Make sure every set is
                    saved and try again.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MemberWorkoutPage;
