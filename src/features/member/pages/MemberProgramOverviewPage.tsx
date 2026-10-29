import MemberRequestError from '../components/MemberRequestError'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'

import MemberProgramResourceCard from '../components/MemberProgramResourceCard'
import MemberProgramWeekCard from '../components/MemberProgramWeekCard'

import { useMyProgramQuery } from '../hooks/useMyProgramQuery'

function formatAccessDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function MemberProgramOverviewPage() {
  const { programId } = useParams()

  const {
    data: program,
    isPending,
    isError,
    error,
    refetch,
  } = useMyProgramQuery(programId)

  const isAccessDenied =
    error instanceof ApiError && error.status === 403

  return (
    <div className="space-y-7 sm:space-y-9" role="status">
      {/* Back navigation */}
      <Link
        to="/app/programs"
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary-dark"
      >
        <ArrowLeft
          className="h-4 w-4"
          strokeWidth={1.7}
          aria-hidden="true"
        />

        My programs
      </Link>

      {/* Loading state */}
      {isPending && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Loading program...
          </p>
        </div>
      )}

      {/* Access denied */}
      {isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="font-medium text-foreground">
            You don't have access to this program.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This program is not currently available
            to your account.
          </p>

          <Link
            to="/app/programs"
            className="mt-4 inline-block text-sm text-foreground underline underline-offset-4"
          >
            Back to My Programs
          </Link>
        </div>
      )}

      {/* Error state */}
      {isError && !isAccessDenied && (
        <MemberRequestError error={error} subject="program" onRetry={refetch} />
      )}

      {/* Program content */}
      {!isPending && !isError && program && (
        <>
          {/* Program header */}
          <header className="space-y-4">

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Program
              </p>

              <h1 className="mt-1.5 text-[28px] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                {program.name}
              </h1>

              {program.description && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  {program.description}
                </p>
              )}
            </div>

            {/* Program metadata */}
            <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Current attempt
                </p>

                <p className="mt-1 text-sm font-medium leading-5 text-foreground">
                  Started{' '}
                  {formatAccessDate(program.accessStartsAt)}
                </p>
              </div>

              {program.accessExpiresAt && (
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Access
                  </p>

                  <p className="mt-1 text-sm font-medium leading-5 text-foreground">
                    Until{' '}
                    {formatAccessDate(program.accessExpiresAt)}
                  </p>
                </div>
              )}
            </div>
          </header>

          {/* Program weeks */}
          <section aria-labelledby="program-weeks-heading">
            <h2
              id="program-weeks-heading"
              className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Weeks
            </h2>

            {program.weeks.length === 0 ? (
              <div className="mt-4 border border-border p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                  No weeks available yet.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {program.weeks.map((week) => (
                  <MemberProgramWeekCard
                    key={week.weekId}
                    programId={program.programId}
                    week={week}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Program resources */}
          {program.resources.length > 0 && (
            <section aria-labelledby="program-resources-heading">
              <h2
                id="program-resources-heading"
                className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                Resources
              </h2>

              <div className="mt-3 border-b border-border">
                {program.resources.map((resource) => (
                  <MemberProgramResourceCard
                    key={resource.resourceId}
                    resource={resource}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default MemberProgramOverviewPage