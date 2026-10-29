import MemberRequestError from '../components/MemberRequestError'
import MemberProgramCard from '../components/MemberProgramCard'
import { useMyProgramsQuery } from '../hooks/useMyProgramsQuery'

function MemberProgramsPage() {
  const {
    data: programs,
    isPending,
    isError,
    error,
    refetch,
  } = useMyProgramsQuery()

  return (
    <div className="space-y-8" role="status">
      {/* Page header */}
      <header className="max-w-2xl">
        <p className="text-sm text-muted-foreground">
          Your training library
        </p>

        <h1 className="mt-1 text-[30px] font-bold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
          My{' '}
          <span className="text-primary-dark">
            Programs
          </span>
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          Access the training programs currently
          available to you.
        </p>
      </header>

      {/* Programs list */}
      <section aria-labelledby="programs-heading">
        <h2
          id="programs-heading"
          className="sr-only"
        >
          Available programs
        </h2>

        {/* Loading state */}
        {isPending && (
          <div className="border border-border p-5 sm:p-6">
            <p className="text-sm text-muted-foreground">
              Loading your programs...
            </p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <MemberRequestError error={error} subject="programs" onRetry={refetch} />
        )}

        {/* Empty state */}
        {!isPending &&
          !isError &&
          programs?.length === 0 && (
            <div className="border border-border p-5 sm:p-6">
              <p className="text-sm text-foreground">
                No programs available yet.
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your programs will appear here
                when they become available.
              </p>
            </div>
          )}

        {/* Program cards */}
        {!isPending &&
          !isError &&
          programs &&
          programs.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {programs.map((program) => (
                <MemberProgramCard
                  key={program.programId}
                  program={program}
                  variant="library"
                  showAccessInfo
                  to={`/app/programs/${program.programId}`}
                />
              ))}
            </div>
          )}
      </section>
    </div>
  )
}

export default MemberProgramsPage