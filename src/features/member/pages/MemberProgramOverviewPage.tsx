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
    <div className="space-y-8">
      <Link
        to="/app/programs"
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← My programs
      </Link>

      {isPending && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            Loading program...
          </p>
        </div>
      )}

      {isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="font-medium text-foreground">
            You don't have access to this program.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This program is not currently available to your account.
          </p>

          <Link
            to="/app/programs"
            className="mt-4 inline-block text-sm text-foreground underline underline-offset-4"
          >
            Back to My Programs
          </Link>
        </div>
      )}

      {isError && !isAccessDenied && (
        <div className="border border-border p-5 sm:p-6">
          <p className="text-sm text-foreground">
            We couldn't load this program.
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

      {!isPending && !isError && program && (
        <>
          <header className="max-w-2xl">
            <p className="text-sm text-muted-foreground">
              Program
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {program.name}
            </h1>

            {program.description && (
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                {program.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Current attempt
                </p>

                <p className="mt-1 text-sm text-foreground">
                  Started {formatAccessDate(program.accessStartsAt)}
                </p>
              </div>

              {program.accessExpiresAt && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Access
                  </p>

                  <p className="mt-1 text-sm text-foreground">
                    Until {formatAccessDate(program.accessExpiresAt)}
                  </p>
                </div>
              )}
            </div>
          </header>

          <section aria-labelledby="program-weeks-heading">
            <h2
              id="program-weeks-heading"
              className="text-xl font-medium"
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
              <div className="mt-4 grid gap-4 md:grid-cols-2">
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

          {program.resources.length > 0 && (
            <section aria-labelledby="program-resources-heading">
              <h2
                id="program-resources-heading"
                className="text-xl font-medium"
              >
                Resources
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
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