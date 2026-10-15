import MemberProgramCard from "../components/MemberProgramCard";
import { useMyProgramsQuery } from "../hooks/useMyProgramsQuery";

function MemberProgramsPage() {
  const { data: programs, isPending, isError, refetch } = useMyProgramsQuery();

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="text-sm text-muted-foreground">Your training library</p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          My programs
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Access the training programs currently available to you.
        </p>
      </header>

      <section aria-labelledby="programs-heading">
        <h2 id="programs-heading" className="sr-only">
          Available programs
        </h2>

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

        {!isPending && !isError && programs?.length === 0 && (
          <div className="border border-border p-5 sm:p-6">
            <p className="text-sm text-foreground">
              No programs available yet.
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your programs will appear here when they become available.
            </p>
          </div>
        )}

        {!isPending && !isError && programs && programs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <MemberProgramCard
                key={program.programId}
                program={program}
                showAccessInfo
                to={`/app/programs/${program.programId}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MemberProgramsPage;
