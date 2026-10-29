import { useState, type ReactNode } from "react";
import { paginateHistory } from "../utils/historyPagination";
const navigationLink =
  "inline-flex min-h-9 items-center gap-2 py-1 text-primary-dark underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:text-muted-foreground/45 disabled:no-underline";

export default function AdminHistoryPagination<T>({
  items,
  renderPage,
}: {
  items: T[];
  renderPage: (items: T[]) => ReactNode;
}) {
  const [page, setPage] = useState(1);
  const result = paginateHistory(items, page);
  // Keep the page valid when a mutation removes the last row of a page.
  if (page !== result.page) setPage(result.page);
  return (
    <div className="admin-surface overflow-hidden rounded-[4px] border border-border">
      {renderPage(result.items)}
      <nav
        aria-label="History pagination"
        className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-border px-4 py-3 text-xs sm:px-5"
      >
        <p
          role="status"
          aria-atomic="true"
          className="text-xs text-muted-foreground"
        >
          {result.start}–{result.end} of {result.total}
        </p>
        {result.totalPages > 1 && (
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              className={navigationLink}
              disabled={result.page === 1}
              onClick={() => setPage(result.page - 1)}
            >
              <span aria-hidden="true">←</span>
              <span className="text-xs">Previous</span>
            </button>
            <span
              aria-label={`Page ${result.page} of ${result.totalPages}`}
              className="tabular-nums text-muted-foreground"
            >
              {result.page} / {result.totalPages}
            </span>
            <button
              type="button"
              className={navigationLink}
              disabled={result.page === result.totalPages}
              onClick={() => setPage(result.page + 1)}
            >
              <span className="text-xs">Next</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
