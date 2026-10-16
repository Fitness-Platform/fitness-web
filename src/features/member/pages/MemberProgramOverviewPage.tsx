import { Link, useParams } from 'react-router-dom'

import MemberProgramResourceCard from '../components/MemberProgramResourceCard'
import MemberProgramWeekCard from '../components/MemberProgramWeekCard'
import { useMyProgramQuery } from '../hooks/useMyProgramQuery'

function MemberProgramOverviewPage() {
  const { programId } = useParams()

  const {
    data: program,
    isPending,
    isError,
    refetch,
  } = useMyProgramQuery(programId)

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

      {isError && (
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