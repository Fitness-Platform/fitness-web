import { Link, useParams } from 'react-router-dom'

function MemberWorkoutPage() {
  const { programId, weekId } = useParams()

  return (
    <div className="space-y-6">
      <Link
        to={`/app/programs/${programId}/weeks/${weekId}`}
        className="text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← Week overview
      </Link>

      <div>
        <p className="text-sm text-muted-foreground">
          Workout
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Workout
        </h1>
      </div>
    </div>
  )
}

export default MemberWorkoutPage