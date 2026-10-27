import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAdminProgramWeeksQuery,
  useAdminProgramWeekWorkoutsQuery,
} from "../hooks/useAdminProgramStructure";
import { useAdminWorkoutsQuery } from "../hooks/useAdminWorkoutsQuery";
import type {
  AdminProgramWeek,
  AdminProgramWeekWorkout,
} from "../types/adminProgramStructure";
import type { AdminWorkout } from "../types/adminWorkout";
import AdminProgramWeekDrawer from "./AdminProgramWeekDrawer";
import AdminAssignProgramWorkoutDrawer from "./AdminAssignProgramWorkoutDrawer";
import AdminStructureDeleteDialog from "./AdminStructureDeleteDialog";
import { structureButton } from "./programStructureStyles";

type Action =
  | { kind: "week"; week?: AdminProgramWeek }
  | { kind: "deleteWeek"; week: AdminProgramWeek }
  | {
      kind: "workout";
      week: AdminProgramWeek;
      nextPosition: number;
      assignment?: AdminProgramWeekWorkout;
    }
  | {
      kind: "removeWorkout";
      week: AdminProgramWeek;
      assignment: AdminProgramWeekWorkout;
      name: string;
    };

function Week({
  week,
  workouts,
  onAction,
}: {
  week: AdminProgramWeek;
  workouts: AdminWorkout[] | undefined;
  onAction: (action: Action) => void;
}) {
  const query = useAdminProgramWeekWorkoutsQuery(week.programId, week.id);
  const assignments = query.data ?? [];
  const nextPosition =
    Math.max(0, ...assignments.map((item) => item.position)) + 1;
  return (
    <article className="border-t border-border">
      <header className="flex flex-col items-start justify-between gap-4 px-5 py-6 sm:flex-row sm:px-7">
        <div className="min-w-0 flex-1 break-words">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark">
            Week {String(week.position).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">
            {week.title}
          </h3>
          {week.description && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {week.description}
            </p>
          )}
          {query.isSuccess && (
            <p className="mt-3 text-xs text-muted-foreground">
              {assignments.length}{" "}
              {assignments.length === 1 ? "workout" : "workouts"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="min-h-11 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
            onClick={() => onAction({ kind: "week", week })}
            aria-label={`Edit week ${week.position}`}
          >
            Edit
          </button>
          <button
            type="button"
            className="min-h-11 text-[10px] font-medium uppercase tracking-[0.16em] text-red-700"
            onClick={() => onAction({ kind: "deleteWeek", week })}
            aria-label={`Delete week ${week.position}`}
          >
            Delete Week
          </button>
        </div>
      </header>
      {query.isPending ? (
        <p
          role="status"
          className="px-5 pb-6 text-sm text-muted-foreground sm:px-7"
        >
          Loading week workouts...
        </p>
      ) : query.isError ? (
        <div role="alert" className="px-5 pb-6 sm:px-7">
          <p className="text-sm text-red-700">
            Unable to load this week’s workouts.
          </p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className={structureButton + " mt-3"}
          >
            Try again
          </button>
        </div>
      ) : assignments.length ? (
        <ol className="divide-y divide-border border-y border-border">
          {assignments.map((assignment) => {
            const workout = workouts?.find(
              (item) => item.id === assignment.workoutId,
            );
            const name = workout?.name ?? `Workout ${assignment.workoutId}`;
            return (
              <li
                key={assignment.id}
                className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-5 sm:px-7"
              >
                <span
                  className="text-xs text-muted-foreground"
                  aria-label={`Position ${assignment.position}`}
                >
                  {String(assignment.position).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 break-words">
                  <Link
                    to={`/admin/workouts/${assignment.workoutId}`}
                    className="text-sm font-medium hover:text-primary-dark hover:underline"
                  >
                    {name}
                  </Link>
                  {workout?.description && (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {workout.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="min-h-11 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
                    onClick={() =>
                      onAction({
                        kind: "workout",
                        week,
                        assignment,
                        nextPosition,
                      })
                    }
                    aria-label={`Edit position of ${name}`}
                  >
                    Edit Position
                  </button>
                  <button
                    type="button"
                    className="min-h-11 text-[10px] font-medium uppercase tracking-[0.16em] text-red-700"
                    onClick={() =>
                      onAction({
                        kind: "removeWorkout",
                        week,
                        assignment,
                        name,
                      })
                    }
                    aria-label={`Remove ${name} from week ${week.position}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="px-5 pb-6 text-sm text-muted-foreground sm:px-7">
          No workouts assigned to this week. Add an existing workout from your
          library.
        </p>
      )}
      <div className="px-5 py-5 sm:px-7">
        <button
          type="button"
          className={structureButton}
          disabled={!query.isSuccess || query.isFetching}
          onClick={() => onAction({ kind: "workout", week, nextPosition })}
          aria-label={`Add workout to week ${week.position}`}
        >
          <Plus size={14} aria-hidden="true" /> Add Workout
        </button>
      </div>
    </article>
  );
}

export default function AdminProgramStructure({
  programId,
}: {
  programId: string;
}) {
  const query = useAdminProgramWeeksQuery(programId);
  const library = useAdminWorkoutsQuery();
  const [action, setAction] = useState<Action | null>(null);
  const weeks = query.data ?? [];
  const close = () => setAction(null);
  const nextPosition = Math.max(0, ...weeks.map((week) => week.position)) + 1;
  return (
    <section
      aria-labelledby="program-structure-heading"
      className="border border-border"
    >
      <header className="flex flex-wrap items-end justify-between gap-5 px-5 py-7 sm:px-7">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
            Program Structure
          </p>
          <h2
            id="program-structure-heading"
            className="mt-3 text-2xl font-semibold tracking-tight"
          >
            Weeks & Workouts
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Build your program week by week and define the workout order.
          </p>
        </div>
        <button
          type="button"
          className={structureButton}
          disabled={!query.isSuccess || query.isFetching}
          onClick={() => setAction({ kind: "week" })}
        >
          <Plus size={14} aria-hidden="true" /> Add Week
        </button>
      </header>
      {library.isError && (
        <div
          role="alert"
          className="border-t border-border px-5 py-4 text-sm sm:px-7"
        >
          <p className="text-red-700">Unable to load Workout Library names.</p>
          <button
            type="button"
            className={structureButton + " mt-3"}
            onClick={() => library.refetch()}
          >
            Retry Workout Library
          </button>
        </div>
      )}
      {query.isPending ? (
        <p
          role="status"
          className="border-t border-border px-5 py-7 text-sm text-muted-foreground sm:px-7"
        >
          Loading program weeks...
        </p>
      ) : query.isError ? (
        <div role="alert" className="border-t border-border px-5 py-7 sm:px-7">
          <p className="text-sm text-red-700">
            Unable to load Program Structure.
          </p>
          <button
            type="button"
            className={structureButton + " mt-3"}
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : weeks.length ? (
        weeks.map((week) => (
          <Week
            key={week.id}
            week={week}
            workouts={library.data}
            onAction={setAction}
          />
        ))
      ) : (
        <p className="border-t border-border px-5 py-7 text-sm leading-6 text-muted-foreground sm:px-7">
          No weeks yet. Add the first week to start building this program.
        </p>
      )}
      {action?.kind === "week" && (
        <AdminProgramWeekDrawer
          programId={programId}
          week={action.week}
          nextPosition={nextPosition}
          onClose={close}
        />
      )}
      {action?.kind === "deleteWeek" && (
        <AdminStructureDeleteDialog
          programId={programId}
          weekId={action.week.id}
          name={action.week.title}
          onClose={close}
        />
      )}
      {action?.kind === "workout" && (
        <AdminAssignProgramWorkoutDrawer
          programId={programId}
          weekId={action.week.id}
          assignment={action.assignment}
          nextPosition={action.nextPosition}
          onClose={close}
        />
      )}
      {action?.kind === "removeWorkout" && (
        <AdminStructureDeleteDialog
          programId={programId}
          weekId={action.week.id}
          assignmentId={action.assignment.id}
          name={action.name}
          onClose={close}
        />
      )}
    </section>
  );
}
