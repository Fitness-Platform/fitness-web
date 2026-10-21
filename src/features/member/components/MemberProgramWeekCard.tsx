import { ArrowRight, CalendarDays, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { MemberProgramWeek } from '../types/memberProgramDetail'

type MemberProgramWeekCardProps = {
  programId: string
  week: MemberProgramWeek
}

function formatUnlockDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function MemberProgramWeekCard({
  programId,
  week,
}: MemberProgramWeekCardProps) {
  const isUnlocked = week.unlocked

  const content = (
    <div className="flex h-full flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Week {week.position}
          </p>

          <h3 className="mt-1.5 text-lg font-semibold leading-6 tracking-tight text-foreground">
            {week.title}
          </h3>
        </div>

        {!isUnlocked && (
          <Lock
            className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
            strokeWidth={1.6}
            aria-hidden="true"
          />
        )}
      </div>

      {week.description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {week.description}
        </p>
      )}

      <div className="mt-auto pt-5">
        {isUnlocked ? (
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-dark">
              <span
                className="h-2 w-2 rounded-full bg-primary-dark"
                aria-hidden="true"
              />

              Available
            </span>

            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-dark text-background transition group-hover:bg-foreground"
              aria-hidden="true"
            >
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.7}
              />
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
            <CalendarDays
              className="h-4 w-4 shrink-0"
              strokeWidth={1.6}
              aria-hidden="true"
            />

            <span>
              Unlocks {formatUnlockDate(week.unlocksAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  if (!isUnlocked) {
    return (
      <article
        className="min-w-0 border border-border bg-border/20"
        aria-label={`${week.title} locked`}
      >
        {content}
      </article>
    )
  }

  return (
    <Link
      to={`/app/programs/${programId}/weeks/${week.weekId}`}
      className="group block min-w-0 border border-primary-dark bg-background transition hover:bg-primary-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2"
      aria-label={`Open week ${week.position}: ${week.title}`}
    >
      {content}
    </Link>
  )
}

export default MemberProgramWeekCard