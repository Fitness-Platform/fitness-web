import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { MemberProgramWorkoutSummary } from '../types/memberProgramWeekDetail'

type MemberWorkoutCardProps = {
  programId: string
  weekId: string
  workout: MemberProgramWorkoutSummary
}

function MemberWorkoutCard({
  programId,
  weekId,
  workout,
}: MemberWorkoutCardProps) {
  return (
    <Link
      to={`/app/programs/${programId}/weeks/${weekId}/workouts/${workout.programWeekWorkoutId}`}
      className="group block min-w-0 border border-border bg-background p-3 transition hover:border-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 sm:p-4"
      aria-label={`Open workout ${workout.position}: ${workout.name}`}
    >
      <div className="flex min-w-0 items-stretch gap-3 sm:gap-4">
        {/* Workout information */}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Workout {workout.position}
          </p>

          <h3 className="mt-1.5 text-base font-semibold leading-5 tracking-tight text-foreground sm:text-lg sm:leading-6">
            {workout.name}
          </h3>

          {workout.description && (
            <p className="mt-2 text-[13px] leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {workout.description}
            </p>
          )}

          {/* Navigation action */}
          <span
            className="ml-auto mt-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-dark text-background transition group-hover:bg-foreground"
            aria-hidden="true"
          >
            <ArrowRight
              className="h-4 w-4"
              strokeWidth={1.7}
            />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default MemberWorkoutCard