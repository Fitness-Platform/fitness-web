import test from "node:test";
import assert from "node:assert/strict";
import { paginateHistory } from "../src/features/admin/utils/historyPagination.ts";

test("history pagination covers every record once in pages of ten", () => {
  const items = Array.from({ length: 47 }, (_, i) => i);
  assert.deepEqual(
    [1, 2, 3, 4, 5].flatMap((page) => paginateHistory(items, page).items),
    items,
  );
  const last = paginateHistory(items, 5);
  assert.deepEqual(
    [last.start, last.end, last.total, last.totalPages],
    [41, 47, 47, 5],
  );
});
test("empty histories and shrinking datasets keep a valid page", () => {
  assert.deepEqual(paginateHistory([], 3), {
    page: 1,
    totalPages: 1,
    total: 0,
    start: 0,
    end: 0,
    items: [],
  });
  const result = paginateHistory(
    Array.from({ length: 10 }, (_, i) => i),
    2,
  );
  assert.equal(result.page, 1);
  assert.equal(result.items.length, 10);
});
