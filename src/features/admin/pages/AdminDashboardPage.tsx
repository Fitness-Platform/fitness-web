import { adminManageInteraction } from "../components/programStructureStyles";
import { Link } from "react-router-dom";
import { useAdminDashboardQuery } from "../hooks/useAdminDashboardQuery";

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AdminDashboardPage() {
  const { data, dataUpdatedAt, isPending, isError, refetch } =
    useAdminDashboardQuery();

  const hour = dataUpdatedAt ? new Date(dataUpdatedAt).getHours() : null;

  const greeting =
    hour === null
      ? "Welcome back"
      : hour < 12
        ? "Good morning"
        : hour < 18
          ? "Good afternoon"
          : "Good evening";

  const now = dataUpdatedAt;

  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const programs = data?.programs ?? [];
  const accesses = data?.accesses ?? [];
  const purchases = data?.purchases ?? [];

  const activeClientIds = new Set(
    accesses
      .filter((access) => {
        const startsAt = new Date(access.startsAt).getTime();

        const expiresAt = access.expiresAt
          ? new Date(access.expiresAt).getTime()
          : null;

        return (
          startsAt <= now &&
          access.revokedAt === null &&
          (expiresAt === null || expiresAt > now)
        );
      })
      .map((access) => access.userId),
  );

  const recentPurchases = purchases.filter(
    (purchase) => new Date(purchase.createdAt).getTime() >= thirtyDaysAgo,
  );

  const paidPurchases = purchases.filter(
    (purchase) => purchase.status === "PAID",
  );

  const paidCurrencies = new Set(
    paidPurchases.map((purchase) => purchase.currency),
  );

  const totalPaidCents = paidPurchases.reduce(
    (total, purchase) => total + purchase.amountCents,
    0,
  );

  const totalPaid =
    paidCurrencies.size <= 1
      ? formatCurrency(totalPaidCents, paidPurchases[0]?.currency ?? "USD")
      : "—";

  const metrics = [
    {
      label: "Total programs",
      to: "/admin/programs",
      value: programs.length.toString(),
      note: "Across your catalog",
    },
    {
      label: "Active clients",
      to: "/admin/clients-access",
      value: activeClientIds.size.toString(),
      note: "With current access",
    },
    {
      label: "Recent purchases",
      to: "/admin/purchases",
      value: recentPurchases.length.toString(),
      note: "Last 30 days",
    },
    {
      label: "Total revenue",
      to: "/admin/purchases?status=PAID",
      value: totalPaid,
      note: "All time",
    },
  ];

  const recentPrograms = [...programs]
    .sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime(),
    )
    .slice(0, 3);

  const latestPurchases = [...purchases]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="space-y-10 lg:space-y-12">
      <section aria-labelledby="admin-welcome-heading">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
          Admin overview
        </p>

        <h1
          id="admin-welcome-heading"
          className="mt-2 text-[32px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]"
        >
          {greeting}, Daniela.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Here's what's happening across your platform.
        </p>
      </section>

      {isError && (
        <section
          aria-label="Dashboard error"
          className="border border-border p-5"
        >
          <p className="text-sm text-foreground">
            We couldn't load the dashboard data.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm text-muted-foreground underline underline-offset-4 transition hover:text-foreground"
          >
            Try again
          </button>
        </section>
      )}

      <section
        aria-label="Platform metrics"
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <Link
            to={metric.to}
            key={metric.label}
            className="min-w-0 border border-border bg-background p-4 transition-colors hover:border-primary-dark sm:p-5"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {metric.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {isPending || isError ? "—" : metric.value}
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {metric.note}
            </p>
          </Link>
        ))}
      </section>

      {isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading dashboard data...
        </p>
      )}

      {!isPending && !isError && (
        <>
          <section
            aria-labelledby="quick-actions-heading"
            className="border-t border-border pt-8"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
              Shortcuts
            </p>

            <h2
              id="quick-actions-heading"
              className="mt-2 text-xl font-semibold tracking-tight text-foreground"
            >
              Quick Actions
            </h2>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              <Link
                to="/admin/programs?create=1"
                className="flex min-h-16 items-center gap-4 border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary-dark"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-dark text-lg text-background">
                  +
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    Create Program
                  </span>

                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Start a new training program
                  </span>
                </span>

                <span className="text-lg text-foreground" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                to="/admin/workouts?create=1"
                className="flex min-h-16 items-center gap-4 border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary-dark"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-dark text-lg text-background">
                  +
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    Create Workout
                  </span>

                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Build a workout session
                  </span>
                </span>

                <span className="text-lg text-foreground" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                to="/admin/exercises?create=1"
                className="flex min-h-16 items-center gap-4 border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary-dark"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-dark text-lg text-background">
                  +
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    Add Exercise
                  </span>

                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Add to your library
                  </span>
                </span>

                <span className="text-lg text-foreground" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </section>

          <section
            aria-labelledby="admin-programs-heading"
            className="border-t border-border pt-8"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
                  Recently managed
                </p>

                <h2
                  id="admin-programs-heading"
                  className="mt-2 text-xl font-semibold tracking-tight text-foreground"
                >
                  Your Programs
                </h2>
              </div>

              <Link to="/admin/programs" className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-primary-dark hover:underline underline-offset-4 sm:inline">
                View all programs →
              </Link>
            </div>

            {recentPrograms.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">
                No programs available yet.
              </p>
            ) : (
              <div className="mt-5 border border-border bg-background">
                {recentPrograms.map((program, index) => (
                  <div
                    key={program.id}
                    className="grid gap-4 border-b border-border p-4 last:border-b-0 sm:grid-cols-[40px_minmax(0,1fr)_auto_auto] sm:items-center sm:px-5"
                  >
                    <p className="text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground">
                        {program.name}
                      </h3>

                      {program.description && (
                        <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">
                          {program.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={
                        program.status === "PUBLISHED"
                          ? "w-fit bg-primary/10 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark"
                          : "w-fit bg-[#F3EEE1] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#776842]"
                      }
                    >
                      {program.status}
                    </span>

                    <Link
                      to={`/admin/programs/${program.id}`}
                      aria-label={`Manage ${program.name}`}
                      style={{ font: "inherit" }}
                      className={"inline-flex min-h-10 items-center justify-center border border-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark " + adminManageInteraction}
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <Link to="/admin/programs" className="mt-4 inline-block text-[10px] font-medium uppercase tracking-[0.14em] text-primary-dark hover:underline underline-offset-4 sm:hidden">
              View all programs →
            </Link>
          </section>

          <section
            aria-labelledby="recent-purchases-heading"
            className="border-t border-border pt-8"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
                  Latest activity
                </p>

                <h2
                  id="recent-purchases-heading"
                  className="mt-2 text-xl font-semibold tracking-tight text-foreground"
                >
                  Recent Purchases
                </h2>
              </div>

              <Link to="/admin/purchases" className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-primary-dark hover:underline underline-offset-4 sm:inline">
                View all purchases →
              </Link>
            </div>

            {latestPurchases.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">
                No purchases yet.
              </p>
            ) : (
              <>
                {/* Mobile */}
                <div className="mt-5 border border-border bg-background sm:hidden">
                  {latestPurchases.map((purchase) => (
                    <div
                      key={purchase.purchaseId}
                      className="border-b border-border p-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {purchase.programName}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(purchase.createdAt)}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-medium text-foreground">
                            {formatCurrency(
                              purchase.amountCents,
                              purchase.currency,
                            )}
                          </p>

                          <span
                            className={
                              purchase.status === "PAID"
                                ? "mt-2 inline-block bg-primary/10 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark"
                                : purchase.status === "PENDING"
                                  ? "mt-2 inline-block bg-[#F3EEE1] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#776842]"
                                  : "mt-2 inline-block bg-muted px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                            }
                          >
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop / tablet */}
                <div className="mt-5 hidden overflow-x-auto border border-border bg-background sm:block">
                  <table className="w-full min-w-[620px] text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Program
                        </th>

                        <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Date
                        </th>

                        <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Amount
                        </th>

                        <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          Payment Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {latestPurchases.map((purchase) => (
                        <tr
                          key={purchase.purchaseId}
                          className="border-b border-border last:border-b-0"
                        >
                          <td className="px-5 py-4 text-sm font-medium text-foreground">
                            {purchase.programName}
                          </td>

                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {formatDate(purchase.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-sm text-foreground">
                            {formatCurrency(
                              purchase.amountCents,
                              purchase.currency,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={
                                purchase.status === "PAID"
                                  ? "inline-block bg-primary/10 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark"
                                  : purchase.status === "PENDING"
                                    ? "inline-block bg-[#F3EEE1] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#776842]"
                                    : "inline-block bg-muted px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                              }
                            >
                              {purchase.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <Link to="/admin/purchases" className="mt-4 inline-block text-[10px] font-medium uppercase tracking-[0.14em] text-primary-dark hover:underline underline-offset-4 sm:hidden">
              View all purchases →
            </Link>
          </section>
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;
