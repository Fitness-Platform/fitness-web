import { useState, type ReactNode } from "react";
import { paginateHistory } from "../utils/historyPagination";
import { structureButton } from "./programStructureStyles";

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
    <div>
      {renderPage(result.items)}
      <nav
        aria-label="History pagination"
        className="mt-5 flex flex-wrap items-center justify-between gap-4"
      >
        <p
          role="status"
          aria-atomic="true"
          className="text-sm text-muted-foreground"
        >
          {result.start}–{result.end} of {result.total}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className={structureButton}
            disabled={result.page === 1}
            onClick={() => setPage(result.page - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className={structureButton}
            disabled={result.page === result.totalPages}
            onClick={() => setPage(result.page + 1)}
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}
