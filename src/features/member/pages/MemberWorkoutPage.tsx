import { Link, useParams } from "react-router-dom";

import { ApiError } from "../../../services/apiClient";
import { useMyProgramWorkoutQuery } from "../hooks/useMyProgramWorkoutQuery";
import MemberExerciseCard from "../components/MemberExerciseCard";

function MemberWorkoutPage() {
  const { programId, weekId, programWeekWorkoutId } = useParams();

  const {
    data: workout,
    isPending,
    isError,
    error,
    refetch,
  } = useMyProgramWorkoutQuery(programId, weekId, programWeekWorkoutId);

  const isAccessDenied = error instanceof ApiError && error.status === 403;

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

            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {workout.name}
            </h1>

            {workout.description && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                {workout.description}
              </p>
            )}
          </header>

          <section aria-labelledby="workout-exercises-heading">
            <h2 id="workout-exercises-heading" className="text-xl font-medium">
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
                {workout.exercises.map((exercise) => (
                  <MemberExerciseCard
                    key={exercise.workoutExerciseId}
                    exercise={exercise}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default MemberWorkoutPage;
