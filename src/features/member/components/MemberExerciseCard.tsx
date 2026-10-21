import { useState } from "react";

import type { MemberWorkoutExercise } from "../types/memberProgramWorkoutDetail";

type MemberExerciseCardProps = {
  exercise: MemberWorkoutExercise;
  isWorkoutCompleted: boolean;
  isSaving: boolean;
  savingSetNumber: number | null;
  onSaveSet: (setNumber: number, reps: number, weightLb: number) => void;
};

type SetDraft = {
  reps: string;
  weightLb: string;
};

function formatWeight(weight: number) {
  return `${weight} lb`;
}

function formatRest(seconds: number) {
  if (seconds < 60) {
    return `${seconds} sec`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
}

function createSetDrafts(
  exercise: MemberWorkoutExercise,
): Record<number, SetDraft> {
  const drafts: Record<number, SetDraft> = {};

  for (let setNumber = 1; setNumber <= exercise.sets; setNumber += 1) {
    const completedSet = exercise.completedSets.find(
      (set) => set.setNumber === setNumber,
    );

    drafts[setNumber] = {
      reps: completedSet !== undefined ? String(completedSet.reps) : "",
      weightLb:
        completedSet !== undefined
          ? String(completedSet.weightLb)
          : exercise.currentWeightLb !== null
            ? String(exercise.currentWeightLb)
            : exercise.suggestedWeightLb !== null
              ? String(exercise.suggestedWeightLb)
              : "",
    };
  }

  return drafts;
}

function MemberExerciseCard({
  exercise,
  isWorkoutCompleted,
  isSaving,
  savingSetNumber,
  onSaveSet,
}: MemberExerciseCardProps) {
  const [setDrafts, setSetDrafts] = useState<Record<number, SetDraft>>(() =>
    createSetDrafts(exercise),
  );

  const [editingSetNumber, setEditingSetNumber] = useState<number | null>(null);

  const nextPendingSetNumber =
    Array.from({ length: exercise.sets }, (_, index) => index + 1).find(
      (setNumber) =>
        !exercise.completedSets.some((set) => set.setNumber === setNumber),
    ) ?? null;

  const activeSetNumber = isWorkoutCompleted
    ? null
    : (editingSetNumber ?? nextPendingSetNumber);

  function updateSetDraft(
    setNumber: number,
    field: keyof SetDraft,
    value: string,
  ) {
    setSetDrafts((current) => ({
      ...current,
      [setNumber]: {
        ...current[setNumber],
        [field]: value,
      },
    }));
  }

  function handleSaveSet(setNumber: number) {
    const draft = setDrafts[setNumber];

    if (!draft) {
      return;
    }

    if (draft.reps.trim() === "" || draft.weightLb.trim() === "") {
      return;
    }

    const reps = Number(draft.reps);
    const weightLb = Number(draft.weightLb);

    if (
      !Number.isInteger(reps) ||
      reps < 0 ||
      !Number.isFinite(weightLb) ||
      weightLb < 0
    ) {
      return;
    }

    onSaveSet(setNumber, reps, weightLb);
  }

  return (
    <article className="border border-border p-5 sm:p-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Exercise {exercise.position}
        </p>

        <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
          {exercise.name}
        </h3>

        {exercise.equipment && (
          <p className="mt-1 text-sm text-muted-foreground">
            {exercise.equipment}
          </p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-4 sm:grid-cols-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Sets
          </p>

          <p className="mt-1 text-sm text-foreground">{exercise.sets}</p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Reps
          </p>

          <p className="mt-1 text-sm text-foreground">{exercise.reps}</p>
        </div>

        {exercise.restSeconds !== null && (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Rest
            </p>

            <p className="mt-1 text-sm text-foreground">
              {formatRest(exercise.restSeconds)}
            </p>
          </div>
        )}

        {exercise.currentWeightLb !== null ? (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Current load
            </p>

            <p className="mt-1 text-sm text-foreground">
              {formatWeight(exercise.currentWeightLb)}
            </p>
          </div>
        ) : (
          exercise.suggestedWeightLb !== null && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Suggested
              </p>

              <p className="mt-1 text-sm text-foreground">
                {formatWeight(exercise.suggestedWeightLb)}
              </p>
            </div>
          )
        )}
      </div>

      {exercise.instructions && (
        <div className="mt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Instructions
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {exercise.instructions}
          </p>
        </div>
      )}

      {exercise.notes && (
        <div className="mt-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Notes
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {exercise.notes}
          </p>
        </div>
      )}

      {exercise.videoUrl && (
        <div className="mt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Demo
          </p>

          <video
            controls
            playsInline
            preload="metadata"
            className="mt-2 aspect-video w-full bg-black"
            src={exercise.videoUrl}
          >
            Your browser does not support video playback.
          </video>
        </div>
      )}

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Previous performance
        </p>

        {exercise.previousSets.length > 0 ? (
          <div className="mt-3 divide-y divide-border border-y border-border">
            {[...exercise.previousSets]
              .sort((first, second) => first.setNumber - second.setNumber)
              .map((previousSet) => (
                <div
                  key={previousSet.setNumber}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <p className="text-sm text-foreground">
                    Set {previousSet.setNumber}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {previousSet.reps} reps ·{" "}
                    {formatWeight(previousSet.weightLb)}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No previous performance yet.
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Set tracking
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {exercise.completedSets.length} of {exercise.sets} sets saved
            </p>
          </div>

          {isWorkoutCompleted && (
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary-dark">
              Workout completed
            </p>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {[...exercise.completedSets]
            .sort((first, second) => first.setNumber - second.setNumber)
            .map((completedSet) => (
              <div
                key={completedSet.id}
                className="flex items-center justify-between gap-4 border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Set {completedSet.setNumber}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {completedSet.reps} reps ·{" "}
                    {formatWeight(completedSet.weightLb)}
                  </p>
                </div>

                {!isWorkoutCompleted && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setEditingSetNumber(completedSet.setNumber)}
                    className="text-sm text-primary-dark underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}

          {activeSetNumber !== null &&
            (() => {
              const completedSet = exercise.completedSets.find(
                (set) => set.setNumber === activeSetNumber,
              );

              const draft = setDrafts[activeSetNumber] ?? {
                reps: "",
                weightLb: "",
              };

              const isThisSetSaving = savingSetNumber === activeSetNumber;

              const isValid =
                draft.reps.trim() !== "" &&
                draft.weightLb.trim() !== "" &&
                Number.isInteger(Number(draft.reps)) &&
                Number(draft.reps) >= 0 &&
                Number.isFinite(Number(draft.weightLb)) &&
                Number(draft.weightLb) >= 0;

              return (
                <div className="border border-primary-dark p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark">
                        {completedSet ? "Editing saved set" : "Current set"}
                      </p>

                      <p className="mt-1 text-base font-medium text-foreground">
                        Set {activeSetNumber} of {exercise.sets}
                      </p>
                    </div>

                    {completedSet && (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => setEditingSetNumber(null)}
                        className="text-sm text-muted-foreground underline underline-offset-4 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Reps
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={draft.reps}
                        disabled={isSaving}
                        onChange={(event) =>
                          updateSetDraft(
                            activeSetNumber,
                            "reps",
                            event.target.value,
                          )
                        }
                        className="mt-1 w-full border border-border bg-background px-3 py-3 text-base text-foreground outline-none transition focus:border-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Weight (lb)
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={draft.weightLb}
                        disabled={isSaving}
                        onChange={(event) =>
                          updateSetDraft(
                            activeSetNumber,
                            "weightLb",
                            event.target.value,
                          )
                        }
                        className="mt-1 w-full border border-border bg-background px-3 py-3 text-base text-foreground outline-none transition focus:border-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    disabled={!isValid || isSaving}
                    onClick={() => handleSaveSet(activeSetNumber)}
                    className="mt-3 w-full bg-primary px-4 py-3 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isThisSetSaving
                      ? "Saving..."
                      : completedSet
                        ? "Update Set"
                        : "Complete Set"}
                  </button>
                </div>
              );
            })()}

          {!isWorkoutCompleted &&
            nextPendingSetNumber === null &&
            editingSetNumber === null && (
              <div className="border border-border p-4">
                <p className="text-sm font-medium text-foreground">
                  All sets completed
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Review your sets above or continue to the next exercise.
                </p>
              </div>
            )}
        </div>
      </div>
    </article>
  );
}

export default MemberExerciseCard;
