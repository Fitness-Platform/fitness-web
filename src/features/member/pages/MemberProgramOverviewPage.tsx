import { Link, useParams } from 'react-router-dom'

function MemberProgramOverviewPage() {
  const { programId } = useParams()

  return (
    <div className="space-y-6">
      <Link
        to="/app/programs"
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← My programs
      </Link>

      <div>
        <p className="text-sm text-muted-foreground">
          Program
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Program overview
        </h1>
      </div>

      <p className="sr-only">
        Program ID: {programId}
      </p>
    </div>
  )
}

export default MemberProgramOverviewPage