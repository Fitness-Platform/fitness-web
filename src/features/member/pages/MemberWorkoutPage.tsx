import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ApiError } from "../../../services/apiClient";
import MemberExerciseCard from "../components/MemberExerciseCard";
import { useCompleteMyWorkoutMutation } from "../hooks/useCompleteMyWorkoutMutation";
import { useMyProgramWorkoutQuery } from "../hooks/useMyProgramWorkoutQuery";
import { useSaveMyWorkoutSetMutation } from "../hooks/useSaveMyWorkoutSetMutation";

function MemberWorkoutPage() {
  const { programId, weekId, programWeekWorkoutId } = useParams();

  const [exerciseNavigation, setExerciseNavigation] = useState({
    workoutId: programWeekWorkoutId,
    index: 0,
  });

  const currentExerciseIndex =
    exerciseNavigation.workoutId === programWeekWorkoutId
      ? exerciseNavigation.index
      : 0;

  const exerciseSectionRef = useRef<HTMLElement>(null);

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

  const currentExercise = workout?.exercises[currentExerciseIndex] ?? null;

  const hasPreviousExercise = currentExerciseIndex > 0;

  const hasNextExercise =
    workout !== undefined &&
    currentExerciseIndex < workout.exercises.length - 1;

  const areAllSetsSaved =
    workout !== undefined &&
    workout.exercises.length > 0 &&
    workout.exercises.every((exercise) =>
      Array.from({ length: exercise.sets }, (_, index) => index + 1).every(
        (setNumber) =>
          exercise.completedSets.some((set) => set.setNumber === setNumber),
      ),
    );

  const isSavingCurrentExercise =
    currentExercise !== null &&
    saveSetMutation.isPending &&
    saveSetMutation.variables?.workoutExerciseId ===
      currentExercise.workoutExerciseId;

  const savingSetNumber = isSavingCurrentExercise
    ? (saveSetMutation.variables?.setNumber ?? null)
    : null;

  function navigateToExercise(index: number) {
    setExerciseNavigation({
      workoutId: programWeekWorkoutId,
      index,
    });

    requestAnimationFrame(() => {
      exerciseSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

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

          <Link
            to={`/app/programs/${programId}/weeks/${weekId}`}
            className="mt-4 inline-block text-sm text-foreground underline underline-offset-4"
          >
            Back to week overview
          </Link>
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

          <section
            ref={exerciseSectionRef}
            aria-labelledby="workout-exercises-heading"
            className="scroll-mt-6"
          >
            <div className="flex items-end justify-between gap-4">
              <h2
                id="workout-exercises-heading"
                className="text-xl font-medium text-foreground"
              >
                Exercises
              </h2>

              {workout.exercises.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {currentExerciseIndex + 1} of {workout.exercises.length}
                </p>
              )}
            </div>

            {workout.exercises.length === 0 ? (
              <div className="mt-4 border border-border p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                  No exercises available yet.
                </p>
              </div>
            ) : (
              currentExercise && (
                <div className="mt-4">
                  <MemberExerciseCard
                    key={currentExercise.workoutExerciseId}
                    exercise={currentExercise}
                    isWorkoutCompleted={workout.completedAt !== null}
                    isSaving={isSavingCurrentExercise}
                    savingSetNumber={savingSetNumber}
                    onSaveSet={(setNumber, reps, weightLb) => {
                      saveSetMutation.mutate({
                        workoutExerciseId: currentExercise.workoutExerciseId,
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
                      currentExercise.workoutExerciseId && (
                      <div className="mt-3 border border-border p-4">
                        <p className="text-sm text-foreground">
                          We couldn't save this set. Try again.
                        </p>
                      </div>
                    )}

                  {workout.exercises.length > 1 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={!hasPreviousExercise}
                        onClick={() =>
                          navigateToExercise(currentExerciseIndex - 1)
                        }
                        className="border border-border px-4 py-3 text-sm text-foreground transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ← Previous
                      </button>

                      <button
                        type="button"
                        disabled={!hasNextExercise}
                        onClick={() =>
                          navigateToExercise(currentExerciseIndex + 1)
                        }
                        className="border border-foreground px-4 py-3 text-sm text-foreground transition hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )
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
            workout.exercises.length > 0 && (
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
            )
          )}
        </>
      )}
    </div>
  );
}

export default MemberWorkoutPage;
