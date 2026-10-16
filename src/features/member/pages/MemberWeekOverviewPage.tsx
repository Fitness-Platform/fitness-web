import { Link, useParams } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'
import MemberWorkoutCard from '../components/MemberWorkoutCard'
import { useMyProgramWeekQuery } from '../hooks/useMyProgramWeekQuery'

function MemberWeekOverviewPage() {
  const { programId, weekId } = useParams()

  const {
    data: week,
    isPending,
    isError,
    error,
    refetch,
  } = useMyProgramWeekQuery(programId, weekId)

  const isAccessDenied =
    error instanceof ApiError && error.status === 403

  return (
    <div className="space-y-8">
      <Link
        to={`/app/programs/${programId}`}
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← Program overview
      </Link>

      {isPending && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Loading week...
          </p>
        </div>
      )}

      {isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="font-medium text-foreground">
            This week isn't available yet.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Return to the program overview to see when it unlocks.
          </p>
        </div>
      )}

      {isError && !isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-foreground">
            We couldn't load this week.
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

      {!isPending && !isError && week && (
        <>
          <header className="max-w-2xl">
            <p className="text-sm text-muted-foreground">
              Week {week.position}
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {week.title}
            </h1>

            {week.description && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                {week.description}
              </p>
            )}
          </header>

          <section aria-labelledby="week-workouts-heading">
            <h2
              id="week-workouts-heading"
              className="text-xl font-medium"
            >
              Workouts
            </h2>

            {week.workouts.length === 0 ? (
              <div className="mt-4 border border-border p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                  No workouts available yet.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {week.workouts.map((workout) => (
                  <MemberWorkoutCard
                    key={workout.programWeekWorkoutId}
                    programId={programId!}
                    weekId={week.weekId}
                    workout={workout}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default MemberWeekOverviewPage