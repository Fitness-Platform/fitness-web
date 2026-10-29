import { useCreateDrawerQuery } from "../hooks/useCreateDrawerQuery";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import AdminCreateProgramDrawer from "../components/AdminCreateProgramDrawer";
import { useAdminProgramsQuery } from "../hooks/useAdminProgramsQuery";

type ProgramFilter = "ALL" | "PUBLISHED" | "DRAFT";

function formatCurrency(amountCents: number | null, currency: string | null) {
  if (amountCents === null || currency === null) {
    return "Not set";
  }

  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100)} ${currency}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AdminProgramsPage() {
  const {
    data: programs = [],
    isPending,
    isError,
    refetch,
  } = useAdminProgramsQuery();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProgramFilter>("ALL");

  const [isCreateProgramOpen, setIsCreateProgramOpen] = useCreateDrawerQuery();

  const publishedCount = programs.filter(
    (program) => program.status === "PUBLISHED",
  ).length;

  const draftCount = programs.filter(
    (program) => program.status === "DRAFT",
  ).length;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredPrograms = programs.filter((program) => {
    const matchesStatus = filter === "ALL" || program.status === filter;

    const matchesSearch =
      normalizedSearch.length === 0 ||
      program.name.toLowerCase().includes(normalizedSearch) ||
      (program.description ?? "").toLowerCase().includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
            Program management
          </p>

          <h1 className="mt-2 text-[32px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
            Programs
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Create, organize and publish your training programs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateProgramOpen(true)}
          className="min-h-11 w-full bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 sm:w-auto"
        >
          + Create Program
        </button>
      </section>

      {isError && (
        <section className="border border-border p-5">
          <p className="text-sm font-medium text-foreground">
            Unable to load programs
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading your catalog.
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
          Loading programs...
        </p>
      )}

      {!isPending && !isError && (
        <>
          <section
            aria-label="Program summary"
            className="grid grid-cols-3 border-y border-border"
          >
            <div className="py-4 pr-4 sm:py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                All programs
              </p>

              <p className="mt-1 text-2xl font-semibold text-foreground">
                {programs.length}
              </p>
            </div>

            <div className="border-l border-border px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                Published
              </p>

              <p className="mt-1 text-2xl font-semibold text-foreground">
                {publishedCount}
              </p>
            </div>

            <div className="border-l border-border px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                Drafts
              </p>

              <p className="mt-1 text-2xl font-semibold text-foreground">
                {draftCount}
              </p>
            </div>
          </section>

          {programs.length === 0 ? (
            <section className="flex min-h-80 items-center justify-center border border-border px-6 text-center">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  No programs yet.
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create your first training program to start building your
                  catalog.
                </p>
              </div>
            </section>
          ) : (
            <>
              <section className="space-y-4 sm:flex sm:items-end sm:justify-between sm:space-y-0">
                <label className="relative block sm:w-72">
                  <span className="sr-only">Search programs</span>

                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search programs"
                    className="h-11 w-full border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary-dark"
                  />
                </label>

                <div
                  className="flex gap-6"
                  aria-label="Filter programs by status"
                >
                  {(
                    [
                      ["ALL", "All"],
                      ["PUBLISHED", "Published"],
                      ["DRAFT", "Draft"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value)}
                      className={[
                        "border-b py-2 text-xs transition-colors",
                        filter === value
                          ? "border-primary-dark font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              {filteredPrograms.length === 0 ? (
                <section className="border border-border px-5 py-10 text-center">
                  <p className="text-sm font-medium text-foreground">
                    No programs found
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try changing your search or filter.
                  </p>
                </section>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden border border-border bg-background xl:block">
                    <div className="grid grid-cols-[40px_1.1fr_1.5fr_120px_110px_120px_110px] items-center gap-4 border-b border-border px-4 py-3">
                      <span />

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Program
                      </p>

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Description
                      </p>

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Price
                      </p>

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Status
                      </p>

                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Updated
                      </p>

                      <span />
                    </div>

                    {filteredPrograms.map((program, index) => (
                      <div
                        key={program.id}
                        className="grid grid-cols-[40px_1.1fr_1.5fr_120px_110px_120px_110px] items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
                      >
                        <p className="text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <p className="text-sm font-medium text-foreground">
                          {program.name}
                        </p>

                        <p className="text-sm leading-5 text-muted-foreground">
                          {program.description ?? "No description"}
                        </p>

                        <p className="text-sm text-foreground">
                          {formatCurrency(program.priceCents, program.currency)}
                        </p>

                        <span
                          className={
                            program.status === "PUBLISHED"
                              ? "w-fit bg-[#E3ECE7] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#496658]"
                              : "w-fit bg-[#F1E8D5] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#7A6334]"
                          }
                        >
                          {program.status}
                        </span>

                        <p className="text-xs text-muted-foreground">
                          {formatDate(program.updatedAt)}
                        </p>

                        <Link
                          to={`/admin/programs/${program.id}`}
                          className="border border-primary-dark px-3 py-2 text-center text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                        >
                          Manage →
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Mobile / tablet */}
                  <div className="space-y-3 xl:hidden">
                    {filteredPrograms.map((program, index) => (
                      <article
                        key={program.id}
                        className="border border-border bg-background p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-xs text-muted-foreground">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span
                            className={
                              program.status === "PUBLISHED"
                                ? "bg-[#E3ECE7] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#496658]"
                                : "bg-[#F1E8D5] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#7A6334]"
                            }
                          >
                            {program.status}
                          </span>
                        </div>

                        <h2 className="mt-4 font-semibold text-foreground">
                          {program.name}
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {program.description ?? "No description"}
                        </p>

                        <div className="mt-4 flex items-end justify-between gap-4 border-t border-border pt-3">
                          <p className="text-sm font-medium text-foreground">
                            {formatCurrency(
                              program.priceCents,
                              program.currency,
                            )}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Updated {formatDate(program.updatedAt)}
                          </p>
                        </div>

                        <Link
                          to={`/admin/programs/${program.id}`}
                          className="mt-4 block border border-primary-dark px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                        >
                          Manage
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

      {isCreateProgramOpen && (
        <AdminCreateProgramDrawer
          onClose={() => setIsCreateProgramOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminProgramsPage;
