import { useCreateDrawerQuery } from "../hooks/useCreateDrawerQuery";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminExercisesQuery } from "../hooks/useAdminExercisesQuery";
import AdminCreateExerciseDrawer from "../components/AdminCreateExerciseDrawer";
import { Link } from "react-router-dom";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AdminExercisesPage() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const {
    data: exercises = [],
    isPending,
    isError,
    refetch,
  } = useAdminExercisesQuery();

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredExercises = useMemo(() => {
    if (!normalizedSearch) {
      return exercises;
    }

    return exercises.filter((exercise) => {
      const name =
        exercise.name.toLowerCase();

      const equipment =
        exercise.equipment?.toLowerCase() ??
        "";

      return (
        name.includes(normalizedSearch) ||
        equipment.includes(normalizedSearch)
      );
    });
  }, [exercises, normalizedSearch]);

  const withVideoCount = exercises.filter(
    (exercise) =>
      Boolean(exercise.videoUrl?.trim() || exercise.uploadedMedia),
  ).length;

  const withoutVideoCount =
    exercises.length - withVideoCount;

  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = useCreateDrawerQuery();

  if (isPending) {
    return (
      <p
        role="status"
        className="text-sm text-muted-foreground"
      >
        Loading exercises...
      </p>
    );
  }

  if (isError) {
    return (
      <section className="border border-border p-5">
        <p className="text-sm font-medium text-foreground">
          Unable to load exercises
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while loading
          your exercise library.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
            Exercise Library
          </p>

          <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
            Exercises
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Create and manage reusable exercises
            for your workouts.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsCreateExerciseOpen(true)
          }
          className="min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90"
        >
          + Create Exercise
        </button>
      </header>

      <section className="grid border-y border-border sm:grid-cols-3">
        <div className="border-b border-border py-5 sm:border-b-0 sm:border-r sm:px-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            All Exercises
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {exercises.length}
          </p>
        </div>

        <div className="border-b border-border py-5 sm:border-b-0 sm:border-r sm:px-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            With Video
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {withVideoCount}
          </p>
        </div>

        <div className="py-5 sm:px-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Without Video
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {withoutVideoCount}
          </p>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[285px]">
            <Search
              aria-hidden="true"
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
              placeholder="Search exercises"
              className="h-11 w-full border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary-dark"
            />
          </div>

          {normalizedSearch && (
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {filteredExercises.length}{" "}
              {filteredExercises.length === 1
                ? "Result"
                : "Results"}
            </p>
          )}
        </div>

        {exercises.length === 0 ? (
          <div className="mt-8 border border-border px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              No exercises yet.
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create your first reusable exercise
              to start building your exercise
              library.
            </p>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="mt-8 border border-border px-6 py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              No exercises found.
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Try changing your search.
            </p>
          </div>
        ) : (
          <>
            <div className="admin-surface mt-8 hidden border border-border xl:block">
              <div className="grid grid-cols-[56px_1.35fr_0.9fr_0.8fr_0.8fr_120px] gap-4 border-b border-border px-4 py-4">
                <span />

                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Exercise
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Equipment
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Video
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Updated
                </p>

                <span />
              </div>

              {filteredExercises.map(
                (exercise, index) => {
                  const hasVideo =
                    Boolean(
                      exercise.videoUrl?.trim() || exercise.uploadedMedia,
                    );

                  return (
                    <article
                      key={exercise.id}
                      className="grid grid-cols-[56px_1.35fr_0.9fr_0.8fr_0.8fr_120px] items-center gap-4 border-b border-border px-4 py-5 last:border-b-0"
                    >
                      <p className="text-xs text-muted-foreground">
                        {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </p>

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {exercise.name}
                        </p>

                        {exercise.instructions && (
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {
                              exercise.instructions
                            }
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {exercise.equipment ||
                          "—"}
                      </p>

                      <p
                        className={
                          hasVideo
                            ? "text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark"
                            : "text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                        }
                      >
                        {hasVideo
                          ? "Video Available"
                          : "No Video"}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {formatDate(
                          exercise.updatedAt,
                        )}
                      </p>

                      <Link
                        to={`/admin/exercises/${exercise.id}`}
                        className="flex min-h-9 items-center justify-center border border-primary-dark px-3 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                      >
                        Manage →
                      </Link>
                    </article>
                  );
                },
              )}
            </div>

            <div className="admin-surface mt-8 border border-border xl:hidden">
              {filteredExercises.map(
                (exercise, index) => {
                  const hasVideo =
                    Boolean(
                      exercise.videoUrl?.trim() || exercise.uploadedMedia,
                    );

                  return (
                    <article
                      key={exercise.id}
                      className="border-b border-border p-5 last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {String(
                            index + 1,
                          ).padStart(2, "0")}
                        </p>

                        <div className="min-w-0 flex-1">
                          <h2 className="text-base font-medium text-foreground">
                            {exercise.name}
                          </h2>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {exercise.equipment ||
                              "No equipment"}
                          </p>

                          {exercise.instructions && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                              {
                                exercise.instructions
                              }
                            </p>
                          )}

                          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                            <p
                              className={
                                hasVideo
                                  ? "text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark"
                                  : "text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                              }
                            >
                              {hasVideo
                                ? "Video Available"
                                : "No Video"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {formatDate(
                                exercise.updatedAt,
                              )}
                            </p>
                          </div>

                          <Link
                            to={`/admin/exercises/${exercise.id}`}
                            className="mt-5 flex min-h-10 w-full items-center justify-center border border-primary-dark px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                          >
                            Manage →
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </>
        )}
      </section>
      {isCreateExerciseOpen && (
        <AdminCreateExerciseDrawer
          onClose={() =>
            setIsCreateExerciseOpen(false)
          }
        />
      )}
    </div>
  );
}

export default AdminExercisesPage;