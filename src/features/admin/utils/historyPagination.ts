export const historyPageSize = 5;

export function paginateHistory<T>(items: T[], requestedPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / historyPageSize));
  const page = Math.max(1, Math.min(requestedPage, totalPages));
  const offset = (page - 1) * historyPageSize;
  return {
    page,
    totalPages,
    total: items.length,
    start: items.length ? offset + 1 : 0,
    end: Math.min(offset + historyPageSize, items.length),
    items: items.slice(offset, offset + historyPageSize),
  };
}
