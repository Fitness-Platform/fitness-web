import test from "node:test";
import assert from "node:assert/strict";
import { isValidSetDraft } from "../src/features/member/utils/setDraft.ts";

test("saved sets accept zero, integer reps and the backend weight precision/range", () => {
  for (const [reps, weightLb] of [
    ["0", "0"],
    ["8", "12.50"],
    ["2147483647", "999999.99"],
  ])
    assert(isValidSetDraft({ reps, weightLb }));
});
test("saved sets reject empty/non-finite/negative values and backend numeric overflows", () => {
  for (const [reps, weightLb] of [
    ["", "12"],
    ["8", ""],
    ["1.5", "10"],
    ["-1", "10"],
    ["8", "-1"],
    ["2147483648", "12"],
    ["8", "1000000"],
    ["8", "12.345"],
    ["8", "12.000000001"],
    ["Infinity", "10"],
    ["8", "NaN"],
  ])
    assert.equal(
      isValidSetDraft({ reps, weightLb }),
      false,
      `${reps}/${weightLb}`,
    );
});
