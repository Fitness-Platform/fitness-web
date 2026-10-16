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
      className="block border border-border p-5 transition hover:border-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Workout {workout.position}
          </p>

          <h2 className="mt-2 text-lg font-medium tracking-tight text-foreground">
            {workout.name}
          </h2>
        </div>

        <ArrowRight
          className="h-4 w-4 shrink-0 text-muted-foreground"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      {workout.description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {workout.description}
        </p>
      )}
    </Link>
  )
}

export default MemberWorkoutCard