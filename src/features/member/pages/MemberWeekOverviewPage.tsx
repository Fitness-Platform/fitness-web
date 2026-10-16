import { Link, useParams } from 'react-router-dom'

function MemberWeekOverviewPage() {
  const { programId } = useParams()

  return (
    <div className="space-y-6">
      <Link
        to={`/app/programs/${programId}`}
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← Program overview
      </Link>

      <div>
        <p className="text-sm text-muted-foreground">
          Week
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Week overview
        </h1>
      </div>
    </div>
  )
}

export default MemberWeekOverviewPage