import { useCreateDrawerQuery } from "../hooks/useCreateDrawerQuery";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import AdminCreateWorkoutDrawer from "../components/AdminCreateWorkoutDrawer";
import { useAdminWorkoutsQuery } from "../hooks/useAdminWorkoutsQuery";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AdminWorkoutsPage() {
  const {
    data: workouts = [],
    isPending,
    isError,
    refetch,
  } = useAdminWorkoutsQuery();

  const [search, setSearch] = useState("");

  const [isCreateWorkoutOpen, setIsCreateWorkoutOpen] = useCreateDrawerQuery();

  const normalizedSearch = search.trim().toLowerCase();

  const filteredWorkouts = workouts.filter(
    (workout) =>
      normalizedSearch.length === 0 ||
      workout.name.toLowerCase().includes(normalizedSearch) ||
      (workout.description ?? "").toLowerCase().includes(normalizedSearch),
  );

  const createdThisMonthCount = workouts.filter((workout) => {
    const createdAt = new Date(workout.createdAt);

    return (
      createdAt.getFullYear() === currentYear &&
      createdAt.getMonth() === currentMonth
    );
  }).length;

  const lastUpdatedAt =
    workouts.length > 0
      ? workouts.reduce(
          (latest, workout) =>
            new Date(workout.updatedAt).getTime() > new Date(latest).getTime()
              ? workout.updatedAt
              : latest,
          workouts[0].updatedAt,
        )
      : null;

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
            Workout management
          </p>

          <h1 className="mt-2 text-[32px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
            Workouts
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Create and organize reusable training sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateWorkoutOpen(true)}
          className="min-h-11 w-full bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 sm:w-auto"
        >
          + Create Workout
        </button>
      </section>

      {isError && (
        <section className="border border-border p-5">
          <p className="text-sm font-medium text-foreground">
            Unable to load workouts
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading your workout library.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 border border-primary-dark px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-primary-dark"
          >
            Try again
          </button>
        </section>
      )}

      {isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading workouts...
        </p>
      )}

      {!isPending && !isError && (
        <>
          <section
            aria-label="Workout summary"
            className="grid grid-cols-3 border-y border-border"
          >
            <div className="py-4 pr-4 sm:py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                All workouts
              </p>

              <p className="mt-1 text-2xl font-semibold text-foreground">
                {workouts.length}
              </p>
            </div>

            <div className="border-l border-border px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                Last updated
              </p>

              <p className="mt-1 text-lg font-semibold text-foreground sm:text-2xl">
                {lastUpdatedAt ? formatDate(lastUpdatedAt) : "—"}
              </p>
            </div>

            <div className="border-l border-border px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                Created this month
              </p>

              <p className="mt-1 text-2xl font-semibold text-foreground">
                {createdThisMonthCount}
              </p>
            </div>
          </section>

          {workouts.length === 0 ? (
            <section className="flex min-h-80 items-center justify-center border border-border px-6 text-center">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  No workouts yet.
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create your first reusable workout to begin building training
                  programs.
                </p>

                <button
                  type="button"
                  onClick={() => setIsCreateWorkoutOpen(true)}
                  className="mt-6 min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90"
                >
                  Create Workout
                </button>
              </div>
            </section>
          ) : (
            <>
              <section>
                <label className="relative block sm:w-72">
                  <span className="sr-only">Search workouts</span>

                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search workouts"
                    className="h-11 w-full border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary-dark"
                  />
                </label>
              </section>

              {filteredWorkouts.length === 0 ? (
                <section className="border border-border px-5 py-10 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No workouts found
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try changing your search.
                  </p>
                </section>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden border border-border bg-background lg:block">
                    <div className="grid grid-cols-[56px_1.1fr_1.8fr_160px_140px] items-center border-b border-border px-4 py-3">
                      <span />

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Workout
                      </p>

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Description
                      </p>

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Updated
                      </p>

                      <span />
                    </div>

                    {filteredWorkouts.map((workout, index) => (
                      <div
                        key={workout.id}
                        className="grid grid-cols-[56px_1.1fr_1.8fr_160px_140px] items-center border-b border-border px-4 py-5 last:border-b-0"
                      >
                        <p className="text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <p className="pr-6 text-sm font-medium text-foreground">
                          {workout.name}
                        </p>

                        <p className="pr-8 text-sm leading-5 text-muted-foreground">
                          {workout.description || "No description"}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {formatDate(workout.updatedAt)}
                        </p>

                        <Link
                          to={`/admin/workouts/${workout.id}`}
                          className="flex min-h-9 items-center justify-center border border-primary-dark px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                        >
                          Manage →
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Mobile / Tablet */}
                  <div className="space-y-3 lg:hidden">
                    {filteredWorkouts.map((workout, index) => (
                      <article
                        key={workout.id}
                        className="border border-border p-5"
                      >
                        <p className="text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <h2 className="mt-4 text-lg font-medium text-foreground">
                          {workout.name}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {workout.description || "No description"}
                        </p>

                        <div className="mt-5 border-t border-border pt-4">
                          <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                            Last updated
                          </p>

                          <p className="mt-1 text-sm text-foreground">
                            {formatDate(workout.updatedAt)}
                          </p>
                        </div>

                        <Link
                          to={`/admin/workouts/${workout.id}`}
                          className="mt-5 flex min-h-10 w-full items-center justify-center border border-primary-dark px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                        >
                          Manage →
                        </Link>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {isCreateWorkoutOpen && (
        <AdminCreateWorkoutDrawer
          onClose={() => setIsCreateWorkoutOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminWorkoutsPage;
