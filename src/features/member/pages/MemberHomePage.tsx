import MemberRequestError from '../components/MemberRequestError'
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import MemberProgramCard from "../components/MemberProgramCard";
import { useMyProgramsQuery } from "../hooks/useMyProgramsQuery";

function MemberHomePage() {
  const { data: programs, isPending, isError, error, refetch } = useMyProgramsQuery();

  const dashboardPrograms = programs?.slice(0, 2) ?? [];

  const hasPrograms = !isPending && !isError && dashboardPrograms.length > 0;

  return (
    <div className="space-y-9 sm:space-y-10">
      {/* Welcome section */}
      <section aria-labelledby="training-heading">
        <p className="text-sm text-muted-foreground">Welcome back</p>

        <h1
          id="training-heading"
          className="mt-1 text-[30px] font-bold uppercase leading-tight tracking-tight text-foreground sm:text-4xl"
        >
          Your <span className="text-primary-dark">Training</span>
        </h1>

        {/* Training hero */}
        {hasPrograms && (
          <div className="mt-6 overflow-hidden">

            <div className="bg-primary-dark p-5 text-background sm:p-7">
              <h2 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                Choose your program
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6">
                View the training programs currently available to you and choose
                where you want to start.
              </p>

              <Link
                to="/app/programs"
                className="mt-5 flex min-h-12 w-full items-center justify-between gap-4 bg-background px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
              >
                <span>View my programs</span>

                <ArrowRight
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Programs preview */}
      <section aria-labelledby="my-programs-heading">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="my-programs-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            My programs
          </h2>

          {hasPrograms && (
            <Link
              to="/app/programs"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground underline underline-offset-4 transition hover:text-primary-dark"
            >
              View all
            </Link>
          )}
        </div>

        <div className="mt-4">
          {isPending && (
            <div className="border border-border p-5 sm:p-6" role="status">
              <p className="text-sm text-muted-foreground">
                Loading your programs...
              </p>
            </div>
          )}

          {isError && (
            <MemberRequestError error={error} subject="programs" onRetry={refetch} />
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

          {hasPrograms && (
            <div className="grid gap-3 lg:grid-cols-2">
              {dashboardPrograms.map((program) => (
                <MemberProgramCard
                  key={program.programId}
                  program={program}
                  variant="dashboard"
                  to={`/app/programs/${program.programId}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MemberHomePage;
