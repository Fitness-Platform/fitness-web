import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'
import MemberExerciseCard from '../components/MemberExerciseCard'
import { useCompleteMyWorkoutMutation } from '../hooks/useCompleteMyWorkoutMutation'
import { useMyProgramWorkoutQuery } from '../hooks/useMyProgramWorkoutQuery'
import { useSaveMyWorkoutSetMutation } from '../hooks/useSaveMyWorkoutSetMutation'

function MemberWorkoutPage() {
  const { programId, weekId, programWeekWorkoutId } = useParams()

  const [exerciseNavigation, setExerciseNavigation] = useState({
    workoutId: programWeekWorkoutId,
    index: 0,
  })
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)
  const exerciseSectionRef = useRef<HTMLElement>(null)

  const currentExerciseIndex = exerciseNavigation.workoutId === programWeekWorkoutId
    ? exerciseNavigation.index
    : 0

  const {
    data: workout,
    isPending,
    isError,
    error,
    refetch,
  } = useMyProgramWorkoutQuery(programId, weekId, programWeekWorkoutId)

  const saveSetMutation = useSaveMyWorkoutSetMutation({
    programId: programId ?? '',
    weekId: weekId ?? '',
    programWeekWorkoutId: programWeekWorkoutId ?? '',
  })

  const completeWorkoutMutation = useCompleteMyWorkoutMutation({
    programId: programId ?? '',
    weekId: weekId ?? '',
    programWeekWorkoutId: programWeekWorkoutId ?? '',
  })

  const weekOverviewPath = `/app/programs/${programId}/weeks/${weekId}`
  const isAccessDenied = error instanceof ApiError && error.status === 403
  const currentExercise = workout?.exercises[currentExerciseIndex] ?? null
  const isWorkoutCompleted = workout?.completedAt != null
  const isEditingCurrentExercise = currentExercise !== null &&
    editingExerciseId === currentExercise.workoutExerciseId

  const areAllSetsSaved =
    workout !== undefined &&
    workout.exercises.length > 0 &&
    workout.exercises.every((exercise) =>
      Array.from({ length: exercise.sets }, (_, index) => index + 1).every(
        (setNumber) => exercise.completedSets.some((set) => set.setNumber === setNumber),
      ),
    )

  const isSavingCurrentExercise =
    currentExercise !== null &&
    saveSetMutation.isPending &&
    saveSetMutation.variables?.workoutExerciseId === currentExercise.workoutExerciseId

  const savingSetNumber = isSavingCurrentExercise
    ? (saveSetMutation.variables?.setNumber ?? null)
    : null

  function navigateToExercise(index: number) {
    setEditingExerciseId(null)
    setExerciseNavigation({ workoutId: programWeekWorkoutId, index })

    requestAnimationFrame(() => {
      exerciseSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const exerciseContent = currentExercise && workout ? (
    <section
      ref={exerciseSectionRef}
      aria-label="Current exercise"
      className="scroll-mt-24"
    >
      <MemberExerciseCard
        key={currentExercise.workoutExerciseId}
        exercise={currentExercise}
        exerciseNumber={currentExerciseIndex + 1}
        exerciseCount={workout.exercises.length}
        hasPreviousExercise={currentExerciseIndex > 0}
        hasNextExercise={currentExerciseIndex < workout.exercises.length - 1}
        onPreviousExercise={() => navigateToExercise(currentExerciseIndex - 1)}
        onNextExercise={() => navigateToExercise(currentExerciseIndex + 1)}
        isWorkoutCompleted={isWorkoutCompleted}
        isSaving={isSavingCurrentExercise}
        savingSetNumber={savingSetNumber}
        onEditingChange={(editing) => {
          setEditingExerciseId(editing ? currentExercise.workoutExerciseId : null)
        }}
        onSaveSet={(setNumber, reps, weightLb, onSuccess) => {
          saveSetMutation.mutate(
            {
              workoutExerciseId: currentExercise.workoutExerciseId,
              setNumber,
              request: { reps, weightLb },
            },
            { onSuccess },
          )
        }}
      />

      {saveSetMutation.isError &&
        saveSetMutation.variables?.workoutExerciseId === currentExercise.workoutExerciseId && (
          <div className="mt-3 border border-border bg-background p-4" role="alert">
            <p className="text-sm text-foreground">
              We couldn't save this set. Check the values and try again.
            </p>
          </div>
        )}
    </section>
  ) : null

  return (
    <div className="space-y-7 sm:space-y-9">
      <Link
        to={weekOverviewPath}
        className="inline-flex min-h-8 items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary-dark"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Week overview
      </Link>

      {isPending && (
        <div className="border border-border bg-background p-5 sm:p-6" role="status">
          <p className="text-sm text-muted-foreground">Loading workout...</p>
        </div>
      )}

      {isAccessDenied && (
        <div className="border border-border bg-background p-5 sm:p-6">
          <p className="font-medium text-foreground">This workout isn't available.</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Return to the week overview to continue your training.
          </p>
          <Link
            to={weekOverviewPath}
            className="mt-4 inline-block text-sm text-primary-dark underline underline-offset-4"
          >
            Back to week overview
          </Link>
        </div>
      )}

      {isError && !isAccessDenied && (
        <div className="border border-border bg-background p-5 sm:p-6" role="alert">
          <p className="text-sm text-foreground">We couldn't load this workout.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 min-h-11 text-sm text-primary-dark underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {!isPending && !isError && workout && (
        <>
          <header className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Workout {workout.position}
            </p>
            <h1 className="mt-1.5 text-[30px] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {workout.name}
            </h1>
            {workout.description && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {workout.description}
              </p>
            )}
          </header>

          {isWorkoutCompleted ? (
            <>
              {/* Matches the approved completion concept; no new route is required. */}
              <section className="bg-primary-dark px-6 py-7 text-background sm:px-8 sm:py-9" aria-label="Workout completed">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-foreground">
                  <Check className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-[28px] font-bold leading-tight tracking-tight sm:text-3xl">
                  Workout completed
                </h2>
                <p className="mt-3 text-sm leading-6 sm:text-base">
                  {workout.name} is finished and your sets have been saved.
                </p>
                <Link
                  to={weekOverviewPath}
                  className="mt-6 flex min-h-12 items-center justify-between gap-4 bg-background px-4 py-3 text-xs font-semibold uppercase tracking-[0.13em] text-foreground transition hover:bg-white"
                >
                  Back to week overview
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              </section>

              {/* Keeps access to completed sets and performance after finishing. */}
              {exerciseContent && (
                <details className="border-t border-border pt-5">
                  <summary className="cursor-pointer py-3 text-sm font-medium text-primary-dark">
                    Review completed exercises
                  </summary>
                  <div className="mt-4">{exerciseContent}</div>
                </details>
              )}
            </>
          ) : (
            <>
              {exerciseContent ?? (
                <div className="border border-border bg-background p-5">
                  <p className="text-sm text-muted-foreground">
                    No exercises available yet.
                  </p>
                </div>
              )}

              {workout.exercises.length > 0 && (
                <section className="border-t border-border pt-6" aria-label="Complete workout">
                  {isEditingCurrentExercise ? (
                    <p className="mb-3 text-sm leading-6 text-muted-foreground">
                      Save or cancel your edit before finishing the workout.
                    </p>
                  ) : !areAllSetsSaved ? (
                    <p className="mb-3 text-sm leading-6 text-muted-foreground">
                      Complete every prescribed set before finishing the workout.
                    </p>
                  ) : null}

                  <button
                    type="button"
                    disabled={
                      !areAllSetsSaved ||
                      isEditingCurrentExercise ||
                      saveSetMutation.isPending ||
                      completeWorkoutMutation.isPending
                    }
                    onClick={() => completeWorkoutMutation.mutate()}
                    className="min-h-14 w-full bg-primary-dark px-5 py-4 text-sm font-semibold text-background transition hover:bg-foreground disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
                  >
                    {completeWorkoutMutation.isPending ? 'Completing...' : 'Complete Workout'}
                  </button>

                  {completeWorkoutMutation.isError && (
                    <div className="mt-3 border border-border bg-background p-4" role="alert">
                      <p className="text-sm text-foreground">
                        We couldn't complete this workout. Make sure every set is saved and try again.
                      </p>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default MemberWorkoutPage
