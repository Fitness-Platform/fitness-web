import { Lock } from 'lucide-react'
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
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Week {week.position}
          </p>

          <h3 className="mt-2 text-lg font-medium tracking-tight">
            {week.title}
          </h3>
        </div>

        {!week.unlocked && (
          <Lock
            className="h-4 w-4 text-muted-foreground"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        )}
      </div>

      {week.description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {week.description}
        </p>
      )}

      {!week.unlocked && (
        <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          Unlocks {formatUnlockDate(week.unlocksAt)}
        </p>
      )}
    </>
  )

  if (!week.unlocked) {
    return (
      <article
        className="border border-border p-5 opacity-70 sm:p-6"
        aria-label={`${week.title} locked`}
      >
        {content}
      </article>
    )
  }

  return (
    <Link
      to={`/app/programs/${programId}/weeks/${week.weekId}`}
      className="block border border-border p-5 transition hover:border-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 sm:p-6"
    >
      {content}
    </Link>
  )
}

export default MemberProgramWeekCard