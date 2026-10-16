import { Link, useParams } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'
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
    <div className="space-y-6">
      <Link
        to={`/app/programs/${programId}`}
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← Program overview
      </Link>

      {isPending && (
        <p className="text-sm text-muted-foreground">
          Checking week access...
        </p>
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
        <div>
          <p className="text-sm text-muted-foreground">
            Week {week.position}
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Week overview
          </h1>
        </div>
      )}
    </div>
  )
}

export default MemberWeekOverviewPage