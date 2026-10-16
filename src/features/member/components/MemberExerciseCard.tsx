import { ExternalLink, Play } from 'lucide-react'

import type { MemberWorkoutExercise } from '../types/memberProgramWorkoutDetail'

type MemberExerciseCardProps = {
  exercise: MemberWorkoutExercise
}

function formatWeight(weight: number) {
  return `${weight} lb`
}

function formatRest(seconds: number) {
  if (seconds < 60) {
    return `${seconds} sec`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (remainingSeconds === 0) {
    return `${minutes} min`
  }

  return `${minutes} min ${remainingSeconds} sec`
}

function MemberExerciseCard({
  exercise,
}: MemberExerciseCardProps) {
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

          <p className="mt-1 text-sm text-foreground">
            {exercise.sets}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Reps
          </p>

          <p className="mt-1 text-sm text-foreground">
            {exercise.reps}
          </p>
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
        <a
          href={exercise.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 transition hover:underline"
        >
          <Play
            className="h-4 w-4"
            strokeWidth={1.7}
            aria-hidden="true"
          />

          Watch demo

          <ExternalLink
            className="h-3.5 w-3.5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </a>
      )}
    </article>
  )
}

export default MemberExerciseCard