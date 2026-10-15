import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import MemberProgramCard from '../components/MemberProgramCard'
import { useMyProgramsQuery } from '../hooks/useMyProgramsQuery'

function MemberHomePage() {
  const {
    data: programs,
    isPending,
    isError,
    refetch,
  } = useMyProgramsQuery()

  const dashboardPrograms = programs?.slice(0, 3) ?? []

  const hasPrograms =
    !isPending &&
    !isError &&
    dashboardPrograms.length > 0

  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm text-muted-foreground">
          Welcome back
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Your training
        </h1>

        {hasPrograms && (
          <div className="mt-6 border border-primary bg-primary p-6 text-background sm:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em]">
              Your training
            </p>

            <h2 className="mt-3 text-2xl font-medium tracking-tight">
              Choose your program
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6">
              View the training programs currently available to you and choose
              where you want to start.
            </p>

            <Link
              to="/app/programs"
              className="mt-6 inline-flex items-center gap-2 border border-background px-4 py-2.5 text-sm font-medium transition hover:bg-background hover:text-primary-dark"
            >
              View my programs

              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-medium">
            My programs
          </h2>

          {programs && programs.length > 0 && (
            <Link
              to="/app/programs"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              View all
            </Link>
          )}
        </div>

        <div className="mt-4">
          {isPending && (
            <div className="border border-border p-5 sm:p-6">
              <p className="text-sm text-muted-foreground">
                Loading your programs...
              </p>
            </div>
          )}

          {isError && (
            <div className="border border-border p-5 sm:p-6">
              <p className="text-sm text-foreground">
                We couldn't load your programs.
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

          {!isPending &&
            !isError &&
            programs?.length === 0 && (
              <div className="border border-border p-5 sm:p-6">
                <p className="text-sm text-foreground">
                  No programs available yet.
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Your programs will appear here when they become available.
                </p>
              </div>
            )}

          {!isPending &&
            !isError &&
            dashboardPrograms.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {dashboardPrograms.map((program) => (
                  <MemberProgramCard
                    key={program.programId}
                    program={program}
                  />
                ))}
              </div>
            )}
        </div>
      </section>
    </div>
  )
}

export default MemberHomePage