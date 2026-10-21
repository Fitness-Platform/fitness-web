import { Link } from 'react-router-dom'

import type { MemberProgramSummary } from '../types/memberProgram'

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

function MemberProgramCardContent({
  program,
  showAccessInfo,
}: {
  program: MemberProgramSummary
  showAccessInfo: boolean
}) {
  return (
    <>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Program
      </p>

      <h3 className="mt-3 text-lg font-medium tracking-tight text-foreground">
        {program.name}
      </h3>

      {program.description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {program.description}
        </p>
      )}

      {showAccessInfo && program.accessExpiresAt && (
        <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          Available until {formatAccessDate(program.accessExpiresAt)}
        </p>
      )}
    </>
  )
}

function MemberProgramCard({
  program,
  showAccessInfo = false,
  to,
}: MemberProgramCardProps) {
  if (to) {
    return (
      <Link
        to={to}
        className="block border border-border p-5 transition hover:border-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 sm:p-6"
      >
        <MemberProgramCardContent
          program={program}
          showAccessInfo={showAccessInfo}
        />
      </Link>
    )
  }

  return (
    <article className="border border-border p-5 sm:p-6">
      <MemberProgramCardContent
        program={program}
        showAccessInfo={showAccessInfo}
      />
    </article>
  )
}

export default MemberProgramCard