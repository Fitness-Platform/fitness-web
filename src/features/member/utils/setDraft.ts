export type SetDraft = { reps: string; weightLb: string };

// Matches MemberWorkoutSetRequest: nonnegative integer reps and six weight
// integer digits with at most two decimal places.
export function isValidSetDraft(draft: SetDraft) {
  const reps = Number(draft.reps);
  const weight = Number(draft.weightLb);
  return (
    draft.reps.trim() !== "" &&
    draft.weightLb.trim() !== "" &&
    Number.isInteger(reps) &&
    reps >= 0 &&
    reps <= 2147483647 &&
    Number.isFinite(weight) &&
    weight >= 0 &&
    weight <= 999999.99 &&
    Math.round(weight * 100) / 100 === weight
  );
}
