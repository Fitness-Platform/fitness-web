import { ArrowRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { MemberProgramSummary } from '../types/memberProgram'
import MemberPhotoPlaceholder from './MemberPhotoPlaceholder'

type MemberProgramCardProps = {
  program: MemberProgramSummary
  variant?: 'dashboard' | 'library'
  showAccessInfo?: boolean
  to?: string
}

function formatAccessDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function MemberProgramCard({
  program,
  variant,
  showAccessInfo = false,
  to,
}: MemberProgramCardProps) {
  const isLibraryCard =
    (variant ?? (showAccessInfo ? 'library' : 'dashboard')) ===
    'library'

  const cardContent = (
    <>
      <div className="flex min-w-0 gap-3 p-3 sm:gap-4 sm:p-4">
        <MemberPhotoPlaceholder
          variant="card"
          className="min-h-28 w-24 shrink-0 self-stretch sm:w-28"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Program
          </p>

          <h3 className="mt-1 text-base font-semibold leading-5 tracking-tight text-foreground sm:text-lg sm:leading-6">
            {program.name}
          </h3>

          {program.description && (
            <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground sm:text-sm">
              {program.description}
            </p>
          )}

          {!isLibraryCard && to && (
            <span
              className="ml-auto mt-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-dark text-background transition group-hover:bg-foreground"
              aria-hidden="true"
            >
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.7}
              />
            </span>
          )}
        </div>
      </div>

      {isLibraryCard && (
        <div className="flex min-h-14 items-center justify-between gap-3 border-t border-border px-3 py-3 sm:px-4">
          <div className="min-w-0 flex-1">
            {showAccessInfo && program.accessExpiresAt && (
              <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <CalendarDays
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />

                <span>
                  Available until{' '}
                  {formatAccessDate(program.accessExpiresAt)}
                </span>
              </p>
            )}
          </div>

          <span className="flex shrink-0 items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-foreground sm:text-xs">
              View program
            </span>

            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-dark text-background transition group-hover:bg-foreground"
              aria-hidden="true"
            >
              <ArrowRight
                className="h-4 w-4"
                strokeWidth={1.7}
              />
            </span>
          </span>
        </div>
      )}
    </>
  )

  const className = [
    'group block min-w-0 overflow-hidden',
    'border border-border bg-background',
    to
      ? 'transition hover:border-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2'
      : '',
  ].join(' ')

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        aria-label={`View ${program.name}`}
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <article className={className}>
      {cardContent}
    </article>
  )
}

export default MemberProgramCard