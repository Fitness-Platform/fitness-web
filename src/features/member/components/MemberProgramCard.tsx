import type { MemberProgramSummary } from '../types/memberProgram'

type MemberProgramCardProps = {
  program: MemberProgramSummary
}

function MemberProgramCard({
  program,
}: MemberProgramCardProps) {
  return (
    <article className="border border-border p-5 sm:p-6">
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
    </article>
  )
}

export default MemberProgramCard