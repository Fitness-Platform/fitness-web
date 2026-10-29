import MemberRestTimer from './MemberRestTimer'
import { useRestTimer } from '../hooks/useRestTimer'
import MemberExerciseVideo from './MemberExerciseVideo'
import { isValidSetDraft, type SetDraft } from '../utils/setDraft'
import { Check, Minus, Plus } from 'lucide-react'
import { useState } from 'react'

import type { MemberWorkoutExercise } from '../types/memberProgramWorkoutDetail'

type MemberExerciseCardProps = {
  exercise: MemberWorkoutExercise
  exerciseNumber: number
  exerciseCount: number
  hasPreviousExercise: boolean
  hasNextExercise: boolean
  onPreviousExercise: () => void
  onNextExercise: () => void
  isWorkoutCompleted: boolean
  isSaving: boolean
  savingSetNumber: number | null
  onSaveSet: (
    setNumber: number,
    reps: number,
    weightLb: number,
    onSuccess: () => void,
  ) => void
  onEditingChange: (editing: boolean) => void
}


function formatWeight(weight: number) {
  return `${weight} lb`
}

function formatRest(seconds: number) {
  if (seconds < 60) return `${seconds} sec`

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return remainingSeconds === 0
    ? `${minutes} min`
    : `${minutes} min ${remainingSeconds} sec`
}

function createSetDrafts(exercise: MemberWorkoutExercise): Record<number, SetDraft> {
  const drafts: Record<number, SetDraft> = {}

  for (let setNumber = 1; setNumber <= exercise.sets; setNumber += 1) {
    const savedSet = exercise.completedSets.find((set) => set.setNumber === setNumber)

    drafts[setNumber] = {
      reps: savedSet ? String(savedSet.reps) : '',
      weightLb: savedSet
        ? String(savedSet.weightLb)
        : exercise.currentWeightLb !== null
          ? String(exercise.currentWeightLb)
          : exercise.suggestedWeightLb !== null
            ? String(exercise.suggestedWeightLb)
            : '',
    }
  }

  return drafts
}

function MemberExerciseCard({
  exercise,
  exerciseNumber,
  exerciseCount,
  hasPreviousExercise,
  hasNextExercise,
  onPreviousExercise,
  onNextExercise,
  isWorkoutCompleted,
  isSaving,
  savingSetNumber,
  onSaveSet,
  onEditingChange,
}: MemberExerciseCardProps) {
  const [setDrafts, setSetDrafts] = useState<Record<number, SetDraft>>(() =>
    createSetDrafts(exercise),
  )
  const restTimer = useRestTimer()
  const [editingSetNumber, setEditingSetNumber] = useState<number | null>(null)

  const completedSets = [...exercise.completedSets].sort(
    (first, second) => first.setNumber - second.setNumber,
  )

  const nextPendingSetNumber =
    Array.from({ length: exercise.sets }, (_, index) => index + 1).find(
      (setNumber) => !completedSets.some((set) => set.setNumber === setNumber),
    ) ?? null

  const activeSetNumber = isWorkoutCompleted
    ? null
    : (editingSetNumber ?? nextPendingSetNumber)

  function updateDraft(setNumber: number, field: keyof SetDraft, value: string) {
    setSetDrafts((current) => ({
      ...current,
      [setNumber]: { ...current[setNumber], [field]: value },
    }))
  }

  function adjustDraft(setNumber: number, field: keyof SetDraft, delta: number) {
    const currentValue = Number(setDrafts[setNumber]?.[field] ?? '')
    const base = Number.isFinite(currentValue) ? currentValue : 0
    const next = Math.max(0, Math.round((base + delta) * 100) / 100)
    updateDraft(setNumber, field, String(next))
  }

  function beginEditing(setNumber: number) {
    const savedSet = completedSets.find((set) => set.setNumber === setNumber)
    if (!savedSet || isSaving || isWorkoutCompleted) return

    setSetDrafts((current) => ({
      ...current,
      [setNumber]: {
        reps: String(savedSet.reps),
        weightLb: String(savedSet.weightLb),
      },
    }))
    setEditingSetNumber(setNumber)
    onEditingChange(true)
  }

  function cancelEditing() {
    if (isSaving || editingSetNumber === null) return

    const savedSet = completedSets.find((set) => set.setNumber === editingSetNumber)
    if (savedSet) {
      setSetDrafts((current) => ({
        ...current,
        [editingSetNumber]: {
          reps: String(savedSet.reps),
          weightLb: String(savedSet.weightLb),
        },
      }))
    }

    setEditingSetNumber(null)
    onEditingChange(false)
  }

  function handleSaveSet(setNumber: number) {
    const draft = setDrafts[setNumber]
    if (!draft || isSaving) return

    if (!isValidSetDraft(draft)) return
    const reps = Number(draft.reps)
    const weightLb = Number(draft.weightLb)

    // Capture whether this was new before the successful refetch includes it.
    const wasSaved = editingSetNumber === setNumber ||
      completedSets.some(set => set.setNumber === setNumber)
    onSaveSet(setNumber, reps, weightLb, () => {
      if (!wasSaved && !isWorkoutCompleted) restTimer.start(exercise.restSeconds)
      if (editingSetNumber === setNumber) {
        setEditingSetNumber(null)
        onEditingChange(false)
      }
    })
  }

  const activeDraft = activeSetNumber === null
    ? null
    : (setDrafts[activeSetNumber] ?? { reps: '', weightLb: '' })

  const activeDraftValid = activeDraft !== null && isValidSetDraft(activeDraft)
  const isEditingSavedSet = editingSetNumber !== null

  return (
    <article className="min-w-0">
      {/* Exercise header and progress */}
      <div className="border border-border bg-background px-4 py-4 sm:px-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Exercise {exerciseNumber} of {exerciseCount}
        </p>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: exerciseCount }, (_, index) => (
            <span
              key={index}
              className={`h-0.5 min-w-0 flex-1 ${index <= exerciseNumber - 1 ? 'bg-primary-dark' : 'bg-border'}`}
            />
          ))}
        </div>
        <h2 tabIndex={-1} className="mt-3 text-2xl font-semibold leading-7 tracking-tight text-foreground">
          {exercise.name}
        </h2>
        {exercise.equipment && (
          <p className="mt-1 text-sm text-muted-foreground">{exercise.equipment}</p>
        )}
      </div>

      <MemberExerciseVideo key={exercise.videoUrl} url={exercise.videoUrl} name={exercise.name} />

      {/* Exercise prescription */}
      <dl className="grid grid-cols-2 border-x border-b border-border bg-background sm:grid-cols-4">
        <div className="border-b border-r border-border px-4 py-3 sm:border-b-0">
          <dt className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Sets</dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">{exercise.sets}</dd>
        </div>
        <div className="border-b border-border px-4 py-3 sm:border-b-0 sm:border-r">
          <dt className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Reps</dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">{exercise.reps}</dd>
        </div>
        <div className="border-r border-border px-4 py-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Rest</dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {exercise.restSeconds != null && Number.isFinite(exercise.restSeconds) ? formatRest(exercise.restSeconds) : '—'}
          </dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {exercise.currentWeightLb !== null ? 'Current load' : 'Suggested load'}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {exercise.currentWeightLb !== null
              ? formatWeight(exercise.currentWeightLb)
              : exercise.suggestedWeightLb !== null
                ? formatWeight(exercise.suggestedWeightLb)
                : '—'}
          </dd>
        </div>
      </dl>

      {/* Set tracking */}
      <section aria-labelledby="set-tracking-heading" className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <h3 id="set-tracking-heading" className="text-xl font-semibold tracking-tight text-foreground">
            Set tracking
          </h3>
          <p className="text-xs text-muted-foreground">
            {completedSets.length} of {exercise.sets} sets saved
          </p>
        </div>

        {!isWorkoutCompleted && restTimer.rest && (
          <MemberRestTimer remaining={restTimer.rest.remaining} exerciseName={exercise.name} onDismiss={restTimer.dismiss} />
        )}

        <div className="mt-4 space-y-2.5">
          {completedSets
            .filter((set) => set.setNumber !== editingSetNumber)
            .map((savedSet) => (
              <div
                key={savedSet.id}
                className="flex min-h-16 items-center gap-3 border border-border bg-background px-3 py-2.5 sm:px-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-dark text-background">
                  <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">Set {savedSet.setNumber}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {savedSet.reps} reps · {formatWeight(savedSet.weightLb)}
                  </p>
                </div>
                {!isWorkoutCompleted && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => beginEditing(savedSet.setNumber)}
                    className="min-h-11 shrink-0 px-2 text-sm font-medium text-primary-dark underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Edit set ${savedSet.setNumber}`}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}

          {activeSetNumber !== null && activeDraft !== null && (
            <div className="border border-primary-dark bg-background p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-dark">
                    {isEditingSavedSet ? 'Editing saved set' : 'Current set'}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    Set {activeSetNumber} of {exercise.sets}
                  </p>
                </div>
                {isEditingSavedSet && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="min-h-11 text-sm text-muted-foreground underline underline-offset-4 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {(['reps', 'weightLb'] as const).map((field) => (
                  <div key={field} className="min-w-0">
                    <label
                      htmlFor={`${field}-${exercise.workoutExerciseId}-${activeSetNumber}`}
                      className="block text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      {field === 'reps' ? 'Reps' : 'Weight (lb)'}
                    </label>
                    <div className="mt-1.5 flex min-w-0 border border-border">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => adjustDraft(activeSetNumber, field, -1)}
                        className="flex h-11 w-10 shrink-0 items-center justify-center text-foreground disabled:opacity-40"
                        aria-label={`Decrease ${field === 'reps' ? 'repetitions' : 'weight'} for set ${activeSetNumber}`}
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <input
                        id={`${field}-${exercise.workoutExerciseId}-${activeSetNumber}`}
                        type="number"
                        min="0"
                        max={field === 'reps' ? 2147483647 : 999999.99}
                        step={field === 'reps' ? '1' : '0.01'}
                        inputMode={field === 'reps' ? 'numeric' : 'decimal'}
                        value={activeDraft[field]}
                        disabled={isSaving}
                        onChange={(event) => updateDraft(activeSetNumber, field, event.target.value)}
                        className="h-11 w-full min-w-0 bg-transparent px-0 text-center text-base font-semibold text-foreground outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => adjustDraft(activeSetNumber, field, 1)}
                        className="flex h-11 w-10 shrink-0 items-center justify-center text-foreground disabled:opacity-40"
                        aria-label={`Increase ${field === 'reps' ? 'repetitions' : 'weight'} for set ${activeSetNumber}`}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={!activeDraftValid || isSaving}
                onClick={() => handleSaveSet(activeSetNumber)}
                className="mt-3 min-h-12 w-full bg-primary-dark px-4 py-3 text-sm font-semibold text-background transition hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-45"
              >
                {savingSetNumber === activeSetNumber
                  ? 'Saving...'
                  : isEditingSavedSet
                    ? 'Update Set'
                    : 'Complete Set'}
              </button>
            </div>
          )}

          {!isWorkoutCompleted && activeSetNumber === null && (
            <div className="border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">All sets completed</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Review your sets above or continue to the next exercise.
              </p>
            </div>
          )}
        </div>
      </section>

      {exerciseCount > 1 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onPreviousExercise}
            disabled={!hasPreviousExercise || isSaving || isEditingSavedSet}
            className="min-h-12 border border-border px-3 py-3 text-sm font-medium text-foreground transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-35"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onNextExercise}
            disabled={!hasNextExercise || isSaving || isEditingSavedSet}
            className="min-h-12 border border-foreground px-3 py-3 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:border-border disabled:opacity-35"
          >
            Next →
          </button>
        </div>
      )}

      {/* Reference information below the primary actions */}
      {(exercise.instructions || exercise.notes || exercise.previousSets.length > 0) && (
        <div className="mt-7 space-y-5 border-t border-border pt-6">
          {exercise.instructions && (
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Instructions
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{exercise.instructions}</p>
            </section>
          )}
          {exercise.notes && (
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Notes
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{exercise.notes}</p>
            </section>
          )}
        </div>
      )}

      <section className="mt-7 border-t border-border pt-6" aria-label="Previous performance">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Previous performance
        </h3>
        {exercise.previousSets.length > 0 ? (
          <div className="mt-3 divide-y divide-border border-y border-border">
            {[...exercise.previousSets]
              .sort((first, second) => first.setNumber - second.setNumber)
              .map((previousSet) => (
                <div key={previousSet.setNumber} className="flex justify-between gap-3 py-3">
                  <span className="text-sm text-foreground">Set {previousSet.setNumber}</span>
                  <span className="text-sm text-muted-foreground">
                    {previousSet.reps} reps · {formatWeight(previousSet.weightLb)}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No previous performance yet.</p>
        )}
      </section>
    </article>
  )
}

export default MemberExerciseCard
