import MemberRequestError from '../components/MemberRequestError'
import { ArrowLeft } from 'lucide-react'
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
    <div className="space-y-8 sm:space-y-10" role="status">
      {/* Back navigation */}
      <Link
        to={`/app/programs/${programId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary-dark"
      >
        <ArrowLeft
          className="h-4 w-4"
          strokeWidth={1.7}
          aria-hidden="true"
        />

        Program overview
      </Link>

      {/* Loading state */}
      {isPending && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Loading week...
          </p>
        </div>
      )}

      {/* Access denied */}
      {isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="font-medium text-foreground">
            This week isn't currently available.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Return to the program overview to check
            your access and week availability.
          </p>

          <Link
            to={`/app/programs/${programId}`}
            className="mt-4 inline-block text-sm text-foreground underline underline-offset-4 transition hover:text-primary-dark"
          >
            Back to Program Overview
          </Link>
        </div>
      )}

      {/* Error state */}
      {isError && !isAccessDenied && (
        <MemberRequestError error={error} subject="week" onRetry={refetch} />
      )}

      {/* Week content */}
      {!isPending && !isError && week && (
        <>
          {/* Week header */}
          <header className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Week {week.position}
            </p>

            <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {week.title}
            </h1>

            {week.description && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {week.description}
              </p>
            )}
          </header>

          {/* Workouts section */}
          <section aria-labelledby="week-workouts-heading">
            <h2
              id="week-workouts-heading"
              className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Workouts
            </h2>

            {/* Empty state */}
            {week.workouts.length === 0 ? (
              <div className="mt-4 border border-border p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                  No workouts available yet.
                </p>
              </div>
            ) : (
              /* Workout cards */
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
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